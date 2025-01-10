export function errorHandler(err, req, res, next) {
    console.error('Server error:', err);
    
    let status = 400;
    let message = err.message || 'Something went wrong';
    
    // Handle specific error types
    if (message.includes('unavailable') || message.includes('quota exceeded')) {
        status = 503;
    } else if (message.includes('permission') || message.includes('denied')) {
        status = 403;
    } else if (message.includes('not found')) {
        status = 404;
    }
    
    res.status(status).json({
        error: message,
        status,
        timestamp: new Date().toISOString()
    });
}