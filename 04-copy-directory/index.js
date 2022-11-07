const fs = require('fs');
const path = require('path');
const dir = 'files-copy';

function copyDir() {

  fs.promises.mkdir(path.join(__dirname, dir), {recursive: true})
    .then(() => {
      console.log('dir is created');
    });

  fs.promises.readdir(path.join(__dirname, 'files'), { withFileTypes: true })
    .then(files => {

      for (let i = 0; i < files.length; i++) {
        
        fs.promises.copyFile(path.join(__dirname, 'files', files[i].name), path.join(__dirname, dir, files[i].name))
          .then(() => {
            console.log('file is copied succesfully');
          })
        
      }
    })
}

copyDir();
