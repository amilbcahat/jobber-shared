const { copyFileSync } = require('fs');

//Copies file to build folder
copyFileSync('package.json', 'build/package.json');
