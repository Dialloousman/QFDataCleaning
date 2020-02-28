const express = require('express');
const path = require('path');

const app = express();
const PORT = 3434;

// Invoke server listen
app.listen(PORT, () => console.log(`This app is listening on port ${PORT}`));
