"use server";

import { z } from "zod";

const contactSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Enter a valid email"),
  message: z.string().min(20, "Message must be at least 20 characters"),
});

export type ContactFormData = z.infer<typeof contactSchema>;

export async function submitContact(
  data: ContactFormData
): Promise<{ success: boolean; error?: string }> {
  const result = contactSchema.safeParse(data);
  if (!result.success) {
    return { success: false, error: "Validation failed" };
  }
  console.log("[Contact submission]", result.data);
  return { success: true };
}
