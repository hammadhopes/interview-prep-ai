const userModel = require("../models/user.model.js");
const tokenBlacklistModel = require("../models/blacklist.model.js");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { validateRegisterInput, validateLoginInput } = require("../validators/auth.validators.js");

const cookieOptions = {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production"
};

const CONFLICT_MESSAGES = {
    username: "This username is already taken.",
    email: "An account with this email already exists."
};

function sendConflict(res, fields) {
    const errors = {};
    fields.forEach(field => {
        errors[field] = CONFLICT_MESSAGES[field];
    });

    return res.status(409).json({
        message: "Please fix the highlighted fields.",
        errors
    });
}

/**
 * @name registerUserController
 * @description Register a new user, expects email, username and password in the request body
 * @access public
 */
async function registerUserController(req, res) {
    const { values, errors } = validateRegisterInput(req.body);

    if (Object.keys(errors).length > 0) {
        return res.status(400).json({
            message: "Please fix the highlighted fields.",
            errors
        });
    }

    const { username, email, password } = values;

    const [ usernameTaken, emailTaken ] = await Promise.all([
        userModel.exists({ username }),
        userModel.exists({ email })
    ]);

    const takenFields = [];
    if (usernameTaken) takenFields.push("username");
    if (emailTaken) takenFields.push("email");

    if (takenFields.length > 0) {
        return sendConflict(res, takenFields);
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    let user;
    try {
        user = await userModel.create({
            username,
            email,
            password: hashedPassword
        });
    } catch (err) {
        const duplicateField = err.code === 11000 ? Object.keys(err.keyPattern || {})[0] : null;

        if (duplicateField && CONFLICT_MESSAGES[duplicateField]) {
            return sendConflict(res, [ duplicateField ]);
        }

        throw err;
    }

    const token = jwt.sign(
        { id: user._id, username: user.username },
        process.env.JWT_SECRET,
        { expiresIn: "1d" }
    );

    res.cookie("token", token, { ...cookieOptions, maxAge: 24 * 60 * 60 * 1000 });

    res.status(201).json({
        message: "User registered successfully",
        user: {
            id: user._id,
            username: user.username,
            email: user.email
        }
    });
}


/**
 * @name loginUserController
 * @description Login a user, expects email  and password in the request body
 * @access public
 */
async function loginUserController(req, res) {
    const { values, errors } = validateLoginInput(req.body);

    if (Object.keys(errors).length > 0) {
        return res.status(400).json({
            message: "Please provide your email and password.",
            errors
        });
    }

    const { email, password } = values;
    
    const user = await userModel.findOne({ email });

    if(!user) {
        return res.status(400).json({
            message: "Invalid email or password"
        }); 
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if(!isPasswordValid) {
        return res.status(400).json({
            message: "Invalid email or password"
        }); 
    }

    const token = jwt.sign(
        { id: user._id, username: user.username },
        process.env.JWT_SECRET,
        { expiresIn: "1d" }
    );

    res.cookie("token", token, { ...cookieOptions, maxAge: 24 * 60 * 60 * 1000 });
    res.status(200).json({
        message: "User logged in successfully",
        user: {
            id: user._id,
            username: user.username,
            email: user.email
        }
    });
}


/**
 * @name logoutUserController
 * @description Logout a user, clear token from user cookie and add the token in blacklist
 * @access public
 */
async function logoutUserController(req, res) {
    const token = req.cookies.token;

    if(token) {
        await tokenBlacklistModel.create({ token });
    }

    res.clearCookie("token", cookieOptions);

    res.status(200).json({
        message: "User logged out successfully"
    });
}


/**
 * @name getMeController
 * @description Get the current logged in user details
 * @access private
 */
async function getMeController(req, res) {
    const user = await userModel.findById(req.user.id);

    res.status(200).json({
        message: "User details fetched successfully",
        user: {
            id: user._id,
            username: user.username,
            email: user.email
        }
    }); 
}





module.exports = {
    registerUserController,
    loginUserController,
    logoutUserController,
    getMeController
};