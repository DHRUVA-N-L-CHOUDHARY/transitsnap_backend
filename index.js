const express = require('express');
const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const { PrismaClient } = require('@prisma/client');
const imageRoutes = require('./routes/imageRoutes');

const app = express();
const prisma = new PrismaClient();
app.use(express.json());

app.use('/api', imageRoutes);


const swaggerOptions = {
  swaggerDefinition: {
    openapi: '3.0.0',
    info: {
      title: 'Image Store API',
      version: '1.0.0',
      description: 'API documentation for the Image Store backend',
    },
    servers: [
      {
        url: 'http://localhost:3000',
      },
    ],
  },
  apis: ['./routes/*.js'],
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

app.listen(3000, () => console.log('Server running on http://localhost:3000'));
