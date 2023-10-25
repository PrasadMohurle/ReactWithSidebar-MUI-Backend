const procedure = require('express').Router();
const poolReadyPromise = require('../db'); // Import the promise

//routes for running procedures

procedure.get('/mdplPumping', async (req, res) => {
    try {
        await poolReadyPromise; // Wait for the pool to be ready
        const pool = require('../db'); // Import the pool after it's ready
        const result = await pool.query('SELECT "EON".eon_mundra_pumping_schedule(1011)');
        if (result.rows.length === 0) {
            return res.status(401).json('No such Procedure !');
        }
        res.json(result.rows[0].eon_mundra_pumping_schedule);
    } catch (err) {
        console.error(err.message);
        res.status(500).json('Server Error');
    }
});

procedure.get('/mdplSchedule', async (req, res) => {
    try {
        await poolReadyPromise; // Wait for the pool to be ready
        const pool = require('../db'); // Import the pool after it's ready
        const result = await pool.query('SELECT "EON".eon_mdpl_schedule_excel(1011)');
        if (result.rows.length === 0) {
            return res.status(401).json('No such Procedure !');
        }
        res.json(result.rows[0].eon_mdpl_schedule_excel);
    } catch (err) {
        console.error(err.message);
        res.status(500).json('Server Error');
    }
});

procedure.get('/dropping', async (req, res) => {
    try {
        await poolReadyPromise; // Wait for the pool to be ready
        const pool = require('../db'); // Import the pool after it's ready
        const result = await pool.query('SELECT "EON".eon_dropping_rpt(1011)');
        if (result.rows.length === 0) {
            return res.status(401).json('No such Procedure !');
        }
        res.json(result.rows[0].eon_dropping_rpt);
    } catch (err) {
        console.error(err.message);
        res.status(500).json('Server Error');
    }
});

procedure.get('/demand', async (req, res) => {
    try {
        await poolReadyPromise; // Wait for the pool to be ready
        const pool = require('../db'); // Import the pool after it's ready
        const result = await pool.query('SELECT "EON".eon_demand_rpt(1011)');
        if (result.rows.length === 0) {
            return res.status(401).json('No such Procedure !');
        }
        res.json(result.rows[0].eon_demand_rpt);
    } catch (err) {
        console.error(err.message);
        res.status(500).json('Server Error');
    }
});

procedure.get('/stock', async (req, res) => {
    try {
        await poolReadyPromise; // Wait for the pool to be ready
        const pool = require('../db'); // Import the pool after it's ready
        const result = await pool.query('SELECT "EON".eon_stock_rpt(1011)');
        if (result.rows.length === 0) {
            return res.status(401).json('No such Procedure !');
        }
        res.json(result.rows[0].eon_stock_rpt);
    } catch (err) {
        console.error(err.message);
        res.status(500).json('Server Error');
    }
});

procedure.get('/tankage', async (req, res) => {
    try {
        await poolReadyPromise; // Wait for the pool to be ready
        const pool = require('../db'); // Import the pool after it's ready
        const result = await pool.query('SELECT "EON".eon_tankage_rpt(1011)');
        if (result.rows.length === 0) {
            return res.status(401).json('No such Procedure !');
        }
        res.json(result.rows[0].eon_tankage_rpt);
    } catch (err) {
        console.error(err.message);
        res.status(500).json('Server Error');
    }
});


module.exports = procedure;
