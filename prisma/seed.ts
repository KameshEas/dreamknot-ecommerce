import "dotenv/config"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

async function main() {
  const mugCategory = await prisma.category.upsert({
    where: { name: "Mugs" },
    update: {},
    create: { name: "Mugs" },
  })



  const mug1 = await prisma.product.upsert({
    where: { id: 1 },
    update: {},
    create: {
      title: "Personalized Coffee Mug",
      description: "A beautiful ceramic mug perfect for your morning coffee.",
      base_price: 15.99,
      category_id: mugCategory.id,
      images: [
        "https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=400",
      ],
    },
  })

  await prisma.productCustomization.upsert({
    where: { id: 1 },
    update: {},
    create: {
      product_id: mug1.id,
      customization_type: "text",
      metadata: JSON.stringify({
        maxLength: 50,
        fontOptions: ["Arial", "Times New Roman", "Great Vibes"],
        colorOptions: ["#000000", "#FF0000", "#0000FF"],
      }),
    },
  })

  console.log("Seed data created successfully")
}

main()
  .then(async () => prisma.$disconnect())
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
