const fs = require('fs');
const path = require('path');

const projectDist = 'project-dist';
const bundle = 'bundle.css';
const bundlePath = path.join(__dirname, projectDist, bundle);

fs.promises.writeFile(bundlePath, '')
  .then(() => {
    console.log('creating bundle.css');

    let writeStream = fs.createWriteStream(bundlePath);

    let cssFiles;

    fs.promises.readdir(path.join(__dirname, 'styles'), { withFileTypes: true })
      .then(files => {

        cssFiles = files.filter((file) => path.parse(file.name).ext === '.css');
        for (let i = 0; i < cssFiles.length; i++) {
          console.log(`reading file ${cssFiles[i].name}`);
          let readStream = fs.createReadStream(path.join(__dirname, 'styles', cssFiles[i].name));

          readStream.pipe(writeStream);
        }
        
      })

  })
