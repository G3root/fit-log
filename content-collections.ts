import { defineCollection, defineConfig } from "@content-collections/core";

const exercises = defineCollection({
  name: "exercises",
  directory: "app/exercises",
  include: "**/*.md",
  schema: (z) => ({
    name: z.string(),
  }),
  transform: (doc) => {
    return {
      ...doc,
      id: doc._meta.fileName,
    };
  },
});

export default defineConfig({
  collections: [exercises],
});
