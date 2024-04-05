import swaggerJSDoc from 'swagger-jsdoc';

const swaggerOptions: swaggerJSDoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'My Brand Api',
      version: '1.0.0',
      description: 'My Brand API Description',
    },

    servers: [{
      url: 'http://localhost:4000',
      description: 'Development server',
    },
  ],
  components: {
    securitySchemes: {
        bearerAuth: {
            type: 'http',
            scheme: 'bearer',
        }
    },
},

  },
  apis: ['./src/route/*.ts', './src/controller/*.ts', './src/api-docs/docs/*.yml'],
};

export const swaggerSpec = swaggerJSDoc(swaggerOptions);