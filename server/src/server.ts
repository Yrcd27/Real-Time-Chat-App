import express from 'express';
import http from 'http';
import cors from 'cors';
import dotenv from 'dotenv';
import { WebSocket, WebSocketServer } from 'ws';

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

// Create a server
const server = http.createServer(app);
const wss = new WebSocketServer({ server });

// Create a new WebSocket connection
wss.on('connection', (ws: WebSocket) => {
  console.log('New client connected');

  ws.on("message", (data) => {
    try {
      console.log("Message received:", data.toString());
      // Forward the message to all clients except the sender
      wss.clients.forEach((client) => {
        if (client !== ws && client.readyState === WebSocket.OPEN) {
          client.send(data.toString());
        }
      });
    } catch (error) {
      console.error("Error handling message:", error);
    }
  });
  ws.on('close', () => {
    console.log('Client disconnected');
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
