const grpc = require("@grpc/grpc-js");
const protoLoader = require("@grpc/proto-loader");
const path = require("path");
const { expect } = require("chai");

const PROTO_PATH = path.resolve(__dirname, "../src/protos/chat.proto");

const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
});

const chatProto = grpc.loadPackageDefinition(packageDefinition).chat;
const client = new chatProto.ChatService(
  "localhost:3001",
  grpc.credentials.createInsecure()
);

describe("Chat Service", () => {
  it("should send a message", (done) => {
    const request = {
      sender_id: "123",
      recipient_id: "456",
      content: "Hello, World!",
    };

    client.SendMessage(request, (error, response) => {
      expect(error).to.be.null;
      expect(response.success).to.be.true;
      expect(response.message).to.equal("Message sent successfully");
      done();
    });
  });

  it("should get messages", (done) => {
    const request = {
      user_id: "123",
      other_user_id: "456",
    };

    client.GetMessages(request, (error, response) => {
      expect(error).to.be.null;
      expect(response.messages).to.be.an("array");
      done();
    });
  });
});
