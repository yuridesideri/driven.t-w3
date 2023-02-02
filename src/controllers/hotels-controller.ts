import { AuthenticatedRequest } from "@/middlewares"
import { getHotelWithRoomsByIdRepo } from "@/repositories/hotels-repository";
import { checkTicketForHotelService, getHotelsService } from "@/services";
import { HttpStatusCode } from "axios";
import { Response } from "express"
import httpStatus from "http-status";


export async function getHotels(req: AuthenticatedRequest, res: Response): Promise<Response>{
    try {
        const { userId } = req;
        await checkTicketForHotelService(userId);
        const hotels = getHotelsService();
        res.status(HttpStatusCode.Ok).send(hotels)
    }catch (err){
        console.error(err)
        res.status(err.status || HttpStatusCode.BadRequest)
        return res.send(err)
    }
}



export async function getHotelById(req: AuthenticatedRequest, res: Response): Promise<Response>{
    try {
        const { hotelId } = req.params;
        const { userId } = req;
        await checkTicketForHotelService(userId);
        const hotel = getHotelWithRoomsByIdRepo(Number(hotelId));
        if (!hotel) throw httpStatus.NOT_FOUND;
        res.status(HttpStatusCode.Ok).send(hotel)
    }catch (err){
        console.error(err)
        res.status(err.status || HttpStatusCode.BadRequest)
        return res.send(err)
    }
}