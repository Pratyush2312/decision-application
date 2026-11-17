
import { z } from "zod";

const uniqueNames = (items: { name: string }[]) => {
  const names = items.map((item) => item.name.trim().toLowerCase());

  return new Set(names).size === names.length;
};

export const DecisionSchema = z
  .object({
    id: z.string(),
    title: z.string().trim().min(3, "Title must contain at least 3 characters."),

    criteria: z
      .array(
        z.object({
          id: z.string(),
          name: z.string().trim().min(1, "Criterion name is required."),
          weight: z.number().int().min(1).max(5),
        })
      )
      .min(1, "At least one criterion is required.")
      .refine(uniqueNames, {
        message: "Criterion names must be unique.",
      }),

    options: z
      .array(
        z.object({
          id: z.string(),
          name: z.string().trim().min(1, "Option name is required."),
          ratings: z.record(
            z.string(),
            z.number().int().min(1).max(5)
          ),
        })
      )
      .min(2, "At least two options are required.")
      .refine(uniqueNames, {
        message: "Option names must be unique.",
      }),
  });

export type Decision = z.infer<typeof DecisionSchema>;
