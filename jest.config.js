module.exports = {
    preset: "ts-jest",
    testEnvironment: "node",
    roots: ["<rootDir>/tests"],
    modulePathIgnorePatterns: ["<rootDir>/dist/"],
    testTimeout: 100000,
  };