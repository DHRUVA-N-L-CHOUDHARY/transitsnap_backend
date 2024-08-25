const express = require('express');
const { PrismaClient } = require('@prisma/client');
const router = express.Router();
const prisma = new PrismaClient();

/**
 * @swagger
 * /images:
 *   get:
 *     summary: Get all images
 *     responses:
 *       200:
 *         description: Success
 */
router.get('/images', async (req, res) => {
  const images = await prisma.image.findMany();
  res.json(images);
});

/**
 * @swagger
 * /images:
 *   post:
 *     summary: Upload an image
 *     responses:
 *       201:
 *         description: Created
 */
router.post('/images', async (req, res) => {
  const { url, title } = req.body;
  const newImage = await prisma.image.create({
    data: {
      url,
      title,
    },
  });
  res.status(201).json(newImage);
});

module.exports = router;
