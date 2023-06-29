import { User, ErrorResponse } from './model/types/index';
import http, { Server, IncomingMessage, ServerResponse } from 'http';
import { v4 as uuidv4 } from 'uuid';

const users: User[] = [];

function parseJson<T>(jsonString: string): T | null {
  try {
    return JSON.parse(jsonString) as T;
  } catch (error) {
    return null;
  }
}

function sendResponse<T>(
  res: ServerResponse,
  statusCode: number,
  data?: T,
): void {
  res.statusCode = statusCode;
  res.setHeader('Content-Type', 'application/json');
  res.end(JSON.stringify(data));
}

const server: Server = http.createServer(
  (req: IncomingMessage, res: ServerResponse) => {
    const { method, url } = req;

    if (method === 'GET' && url === '/api/users') {
      sendResponse(res, 200, users);
    } else if (url && method === 'GET' && url.startsWith('/api/users/')) {
      const userId = url.split('/')[3];
      const user = users.find((u) => u.id === userId);

      if (!user) {
        sendResponse(res, 404, { message: 'User not found' } as ErrorResponse);
      } else {
        sendResponse(res, 200, user);
      }
    } else if (method === 'POST' && url === '/api/users') {
      let body = '';

      req.on('data', (chunk) => {
        body += chunk;
      });

      req.on('end', () => {
        const { id, username, age, hobbies } =
          parseJson<Partial<User>>(body) || {};

        if (!username || !age || !hobbies) {
          sendResponse(res, 400, {
            message: 'Missing required fields',
          } as ErrorResponse);
        } else {
          const newUser: User = {
            id: id || uuidv4(),
            username,
            age,
            hobbies,
          };

          users.push(newUser);

          sendResponse(res, 201, newUser);
        }
      });
    } else if (url && method === 'PUT' && url.startsWith('/api/users/')) {
      const userId = url.split('/')[3];

      let body = '';

      req.on('data', (chunk) => {
        body += chunk;
      });

      req.on('end', () => {
        const { username, age, hobbies } = parseJson<Partial<User>>(body) || {};

        const userIndex = users.findIndex((u) => u.id === userId);
        const user = users[userIndex];

        if (!user) {
          sendResponse(res, 404, {
            message: 'User not found',
          } as ErrorResponse);
        } else if (!username || !age || !hobbies) {
          sendResponse(res, 400, {
            message: 'Missing required fields',
          } as ErrorResponse);
        } else {
          user.username = username;
          user.age = age;
          user.hobbies = hobbies;

          sendResponse(res, 200, user);
        }
      });
    } else if (url && method === 'DELETE' && url.startsWith('/api/users/')) {
      const userId = url.split('/')[3];
      const userIndex = users.findIndex((u) => u.id === userId);

      if (userIndex === -1) {
        sendResponse(res, 404, { message: 'User not found' } as ErrorResponse);
      } else {
        users.splice(userIndex, 1);
        sendResponse(res, 204);
      }
    } else {
      sendResponse(res, 404, { message: 'Invalid route' } as ErrorResponse);
    }
  },
);

const port = process.env.PORT || 4000;
server.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
