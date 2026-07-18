import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const products = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/products' }),
  schema: ({ image }) =>
    z.object({
      name: z.string(),
      weight: z.string(),
      shelfLife: z.string(),
      packingType: z.string(),
      nutsPerBag: z.number(),
      fclQuantity: z.string(),
      image: image(),
    }),
});

export const collections = { products };
