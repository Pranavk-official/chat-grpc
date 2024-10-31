const express = require("express");
const cors = require("cors");
const chatRoutes = require("./routes/chatRoutes");
const userRoutes = require("./routes/userRoutes");
const config = require("./config");
const logger = require("./utils/logger");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/chat", chatRoutes);
app.use("/users", userRoutes);

app.listen(config.port, () => {
  logger.info(`Gateway server running on port ${config.port}`);
});

module.exports = app;
