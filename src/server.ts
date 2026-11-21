import app from "./app";
import config from "./config";
import { prisma } from "./lib/prisma"; 

async function main() {

    try {
        await prisma.$connect();
        console.log("database connected successfully");
        app.listen(config.port, ()=>{
            console.log(`blog post server is running on port ${config.port}`);
            
        })
        
    } catch (error) {
        console.log("Error starting the server", error);
        await prisma.$disconnect();
        process.exit(1)
    }
    
}

main()