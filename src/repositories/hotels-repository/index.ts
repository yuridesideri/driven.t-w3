import { prisma } from '@/config';

export function getHotelsRepo() {
  return prisma.hotel.findMany();
}

export function getHotelWithRoomsByIdRepo(hotelId: number) {
  return prisma.hotel.findUnique({
    where: {
      id: hotelId
    },
    include:{
      Rooms: true
    }
  });
}
