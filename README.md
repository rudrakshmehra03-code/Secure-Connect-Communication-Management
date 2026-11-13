# Assignment 4 – Secure Connect and Communication Platform

A backend application using Node.js, Express, MongoDB, JWT, bcrypt, dotenv, Socket.IO and Node.js EventEmitter.

## 1. Requirements
- Node.js and npm
- MongoDB running locally or a MongoDB Atlas database
- VS Code
- Postman for API testing

## 2. Setup
1. Extract the ZIP and open this folder in VS Code.
2. Run `npm install` in the VS Code terminal.
3. Copy `.env.example` and rename the copy to `.env`.
4. Update `MONGO_URI` if using MongoDB Atlas.
5. Replace `JWT_SECRET` with a long private random value.
6. Run `npm start`.

The server runs at `http://localhost:5000`.

## 3. Signup
POST `http://localhost:5000/api/auth/signup`

Body → raw → JSON:
```json
{
  "username": "victor",
  "email": "victor@example.com",
  "password": "123456"
}
```

## 4. Login
POST `http://localhost:5000/api/auth/login`

```json
{
  "email": "victor@example.com",
  "password": "123456"
}
```
Copy the token returned in the response.

## 5. Protected routes
For every `/api/notes` request, add this Postman header:

`Authorization: Bearer YOUR_LOGIN_TOKEN`

## 6. Notes API
| Method | URL | Purpose |
|---|---|---|
| POST | `/api/notes` | Create a note |
| GET | `/api/notes` | Get your notes |
| GET | `/api/notes/:id` | Get one of your notes |
| PUT | `/api/notes/:id` | Update your note |
| DELETE | `/api/notes/:id` | Delete your note |

Create note body:
```json
{
  "title": "My First Note",
  "content": "This is my first note of web development."
}
```

## 7. Real-time chat test
The server provides Socket.IO events:
- `joinRoom` – send a room name such as `general`
- `chatMessage` – send `{ "room": "general", "sender": "Tanvi", "message": "Hello team!" }`
- `newMessage` – listen for incoming messages
- `joinedRoom` – confirms room joining

To test Socket.IO, use a small Socket.IO client or a separate frontend that connects to `http://localhost:5000`. Postman REST requests alone do not demonstrate the live chat events.

## 8. Event-driven features
The `utils/events.js` file uses Node.js EventEmitter for:
- `userRegistered`
- `noteCreated`
- `chatMessage`

## 9. RBAC
The authentication middleware includes `authorize("admin")` for admin-only route protection. New users are registered with the `user` role by default. Do not allow users to choose their own admin role during public signup.

## 10. GitHub
Do not upload `.env` or `node_modules`. The `.gitignore` file excludes both.
