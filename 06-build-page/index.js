const fs = require('fs');
const path = require('path');

const projectDist = 'project-dist';
const bundle = 'style.css';
const bundlePath = path.join(__dirname, projectDist, bundle);

function main() {
  fs.promises.mkdir(path.join(__dirname, projectDist), {recursive: true})
    .then(() => {
      console.log(`${projectDist} directory is created`);

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
                    console.log(`${dirs[i].name} directory is created`);
      
                    // read all files of curr dir
                    fs.promises.readdir(path.join(__dirname, 'assets', dirs[i].name), { withFileTypes: true })
                      .then((files) => {
      
                        for (let j = 0; j < files.length; j++) {
                          fs.promises.copyFile(path.join(__dirname, 'assets', dirs[i].name, files[j].name), path.join(__dirname, projectDist, 'assets', dirs[i].name, files[j].name))
                            .then(() => {
                              console.log(`${files[j].name} is copied succesfully`);
                            })
                        }
      
                      })
                  });
                
                
              }
            })
      
        })
      
      // replace templates with components
      fs.promises.readFile(path.join(__dirname, 'template.html'), 'utf8')
        .then((data) => {
          
          let mustaches = data.match(/{{.+}}/g);
          
          let template = data;

          replaceTemplates(mustaches, template);
      
        })

    });
}

fs.promises.access(path.join(__dirname, projectDist))
  .then(() => {
    console.log(`${projectDist} folder exists, deleting...`);
    fs.promises.rm(path.join(__dirname, projectDist), {recursive: true})
      .then(() => {
        console.log(`${projectDist} is succesfully deleted`);

        main();
      })
  })
  .catch(() => {
    main();
  })

async function replaceTemplates(mustaches, template) {
  for (let i = 0; i < mustaches.length; i++) {
    let fileName = mustaches[i].replace(/{{/, '').replace(/}}/, '');

    let component = await fs.promises.readFile(path.join(__dirname, 'components', fileName + '.html'), 'utf8');

    let regex = new RegExp(mustaches[i]);
    template = template.replace(regex, component);

    if (i === mustaches.length - 1) {
      fs.promises.writeFile(path.join(__dirname, projectDist, 'index.html'), template);
    }

  }
}
