const fs = require("fs");

const today = new Date().toLocaleDateString("en-GB");

const [,,action, subject, minutes] = process.argv;

if(!action || !subject || !minutes){
    console.log("Usage: idlelog.js <action> <subject> <minutes>");
    process.exit(1);
}

const data = `${today} | ${action} | ${subject} | ${minutes}\n`;

fs.appendFileSync("idle.log", data);