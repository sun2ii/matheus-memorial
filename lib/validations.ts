import { z } from 'zod';

export const guestbookSchema = z.object({
  visitor_name: z.string().min(1, "Please enter your name"),
  message: z.string().min(10, "Please write at least 10 characters"),
});

export type GuestbookEntry = z.infer<typeof guestbookSchema>;
