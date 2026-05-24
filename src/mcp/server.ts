import { createServer, IncomingMessage, ServerResponse } from 'http';
import { Logger } from '@utils/logger';
import { APIClient } from '@api/APIClient';
import { exec } from 'child_process';
import { promisify } from 'util';

const execPromise = promisify(exec);
const logger = new Logger('MCP Server');

interface MCPRequest {
  jsonrpc: string;
  method: string;
  params?: unknown;
  id?: string | number;
}

interface MCPResponse {
  jsonrpc: string;
  result?: unknown;
  error?: { code: number; message: string };
  id?: string | number;
}

/**
 * MCP (Model Context Protocol) Server for test automation
 */
class MCPTestServer {
  private server: ReturnType<typeof createServer>;
  private apiClient: APIClient;
  private port: number;
  private host: string;

  constructor(port: number = 3000, host: string = 'localhost') {
    this.port = port;
    this.host = host;
    this.apiClient = new APIClient();

    this.server = createServer(async (req: IncomingMessage, res: ServerResponse) => {
      res.setHeader('Content-Type', 'application/json');

      // Handle CORS
      res.setHeader('Access-Control-Allow-Origin', '*');
      res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
      res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

      if (req.method === 'OPTIONS') {
        res.writeHead(200);
        res.end();
        return;
      }

      let body = '';
      req.on('data', (chunk) => {
        body += chunk.toString();
      });

      req.on('end', async () => {
        try {
          const request: MCPRequest = JSON.parse(body);
          const response = await this.handleRequest(request);
          res.writeHead(200);
          res.end(JSON.stringify(response));
        } catch (error) {
          const errorResponse: MCPResponse = {
            jsonrpc: '2.0',
            error: { code: -32700, message: 'Parse error' },
          };
          res.writeHead(400);
          res.end(JSON.stringify(errorResponse));
        }
      });
    });
  }

  private async handleRequest(request: MCPRequest): Promise<MCPResponse> {
    const { method, params, id } = request;

    try {
      let result: unknown;

      switch (method) {
        case 'runUITests':
          result = await this.runUITests(params);
          break;
        case 'runAPITests':
          result = await this.runAPITests(params);
          break;
        case 'runMobileTests':
          result = await this.runMobileTests(params);
          break;
        case 'runAllTests':
          result = await this.runAllTests();
          break;
        case 'getTestResults':
          result = await this.getTestResults();
          break;
        case 'apiCall':
          result = await this.executeAPICall(params);
          break;
        default:
          return {
            jsonrpc: '2.0',
            error: { code: -32601, message: 'Method not found' },
            id,
          };
      }

      return {
        jsonrpc: '2.0',
        result,
        id,
      };
    } catch (error) {
      logger.error('Request handling error', error instanceof Error ? error : new Error(String(error)));
      return {
        jsonrpc: '2.0',
        error: { code: -32603, message: 'Internal error' },
        id,
      };
    }
  }

  private async runUITests(params?: unknown): Promise<{ status: string; message: string }> {
    logger.info('Running UI tests...');
    try {
      const { stdout, stderr } = await execPromise('npm run test:ui');
      if (stderr) logger.warn(stderr);
      return { status: 'success', message: stdout };
    } catch (error) {
      return { status: 'failed', message: String(error) };
    }
  }

  private async runAPITests(params?: unknown): Promise<{ status: string; message: string }> {
    logger.info('Running API tests...');
    try {
      const { stdout, stderr } = await execPromise('npm run test:api');
      if (stderr) logger.warn(stderr);
      return { status: 'success', message: stdout };
    } catch (error) {
      return { status: 'failed', message: String(error) };
    }
  }

  private async runMobileTests(params?: unknown): Promise<{ status: string; message: string }> {
    logger.info('Running Mobile tests...');
    try {
      const { stdout, stderr } = await execPromise('npm run test:mobile');
      if (stderr) logger.warn(stderr);
      return { status: 'success', message: stdout };
    } catch (error) {
      return { status: 'failed', message: String(error) };
    }
  }

  private async runAllTests(): Promise<{ status: string; message: string }> {
    logger.info('Running all tests...');
    try {
      const { stdout, stderr } = await execPromise('npm run test:all');
      if (stderr) logger.warn(stderr);
      return { status: 'success', message: stdout };
    } catch (error) {
      return { status: 'failed', message: String(error) };
    }
  }

  private async getTestResults(): Promise<unknown> {
    logger.info('Fetching test results...');
    try {
      const { stdout } = await execPromise('cat test-results/results.json');
      return JSON.parse(stdout);
    } catch (error) {
      return { status: 'no results available' };
    }
  }

  private async executeAPICall(params: unknown): Promise<unknown> {
    const apiParams = params as { method: string; endpoint: string; data?: unknown; headers?: Record<string, string> };

    if (!apiParams || !apiParams.method || !apiParams.endpoint) {
      throw new Error('Invalid API call parameters');
    }

    // Set headers if provided
    if (apiParams.headers) {
      Object.entries(apiParams.headers).forEach(([key, value]) => {
        this.apiClient.setHeader(key, value);
      });
    }

    let response;
    switch (apiParams.method.toUpperCase()) {
      case 'GET':
        response = await this.apiClient.get(apiParams.endpoint);
        break;
      case 'POST':
        response = await this.apiClient.post(apiParams.endpoint, apiParams.data);
        break;
      case 'PUT':
        response = await this.apiClient.put(apiParams.endpoint, apiParams.data);
        break;
      case 'DELETE':
        response = await this.apiClient.delete(apiParams.endpoint);
        break;
      default:
        throw new Error(`Unsupported HTTP method: ${apiParams.method}`);
    }

    return {
      status: response.status,
      data: response.data,
      headers: response.headers,
    };
  }

  start(): void {
    this.server.listen(this.port, this.host, () => {
      logger.success(
        `MCP Test Server is running at http://${this.host}:${this.port}`
      );
    });
  }

  stop(): void {
    this.server.close(() => {
      logger.info('MCP Test Server stopped');
    });
  }
}

// Initialize and start server
const port = parseInt(process.env.MCP_PORT || '3000');
const host = process.env.MCP_HOST || 'localhost';
const mcpServer = new MCPTestServer(port, host);
mcpServer.start();

// Handle graceful shutdown
process.on('SIGINT', () => {
  mcpServer.stop();
  process.exit(0);
});
