const fs = require('fs');
const path = require('path');

const projectDist = 'project-dist';
const bundle = 'style.css';
const bundlePath = path.join(__dirname, projectDist, bundle);

fs.promises.mkdir(path.join(__dirname, projectDist), {recursive: true})
  .then(() => {
    console.log('dir is created');
  });

fs.promises.writeFile(bundlePath, '')
  .then(() => {
    console.log(`creating ${bundle}`);
  })

let writeStream = fs.createWriteStream(bundlePath);

let cssFiles;

// bundle styles
fs.promises.readdir(path.join(__dirname, 'styles'), { withFileTypes: true })
  .then(files => {

    cssFiles = files.filter((file) => path.parse(file.name).ext === '.css');
    for (let i = 0; i < cssFiles.length; i++) {
      let readStream = fs.createReadStream(path.join(__dirname, 'styles', cssFiles[i].name));

      readStream.pipe(writeStream);
    }

  })

fs.promises.mkdir(path.join(__dirname, projectDist, 'assets'), {recursive: true})
  .then(() => {

    fs.promises.readdir(path.join(__dirname, 'assets'), { withFileTypes: true })
      .then(dirs => {

        // inside each directory
        for (let i = 0; i < dirs.length; i++) {

          // create a clone of assets dirs
          fs.promises.mkdir(path.join(__dirname, projectDist, 'assets', dirs[i].name), {recursive: true})
            .then(() => {
              console.log('dir is created');

              // read all files of curr dir
              fs.promises.readdir(path.join(__dirname, 'assets', dirs[i].name), { withFileTypes: true })
                .then((files) => {

                  for (let j = 0; j < files.length; j++) {
                    fs.promises.copyFile(path.join(__dirname, 'assets', dirs[i].name, files[j].name), path.join(__dirname, projectDist, 'assets', dirs[i].name, files[j].name))
                      .then(() => {
                        console.log('file is copied succesfully');
                      })
                  }

                })
            });
          
          
        }
      })

  })

fs.promises.readFile(path.join(__dirname, 'template.html'), 'utf8')
  .then((data) => {
    
    let mustaches = data.match(/{{.+}}/g);
    
    let template = data;

    for (let i = 0; i < mustaches.length; i++) {
      let fileName = mustaches[i].replace(/{{/, '').replace(/}}/, '');

      fs.promises.readFile(path.join(__dirname, 'components', fileName + '.html'), 'utf8')
        .then((component) => {
          let regex = new RegExp(mustaches[i]);
          template = template.replace(regex, component);

          if (i === mustaches.length - 1) {
            fs.promises.writeFile(path.join(__dirname, projectDist, 'index.html'), template);
          }
        })

    }


  })
