const grpc = require("@grpc/grpc-js");
const protoLoader = require("@grpc/proto-loader");
const path = require("path");
const config = require("../config");
const logger = require("../utils/logger");

const PROTO_PATH = path.resolve(
  __dirname,
  "../../user-service/src/protos/user.proto"
);

const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
});

const userProto = grpc.loadPackageDefinition(packageDefinition).user;

const client = new userProto.UserService(
  config.userServiceUrl,
  grpc.credentials.createInsecure()
);

exports.register = (req, res) => {
  const { username, email, password } = req.body;

  client.Register({ username, email, password }, (error, response) => {
    if (error) {
      logger.error("Error registering user:", error);
      return res.status(500).json({ error: "Failed to register user" });
    }
    res.json(response);
  });
};

exports.login = (req, res) => {
  const { email, password } = req.body;

  client.Login({ email, password }, (error, response) => {
    if (error) {
      logger.error("Error logging in user:", error);
      return res.status(500).json({ error: "Failed to log in user" });
    }
    res.json(response);
  });
};
