import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const docs = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/docs' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    // Sidebar order — not alphabetical, since "Getting Started" belongs first regardless of its slug.
    order: z.number(),
  }),
});

export const collections = { docs };
