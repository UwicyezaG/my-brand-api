import swaggerJSDoc from 'swagger-jsdoc';

const swaggerOptions: swaggerJSDoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Your API Title', // my brand ...api
      version: '1.0.0',
      description: 'Your API Description',
    },
  },
  apis: ['./src/route/*.ts' , './src/api-docs/docs/*.yml'], // Path to the API routes- access swagger
};

export const swaggerSpec = swaggerJSDoc(swaggerOptions);