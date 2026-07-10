import crypto from 'crypto';

const SECRET = process.env.CAPTCHA_SECRET ?? 'memorial-captcha-fallback';
const TTL_MS = 10 * 60 * 1000;

function sign(answer: string, expires: number): string {
  return crypto.createHmac('sha256', SECRET).update(`${answer}.${expires}`).digest('hex');
}

export function createChallenge(): { question: string; token: string } {
  const a = Math.floor(Math.random() * 8) + 1;
  const b = Math.floor(Math.random() * 8) + 1;
  const expires = Date.now() + TTL_MS;
  return {
    question: `${a} + ${b}`,
    token: `${expires}.${sign(String(a + b), expires)}`,
  };
}

export function verifyChallenge(answer: string, token: string): boolean {
  const [expStr, sig] = token.split('.');
  const expires = Number(expStr);
  if (!expires || Date.now() > expires || !sig) return false;
  const expected = sign(answer.trim(), expires);
  if (sig.length !== expected.length) return false;
  return crypto.timingSafeEqual(Buffer.from(sig), Buffer.from(expected));
}
