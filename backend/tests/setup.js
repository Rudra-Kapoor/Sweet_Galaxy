const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

let mongoServer;

// Suppress Mongoose deprecation warnings
mongoose.set('strictQuery', true);

// Suppress console logs during tests but allow errors
const originalConsoleLog = console.log;
const originalConsoleInfo = console.info;
const originalConsoleDebug = console.debug;

console.log = jest.fn();
console.info = jest.fn();
console.debug = jest.fn();

// Setup in-memory MongoDB before tests
beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const mongoUri = mongoServer.getUri();
  
  await mongoose.connect(mongoUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
});

// Clear database after each test
afterEach(async () => {
  const collections = mongoose.connection.collections;
  
  for (const key in collections) {
    await collections[key].deleteMany();
  }
});

// Restore console and cleanup after all tests
afterAll(async () => {
  // Restore console
  console.log = originalConsoleLog;
  console.info = originalConsoleInfo;
  console.debug = originalConsoleDebug;
  
  // Disconnect from database
  await mongoose.disconnect();
  await mongoServer.stop();
});

// Set consistent JWT secret for tests
process.env.JWT_SECRET = 'test-secret-key-for-jwt-2024';
process.env.NODE_ENV = 'test';