
const { Client } = require('ssh2');
const Pool = require('pg').Pool;

// Creating an SSH tunnel
const sshTunnel = new Client();

// Promise to track when the pool is ready
const poolReadyPromise = new Promise((resolve, reject) => {
    sshTunnel.on('ready', () => {
        console.log('SSH tunnel connected');

        // Now that the SSH tunnel is established, you can create a connection pool and connect to the PostgreSQL database.

        // Creating a PostgreSQL connection pool
        const pool = new Pool({
            user: 'postgres',
            password: 'Baz247Db*',
            host: 'localhost',
            database: 'EON',
            port: 5433, // Use the local port you forwarded through the SSH tunnel (e.g., 5433)
        });

        // Export the pool here, inside the 'ready' callback
        module.exports = pool;

        resolve(); // Resolve the promise to indicate that the pool is ready
    });

    sshTunnel.connect({
        host: '172.105.42.253',
        port: 22,
        username: 'b247a',
        password: 'Bazaar247*',
    });
});

// Export the promise for use in other modules
module.exports = poolReadyPromise;


