module.exports = {
  roots: ["<rootDir>"],
  moduleFileExtensions: ["js", "ts", "tsx", "json"],
  testPathIgnorePatterns: ["<rootDir>[/\\\\](node_modules|.next)[/\\\\]"],
  transformIgnorePatterns: ["[/\\\\]node_modules[/\\\\].+\\.(js|ts|tsx)$"],
  transform: {
    "^.+\\.(js|ts|tsx)$": "babel-jest"
  },
  watchPlugins: [
    "jest-watch-typeahead/filename",
    "jest-watch-typeahead/testname"
  ],
  moduleNameMapper: {
    "@common/(.*)$": "<rootDir>/../common/lib/$1",
    "@logic/(.*)$": "<rootDir>/src/logic/$1",
    "@pages/(.*)$": "<rootDir>/pages/$1"
  },
  setupFilesAfterEnv: ["./jest.setup.js"]
}
