'use client';

import { useEffect, useRef, useState } from 'react';

export default function StarBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [shouldRender, setShouldRender] = useState(true);

  useEffect(() => {
    // Проверка на мобильное устройство и производительность
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    const isLowEnd = navigator.hardwareConcurrency ? navigator.hardwareConcurrency < 4 : false;
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    
    // Отключить анимацию на слабых устройствах
    if (prefersReducedMotion || (isMobile && isLowEnd)) {
      setShouldRender(false);
      return;
    }

    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl = canvas.getContext('webgl2', { 
      alpha: true,
      antialias: false,
      powerPreference: 'high-performance',
    }) || canvas.getContext('webgl', {
      alpha: true,
      antialias: false,
      powerPreference: 'high-performance',
    });
    
    if (!gl) {
      console.error('WebGL not supported');
      setShouldRender(false);
      return;
    }

    // Set canvas size
    function resize() {
      if (!canvas || !gl) return;
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      gl.viewport(0, 0, canvas.width, canvas.height);
    }
    resize();
    window.addEventListener('resize', resize);

    // Vertex Shader
    const vertexShaderSource = `
#ifdef GL_FRAGMENT_PRECISION_HIGH
precision highp float;
#else
precision mediump float;
#endif

attribute vec2 aPosition;
varying vec2 vUv;

void main() {
    vUv = 0.5 * aPosition + 0.5;
    gl_Position = vec4(aPosition, 0.0, 1.0);
}
`;

    // Fragment Shader
    const fragmentShaderSource = `
#ifdef GL_FRAGMENT_PRECISION_HIGH
precision highp float;
#else
precision mediump float;
#endif

varying vec2 vUv;
uniform float uTime;
uniform vec2 uResolution;

#define STAR 5.0
#define FLARE 4.0
#define COLOR vec3(0.2, 0.3, 0.8)

#define STAR_NUM 12.0
#define STAR_AMP 0.5
#define STAR_SPEED 0.01
#define STAR_VEL vec2(1.0, 0.0)
#define STAR_FREQ 8.0
#define STAR_EXP 1.5
#define STAR_STRETCH 0.7
#define STAR_CURVE 0.5

vec3 gamma_encode(vec3 lrgb) {
    return sqrt(lrgb);
}

vec2 turbulence(vec2 p, float freq, float num) {
    mat2 rot = mat2(0.6, -0.8, 0.8, 0.6);
    vec2 turb = vec2(0.0);
    for (float i = 0.0; i < STAR_NUM; i++) {
        if (i >= num) break;
        vec2 pos = p + turb + STAR_SPEED * i * uTime * STAR_VEL;
        float phase = freq * (pos * rot).y + STAR_SPEED * uTime * freq;
        turb += rot[0] * sin(phase) / freq;
        rot *= mat2(0.6, -0.8, 0.8, 0.6);
        freq *= STAR_EXP;
    }
    return turb;
}

vec3 star(vec2 p) {
    vec2 suv = p * 2.0 - 1.0;
    vec2 right = suv - vec2(1.0, 0.0);
    
    right.x *= STAR_STRETCH * uResolution.x / uResolution.y;
    
    float factor = 1.0 + 0.4 * sin(9.0 * suv.y) * sin(5.0 * (suv.x + 5.0 * uTime * STAR_SPEED));
    vec2 turb = right + factor * STAR_AMP * turbulence(right, STAR_FREQ, STAR_NUM);
    turb.x -= STAR_CURVE * suv.y * suv.y;
    
    float fade = max(4.0 * suv.y * suv.y - suv.x + 1.2, 0.001);
    float atten = fade * max(0.5 * turb.x, -turb.x);
    
    float ft = 0.4 * uTime;
    vec2 fp = 8.0 * (turb + 0.5 * STAR_VEL * ft);
    fp *= mat2(0.4, -0.3, 0.3, 0.4);
    
    float f = cos(fp.x) * sin(fp.y) - 0.5;
    float flare = f * f + 0.5 * suv.y * suv.y - 1.5 * turb.x + 0.6 * cos(0.42 * ft + 1.6 * turb.y) * cos(0.31 * ft - turb.y);
    
    vec3 col = 0.1 * COLOR * (STAR / (atten * atten) + FLARE / (flare * flare));
    
    const vec3 chrom = vec3(0.0, 0.1, 0.2);
    col *= exp(p.x *
                cos(turb.y * 5.0 + 0.4 * (uTime + turb.x * 1.0) + chrom) *
                cos(turb.y * 7.0 - 0.5 * (uTime - turb.x * 1.5) + chrom) *
                cos(turb.y * 9.0 + 0.6 * (uTime + turb.x * 2.0) + chrom)
        );
    
    return col;
}

void main() {
    vec2 suv = vUv * 2.0 - 1.0;
    vec3 col = star(vUv);
    
    float vig = 1.0 - abs(suv.y);
    vig *= 0.5 + 0.5 * suv.x;
    col *= vig * vig;
    
    col /= 1.0 + col;
    col = clamp(col, 0.0, 1.0);
    col = gamma_encode(col);
    
    gl_FragColor = vec4(col, 1.0);
}
`;

    // Compile shader
    function createShader(type: number, source: string) {
      if (!gl) return null;
      const shader = gl.createShader(type);
      if (!shader) return null;
      gl.shaderSource(shader, source);
      gl.compileShader(shader);

      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        console.error('Shader compile error:', gl.getShaderInfoLog(shader));
        gl.deleteShader(shader);
        return null;
      }
      return shader;
    }

    // Create program
    const vertexShader = createShader(gl.VERTEX_SHADER, vertexShaderSource);
    const fragmentShader = createShader(gl.FRAGMENT_SHADER, fragmentShaderSource);
    if (!vertexShader || !fragmentShader) return;

    const program = gl.createProgram();
    if (!program) return;
    
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);

    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.error('Program link error:', gl.getProgramInfoLog(program));
      return;
    }

    gl.useProgram(program);

    // Create buffer (fullscreen quad)
    const positions = new Float32Array([
      -1, -1,
       1, -1,
      -1,  1,
       1,  1,
    ]);

    const positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, positions, gl.STATIC_DRAW);

    const aPosition = gl.getAttribLocation(program, 'aPosition');
    gl.enableVertexAttribArray(aPosition);
    gl.vertexAttribPointer(aPosition, 2, gl.FLOAT, false, 0, 0);

    // Get uniform locations
    const uTime = gl.getUniformLocation(program, 'uTime');
    const uResolution = gl.getUniformLocation(program, 'uResolution');

    // Animation loop
    let time = 0;
    let animationId: number;
    
    function render() {
      if (!gl || !canvas) return;
      time += 0.016; // ~60fps

      gl.uniform1f(uTime, time);
      gl.uniform2f(uResolution, canvas.width, canvas.height);

      gl.clearColor(0.04, 0.04, 0.04, 1.0);
      gl.clear(gl.COLOR_BUFFER_BIT);

      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);

      animationId = requestAnimationFrame(render);
    }

    render();

    // Cleanup
    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationId);
    };
  }, []);

  // Fallback для слабых устройств или если пользователь отключил анимации
  if (!shouldRender) {
    return (
      <div 
        className="fixed inset-0 w-full h-full -z-10"
        style={{
          background: 'radial-gradient(ellipse at top, #1e3a8a 0%, #0a0a0a 50%, #000000 100%)',
        }}
      />
    );
  }

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full -z-10"
      style={{ background: '#0a0a0a' }}
    />
  );
}

