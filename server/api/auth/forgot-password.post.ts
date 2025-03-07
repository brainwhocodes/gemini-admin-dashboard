import { getUserByEmail, createPasswordResetToken } from '~/server/utils/db';
import { sendPasswordResetEmail } from '~/server/utils/email';
import { H3Event } from 'h3';
import { z } from 'zod';
import { useValidatedBody } from 'h3-zod';

// Define validation schema
const forgotPasswordSchema = z.object({
  email: z.string().email('Invalid email format'),
});

export default defineEventHandler(async (event: H3Event) => {
  try {
    // Validate input using Zod
    const { email } = await useValidatedBody(event, forgotPasswordSchema);

    // Get user by email
    const user = getUserByEmail(email);
    
    // Always return success even if user doesn't exist (security best practice)
    if (!user) {
      return {
        success: true,
        message: 'If your email is registered, you will receive a password reset link',
      };
    }

    // Create password reset token
    const resetToken = createPasswordResetToken(email);
    
    if (!resetToken) {
      return createError({
        statusCode: 500,
        statusMessage: 'Failed to create password reset token',
      });
    }

    // Send password reset email
    await sendPasswordResetEmail(email, resetToken);

    return {
      success: true,
      message: 'If your email is registered, you will receive a password reset link',
    };
  } catch (error: any) {
    console.error('Forgot password error:', error);
    
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
