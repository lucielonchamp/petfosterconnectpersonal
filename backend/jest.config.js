// jest.config.js
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  clearMocks: true,
  setupFiles: ['./jest.setup.js'], // Ajustez le chemin si nécessaire
};
