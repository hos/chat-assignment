import z from "zod";

export const ZodUsername = z
  .string()
  .min(2)
  .max(12)
  .regex(/^[a-zA-Z0-9_.-]+$/, {
    message: "Username must be alphanumeric and can contain ._-",
  });

// Here we allow weak passwords as this is not a real project,
// but in a real project you should enforce strong passwords.
export const ZodPassword = z
  .string()
  .min(2, {
    message: "Password must be at least 2 characters long",
  })
  .max(12, {
    message: "Password must be at most 12 characters long",
  });
