const cp = require('child_process');
const fs = require('fs');
const path = require('path');

const env = { ...process.env };
// Specifically remove the trash env var
delete env.DATABASE_URL;

console.log('--- STARTING ISOLATED PUSH ---');
try {
    // Use absolute path for safety
    const dbPath = path.join(__dirname, 'dev.db');
    console.log('Targeting DB at:', dbPath);

    // Force delete the old db to be sure
    if (fs.existsSync(dbPath)) fs.unlinkSync(dbPath);

    // Run push
    cp.execSync('npx prisma db push --accept-data-loss', {
        env: { ...env, DATABASE_URL: `file:${dbPath}` },
        stdio: 'inherit'
    });

    console.log('--- PUSH COMPLETED ---');

    // Run seed
    cp.execSync('npx tsx prisma/seed.ts', {
        env: { ...env, DATABASE_URL: `file:${dbPath}` },
        stdio: 'inherit'
    });

    console.log('--- SEED COMPLETED ---');
} catch (e) {
    console.error('ERROR DURING ISOLATED PUSH:', e.message);
    if (e.stdout) console.log('STDOUT:', e.stdout.toString());
    if (e.stderr) console.log('STDERR:', e.stderr.toString());
}
