const express = require('express');
const cors = require('cors');
const poolReadyPromise = require('./db'); // Import the promise
const router = require('./routes/jwtAuth');
const fetching = require('./routes/fetchData')

const app = express();

// MIDDLEWARE
app.use(cors());
app.use(express.json());

//  ROUTERS (register and login)
app.use('/auth', router);

app.use('/fetch', fetching);

const PORT = process.env.PORT || 5005;

app.listen(PORT, () => {
    console.log(`Server is up and running on http://localhost:${PORT}`);
});
