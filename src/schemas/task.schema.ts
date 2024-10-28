import { z } from "zod";
import { baseSchema } from "./base.schema";
import { categoryReturnSchema, categorySchema } from "./category.schema";

const taskSchema = baseSchema.extend({
  title: z.string(),
  content: z.string(),
  finished: z.boolean(),
  category: categorySchema.nullish(),
});

const taskReturnGetSchema = baseSchema.extend({
  title: z.string(),
  content: z.string(),
  finished: z.boolean().default(false),
  category: categoryReturnSchema.nullish(),
});

const taskReturnSchema = taskSchema
  .omit({ category: true })
  .extend({ categoryId: z.number().positive().nullish() });

const taskCreateSchema = taskReturnSchema.omit({ id: true, finished: true });

const taskUpdateSchema = taskSchema
  .omit({ id: true, category: true })
  .partial();

export {
  taskSchema,
  taskCreateSchema,
  taskReturnSchema,
  taskUpdateSchema,
  taskReturnGetSchema,
};
