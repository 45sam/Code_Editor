const express = require('express');
const bodyParser = require('body-parser');
const { exec } = require('child_process');
const fs = require('fs');
const app = express();
const port = 5000;

app.use(bodyParser.json());

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', 'http://localhost:3000');
  res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  next();
});

app.post('/compile', (req, res) => {
  const { code, language } = req.body;
  const tempFile = `temp.${language === 'javascript' ? 'js' : language === 'python' ? 'py' : 'c'}`;

  fs.writeFileSync(tempFile, code);

  let command;
  if (language === 'javascript') {
    command = `node ${tempFile}`;
  } else if (language === 'python') {
    command = `python ${tempFile}`;
  } else if (language === 'c') {
    command = `gcc ${tempFile} -o temp && ./temp`;
  }

  exec(command, (error, stdout, stderr) => {
    if (error) {
      res.send({ output: stderr });
    } else {
      res.send({ output: stdout });
    }
  });
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
