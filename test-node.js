const fs = require('fs');
const path = require('path');
const logFile = path.join(__dirname, 'test_node.log');
fs.writeFileSync(logFile, 'Node is working at ' + new Date().toISOString() + '\n');
console.log('Log written to ' + logFile);
