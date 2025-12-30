"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSummariesHandler = getSummariesHandler;
exports.getSummaryStatsHandler = getSummaryStatsHandler;
exports.getRecentActivityHandler = getRecentActivityHandler;
exports.triggerAggregationHandler = triggerAggregationHandler;
const response_util_1 = require("../utils/response.util");
const summaries_service_1 = require("../services/summaries.service");
async function getSummariesHandler(req, res) {
    try {
        if (!req.user) {
            (0, response_util_1.sendError)(res, 'User authentication required', undefined, undefined, 401);
            return;
        }
        const filters = {
            dateFrom: req.query.dateFrom,
            dateTo: req.query.dateTo,
            service: req.query.service,
            moduleName: req.query.moduleName,
            action: req.query.action,
            groupBy: req.query.groupBy || 'day',
        };
        const summaries = await (0, summaries_service_1.getSummaries)(filters, req.user, req.serviceName);
        (0, response_util_1.sendSuccess)(res, 'Summaries retrieved successfully', summaries);
    }
    catch (error) {
        console.error('Get summaries error:', error);
        (0, response_util_1.sendError)(res, 'Failed to retrieve summaries', error.message, undefined, 500);
    }
}
async function getSummaryStatsHandler(req, res) {
    try {
        if (!req.user) {
            (0, response_util_1.sendError)(res, 'User authentication required', undefined, undefined, 401);
            return;
        }
        const stats = await (0, summaries_service_1.getSummaryStats)(req.user, req.serviceName);
        (0, response_util_1.sendSuccess)(res, 'Summary statistics retrieved successfully', stats);
    }
    catch (error) {
        console.error('Get summary stats error:', error);
        (0, response_util_1.sendError)(res, 'Failed to retrieve summary statistics', error.message, undefined, 500);
    }
}
async function getRecentActivityHandler(req, res) {
    try {
        if (!req.user) {
            (0, response_util_1.sendError)(res, 'User authentication required', undefined, undefined, 401);
            return;
        }
        const days = parseInt(req.query.days) || 7;
        const activity = await (0, summaries_service_1.getRecentActivity)(days, req.user, req.serviceName);
        (0, response_util_1.sendSuccess)(res, 'Recent activity retrieved successfully', activity);
    }
    catch (error) {
        console.error('Get recent activity error:', error);
        (0, response_util_1.sendError)(res, 'Failed to retrieve recent activity', error.message, undefined, 500);
    }
}
async function triggerAggregationHandler(req, res) {
    try {
        const { dateFrom, dateTo } = req.body;
        if (!dateFrom || !dateTo) {
            (0, response_util_1.sendError)(res, 'dateFrom and dateTo are required');
            return;
        }
        const result = await (0, summaries_service_1.triggerManualAggregation)(new Date(dateFrom), new Date(dateTo));
        (0, response_util_1.sendSuccess)(res, `Aggregation completed for ${result.datesProcessed} days`, result);
    }
    catch (error) {
        console.error('Trigger aggregation error:', error);
        (0, response_util_1.sendError)(res, 'Failed to trigger aggregation', error.message, undefined, 500);
    }
}
