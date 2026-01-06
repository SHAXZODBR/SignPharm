const Database = require('better-sqlite3');
const path = require('path');
const fs = require('fs');

function check() {
    const dbPath = path.join(process.cwd(), 'prisma', 'dev.db');
    const publicPath = path.join(process.cwd(), 'public', 'debug.txt');
    let result = 'Checking DB at: ' + dbPath + '\n';

    if (!fs.existsSync(dbPath)) {
        result += 'DB file does not exist!\n';
    } else {
        try {
            const db = new Database(dbPath);
            const tables = db.prepare("SELECT name FROM sqlite_master WHERE type='table'").all();
            result += 'Tables: ' + tables.map(t => t.name).join(', ') + '\n';

            if (tables.some(t => t.name === 'Inventory')) {
                const columns = db.prepare("PRAGMA table_info(Inventory)").all();
                result += 'Inventory columns: ' + columns.map(c => c.name).join(', ') + '\n';
            }
            db.close();
        } catch (err) {
            result += 'SQLite Error: ' + err.message + '\n';
        }
    }

    fs.writeFileSync(publicPath, result);
}

check();
