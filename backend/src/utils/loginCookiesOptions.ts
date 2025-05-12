const isProduction = process.env.NODE_ENV === 'production';

export const LOGIN_COOKIES_OPTIONS = {
  secure: isProduction,
  sameSite: isProduction ? 'none' as const : 'lax' as const,
  httpOnly: true,
  maxAge: 7 * 24 * 60 * 60 * 1000,
};
