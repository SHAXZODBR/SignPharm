const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const path = require('path');

async function check() {
    const prisma = new PrismaClient();
    const reportPath = path.join(process.cwd(), 'db_report.txt');

    try {
        const drugs = await prisma.drug.count();
        const inventory = await prisma.inventory.count();
        const report = `Time: ${new Date().toISOString()}\nDrugs: ${drugs}\nInventory: ${inventory}\n`;
        fs.appendFileSync(reportPath, report);
    } catch (err) {
        fs.appendFileSync(reportPath, `Error: ${err.message}\n`);
    } finally {
        await prisma.$disconnect();
    }
}

check();
