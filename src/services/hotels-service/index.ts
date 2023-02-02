import { requestError } from "@/errors";
import { getHotelsRepo} from "@/repositories/hotels-repository";
import { TicketStatus } from "@prisma/client";
import { HttpStatusCode } from "axios";
import { getTicketByUserId } from "../tickets-service";

export async function getHotelsService(){
    const hotels = await getHotelsRepo();
    return hotels;
}

export async function checkTicketForHotelService(userId: number){
    const ticket = await getTicketByUserId(userId);
    const {TicketType} = ticket;
    if (!TicketType.includesHotel || TicketType.isRemote || ticket.status !== TicketStatus.PAID) {
        throw requestError(HttpStatusCode.PaymentRequired, "You need to pay a ticket to access this resource");
    }
    
}