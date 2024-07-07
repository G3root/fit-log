import { defineCollection, defineConfig } from "@content-collections/core";

const exercises = defineCollection({
  name: "exercises",
  directory: "app/exercises",
  include: "**/*.md",
  schema: (z) => ({
    name: z.string(),
  }),
  transform: (doc) => {
    const slug = doc.name.toLowerCase().replace(/ /g, "-");
    return {
      ...doc,
      id: slug,
      slug,
    };
  },
});

export default defineConfig({
  collections: [exercises],
});
