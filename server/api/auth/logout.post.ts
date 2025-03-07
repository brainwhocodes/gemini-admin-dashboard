import { H3Event } from 'h3';

export default defineEventHandler((event: H3Event) => {
  try {
    // Clear the auth cookie
    deleteCookie(event, 'auth_token', {
      path: '/',
      httpOnly: true,
    });

    return {
      success: true,
      message: 'Logged out successfully',
    };
  } catch (error: any) {
    console.error('Logout error:', error);
    return createError({
      statusCode: 500,
      statusMessage: 'Internal server error',
    });
  }
});
