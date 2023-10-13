const validInfo = (req, res, next) => {
    const { email_address, username, login_pwd, phone_number } = req.body;

    function validEmail(userEmail) {
        return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(userEmail);
    }

    if (req.path === '/register') {
        if (![email_address, username, login_pwd, phone_number].every(Boolean)) {
            return res.status(401).json('Missing Credentials');
        } else if (!validEmail(email_address)) {
            return res.status(401).json('Invalid Email');
        }
    } else if (req.path === '/login') {
        if (![email_address, login_pwd].every(Boolean)) {
            return res.status(401).json('Missing Credentials');
        } else if (!validEmail(email_address)) {
            return res.status(401).json('Invalid Email');
        }
    }

    next();
};

module.exports = validInfo;