import http from 'http';
import { users } from '../src/handleRequest/handleRequest';

describe('User API tests', () => {
  let id: string;
  const port = process.env.PORT || 4000;
  const newUser = {
    username: 'Alex',
    age: 29,
    hobbies: ['coding', 'gaming'],
  };

  test('GET /api/users should return an empty array', (done) => {
    http.get(`http://localhost:${port}/api/users`, (res) => {
      let data = '';

      res.on('data', (chunk) => {
        data += chunk;
      });

      res.on('end', () => {
        const response = JSON.parse(data);

        expect(res.statusCode).toBe(200);
        expect(response).toEqual([]);
        expect(users).toEqual([]);
        done();
      });
    });
  });

  test('POST /api/users should create a new user object', (done) => {
    const options = {
      method: 'POST',
      hostname: 'localhost',
      port,
      path: '/api/users',
      headers: {
        'Content-Type': 'application/json',
      },
    };

    const req = http.request(options, (res) => {
      let data = '';

      res.on('data', (chunk) => {
        data += chunk;
      });

      res.on('end', () => {
        const response = JSON.parse(data);
        id = response.id;
        users.push(response);

        expect(res.statusCode).toBe(201);
        expect(response).toEqual(expect.objectContaining(newUser));
        expect(users[0]).toEqual(expect.objectContaining(newUser));

        done();
      });
    });

    req.write(JSON.stringify(newUser));

    req.end();
  });

  test('GET /api/users/{userId} should return the created user object', (done) => {
    http.get(`http://localhost:4000/api/users/${id}`, (res) => {
      let data = '';

      res.on('data', (chunk) => {
        data += chunk;
      });

      res.on('end', () => {
        const response = JSON.parse(data);

        expect(res.statusCode).toBe(200);
        expect(response.id).toBe(id);

        done();
      });
    });
  });

  test('PUT /api/users/{userId} should update the user object', (done) => {
    const updatedUser = {
      id,
      username: 'Alex Rud',
      age: 30,
      hobbies: ['reading', 'traveling'],
    };

    const options = {
      method: 'PUT',
      hostname: 'localhost',
      port,
      path: `/api/users/${id}`,
      headers: {
        'Content-Type': 'application/json',
      },
    };

    const req = http.request(options, (res) => {
      let data = '';

      res.on('data', (chunk) => {
        data += chunk;
      });

      res.on('end', () => {
        const response = JSON.parse(data);
        users[0] = updatedUser;

        expect(res.statusCode).toBe(200);
        expect(response).toEqual(expect.objectContaining(updatedUser));
        expect(users[0]).toEqual(expect.objectContaining(updatedUser));
        done();
      });
    });

    req.write(JSON.stringify(updatedUser));
    req.end();
  });

  test('DELETE /api/users/{userId} should delete the user object', (done) => {
    const options = {
      method: 'DELETE',
      hostname: 'localhost',
      port,
      path: `/api/users/${id}`,
    };

    const userIndex = users.findIndex((u) => u.id === id);
    users.splice(userIndex, 1);

    const req = http.request(options, (res) => {
      expect(res.statusCode).toBe(204);
      expect(users).toEqual([]);
      done();
    });

    req.end();
  });
});
