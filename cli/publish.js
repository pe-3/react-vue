const { exec } = require('child_process');
const fs = require('fs');

const packageJson = require('../src/Vue/package.json');

packageJson.version = packageJson.version.replace(/\d+$/, (v) => parseInt(v) + 1);;

fs.writeFileSync('./src/Vue/package.json', JSON.stringify(packageJson, null, 2));

setTimeout(() => {
  exec('npm publish ./src/Vue/', (err, stdout, stderr) => {
    if (err) {
      console.error(err);
    }
    console.log(stdout);
    console.log(stderr);
  });
}, 500);