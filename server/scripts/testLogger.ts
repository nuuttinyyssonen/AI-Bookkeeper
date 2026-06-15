import logger from "../src/lib/logger";

logger.info("Server started");
logger.warn("Rate limit exceeded");
logger.error("Database connection failed", { error: "Connection timeout" });
logger.debug("Debug message");