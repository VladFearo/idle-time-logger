const fs = require("fs");

function createTimestamp(){
    const now = new Date();
    const date = now.toLocaleDateString("en-GB");
    const time = now.toLocaleTimeString("en-GB", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false
    });
    return `${date} ${time}`;
}

function handleTag(argv){
    const idx = argv.indexOf("--tag");
    if(idx === -1) return {tag: undefined, restArgs: argv};

     if (idx + 1 >= argv.length) {
    throw new Error("Missing value after --tag");
    }

    const tag = argv[idx + 1];
    const restArgs = argv.filter((_, i) => i !== idx && i !== idx + 1);

    return {tag, restArgs};
}

function formatLine(timestamp, tag, message){
    const parts = [timestamp];
    if(tag) parts.push(tag);
    parts.push(message);
    return parts.join(" | " )+"\n";
}



function handleSummary(argv){
    const idx = argv.indexOf("--summary");
    if (idx === -1) return;

    const summaryCount = argv.filter(a => a === "--summary").length;
    if(summaryCount > 1) throw new Error("Duplicate --summary");

    const restArgs = argv.filter(a => a!== "--summary");
    
    if (restArgs.length !== 1) throw new Error("Summary requires exactly one filepath");

    const [filePath] = restArgs;
    
    if(filePath.startsWith("--")) throw new Error("Summary mode does not accept flags");

    try {
        const stat = fs.statSync(filePath);
        if (!stat.isFile()) {
        throw new Error("NOT_A_FILE");
        }
        const text = fs.readFileSync(filePath, "utf8");  
        const lines = text
        .split(/\r?\n/)
        .map(l => l.trim())
        .filter(Boolean);
        lines.forEach(l => console.log(l));
    process.exit(0);
    } catch (err) {
        if (err.code === "ENOENT") {
            throw new Error(`File not found: ${filePath}`);
        }
        if (err.code === "EACCES") {
            throw new Error(`Permission denied: ${filePath}`);
        }
        if (err.message === "NOT_A_FILE") {
            throw new Error(`Not a file: ${filePath}`);
        }
        throw new Error(`Cannot read file: ${filePath}`);
    }

    
}

const args = process.argv.slice(2);

handleSummary(args);
const timestamp = createTimestamp();
let tag, restArgs;

try {
  ({ tag, restArgs } = handleTag(args));
} catch (e) {
  console.error("Error:", e.message);
  console.error("Usage: node idlelog.js [--tag tag] <message>");
  process.exit(1);
}
const message = restArgs.join(" ");

if(!message){
    console.log("Usage: node idlelog.js [--tag tag] <message>");
    process.exit(1);
}

const data = formatLine(timestamp, tag, message);

fs.appendFileSync("idle.log", data);