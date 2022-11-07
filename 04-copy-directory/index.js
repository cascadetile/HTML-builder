const fs = require('fs');
const path = require('path');
const dir = 'files-copy';

function copyDir() {
  // check if copied folder exists
  fs.promises.access(path.join(__dirname, dir))
    .then(() => {
      console.log(`${dir} folder exists, deleting...`)
      // delete it if it exists, to remove files if they were deleted in origin
      fs.promises.rm(path.join(__dirname, dir), {recursive: true})
        .then(() => {
          console.log(`${dir} is succesfully deleted`);

          // create copy folder
          fs.promises.mkdir(path.join(__dirname, dir), {recursive: true})
            .then(() => {
              console.log('dir is created');

              // scan origin
              fs.promises.readdir(path.join(__dirname, 'files'), { withFileTypes: true })
                .then(files => {

                  // copy all files
                  for (let i = 0; i < files.length; i++) {
                    
                    fs.promises.copyFile(path.join(__dirname, 'files', files[i].name), path.join(__dirname, dir, files[i].name))
                      .then(() => {
                        console.log('file is copied succesfully');
                      })
                    
                  }
                })

            })

        })
        
    })

  
}

copyDir();
