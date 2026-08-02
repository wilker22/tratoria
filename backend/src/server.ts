import cors from 'cors'
import 'dotenv/config'
import  express, { Request, Response, NextFunction } from 'express'
import { router } from "./routes";

const app = express();

app.use(express.json());
app.use(cors());
app.use(router); 
app.use((error: Error, req: Request, res: Response, next: NextFunction) => {
    if(error instanceof Error){
        return res.status(400).json({
            error: error.message
        })
    }

    return res.status(500).json({
        error: "Internal server error!" 
    });
})

const PORT = process.env.PORT! || 3333;

app.listen(PORT, () => {
    console.log("servidor rodando na porta " + PORT);
})