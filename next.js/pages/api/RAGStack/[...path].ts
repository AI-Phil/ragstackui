/**
 * This is a proxy API route that forwards requests to the FastAPI server.
 */
import type { NextApiRequest, NextApiResponse } from 'next';
import { request as httpRequest } from 'http';
import { URL } from 'url';


const ragStackEndpoint=process.env.RAGSTACK_API_ENDPOINT || "http://fastapi:80";

// Config to inform Next.js that we're resolving responses externally
export const config = {
  api: {
    externalResolver: true,
  },
}

export default function handler(req: NextApiRequest, res: NextApiResponse): void {
  // Extracting the path and query from the request to reconstruct the destination URL
  const { path } = req.query;
  const destinationPath = Array.isArray(path) ? path.join('/') : path;
  const queryString = req.url?.split('?')[1] || '';
  const targetUrl = new URL(`${ragStackEndpoint}/${destinationPath}?${queryString}`);

  // Setup the options for the proxy request
  const options = {
    hostname: targetUrl.hostname,
    port: targetUrl.port,
    path: `${targetUrl.pathname}${targetUrl.search}`,
    method: req.method,
    headers: req.headers,
  };

  // Initiating the proxy request to the FastAPI server
  const proxyRequest = httpRequest(options, (proxyRes) => {
    // Forwarding the status code and headers from the FastAPI server to the client
    res.writeHead(proxyRes.statusCode || 500, proxyRes.headers);
    
    // Piping the response body directly from the FastAPI server to the client
    // This avoids buffering the response in memory, which is efficient for large responses or streaming
    proxyRes.pipe(res, { end: true });
  });

  // Error handling for the proxy request
  // If there's an issue with the proxy request, log the error and send a 500 response to the client
  proxyRequest.on('error', (e) => {
    console.error(`Problem with request: ${e.message}`);
    if (!res.headersSent) {
      res.status(500).json({ error: `Proxy failed: ${e.message}` });
    }
  });

  // Forwarding the body of the incoming request to the FastAPI server
  // This is necessary for methods like POST or PUT which include a request body
  req.pipe(proxyRequest, { end: true });
}
