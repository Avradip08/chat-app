import express ,{Request,Response} from "express"
import cors from "cors"
import apiRouter from "./router/api";
import authRouter from "./router/auth";

const PORT = process.env.PORT || 8081;

const app = express();
app.use(express.json())
app.use(cors())
app.use("/api",apiRouter)
app.use("/auth",authRouter)


app.get("/test",async (req:Request,res:Response)=>{
    res.json({message:"hello world"})
})


app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});

