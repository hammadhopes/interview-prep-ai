export const MIN_USERNAME_LENGTH = 3;
export const MIN_PASSWORD_LENGTH = 8;
export const MAX_USERNAME_LENGTH = 30;
export const MAX_PASSWORD_LENGTH = 72;

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const validateUsername = (value) => {
    const username = value.trim();
    if (!username) return "Username is required.";
    if (username.length < MIN_USERNAME_LENGTH) return `Username must be at least ${MIN_USERNAME_LENGTH} characters.`;
    if (username.length > MAX_USERNAME_LENGTH) return `Username must be ${MAX_USERNAME_LENGTH} characters or fewer.`;
    return "";
};

export const validateEmail = (value) => {
    const email = value.trim();
    if (!email) return "Email is required.";
    if (!EMAIL_PATTERN.test(email)) return "Enter a valid email address, like name@example.com.";
    return "";
};

export const validatePassword = (value) => {
    if (!value) return "Password is required.";
    if (value.length < MIN_PASSWORD_LENGTH) return `Password must be at least ${MIN_PASSWORD_LENGTH} characters.`;
    if (value.length > MAX_PASSWORD_LENGTH) return `Password must be ${MAX_PASSWORD_LENGTH} characters or fewer.`;
    return "";
};

export const validateLoginPassword = (value) => {
    return value ? "" : "Password is required.";
};