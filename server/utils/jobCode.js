export const generateJobCode = () => {
    const randomSixDigit = Math.floor(100000 + Math.random() * 900000);
    return `JOB-${randomSixDigit}`;
};