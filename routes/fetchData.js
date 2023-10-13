const fetching = require('express').Router();
const poolReadyPromise = require('../db');

//route for REGISTER
fetching.get('/getUserData', async (req, res) => {
    try {
        await poolReadyPromise; // Wait for the pool to be ready

        const pool = require('../db'); // Import the pool after it's ready

        const allUser = await pool.query('SELECT * FROM "EON".eon_user');

        if (allUser.rows.length === 0) {
            return res.status(401).json('No User Exits !');
        }

        res.json(allUser);
    } catch (err) {
        console.error(err.message);
        res.status(500).json('Server Error');
    }
});

module.exports = fetching;
