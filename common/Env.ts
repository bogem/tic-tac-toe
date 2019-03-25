export const checkEnvVariable = (varName: string) => {
    if (!process.env[varName]) {
        console.error(`Please set ${varName} env variable!`);
        process.exit(-1);
    }
};
