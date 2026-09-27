function errorHandler(err, req, res, next) {
  console.error(`[Error] ${req.method} ${req.originalUrl}:`, err.message);

  let statusCode = err.statusCode || err.status;
  if (!statusCode || statusCode === 200) {
    if (res.statusCode && res.statusCode !== 200) {
      statusCode = res.statusCode;
    } else if (err.message && (
      err.message.includes('Invalid supply chain transition') ||
      err.message.includes('Batch is currently ON HOLD') ||
      err.message.includes('cannot undergo') ||
      err.message.includes('required')
    )) {
      statusCode = 400;
    } else if (err.message && (
      err.message.includes('Permission denied') ||
      err.message.includes('Unauthorized') ||
      err.message.includes('Access denied')
    )) {
      statusCode = 403;
    } else {
      statusCode = 500;
    }
  }

  res.status(statusCode).json({
    success: false,
    message: err.message || 'An unexpected internal server error occurred',
    timestamp: new Date().toISOString()
  });
}

module.exports = { errorHandler };
