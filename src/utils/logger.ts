// Filename: logger.ts
import { Request, Response, NextFunction } from 'express';

// ANSI color codes for terminal output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  dim: '\x1b[2m',
  underscore: '\x1b[4m',
  blink: '\x1b[5m',
  reverse: '\x1b[7m',
  hidden: '\x1b[8m',
  
  // Foreground (text) colors
  fg: {
    black: '\x1b[30m',
    red: '\x1b[31m',
    green: '\x1b[32m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m',
    magenta: '\x1b[35m',
    cyan: '\x1b[36m',
    white: '\x1b[37m',
    gray: '\x1b[90m',
  },
  
  // Background colors
  bg: {
    black: '\x1b[40m',
    red: '\x1b[41m',
    green: '\x1b[42m',
    yellow: '\x1b[43m',
    blue: '\x1b[44m',
    magenta: '\x1b[45m',
    cyan: '\x1b[46m',
    white: '\x1b[47m',
  }
};

// Helper function to get color for status code
const getStatusColor = (statusCode: number): string => {
  if (statusCode >= 500) return colors.fg.red; // Server errors
  if (statusCode >= 400) return colors.fg.yellow; // Client errors
  if (statusCode >= 300) return colors.fg.cyan; // Redirects
  if (statusCode >= 200) return colors.fg.green; // Success
  return colors.fg.white; // Default
};

// Request logging middleware
export const requestLogger = (req: Request, res: Response, next: NextFunction) => {
  // Get timestamp when request starts
  const startTime = new Date();
  const formattedStartTime = startTime.toISOString();
  
  // Process the request
  next();
  
  // The following code will execute after the request is processed
  // but before the response is sent to the client
  res.on('finish', () => {
    // Calculate response time
    const responseTime = new Date().getTime() - startTime.getTime();
    
    // Get the status code
    const statusCode = res.statusCode;
    const statusColor = getStatusColor(statusCode);
    
    // Format the log message
    const logMessage = [
      `${colors.fg.gray}[${formattedStartTime}]${colors.reset}`,
      `${statusColor}${statusCode}${colors.reset}`,
      `${colors.fg.magenta}${req.method}${colors.reset}`,
      `${colors.fg.cyan}${req.originalUrl || req.url}${colors.reset}`,
      `${colors.fg.gray}from ${req.ip}${colors.reset}`,
      `${colors.fg.yellow}${responseTime}ms${colors.reset}`
    ].join(' ');
    
    // Log the message
    console.log(logMessage);
  });
};

// Export other logging utilities if needed
export const logger = {
  info: (message: string) => {
    console.log(`${colors.fg.blue}[INFO]${colors.reset} ${message}`);
  },
  warn: (message: string) => {
    console.log(`${colors.fg.yellow}[WARN]${colors.reset} ${message}`);
  },
  error: (message: string) => {
    console.log(`${colors.fg.red}[ERROR]${colors.reset} ${message}`);
  },
  success: (message: string) => {
    console.log(`${colors.fg.green}[SUCCESS]${colors.reset} ${message}`);
  }
};
