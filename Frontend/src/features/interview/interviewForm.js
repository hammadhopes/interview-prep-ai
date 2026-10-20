export const MAX_TEXT_LENGTH = 5000;
export const MAX_FILE_SIZE_MB = 3;

export const validateJobDescription = (value) => {
    if (!value.trim()) return "Job description is required.";
    if (value.length > MAX_TEXT_LENGTH) return `Job description must be ${MAX_TEXT_LENGTH} characters or fewer.`;
    return "";
};

export const validateResumeFile = (file) => {
    const isPdf = file.type === "application/pdf" || /\.pdf$/i.test(file.name);
    if (!isPdf) return "Only PDF files are supported.";
    if (file.size > MAX_FILE_SIZE_MB * 1024 * 1024) return `Resume must be ${MAX_FILE_SIZE_MB} MB or smaller.`;
    return "";
};

export const validateProfile = (file, selfDescription) => {
    if (!file && !selfDescription.trim()) return "Upload your resume or write a short self-description.";
    return "";
};

export const formatFileSize = (bytes) => {
    if (bytes < 1024 * 1024) return `${Math.max(1, Math.round(bytes / 1024))} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};