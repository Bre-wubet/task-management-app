
import User from "../models/User.js";
import { verifyToken } from "../utils/jwtUtils.js";

// Middleware to protect routes
const protect = async (req, res, next) => {
    try {
        // Check for authorization header
        const authHeader = req.headers.authorization;
        
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ 
                message: 'Access denied. No token provided.' 
            });
        }

        // Extract token from header
        const token = authHeader.split(' ')[1];
        
        if (!token) {
            return res.status(401).json({ 
                message: 'Access denied. Invalid token format.' 
            });
        }

        // Verify token
        const decoded = verifyToken(token);
        
        // Find user by id
        const user = await User.findById(decoded.id).select('-password');
        
        if (!user) {
            return res.status(401).json({ 
                message: 'Access denied. User not found.' 
            });
        }

        // Add user to request object
        req.user = user;
        next();
        
    } catch (error) {
        console.error('Auth middleware error:', error.message);
        
        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({ 
                message: 'Access denied. Invalid token.' 
            });
        }
        
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ 
                message: 'Access denied. Token expired.' 
            });
        }
        
        return res.status(500).json({ 
            message: 'Server error during authentication.' 
        });
    }
};

// Middleware for admin only routes
const adminOnly = (req, res, next) => {
    if (!req.user) {
        return res.status(401).json({ 
            message: 'Access denied. Authentication required.' 
        });
    }
    
    if (req.user.role !== 'Admin') {
        return res.status(403).json({ 
            message: 'Access denied. Admin privileges required.' 
        });
    }
    
    next();
};

export { adminOnly };
export default protect;
