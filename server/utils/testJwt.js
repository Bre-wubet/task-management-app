import { generateToken, verifyToken, JWT_SECRET } from './jwtUtils.js';

// Test JWT functionality
const testJWT = () => {
    try {
        console.log('Testing JWT functionality...');
        console.log('JWT_SECRET:', JWT_SECRET ? 'Set' : 'Not set');
        
        // Test token generation
        const testUserId = '507f1f77bcf86cd799439011';
        const token = generateToken(testUserId);
        console.log('Generated token:', token.substring(0, 50) + '...');
        
        // Test token verification
        const decoded = verifyToken(token);
        console.log('Decoded token:', decoded);
        
        console.log('✅ JWT functionality working correctly');
        return true;
    } catch (error) {
        console.error('❌ JWT test failed:', error.message);
        return false;
    }
};

export { testJWT }; 