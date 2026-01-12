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

const timestamp = createTimestamp();

const args = process.argv.slice(2);

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