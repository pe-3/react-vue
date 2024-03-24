const { exec } = require('child_process');
const fs = require('fs');

const packageJson = require('../src/Vue/package.json');

packageJson.version = packageJson.version.replace(/\d+$/, (v) => parseInt(v) + 1);

// 把根目录的依赖弄进 packageJson
const rootPackageJson = require('../package.json');
packageJson.dependencies = rootPackageJson.dependencies;
packageJson.devDependencies = rootPackageJson.devDependencies;

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