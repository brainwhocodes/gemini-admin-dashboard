import { getUserById } from '~/server/utils/db';
import { verifyToken } from '~/server/utils/jwt';
import { H3Event } from 'h3';

export default defineEventHandler((event: H3Event) => {
  try {
    // Get token from cookie
    const token = getCookie(event, 'auth_token');
    
    if (!token) {
      return createError({
        statusCode: 401,
        statusMessage: 'Unauthorized',
      });
    }

    // Verify token
    const decoded = verifyToken(token);
    
    if (!decoded || typeof decoded !== 'object') {
      // Clear invalid token
      deleteCookie(event, 'auth_token', {
        path: '/',
        httpOnly: true,
      });
      
      return createError({
        statusCode: 401,
        statusMessage: 'Invalid or expired token',
      });
    }

    // Get user from database
    const user = getUserById(decoded.userId);
    
    if (!user) {
      return createError({
        statusCode: 401,
        statusMessage: 'User not found',
      });
    }

    return {
      success: true,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        email_verified: !!user.email_verified,
        created_at: user.created_at
      },
    };
  } catch (error: any) {
    console.error('Auth check error:', error);
    return createError({
      statusCode: 500,
      statusMessage: 'Internal server error',
    });
  }
});
