import "dotenv/config"
import { PrismaClient } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
import { Pool } from 'pg'

const connectionString = process.env.DATABASE_URL!

const pool = new Pool({ connectionString })
const adapter = new PrismaPg(pool)
const prisma = new PrismaClient({ adapter })

async function main() {
  // Create categories
  const mugCategory = await prisma.category.upsert({
    where: { name: 'Mugs' },
    update: {},
    create: { name: 'Mugs' }
  })

  const tshirtCategory = await prisma.category.upsert({
    where: { name: 'T-Shirts' },
    update: {},
    create: { name: 'T-Shirts' }
  })

  const pillowCategory = await prisma.category.upsert({
    where: { name: 'Pillows' },
    update: {},
    create: { name: 'Pillows' }
  })

  // Create products
  const mug1 = await prisma.product.upsert({
    where: { id: 1 },
    update: {},
    create: {
      title: 'Personalized Coffee Mug',
      description: 'A beautiful ceramic mug perfect for your morning coffee. Customize with text and images.',
      base_price: 15.99,
      category_id: mugCategory.id,
      images: ['https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=400']
    }
  })

  const tshirt1 = await prisma.product.upsert({
    where: { id: 2 },
    update: {},
    create: {
      title: 'Custom T-Shirt',
      description: 'Comfortable cotton t-shirt with your personal design. Available in multiple colors.',
      base_price: 24.99,
      category_id: tshirtCategory.id,
      images: ['https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400']
    }
  })

  const pillow1 = await prisma.product.upsert({
    where: { id: 3 },
    update: {},
    create: {
      title: 'Memory Pillow',
      description: 'Soft throw pillow with custom embroidery. Perfect for gifts.',
      base_price: 29.99,
      category_id: pillowCategory.id,
      images: ['https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400']
    }
  })

  // Create customizations
  await prisma.productCustomization.upsert({
    where: { id: 1 },
    update: {},
    create: {
      product_id: mug1.id,
      customization_type: 'text',
      metadata: JSON.stringify({
        maxLength: 50,
        fontOptions: ['Arial', 'Times New Roman', 'Great Vibes'],
        colorOptions: ['#000000', '#FF0000', '#0000FF']
      })
    }
  })

  await prisma.productCustomization.upsert({
    where: { id: 2 },
    update: {},
    create: {
      product_id: mug1.id,
      customization_type: 'image',
      metadata: JSON.stringify({
        maxSize: '2MB',
        supportedFormats: ['jpg', 'png', 'svg']
      })
    }
  })

  await prisma.productCustomization.upsert({
    where: { id: 3 },
    update: {},
    create: {
      product_id: tshirt1.id,
      customization_type: 'text',
      metadata: JSON.stringify({
        maxLength: 30,
        fontOptions: ['Arial', 'Helvetica', 'Impact'],
        colorOptions: ['#000000', '#FFFFFF', '#FF0000']
      })
    }
  })

  console.log('Seed data created successfully')
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
