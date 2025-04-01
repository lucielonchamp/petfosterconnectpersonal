import swaggerJsdoc from 'swagger-jsdoc';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Pet Foster Connect API',
      version: '1.0.0',
    },
  },
  apis: ['./src/routes/*.ts'],
};

const specs = swaggerJsdoc(options);

export { specs };