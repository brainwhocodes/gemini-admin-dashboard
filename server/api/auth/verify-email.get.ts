import { H3Event } from 'h3';

export default defineEventHandler(() => {
  return {
    success: true,
    message: 'Email verification is no longer required. All accounts are automatically verified upon registration.',
  };
});
