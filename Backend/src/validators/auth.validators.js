const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const USERNAME_MIN_LENGTH = 3;
const USERNAME_MAX_LENGTH = 30;
const EMAIL_MAX_LENGTH = 254;
const PASSWORD_MIN_LENGTH = 8;
const PASSWORD_MAX_BYTES = 72;

const asText = (value) => (typeof value === "string" ? value.trim() : "");
const asPassword = (value) => (typeof value === "string" ? value : "");

function validateRegisterInput(body = {}) {
    const username = asText(body.username);
    const email = asText(body.email).toLowerCase();
    const password = asPassword(body.password);

    const errors = {};

    if (!username) {
        errors.username = "Username is required.";
    } else if (username.length < USERNAME_MIN_LENGTH) {
        errors.username = `Username must be at least ${USERNAME_MIN_LENGTH} characters.`;
    } else if (username.length > USERNAME_MAX_LENGTH) {
        errors.username = `Username must be ${USERNAME_MAX_LENGTH} characters or fewer.`;
    }

    if (!email) {
        errors.email = "Email is required.";
    } else if (email.length > EMAIL_MAX_LENGTH || !EMAIL_PATTERN.test(email)) {
        errors.email = "Enter a valid email address, like name@example.com.";
    }

    if (!password) {
        errors.password = "Password is required.";
    } else if (password.length < PASSWORD_MIN_LENGTH) {
        errors.password = `Password must be at least ${PASSWORD_MIN_LENGTH} characters.`;
    } else if (Buffer.byteLength(password, "utf8") > PASSWORD_MAX_BYTES) {
        errors.password = `Password must be ${PASSWORD_MAX_BYTES} characters or fewer.`;
    }

    return { values: { username, email, password }, errors };
}

function validateLoginInput(body = {}) {
    const email = asText(body.email).toLowerCase();
    const password = asPassword(body.password);

    const errors = {};

    if (!email) errors.email = "Email is required.";
    if (!password) errors.password = "Password is required.";

    return { values: { email, password }, errors };
}

module.exports = { validateRegisterInput, validateLoginInput };