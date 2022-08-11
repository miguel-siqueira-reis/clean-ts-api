export default {
    roots: ['<rootDir>/src'],
    coverageDirectory: 'coverage',
    collectCoverageFrom: ['<rootDir>/src/**/*.ts', '!<rootDir>/src/Main/**'],
    testEnvironment: 'node',
    preset: '@shelf/jest-mongodb',
    transform: {
        '^.+\\.ts$': 'ts-jest',
    },
};
