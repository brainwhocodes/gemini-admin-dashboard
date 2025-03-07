import { H3Event } from 'h3';
import { getRecentLoginAttempts, recordLoginAttempt } from '../utils/db';

// Rate limit configuration
const MAX_ATTEMPTS = 5; // Maximum login attempts
const WINDOW_MINUTES = 15; // Time window in minutes

export default defineEventHandler(async (event: H3Event) => {
  // Only apply rate limiting to authentication routes
  const authRoutes = [
    '/api/auth/login',
    '/api/auth/register',
    '/api/auth/forgot-password',
  ];
  
  const path = event.path || '';
  
  if (!authRoutes.some(route => path === route) || event.method !== 'POST') {
    return;
  }

  // Get client IP address
  const clientIp = getRequestIP(event, { xForwardedFor: true }) || '0.0.0.0';
  
  try {
    // For login attempts, check the email from the request body
    if (path === '/api/auth/login') {
      const body = await readBody(event);
      const email = body.email || '';
      
      if (email) {
        // Check recent login attempts
        const attempts = getRecentLoginAttempts(email, clientIp, WINDOW_MINUTES);
        
        if (attempts && attempts.count >= MAX_ATTEMPTS) {
          return createError({
            statusCode: 429,
            statusMessage: `Too many login attempts. Please try again after ${WINDOW_MINUTES} minutes.`,
          });
        }
        
        // Record this attempt
        recordLoginAttempt(email, clientIp);
      }
    }
  } catch (error) {
    console.error('Rate limiting error:', error);
    // Continue processing even if rate limiting fails
  }
});
