require("dotenv").config({ path: "./src/config/.env" });
const httpServer = require("./src/app");
const connectDB = require("./src/config/db");
const port = process.env.PORT || 5000;
const start = async () => {
    try {
        await connectDB();
        httpServer.listen(port, () => {
            console.log(`server is running on port ${port}`);
        });
    } catch (error) {
        console.log(error);
    }
};
start();
