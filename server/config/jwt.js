import jwt from 'jsonwebtoken';

export const generateToken = (userId) => {
  return jwt.sign(
    { userId },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRE }
  );
};

export const generateRefreshToken = (userId) => {
  return jwt.sign(
    { userId },
    process.env.JWT_REFRESH_SECRET,
    { expiresIn: process.env.JWT_REFRESH_EXPIRE }
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
    if (error.name === 'TokenExpiredError') {
      throw new Error('Refresh token expired, please log in again');
    }
    throw new Error('Invalid refresh token');
  }
}; 