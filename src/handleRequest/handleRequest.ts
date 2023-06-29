import { v4 as uuidv4 } from 'uuid';
import { User, ErrorResponse } from '../model/types';
import { IncomingMessage, ServerResponse } from 'http';
import { parseJson } from '../helper/parseJson';
import { sendResponse } from '../helper/sendResponce';
import { isValidUUID } from './../helper/uuidValidation';

const users: User[] = [];

export const handleRequest = (req: IncomingMessage, res: ServerResponse) => {
  try {
    const { method, url } = req;

    if (method === 'GET' && url === '/api/users') {
      sendResponse(res, 200, users);
    } else if (url && method === 'GET' && url.startsWith('/api/users/')) {
      const userId = url.split('/')[3];
      if (userId && !isValidUUID(userId)) {
        sendResponse(res, 400, { message: 'Invalid userId' } as ErrorResponse);
      }
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
        try {
          const { username, age, hobbies } =
            parseJson<Partial<User>>(body) || {};

          if (!username || !age || !hobbies) {
            sendResponse(res, 400, {
              message: 'Missing required fields',
            } as ErrorResponse);
          } else {
            const newUser: User = {
              id: uuidv4(),
              username,
              age,
              hobbies,
            };

            users.push(newUser);

            sendResponse(res, 201, newUser);
          }
        } catch (error) {
          console.error(error);
          sendResponse(res, 500, {
            message: 'Internal server error',
          } as ErrorResponse);
        }
      });
    } else if (url && method === 'PUT' && url.startsWith('/api/users/')) {
      const userId = url.split('/')[3];
      if (userId && !isValidUUID(userId)) {
        sendResponse(res, 400, { message: 'Invalid userId' } as ErrorResponse);
      }

      let body = '';

      req.on('data', (chunk) => {
        body += chunk;
      });

      req.on('end', () => {
        try {
          const { username, age, hobbies } =
            parseJson<Partial<User>>(body) || {};

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
        } catch (error) {
          console.error(error);
          sendResponse(res, 500, {
            message: 'Internal server error',
          } as ErrorResponse);
        }
      });
    } else if (url && method === 'DELETE' && url.startsWith('/api/users/')) {
      const userId = url.split('/')[3];
      if (userId && !isValidUUID(userId)) {
        sendResponse(res, 400, { message: 'Invalid userId' } as ErrorResponse);
      }

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
  } catch (error) {
    console.error(error);
    sendResponse(res, 500, {
      message: 'Internal server error',
    } as ErrorResponse);
  }
};
