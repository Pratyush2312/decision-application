import { z } from "zod";

export const DecisionSchema = z.object({
  id: z.string(),

  title: z.string().min(3),

  criteria: z.array(
    z.object({
      id: z.string(),
      name: z.string().min(1),
      weight: z.number().int().min(1).max(5),
    })
  ),

  options: z.array(
    z.object({
      id: z.string(),
      name: z.string().min(1),
      ratings: z.record(
        z.string(),
        z.number().int().min(1).max(5)
      ),
    })
  ),
});

export type Decision = z.infer<typeof DecisionSchema>;