"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const cypress_controller_1 = require("../controllers/cypress.controller");
const express_1 = require("express");
const rateLimiter_1 = require("../utils/rateLimiter");
const cypressRouter = (0, express_1.Router)();
cypressRouter.delete('/', rateLimiter_1.rateLimiters.read("cypress_e2e_delete"), cypress_controller_1.deleteUserByEmail);
cypressRouter.post('/grant-subscription', rateLimiter_1.rateLimiters.read("cypress_e2e_post"), cypress_controller_1.grantSubscription);
exports.default = cypressRouter;
