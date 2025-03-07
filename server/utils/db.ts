import Database from 'better-sqlite3';
import { hash, compare } from 'bcrypt';
import { join } from 'path';
import fs from 'fs';
import crypto from 'crypto';

// Define User interface
export interface User {
  id: number | bigint;
  username: string;
  email: string;
  password: string;
  verification_token: string | null;
  reset_token: string | null;
  reset_token_expires: string | null;
  created_at: string;
  updated_at: string;
}

// Ensure the data directory exists
const dataDir = join(process.cwd(), 'data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

// Initialize the database
const db = new Database(join(dataDir, 'database.sqlite'));

// Create tables if they don't exist
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    verification_token TEXT,
    reset_token TEXT,
    reset_token_expires TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS login_attempts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT NOT NULL,
    ip_address TEXT NOT NULL,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  );
`);

// User functions
export const createUser = async (username: string, email: string, password: string): Promise<User> => {
  try {
    const hashedPassword = await hash(password, 10);
    
    const stmt = db.prepare('INSERT INTO users (username, email, password) VALUES (?, ?, ?)');
    const result = stmt.run(username, email, hashedPassword);
    
    return { 
      id: result.lastInsertRowid, 
      username, 
      email, 
      password: hashedPassword,
      verification_token: null,
      reset_token: null,
      reset_token_expires: null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
  } catch (error) {
    console.error('Error creating user:', error);
    throw error;
  }
};

export const getUserByEmail = (email: string): User | undefined => {
  const stmt = db.prepare('SELECT * FROM users WHERE email = ?');
  return stmt.get(email) as User | undefined;
};

export const getUserByUsername = (username: string): User | undefined => {
  const stmt = db.prepare('SELECT * FROM users WHERE username = ?');
  return stmt.get(username) as User | undefined;
};

export const getUserById = (id: number): User | undefined => {
  const stmt = db.prepare('SELECT * FROM users WHERE id = ?');
  return stmt.get(id) as User | undefined;
};

export const validatePassword = async (user: User | undefined, password: string): Promise<boolean> => {
  if (!user) return false;
  return await compare(password, user.password);
};

// Email verification is no longer used
// export const verifyEmail = (token: string): User | undefined => {
//   const stmt = db.prepare('UPDATE users SET email_verified = 1, verification_token = NULL WHERE verification_token = ? RETURNING id, username, email');
//   return stmt.get(token) as User | undefined;
// };

export const recordLoginAttempt = (email: string, ipAddress: string) => {
  const stmt = db.prepare('INSERT INTO login_attempts (email, ip_address) VALUES (?, ?)');
  return stmt.run(email, ipAddress);
};

// Define interface for login attempts result
interface LoginAttemptsResult {
  count: number;
}

export const getRecentLoginAttempts = (email: string, ipAddress: string, minutes: number = 15): LoginAttemptsResult => {
  const stmt = db.prepare(`
    SELECT COUNT(*) as count 
    FROM login_attempts 
    WHERE (email = ? OR ip_address = ?) 
    AND timestamp > datetime('now', '-' || ? || ' minutes')
  `);
  return stmt.get(email, ipAddress, minutes) as LoginAttemptsResult;
};

export const createPasswordResetToken = (email: string) => {
  const resetToken = crypto.randomBytes(32).toString('hex');
  const resetTokenExpires = new Date();
  resetTokenExpires.setHours(resetTokenExpires.getHours() + 1); // Token expires in 1 hour
  
  const stmt = db.prepare('UPDATE users SET reset_token = ?, reset_token_expires = ? WHERE email = ? RETURNING id');
  const result = stmt.get(resetToken, resetTokenExpires.toISOString(), email);
  
  if (!result) return null;
  return resetToken;
};

export const resetPassword = async (token: string, newPassword: string): Promise<User | undefined> => {
  const hashedPassword = await hash(newPassword, 10);
  
  const stmt = db.prepare(`
    UPDATE users 
    SET password = ?, reset_token = NULL, reset_token_expires = NULL 
    WHERE reset_token = ? AND reset_token_expires > datetime('now')
    RETURNING id, email
  `);
  
  return stmt.get(hashedPassword, token) as User | undefined;
};

export default db;
