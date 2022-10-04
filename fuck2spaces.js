#! /usr/bin/env node

const fs    = require("fs");
const path  = require("path");
const chalk = require("chalk");
const readl = require('readline-sync');

const stringEndNoSemicolon = [
    ";", '{', '}'
];
const extensionsSemicolon = [
    '.ts', '.js'
];
const ignoreSemicolon = [
    '`', '"', "'"
];
const ignoreFolders = [
    "node_modules", ".git"
];
const targetDirPath = process.argv[2];

if (!targetDirPath) {
    console.log(chalk.red("❌  Error! You have to include the path to the directory as an argument."));
    outro();
    process.exit();
}


// fancy intro + warning

console.clear();
intro();
console.log(chalk.yellow("⚠️  Warning! Only run this tool on a newly initialized Vite project. If you do it twice, you're gonna get ugly 8-space tabs."));
while (true) {
    const yn = readl.question("Do you wish to procceed? (y/n) > ").toLowerCase();
    if (yn == 'y') {
        break;
    } else if (yn == 'n') {
        console.log(chalk.red("👋  Bye!"));
        outro();
        process.exit();
    }
}


// the main part + outro

step(targetDirPath);
console.log(chalk.green("✅  Done!"));
outro();


// core functions

function step (p) {
    if (ignoreFolders.filter(f => p.endsWith(f)).length || (p.includes(".") && p != '.')) return;
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

function outro () {
    console.log(chalk.blueBright("\n\nMade by Ucrash! ") + chalk.blueBright.bold.underline("https://github.com/gducrash"));
}

function intro () {
    console.log(chalk.blueBright.bold("\n\n[fuck2spaces v 1.1.0]\n\n"));
}