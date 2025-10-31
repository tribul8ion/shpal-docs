import {
  defineConfig,
  defineDocs,
  frontmatterSchema,
  metaSchema,
} from 'fumadocs-mdx/config';
import { z } from 'zod';

// Расширяем схему frontmatter для поддержки тегов
const customFrontmatterSchema = frontmatterSchema.extend({
  tags: z.array(z.string()).optional(),
});

// You can customise Zod schemas for frontmatter and `meta.json` here
// see https://fumadocs.dev/docs/mdx/collections
export const docs = defineDocs({
  dir: 'content/docs',
  docs: {
    schema: customFrontmatterSchema,
    postprocess: {
      includeProcessedMarkdown: true,
    },
    files: ['**/*.md', '**/*.mdx'],
  },
  meta: {
    schema: metaSchema,
    files: ['**/_meta.json'],
  },
});

export default defineConfig({
  mdxOptions: {
    // MDX options
  },
});
