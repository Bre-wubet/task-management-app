import jwt from 'jsonwebtoken';

// Generate JWT secret if not exists
const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-in-production';

// Generate JWT token
export const generateToken = (id) => {
    return jwt.sign({ id }, JWT_SECRET, {
        expiresIn: '7d',
    });
};

// Verify JWT token
export const verifyToken = (token) => {
    try {
        return jwt.verify(token, JWT_SECRET);
    } catch (error) {
        throw error;
    }
};

// Decode JWT token (without verification)
export const decodeToken = (token) => {
    try {
        return jwt.decode(token);
    } catch (error) {
        throw error;
    }
};

export { JWT_SECRET }; 