import { AuthenticatedRequest } from "@/middlewares"
import { Response } from "express"


export async function getHotels(req: AuthenticatedRequest, res: Response): Promise<Response>{
    try {
        
    }catch (err){
        console.error(err)
        res.status(400)
        return res.send(err)
    }
}