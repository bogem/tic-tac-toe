export const checkEnvVariable = (varName: string) => {
    if (process && !process.env[varName]) {
        console.error(`Please set ${varName} env variable!`);
        process.exit(-1);
    }
};
