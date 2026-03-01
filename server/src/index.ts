import express from 'express'
import cors from "cors";
import { Server } from 'socket.io';
import http from "http";
import { authRouter } from './routes/auth.js';
import { userRouter } from './routes/user.js';

const app = express()
const server = http.createServer(app)
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

app.use(cors())
app.use(express.json());

app.use("/api/v1/auth", authRouter)
app.use("/api/v1/user", userRouter)

io.on("connection", (socket) => {
  console.log("a user connected! ", socket.id);

  socket.on("disconnect", () => {
    console.log("a use disconnected ", socket.id);
  })

  socket.on("connect_error", (err) => {
    console.log("Error:", err.message);
  })
})

server.listen(3000, "0.0.0.0", () => {
  console.log("Server is running on http://localhost:3000");
});