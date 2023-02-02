import { requestError } from "@/errors";
import { getHotelsRepo, getHotelWithRoomsByIdRepo} from "@/repositories/hotels-repository";
import { TicketStatus } from "@prisma/client";
import httpStatus from "http-status";
import { getTicketByUserId } from "../tickets-service";

export async function getHotelsService(){
    const hotels = await getHotelsRepo();
    return hotels;
}

export async function getHotelByIdService(hotelId: number){
    const hotel = await getHotelWithRoomsByIdRepo(hotelId);
    if (!hotel) throw httpStatus.NOT_FOUND;
    return hotel;
}

export async function checkTicketForHotelService(userId: number){
    const ticket = await getTicketByUserId(userId);
    const {TicketType} = ticket;
    if (!TicketType.includesHotel || TicketType.isRemote || ticket.status !== TicketStatus.PAID) {
        throw requestError(httpStatus.PAYMENT_REQUIRED, "You need to pay a ticket to access this resource");
    }
}