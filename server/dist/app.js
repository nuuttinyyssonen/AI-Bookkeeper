"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
require("./types/express");
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const helmet_1 = __importDefault(require("helmet"));
const storage_routes_1 = __importDefault(require("./routes/storage.routes"));
const receipt_routes_1 = __importDefault(require("./routes/receipt.routes"));
const dashboard_routes_1 = __importDefault(require("./routes/dashboard.routes"));
const report_routes_1 = __importDefault(require("./routes/report.routes"));
const assistant_routes_1 = __importDefault(require("./routes/assistant.routes"));
const user_routes_1 = __importDefault(require("./routes/user.routes"));
const cypress_routes_1 = __importDefault(require("./routes/cypress.routes"));
const errorHandler_1 = require("./middleware/errorHandler");
const requestLogger_1 = require("./middleware/requestLogger");
dotenv_1.default.config();
const app = (0, express_1.default)();
// Webhook
// app.use('/api/subscriptions', webhookRouter);
// CORS configuration to allow requests from frontend
app.use((0, cors_1.default)({
    origin: process.env.NODE_ENV === "production"
        ? "https://aibookkeeper.fi"
        : "http://localhost:3000",
    credentials: true
}));
app.use(express_1.default.json());
app.use((0, cookie_parser_1.default)());
// Use Helmet to set secure HTTP headers
app.use((0, helmet_1.default)());
// Winston request logger
app.use(requestLogger_1.requestLogger);
// Health check point
app.get('/health', (req, res) => res.json({ status: 'ok' }));
// Routes
// app.use('/api/auth/login', loginRouter);
// app.use('/api/auth/signup', signupRouter);
// app.use('/api/auth/logout', logoutRouter);
app.use('/api/storage', storage_routes_1.default);
app.use('/api/receipt', receipt_routes_1.default);
app.use('/api/dashboard', dashboard_routes_1.default);
app.use('/api/report', report_routes_1.default);
app.use('/api/assistant', assistant_routes_1.default);
// app.use('/api/subscription', subscriptionRouter);
app.use('/api/user', user_routes_1.default);
// app.use('/api/auth/reset-password', passwordResetRouter);
if (process.env.NODE_ENV !== 'production') {
    app.use('/api/test-cleanup', cypress_routes_1.default);
}
// Error handler middleware
app.use(errorHandler_1.errorHandler);
exports.default = app;
