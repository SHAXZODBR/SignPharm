const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient({
    datasourceUrl: 'file:C:/Users/user/Desktop/SignPharm/dev.db'
});

async function main() {
    console.log('--- STARTING PLAIN JS SEED ---');
    try {
        // Check connection first
        await prisma.$connect();
        console.log('Connected to database');

        // Create a drug
        const drug = await prisma.drug.create({
            data: {
                name: 'Paracetamol',
                nameRu: 'Парацетамол',
                atxCode: 'N02BE01',
                prescription: false,
            }
        });
        console.log('Created drug:', drug.name);

        // Create a pharmacy
        const pharmacy = await prisma.pharmacy.create({
            data: {
                name: 'Central Pharmacy',
                region: 'Tashkent',
            }
        });
        console.log('Created pharmacy:', pharmacy.name);

        // Create inventory
        const inv = await prisma.inventory.create({
            data: {
                drugId: drug.id,
                pharmacyId: pharmacy.id,
                quantity: 100,
                purchasePriceUZS: 5000,
                salePriceUZS: 7000,
            }
        });
        console.log('Created inventory for:', drug.name);

        console.log('--- SEED COMPLETED ---');
    } catch (err) {
        console.error('SEED ERROR:', err);
    } finally {
        await prisma.$disconnect();
    }
}

main();
