'use server';

import { revalidatePath } from 'next/cache';
import { sql } from '@/lib/db';
import { guestbookSchema } from '@/lib/validations';

export async function submitGuestbookEntry(formData: FormData) {
  const data = {
    visitor_name: formData.get('visitor_name') as string,
    visitor_email: formData.get('visitor_email') as string,
    message: formData.get('message') as string,
  };

  // Validate with Zod — surface the first issue as a human-readable message
  const result = guestbookSchema.safeParse(data);
  if (!result.success) {
    throw new Error(result.error.issues[0]?.message ?? 'Please check your message and try again.');
  }
  const validated = result.data;

  // Insert into Neon database
  try {
    await sql`
      INSERT INTO guestbook_entries (visitor_name, visitor_email, message)
      VALUES (${validated.visitor_name}, ${validated.visitor_email || null}, ${validated.message})
    `;
  } catch (error) {
    console.error('Database error:', error);
    throw new Error('Failed to submit message. Please try again.');
  }

  // Revalidate page to show new message
  revalidatePath('/');

  return { success: true };
}
