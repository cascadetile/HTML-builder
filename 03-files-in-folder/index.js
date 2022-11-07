const fs = require('fs');
const path = require('path');

const wantedPath = path.join(__dirname, 'secret-folder');

async function main() {

  fs.promises.readdir(wantedPath, { withFileTypes: true })
    .then(files => {
      console.log("\nCurr dir filenames:");

      let filteredFiles = files.filter(file => !file.isDirectory());

      for (let i = 0; i < filteredFiles.length; i++) {
        let ext = path.extname(path.join(wantedPath, filteredFiles[i].name));
        fs.promises.stat(path.join(wantedPath, filteredFiles[i].name))
          .then(stats => {
            let KB = (stats.size / 1024).toFixed(2);
            console.log(`name: ${path.parse(filteredFiles[i].name).name} - extension: ${ext} - size: ${KB}KB`);
          })
        
      }
    })

}

main();
