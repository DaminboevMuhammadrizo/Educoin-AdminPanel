import { z } from 'zod';

export const loginSchema = z.object({
  phone: z
    .string()
    .min(1, 'Telefon raqamni kiriting')
    .transform((val) => val.replace(/\D/g, ''))
    .refine((digits) => digits.length === 12 && digits.startsWith('998'), {
      message: "Telefon raqam +998XXXXXXXXX yoki 998XXXXXXXXX formatida bo'lishi kerak",
    }),
  password: z.string()
});

export type LoginInput = z.infer<typeof loginSchema>;
