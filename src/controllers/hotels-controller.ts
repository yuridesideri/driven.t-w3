import { AuthenticatedRequest } from "@/middlewares"
import { getHotelWithRoomsByIdRepo } from "@/repositories/hotels-repository";
import { checkTicketForHotelService, getHotelByIdService, getHotelsService } from "@/services";
import { Response } from "express"
import httpStatus from "http-status";


export async function getHotels(req: AuthenticatedRequest, res: Response): Promise<Response>{
    try {
        const { userId } = req;
        await checkTicketForHotelService(userId);
        const hotels = await getHotelsService();
        res.status(httpStatus.OK).send(hotels)
    }catch (err){
        console.error(err)
        res.status(err.status || httpStatus.BAD_REQUEST)
        return res.send(err)
    }
}



export async function getHotelById(req: AuthenticatedRequest, res: Response): Promise<Response>{
    try {
        const { hotelId } = req.params;
        const { userId } = req;
        await checkTicketForHotelService(userId);
        const hotel = await getHotelByIdService(Number(hotelId));
        res.status(httpStatus.OK).send(hotel)
    }catch (err){
        console.error(err)
        res.status(err.status || httpStatus.BAD_REQUEST)
        return res.send(err)
    }
}