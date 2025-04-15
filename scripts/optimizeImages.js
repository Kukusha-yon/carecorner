import fs from 'fs';
import path from 'path';
import sharp from 'sharp';
import { products } from '../server/data/products.js';

const PUBLIC_DIR = path.join(process.cwd(), 'client/public');
const IMAGE_DIR = path.join(PUBLIC_DIR, 'images/products');

// Ensure directories exist
if (!fs.existsSync(IMAGE_DIR)) {
  fs.mkdirSync(IMAGE_DIR, { recursive: true });
}

// Image sizes for optimization
const sizes = [
  { width: 320, suffix: 'sm' },
  { width: 640, suffix: 'md' },
  { width: 768, suffix: 'lg' },
  { width: 1024, suffix: 'xl' },
  { width: 1280, suffix: '2xl' },
];

// Function to optimize a single image
const optimizeImage = async (inputPath, outputPath, width) => {
  try {
    await sharp(inputPath)
      .resize(width, null, {
        fit: 'contain',
        background: { r: 255, g: 255, b: 255, alpha: 0 }
      })
      .webp({ quality: 80 })
      .toFile(outputPath);
    
    console.log(`Optimized: ${outputPath}`);
  } catch (error) {
    console.error(`Error optimizing ${inputPath}:`, error);
  }
};

// Process all product images
const processImages = async () => {
  const processedImages = new Set();

  for (const product of products) {
    for (const imagePath of product.images) {
      if (processedImages.has(imagePath)) continue;
      processedImages.add(imagePath);

      const filename = path.basename(imagePath, path.extname(imagePath));
      
      for (const size of sizes) {
        const outputPath = path.join(
          IMAGE_DIR,
          `${filename}-${size.suffix}.webp`
        );

        // For development, we'll create placeholder images
        // In production, you would download the actual images first
        const placeholderImage = await sharp({
          create: {
            width: size.width,
            height: Math.round(size.width * 0.75),
            channels: 4,
            background: { r: 200, g: 200, b: 200, alpha: 1 }
          }
        })
          .jpeg()
          .toBuffer();

        await optimizeImage(placeholderImage, outputPath, size.width);
      }
    }
  }
};

processImages().then(() => {
  console.log('Image optimization complete');
}); 