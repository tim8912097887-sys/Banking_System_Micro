/** @type {import('ts-jest').JestConfigWithTsJest} */
export default {
    // Use the specific ESM preset
    preset: "ts-jest/presets/default-esm",
    testEnvironment: "node",
    rootDir: "./",
    
    testMatch: ["<rootDir>/test/**/*.test.ts", "<rootDir>/test/**/*.spec.ts"],
    extensionsToTreatAsEsm: ['.ts'],
    moduleFileExtensions: ["ts", "js"],
    setupFiles: ["<rootDir>/test/setup-env.ts"],
    // Ensure this path is exactly where the file is
    setupFilesAfterEnv: ["<rootDir>/test/jest.setup.ts"],
    
    verbose: true,
    clearMocks: true,

    moduleNameMapper: {
        // Handle test utils import
        '^test/(.*)\\.js$': '<rootDir>/test/$1',
        // Capture any @alias/path.js and map it to <rootDir>/src/path
        '^@(\\w+)/(.*)\\.js$': '<rootDir>/src/$1/$2',
        '^@/(.*)\\.js$': '<rootDir>/src/$1',
        
        // Handle relative imports with .js extensions
        '^(\\.{1,2}/.*)\\.js$': '$1',
    },

    transform: {
        '^.+\\.tsx?$': [
            'ts-jest',
            {
                useESM: true,
                tsconfig: 'tsconfig.json',
            },
        ],
    },
    collectCoverage: true,
    coverageProvider: "v8",
    coverageReporters: ["html", "text", "json"],
}