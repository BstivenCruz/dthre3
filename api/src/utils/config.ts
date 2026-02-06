import cnf from "dotenv";
cnf.config();

const config = {
apiName: process.env.API_NAME || "api",
apiPort: process.env.API_PORT || 3000,
apiKey: process.env.API_KEY || "1234",
dbHost: process.env.DB_HOST || "localhost",
dbUser: process.env.DB_USER || "root",
dbPassword: process.env.DB_PASSWORD || "1234",
dbName: process.env.DB_NAME || "api",
dbPort: process.env.DB_PORT || 5432,
};

export default config;
