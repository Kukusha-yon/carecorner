import jwt from 'jsonwebtoken';

export const generateToken = (userId, role = 'user') => {
  return jwt.sign(
    { userId, role },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRE || '30d' }
  );
};

export const generateRefreshToken = (userId, role = 'user') => {
  return jwt.sign(
    { userId, role },
    process.env.JWT_REFRESH_SECRET,
    { expiresIn: process.env.JWT_REFRESH_EXPIRE || '7d' }
  );
};

export const verifyToken = (token) => {
  try {
    // Verify the token and return the decoded data
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Make sure we handle both possible field names (userId or id)
    return {
      ...decoded,
      userId: decoded.userId || decoded.id
    };
  } catch (error) {
    console.error('Token verification error:', error);
    if (error.name === 'TokenExpiredError') {
      throw new Error('Token expired, please log in again');
    }
    throw new Error('Invalid token');
  }
};

export const verifyRefreshToken = (token) => {
  try {
    return jwt.verify(token, process.env.JWT_REFRESH_SECRET);
  } catch (error) {
    console.error('Refresh token verification error:', error);
    if (error.name === 'TokenExpiredError') {
      throw new Error('Refresh token expired, please log in again');
    }
    throw new Error('Invalid refresh token');
  }
}; 