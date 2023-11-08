import http from "http";
import express, {
    Application, Request, Response
} from "express";

export const app: Application = express()

app.all('/', (req: Request, res: Response) => {
    console.log("Just got a request!")
    res.send('Yo!')
})
app.listen(process.env.PORT || 3000)