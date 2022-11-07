const fs = require('fs');
const path = require('path');
const {stdin, stdout} = process;

process.on('SIGINT', () => {
  stdout.write('До свидания');
  process.exit();
});

const filePath = path.join(__dirname, 'output.txt');

const output = fs.createWriteStream(filePath);

console.log('Вводите текст');

stdin.on('data', (chunk) => {
  if (chunk.toString().trim() === 'exit') {
    stdout.write('До свидания');
    process.exit();
  }
  output.write(chunk.toString());
});
