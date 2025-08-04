/**
 * Utility functions for handling serverless-specific database operations
 */

/**
 * Safely execute a Prisma query with error handling for serverless environments
 * This helps prevent prepared statement conflicts by serializing operations
 */

// Queue to serialize database operations
let operationQueue = Promise.resolve();

async function safeQueryExecution(queryFn, retries = 2) {
  // Serialize operations to prevent concurrent prepared statement creation
  operationQueue = operationQueue.then(async () => {
    for (let attempt = 0; attempt <= retries; attempt++) {
      try {
        return await queryFn();
      } catch (error) {
        // Check if it's a prepared statement error or connection error
        if (
          error.code === "P2002" ||
          error.code === "42P05" ||
          (error.message && error.message.includes("prepared statement")) ||
          (error.message && error.message.includes("already exists")) ||
          (error.message && error.message.toLowerCase().includes("connection"))
        ) {
          if (attempt < retries) {
            console.log(
              `Retrying query due to database conflict (attempt ${attempt + 1}/${
                retries + 1
              })`
            );
            // Simple delay between retries
            await new Promise((resolve) => setTimeout(resolve, 200 * (attempt + 1)));
            continue;
          }
        }
        throw error;
      }
    }
  });

  return operationQueue;
}

/**
 * Initialize Prisma client for serverless environment
 */
function initializePrismaForServerless(PrismaClient, options = {}) {
  // Use a global variable to persist the connection across serverless function invocations
  const globalKey = "__prisma_client__";

  if (!global[globalKey]) {
    global[globalKey] = new PrismaClient({
      ...options,
      // Add serverless-specific configurations
      log:
        process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
    });
  }

  return global[globalKey];
}

module.exports = {
  safeQueryExecution,
  initializePrismaForServerless,
};
