'use server';

import { revalidatePath } from 'next/cache';
import { sql } from '@/lib/db';
import { guestbookSchema, attendeeSchema } from '@/lib/validations';

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

export async function submitAttendance(formData: FormData) {
  const result = attendeeSchema.safeParse({
    email: formData.get('email') as string,
    language: (formData.get('language') as string) || undefined,
  });
  if (!result.success) {
    throw new Error(result.error.issues[0]?.message ?? 'Please enter a valid email address');
  }

  try {
    const rows = await sql`
      INSERT INTO attendees (email, language)
      VALUES (${result.data.email}, ${result.data.language ?? null})
      ON CONFLICT (email) DO NOTHING
      RETURNING id
    `;
    // No row returned means the email was already registered
    return { success: true, duplicate: rows.length === 0 };
  } catch (error) {
    console.error('Database error:', error);
    throw new Error('Failed to save your RSVP. Please try again.');
  }
}
