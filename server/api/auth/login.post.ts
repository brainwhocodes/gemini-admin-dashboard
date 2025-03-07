import { getUserByEmail, validatePassword, User } from '~/server/utils/db';
import { generateToken } from '~/server/utils/jwt';
import { H3Event } from 'h3';
import { z } from 'zod';
import { useValidatedBody } from 'h3-zod';

// Define validation schema
const loginSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().min(1, 'Password is required'),
});

export default defineEventHandler(async (event: H3Event) => {
  try {
    // Validate input using Zod
    const { email, password } = await useValidatedBody(event, loginSchema);

    // Get user by email
    const user: User | undefined = getUserByEmail(email);
    if (!user) {
      return createError({
        statusCode: 401,
        statusMessage: 'Invalid credentials',
      });
    }

    // Validate password
    const isPasswordValid = await validatePassword(user, password);
    if (!isPasswordValid) {
      return createError({
        statusCode: 401,
        statusMessage: 'Invalid credentials',
      });
    }

    // Create JWT token
    const token = generateToken({ 
      userId: user.id,
      username: user.username,
      email: user.email
    });

    // Set cookie with token
    setCookie(event, 'auth_token', token, {
      httpOnly: true,
      maxAge: 60 * 60 * 24 * 7, // 1 week
      path: '/',
      sameSite: 'strict',
      secure: process.env.NODE_ENV === 'production',
    });

    // Return user without password
    return {
      success: true,
      user: {
        id: user.id,
        username: user.username,
        email: user.email
      },
      token,
    };
  } catch (error: any) {
    console.error('Login error:', error);
    
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
