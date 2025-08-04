/**
 * Utility functions for handling serverless-specific database operations
 */

/**
 * Safely execute a Prisma query with error handling for serverless environments
 * This helps prevent prepared statement conflicts
 */
async function safeQueryExecution(queryFn, retries = 2) {
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      return await queryFn();
    } catch (error) {
      // Check if it's a prepared statement error
      if (error.code === 'P2002' || 
          (error.message && error.message.includes('prepared statement')) ||
          (error.message && error.message.includes('already exists'))) {
        
        if (attempt < retries) {
          console.log(`Retrying query due to prepared statement conflict (attempt ${attempt + 1}/${retries + 1})`);
          // Add a small delay before retrying
          await new Promise(resolve => setTimeout(resolve, 100 * (attempt + 1)));
          continue;
        }
      }
      throw error;
    }
  }
}

/**
 * Initialize Prisma client for serverless environment
 */
function initializePrismaForServerless(PrismaClient, options = {}) {
  // Use a global variable to persist the connection across serverless function invocations
  const globalKey = '__prisma_client__';
  
  if (!global[globalKey]) {
    global[globalKey] = new PrismaClient({
      ...options,
      // Add serverless-specific configurations
      log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'],
    });
  }
  
  return global[globalKey];
}

module.exports = {
  safeQueryExecution,
  initializePrismaForServerless,
};
