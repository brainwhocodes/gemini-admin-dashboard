import { verifyToken } from '../utils/jwt';
import { getUserById } from '../utils/db';
import { H3Event } from 'h3';

export default defineEventHandler(async (event: H3Event) => {
  // Skip authentication for public routes
  const publicRoutes = [
    '/login',
    '/register',
    '/forgot-password',
    '/reset-password',
    '/'
  ];
  
  const path = event.path || '';
  
  if (publicRoutes.some(route => path.startsWith(route))) {
    return;
  }

  // Check for auth token in cookies
  const token = getCookie(event, 'auth_token');
  
  if (!token) {
    return createError({
      statusCode: 401,
      statusMessage: 'Unauthorized - No token provided',
    });
  }

  // Verify token
  const decoded = verifyToken(token);
  
  if (!decoded || typeof decoded !== 'object') {
    return createError({
      statusCode: 401,
      statusMessage: 'Unauthorized - Invalid token',
    });
  }

  // Get user from database
  const user = getUserById(decoded.userId);
  
  if (!user) {
    return createError({
      statusCode: 401,
      statusMessage: 'Unauthorized - User not found',
    });
  }

  // Add user to event context
  event.context.user = {
    id: user.id,
    username: user.username,
    email: user.email
  };
});
