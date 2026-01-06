const { PrismaClient } = require('@prisma/client');

async function test() {
    const prisma = new PrismaClient();
    try {
        const newDrug = await prisma.drug.create({
            data: {
                name: 'Test Drug',
                nameRu: 'Тестовый препарат',
                prescription: false,
            }
        });
        console.log('Created drug:', JSON.stringify(newDrug));
        const count = await prisma.drug.count();
        console.log('Total drugs now:', count);
    } catch (err) {
        console.error('Error:', err);
    } finally {
        await prisma.$disconnect();
    }
}

test();
