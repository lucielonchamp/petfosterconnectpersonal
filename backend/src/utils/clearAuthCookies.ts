import { Response } from 'express';
import { LogoutCookiesOptions } from '../interfaces/logoutCookiesOptions';

export const clearAuthCookies = (res: Response, logoutCookiesOptions: LogoutCookiesOptions) => {
  res.clearCookie('authToken', {
    ...logoutCookiesOptions,
    httpOnly: true,
  });
};
