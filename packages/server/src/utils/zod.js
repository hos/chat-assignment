import z from "zod";

export const ZodUsername = z
  .string()
  .min(2)
  .max(16)
  .regex(/^[a-zA-Z0-9_.-]+$/, {
    message: "Username must be alphanumeric and can contain ._-",
  });

export const ZodPassword = z.string().min(12, {
  message: "Password must be at least 12 characters long",
});
