import AuditLog from '../models/AuditLog.js';

export const auditLogger = async (req, res, next) => {
  const originalSend = res.send;
  const originalJson = res.json;

  // Store the start time
  const startTime = Date.now();

  // Override res.send
  res.send = function (body) {
    logAudit(req, res, startTime, body);
    return originalSend.apply(res, arguments);
  };

  // Override res.json
  res.json = function (body) {
    logAudit(req, res, startTime, body);
    return originalJson.apply(res, arguments);
  };

  next();
};

const logAudit = async (req, res, startTime, responseBody) => {
  try {
    const duration = Date.now() - startTime;
    const userId = req.user?._id;
    const userRole = req.user?.role;
    const ip = req.ip;
    const userAgent = req.get('user-agent');

    // Only log certain types of requests
    const shouldLog = 
      req.method !== 'GET' || // Log all non-GET requests
      req.path.startsWith('/admin') || // Log all admin routes
      req.path.startsWith('/auth'); // Log all auth routes

    if (shouldLog) {
      await AuditLog.create({
        userId,
        userRole,
        action: `${req.method} ${req.path}`,
        method: req.method,
        path: req.path,
        query: req.query,
        body: req.method !== 'GET' ? req.body : undefined,
        responseStatus: res.statusCode,
        responseTime: duration,
        ip,
        userAgent,
        timestamp: new Date()
      });
    }
  } catch (error) {
    console.error('Error logging audit:', error);
  }
}; 