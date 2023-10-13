const router = require('express').Router();
const { hash, compare} = require('bcrypt');
const poolReadyPromise = require('../db'); // Import the promise
const jwtGenerator = require('../utils/jwtGenerator');
const validInfo = require('../middleware/validInfo');


//route for REGISTER
router.post('/register', validInfo, async (req, res) => {
    try {

        //1. destructure data from req.body() (username, email_address, login_pwd, phone_number)
        const { username, email_address, login_pwd, phone_number} = req.body;

        await poolReadyPromise; // Wait for the pool to be ready

        const pool = require('../db'); // Import the pool after it's ready

        //2. check if user exists (if user exist throw error)
        const user = await pool.query(
            'SELECT * FROM "EON".eon_user WHERE email_address =$1',
            [email_address]
        );
        if (user.rows.length > 0) {
            return res.status(401).json('User Already Exits !');
        }

        //3. else bcrypt the password
        const hashedPassword = await hash(login_pwd, 10);
        
        //4. enter the new user inside our database
        const newUser = await pool.query(
            'INSERT INTO "EON".eon_user (username, email_address, login_pwd, phone_numeric, created_by_user, updated_by_user) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
            [username, email_address, hashedPassword, phone_number, null, null]
        );

        //5. Retrieve the user_id of the new user
        const user_id = newUser.rows[0].user_id;

        //6. Update the created_by_user and updated_by_user fields to the user_id
        await pool.query('UPDATE "EON".eon_user SET created_by_user = $1, updated_by_user = $1 WHERE user_id = $2', [user_id, user_id]);

        //7. generate our jwt Token
        const token = await jwtGenerator(user_id);
        const user_role = 'watcher';

        // 8. Send the authentication token in the response
        res.json({ token, user_role });
    } catch (err) {
        console.error(err.message);
        res.status(500).json('Server Error');
    }
}); 

router.post('/register/new', async (req, res) => {
    try {

        //1. destructure data from req.body() (username, email_address, login_pwd, phone_number)
        const { username, email_address, login_pwd, phone_number} = req.body;

        console.log(req.body);

        await poolReadyPromise; // Wait for the pool to be ready

        const pool = require('../db'); // Import the pool after it's ready

        //2. check if user exists (if user exist throw error)
        const user = await pool.query(
            'SELECT * FROM "EON".eon_user WHERE email_address =$1',
            [email_address]
        );
        if (user.rows.length > 0) {
            return res.status(401).json('User Already Exits !');
        }

        //3. else bcrypt the password
        const hashedPassword = await hash(login_pwd, 10);
        
        //4. enter the new user inside our database
        const newUser = await pool.query(
            'INSERT INTO "EON".eon_user (username, email_address, login_pwd, phone_numeric, created_by_user, updated_by_user) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
            [username, email_address, hashedPassword, phone_number, null, null]
        );

        //5. Retrieve the user_id of the new user
        const user_id = newUser.rows[0].user_id;

        //6. Update the created_by_user and updated_by_user fields to the user_id
        await pool.query('UPDATE "EON".eon_user SET created_by_user = $1, updated_by_user = $1 WHERE user_id = $2', [user_id, user_id]);

        // 8. Send the authentication token in the response
        res.json('new user added uscessfully');
    } catch (err) {
        console.error(err.message);
        res.status(500).json('Server Error');
    }
}); 


//route for Login
router.post('/login', validInfo, async(req,res)=>{
    try {
        //1. destructure data from req.body (email,password)
        const { email_address, login_pwd } = req.body;

        await poolReadyPromise; // Wait for the pool to be ready

        const pool = require('../db'); // Import the pool after it's ready


        //2. check if the user exist or not (if not then throw error)
        const user = await pool.query('SELECT * FROM "EON".eon_user WHERE email_address = $1',[email_address]);

        if(user.rows.length !== 1){
            return res.status(401).json('Invalid Email ID !');
        }

        //3. check the incoming password is equal to the database password
        const validPassword = await compare(login_pwd,user.rows[0].login_pwd);
        if(!validPassword){
            return res.status(401).json('Invalid Password !');
        }

        //4. give the jwt token to the user
        const token = await jwtGenerator(user.rows[0].user_id);
        // const user_role = user.rows[0].user_role;
        const user_name = user.rows[0].username;
        const user_email = user.rows[0].email_address;
        res.json({token, user_name, user_email});
    } catch (err) {
        console.error(err.message);
        res.status(500).json('Server Error');
    }
})

module.exports = router;