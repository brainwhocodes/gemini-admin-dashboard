import { resetPassword } from '~/server/utils/db';
import { H3Event } from 'h3';
import { z } from 'zod';
import { useValidatedBody } from 'h3-zod';

// Define validation schema
const resetPasswordSchema = z.object({
  token: z.string().min(1, 'Reset token is required'),
  password: z.string().min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number'),
});

export default defineEventHandler(async (event: H3Event) => {
  try {
    // Validate input using Zod
    const { token, password } = await useValidatedBody(event, resetPasswordSchema);

    // Reset password
    const user = await resetPassword(token, password);
    
    if (!user) {
      return createError({
        statusCode: 400,
        statusMessage: 'Invalid or expired reset token',
      });
    }

    return {
      success: true,
      message: 'Password reset successfully',
    };
  } catch (error: any) {
    console.error('Password reset error:', error);
    
    // Handle validation errors
    if (error.name === 'ZodError') {
      return createError({
        statusCode: 400,
        statusMessage: error.errors[0].message,
      });
    }
    
    return createError({
      statusCode: 500,
      statusMessage: 'Internal server error',
    });
  }
});
