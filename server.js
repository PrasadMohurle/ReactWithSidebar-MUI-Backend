const express = require('express');
const cors = require('cors');
const poolReadyPromise = require('./db'); // Import the promise
const router = require('./routes/jwtAuth');
const procedure = require('./routes/runProcedure');
const fetching = require('./routes/fetchData');

const app = express();

// MIDDLEWARE
app.use(cors());
app.use(express.json());

//  ROUTERS (register and login)
app.use('/auth', router);

// ROUTES (to run procedure)
app.use('/procedure', procedure);

app.use('/fetch', fetching);

app.get('/schedule-main-pipeline-procedure', async (req, res) => {
    try {
        await poolReadyPromise; // Wait for the pool to be ready
        const pool = require('./db'); // Import the pool after it's ready
        const result = await pool.query(
            'SELECT "EON".eon_schedule_main_pipeline_rpt(1011)'
        );

        res.json(result.rows[0].eon_schedule_main_pipeline_rpt);
    } catch (error) {
        console.error('Error executing query:', error);
        res.status(500).json({ error: 'Internal Server Error', error });
    }
});

app.get('/terminal-volume-procedure', async (req, res) => {
    try {
        await poolReadyPromise; // Wait for the pool to be ready
        const pool = require('./db'); // Import the pool after it's ready
        const result = await pool.query(
            'SELECT "EON".eon_get_terminal_volume(1011)'
        );

        res.json(result.rows[0].eon_get_terminal_volume);
    } catch (error) {
        console.error('Error executing query:', error);
        res.status(500).json({ error: 'Internal Server Error', error });
    }
});

app.get('/terminal-volume-depot-procedure', async (req, res) => {
    try {
        await poolReadyPromise; // Wait for the pool to be ready
        const pool = require('./db'); // Import the pool after it's ready
        const result = await pool.query(
            'SELECT "EON".eon_get_terminal_volume_depot(1011)'
        );

        res.json(result.rows[0].eon_get_terminal_volume_depot);
    } catch (error) {
        console.error('Error executing query:', error);
        res.status(500).json({ error: 'Internal Server Error', error });
    }
});

app.get('/data-fetch', async (req, res) => {
    try {
        await poolReadyPromise; // Wait for the pool to be ready
        const pool = require('./db'); // Import the pool after it's ready
        const selectValue = req.query.selectValue; // Getting the selected option from the query string
        console.log('select value', selectValue);

        let result;

        if (selectValue === 'Dropping') {
            result = await pool.query('SELECT "EON".eon_dropping_rpt(1011)');
        } else if (selectValue === 'Stock') {
            result = await pool.query('SELECT "EON".eon_stock_rpt(1011)');
        } else if (selectValue === 'Demand') {
            result = await pool.query('SELECT "EON".eon_demand_rpt(1011)');
        } else {
            // Handling other options or invalid selections
            return res.status(400).json({ error: 'Invalid selection' });
        }

        res.json(result.rows[0][`eon_${selectValue.toLowerCase()}_rpt`]);
    } catch (error) {
        console.error('Error executing query:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.get('/branch-pipeline-procedure', async (req, res) => {
    try {
        await poolReadyPromise; // Wait for the pool to be ready
        const pool = require('./db'); // Import the pool after it's ready
        const result = await pool.query(
            'SELECT "EON".eon_branch_pipeline_table_rpt(1011,2)'
        );

        res.json(result.rows[0].eon_branch_pipeline_table_rpt);
    } catch (error) {
        console.error('Error executing query:', error);
        res.status(500).json({ error: 'Internal Server Error', error });
    }
});

app.get('/branch-daily-drop-awa-procedure', async (req, res) => {
    try {
        await poolReadyPromise; // Wait for the pool to be ready
        const pool = require('./db'); // Import the pool after it's ready
        const result = await pool.query(
            'SELECT "EON".eon_branch_daily_drop_rpt(1011,1)'
        );

        res.json(result.rows[0].eon_branch_daily_drop_rpt);
    } catch (error) {
        console.error('Error executing query:', error);
        res.status(500).json({ error: 'Internal Server Error', error });
    }
});

app.get('/branch-daily-drop-vad-procedure', async (req, res) => {
    try {
        await poolReadyPromise; // Wait for the pool to be ready
        const pool = require('./db'); // Import the pool after it's ready
        const result = await pool.query(
            'SELECT "EON".eon_branch_daily_drop_rpt(1011,2)'
        );

        res.json(result.rows[0].eon_branch_daily_drop_rpt);
    } catch (error) {
        console.error('Error executing query:', error);
        res.status(500).json({ error: 'Internal Server Error', error });
    }
});

const PORT = process.env.PORT || 5005;

app.listen(PORT, () => {
    console.log(`Server is up and running on http://localhost:${PORT}`);
});
