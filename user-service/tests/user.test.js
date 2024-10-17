const grpc = require("@grpc/grpc-js");
const protoLoader = require("@grpc/proto-loader");
const mongoose = require("mongoose");
const config = require("../src/config");

const packageDefinition = protoLoader.loadSync("./src/protos/user.proto", {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
});

const userProto = grpc.loadPackageDefinition(packageDefinition).user;
const client = new userProto.UserService(
  "localhost:50051",
  grpc.credentials.createInsecure()
);

beforeAll(async () => {
  await mongoose.connect(config.mongoUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
});

afterAll(async () => {
  await mongoose.connection.close();
});

describe("User Service", () => {
  it("should register a new user", (done) => {
    client.register(
      { username: "testuser", password: "testpassword" },
      (error, response) => {
        expect(error).toBeNull();
        expect(response.user).toBeDefined();
        expect(response.user.username).toBe("testuser");
        done();
      }
    );
  });

  it("should login a user", (done) => {
    client.login(
      { username: "testuser", password: "testpassword" },
      (error, response) => {
        expect(error).toBeNull();
        expect(response.token).toBeDefined();
        done();
      }
    );
  });

  it("should get a user by ID", (done) => {
    // First, register a user to get an ID
    client.register(
      { username: "testuser2", password: "testpassword" },
      (error, registerResponse) => {
        expect(error).toBeNull();
        const userId = registerResponse.user.id;

        // Now, try to get the user by ID
        client.getUser({ userId }, (error, getUserResponse) => {
          expect(error).toBeNull();
          expect(getUserResponse.user).toBeDefined();
          expect(getUserResponse.user.id).toBe(userId);
          expect(getUserResponse.user.username).toBe("testuser2");
          done();
        });
      }
    );
  });
});
