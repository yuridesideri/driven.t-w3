import { prisma } from "@/config";
import faker from "@faker-js/faker";
import { randomNumber } from "../helpers";

export async function createHotelWithRooms (){
    return prisma.hotel.create({
        data:
            {
                name: faker.name.findName(),
                image: faker.image.imageUrl(),
                Rooms: {
                    create: new Array(randomNumber(1, 3)).map(el => {
                        return {
                            name: faker.name.findName(),
                            capacity: randomNumber(1, 4),
                        }
                    })
                }
            },
            include: {
                Rooms: true
            }
        
    })
}


export async function createBookings (roomsIds:  number[], userId: number){
    return prisma.booking.createMany({
        data: roomsIds.map(roomId => {
            return {
                roomId,
                userId,               
            }
        })
    })
}