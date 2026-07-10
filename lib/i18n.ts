import { cookies } from 'next/headers';
import en from '@/messages/en.json';
import id from '@/messages/id.json';

export type Locale = 'en' | 'id';
export type Dict = typeof en;

const dictionaries: Record<Locale, Dict> = { en, id };

export const LOCALE_COOKIE = 'locale';

export async function getLocale(): Promise<Locale> {
  const store = await cookies();
  return store.get(LOCALE_COOKIE)?.value === 'id' ? 'id' : 'en';
}

export async function getDict(): Promise<{ locale: Locale; dict: Dict }> {
  const locale = await getLocale();
  return { locale, dict: dictionaries[locale] };
}
