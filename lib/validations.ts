import { z } from 'zod';

export const guestbookSchema = z.object({
  visitor_name: z.string().min(1, "Please enter your name"),
  visitor_email: z.string().email("Invalid email").optional().or(z.literal('')),
  message: z.string().min(10, "Please write at least 10 characters"),
});

export type GuestbookEntry = z.infer<typeof guestbookSchema>;

export const attendeeSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  language: z.enum(['en', 'id']).optional(),
});
