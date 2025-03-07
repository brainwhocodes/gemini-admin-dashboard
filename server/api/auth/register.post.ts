import { createUser, getUserByEmail, getUserByUsername } from '~/server/utils/db';
import { generateToken } from '~/server/utils/jwt';
import { H3Event } from 'h3';
import { z } from 'zod';
import { useValidatedBody } from 'h3-zod';

// Define validation schema
const registerSchema = z.object({
  username: z.string().min(3, 'Username must be at least 3 characters'),
  email: z.string().email('Invalid email format'),
  password: z.string().min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number'),
});

export default defineEventHandler(async (event: H3Event) => {
  try {
    // Validate input using Zod
    const { username, email, password } = await useValidatedBody(event, registerSchema);

    // Check if username or email already exists
    const existingUserByUsername = getUserByUsername(username);
    if (existingUserByUsername) {
      return createError({
        statusCode: 409,
        statusMessage: 'Username already exists',
      });
    }

    const existingUserByEmail = getUserByEmail(email);
    if (existingUserByEmail) {
      return createError({
        statusCode: 409,
        statusMessage: 'Email already exists',
      });
    }

    // Create user
    const user = await createUser(username, email, password);

    // Generate JWT token
    const token = generateToken({ userId: user.id });

    // Set cookie with token
    setCookie(event, 'auth_token', token, {
      httpOnly: true,
      maxAge: 60 * 60 * 24 * 7, // 1 week
      path: '/',
      sameSite: 'strict',
      secure: process.env.NODE_ENV === 'production',
    });

    // Return user without sensitive information
    return {
      success: true,
      message: 'Registration successful! You can now log in.',
      user: {
        id: user.id,
        username: user.username,
        email: user.email
      },
      token,
    };
  } catch (error: any) {
    console.error('Registration error:', error);
    
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
