import http, { Server } from 'http';
import { handleRequest } from './handleRequest/handleRequest';

export const server: Server = http.createServer(handleRequest);

const port = process.env.PORT || 4000;

server.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
