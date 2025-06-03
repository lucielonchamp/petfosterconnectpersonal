import { Response } from 'express';
import { LogoutCookiesOptions } from '../interfaces/logoutCookiesOptions';

export const clearAuthCookies = (res: Response, logoutCookiesOptions: LogoutCookiesOptions) => {
  res.clearCookie('accessToken', {
    ...logoutCookiesOptions,
    httpOnly: true,
  });
  res.clearCookie('refreshToken', {
    ...logoutCookiesOptions,
    httpOnly: true,
  });
};
