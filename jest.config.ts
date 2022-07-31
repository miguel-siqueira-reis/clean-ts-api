export default {
    roots: ['<rootDir>/src'],
    coverageDirectory: 'coverage',
    collectCoverageFrom: ['<rootDir>/src/**/*.ts'],
    testEnvironment: 'node',
    preset: '@shelf/jest-mongodb',
    transform: {
        '^.+\\.ts$': 'ts-jest',
    },
};
