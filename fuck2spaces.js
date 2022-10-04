#! /usr/bin/env node

const fs  = require("fs");
const path = require("path");

const stringEndNoSemicolon = [
    ";", '{', '}'
];
const extensionsSemicolon = [
    '.ts', '.js'
];
const ignoreSemicolon = [
    '`', '"', "'"
];

const targetDirPath = path.join(__dirname, process.argv[2]);
step(targetDirPath);
console.log("Done!");

function step (p) {
    const targetDir = fs.readdirSync(p);

    targetDir.forEach(item => {
        const itemPath = path.join(p, item);
        const itemStat = fs.lstatSync(itemPath);

        if (itemStat.isDirectory()) {
            step(itemPath);
        } else if (!itemPath.endsWith('fuck2spaces.js')) {
            editFile(itemPath);
        }
    });
}

function editFile (p) {
    console.log("modyfing", p);
    const targetFile = fs.readFileSync(p).toString();
    const shouldAddSemicolons = extensionsSemicolon.filter(f => p.endsWith(f)).length;
    let shouldIgnoreSemicolon = false;

    const lines = targetFile.split('\n');
    lines.forEach((line, lineIdx) => {
        let startSpaceStr = '';
        let endStr = '';
        let i = 0;
        while (line[i] !== undefined && line[i] == ' ') {
            startSpaceStr += ' ';
            i++;
        }

        let ignoresCount = line.split('').filter(f => ignoreSemicolon.includes(f)).length;
        if (ignoresCount % 2) shouldIgnoreSemicolon = !shouldIgnoreSemicolon;

        if (shouldAddSemicolons && !shouldIgnoreSemicolon) {
            let lineTrim = line.trim();
            if (lineTrim && !stringEndNoSemicolon.filter(f => lineTrim.endsWith(f)).length) {
                endStr = ';';
            }
        }

        lines[lineIdx] = startSpaceStr + line + endStr;
    });

    fs.writeFileSync(p, lines.join('\n'));
}