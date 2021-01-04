const express = require('express');

const app = express();

app.use(() => {
  console.log('Hello server....');
  console.log('Hello lagi jow');
})

app.listen(4000);