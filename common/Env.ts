export const checkEnvVariable = (varName: string) => {
    if (typeof process !== "undefined" && !process.env[varName]) {
        console.error(`Please set ${varName} env variable!`);
        process.exit(-1);
    }
};
