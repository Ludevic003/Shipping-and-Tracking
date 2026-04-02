import 'dotenv/config';
import express from 'express';
import { google } from 'googleapis';
import { stringify } from 'csv-stringify/sync';
import pb from '../utils/pocketbase.js';
import logger from '../utils/logger.js';

const router = express.Router();

// Initialize Google Search Console API
let searchConsole = null;

const initializeSearchConsole = async () => {
  if (searchConsole) return searchConsole;

  const credentials = JSON.parse(process.env.GOOGLE_SEARCH_CONSOLE_CREDENTIALS);
  const auth = new google.auth.GoogleAuth({
    credentials,
    scopes: ['https://www.googleapis.com/auth/webmasters.readonly'],
  });

  searchConsole = google.webmasters({ version: 'v3', auth });
  return searchConsole;
};

// Helper function to format date range
const formatDateRange = (dateRange) => {
  const now = new Date();
  let startDate, endDate;

  switch (dateRange) {
    case '7days':
      startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      break;
    case '30days':
      startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      break;
    case '90days':
      startDate = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
      break;
    case '1year':
      startDate = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
      break;
    default:
      startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
  }

  endDate = new Date(now.getTime() - 24 * 60 * 60 * 1000); // Yesterday

  return {
    startDate: startDate.toISOString().split('T')[0],
    endDate: endDate.toISOString().split('T')[0],
  };
};

// POST /analytics/search-console - Fetch Search Console data
router.post('/search-console', async (req, res) => {
  const { dateRange = '30days', deviceType, country, siteUrl } = req.body;

  if (!siteUrl) {
    return res.status(400).json({ error: 'Missing required field: siteUrl' });
  }

  logger.info(`Fetching Search Console data for ${siteUrl} with filters: dateRange=${dateRange}, deviceType=${deviceType}, country=${country}`);

  const sc = await initializeSearchConsole();
  const { startDate, endDate } = formatDateRange(dateRange);

  // Build filters
  const filters = [];
  if (deviceType) {
    filters.push({ dimension: 'device', operator: 'equals', expression: deviceType });
  }
  if (country) {
    filters.push({ dimension: 'country', operator: 'equals', expression: country });
  }

  // Fetch query data
  const queryResponse = await sc.searchanalytics.query({
    siteUrl,
    requestBody: {
      startDate,
      endDate,
      dimensions: ['query'],
      rowLimit: 1000,
      filters,
    },
  });

  // Fetch page data
  const pageResponse = await sc.searchanalytics.query({
    siteUrl,
    requestBody: {
      startDate,
      endDate,
      dimensions: ['page'],
      rowLimit: 1000,
      filters,
    },
  });

  // Fetch device data
  const deviceResponse = await sc.searchanalytics.query({
    siteUrl,
    requestBody: {
      startDate,
      endDate,
      dimensions: ['device'],
      rowLimit: 100,
      filters: country ? [{ dimension: 'country', operator: 'equals', expression: country }] : [],
    },
  });

  // Fetch country data
  const countryResponse = await sc.searchanalytics.query({
    siteUrl,
    requestBody: {
      startDate,
      endDate,
      dimensions: ['country'],
      rowLimit: 1000,
      filters: deviceType ? [{ dimension: 'device', operator: 'equals', expression: deviceType }] : [],
    },
  });

  // Fetch trend data (by date)
  const trendResponse = await sc.searchanalytics.query({
    siteUrl,
    requestBody: {
      startDate,
      endDate,
      dimensions: ['date'],
      rowLimit: 1000,
      filters,
    },
  });

  // Format responses
  const queries = (queryResponse.rows || []).map((row) => ({
    query: row.keys[0],
    impressions: row.impressions || 0,
    clicks: row.clicks || 0,
    ctr: row.ctr ? (row.ctr * 100).toFixed(2) : '0.00',
    position: row.position ? row.position.toFixed(2) : '0.00',
  }));

  const pages = (pageResponse.rows || []).map((row) => ({
    page: row.keys[0],
    impressions: row.impressions || 0,
    clicks: row.clicks || 0,
    ctr: row.ctr ? (row.ctr * 100).toFixed(2) : '0.00',
  }));

  const devices = (deviceResponse.rows || []).map((row) => ({
    device: row.keys[0],
    impressions: row.impressions || 0,
    clicks: row.clicks || 0,
    ctr: row.ctr ? (row.ctr * 100).toFixed(2) : '0.00',
  }));

  const countries = (countryResponse.rows || []).map((row) => ({
    country: row.keys[0],
    impressions: row.impressions || 0,
    clicks: row.clicks || 0,
  }));

  const trends = (trendResponse.rows || []).map((row) => ({
    date: row.keys[0],
    impressions: row.impressions || 0,
    clicks: row.clicks || 0,
    ctr: row.ctr ? (row.ctr * 100).toFixed(2) : '0.00',
  }));

  logger.info(`Successfully fetched Search Console data: ${queries.length} queries, ${pages.length} pages, ${devices.length} devices, ${countries.length} countries`);

  res.json({
    queries,
    pages,
    devices,
    countries,
    trends,
    dateRange: { startDate, endDate },
  });
});

// GET /analytics/search-console/export - Export Search Console data as CSV
router.get('/search-console/export', async (req, res) => {
  const { dateRange = '30days', deviceType, country, siteUrl } = req.query;

  if (!siteUrl) {
    return res.status(400).json({ error: 'Missing required field: siteUrl' });
  }

  logger.info(`Exporting Search Console data as CSV for ${siteUrl}`);

  const sc = await initializeSearchConsole();
  const { startDate, endDate } = formatDateRange(dateRange);

  // Build filters
  const filters = [];
  if (deviceType) {
    filters.push({ dimension: 'device', operator: 'equals', expression: deviceType });
  }
  if (country) {
    filters.push({ dimension: 'country', operator: 'equals', expression: country });
  }

  // Fetch query data
  const queryResponse = await sc.searchanalytics.query({
    siteUrl,
    requestBody: {
      startDate,
      endDate,
      dimensions: ['query'],
      rowLimit: 10000,
      filters,
    },
  });

  // Format data for CSV
  const csvData = (queryResponse.rows || []).map((row) => ({
    Query: row.keys[0],
    Impressions: row.impressions || 0,
    Clicks: row.clicks || 0,
    CTR: row.ctr ? (row.ctr * 100).toFixed(2) + '%' : '0.00%',
    Position: row.position ? row.position.toFixed(2) : '0.00',
  }));

  // Generate CSV
  const csv = stringify(csvData, {
    header: true,
    columns: ['Query', 'Impressions', 'Clicks', 'CTR', 'Position'],
  });

  logger.info(`Generated CSV export with ${csvData.length} rows`);

  res.setHeader('Content-Type', 'text/csv');
  res.setHeader('Content-Disposition', `attachment; filename="search-console-${startDate}-to-${endDate}.csv"`);
  res.send(csv);
});

// POST /analytics/performance - Log performance metrics
router.post('/performance', async (req, res) => {
  const { metric, value, timestamp, url, userAgent } = req.body;

  // Input validation
  if (!metric || value === undefined) {
    return res.status(400).json({ error: 'Missing required fields: metric, value' });
  }

  // Validate metric type (Core Web Vitals)
  const validMetrics = ['LCP', 'FID', 'CLS', 'TTFB', 'FCP', 'INP'];
  if (!validMetrics.includes(metric)) {
    return res.status(400).json({ error: `Invalid metric. Must be one of: ${validMetrics.join(', ')}` });
  }

  logger.info(`Logging performance metric: ${metric}=${value}ms from ${url || 'unknown'}`);

  // Store performance metric in PocketBase
  const record = await pb.collection('performance_metrics').create({
    metric,
    value: parseFloat(value),
    timestamp: timestamp || new Date().toISOString(),
    url: url || null,
    userAgent: userAgent || null,
  });

  logger.info(`Performance metric stored with ID: ${record.id}`);

  res.json({
    success: true,
    message: 'Performance metric logged successfully',
    metricId: record.id,
  });
});

export default router;