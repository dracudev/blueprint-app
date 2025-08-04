/**
 * Utility functions for handling serverless-specific database operations
 */

/**
 * Safely execute a Prisma query with error handling for serverless environments
 * This helps prevent prepared statement conflicts
 */
async function safeQueryExecution(queryFn, retries = 3) {
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
          // Exponential backoff with jitter
          const delay =
            Math.min(1000 * Math.pow(2, attempt), 5000) + Math.random() * 1000;
          await new Promise((resolve) => setTimeout(resolve, delay));
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
