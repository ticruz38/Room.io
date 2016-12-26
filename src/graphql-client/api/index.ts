import {default as db} from '../../IpfsApiStore';


export function getAllRooms() {
    return db.room.query( room => room );
}

export function getRoom(id: string) {
    return db.room.get(id);
}

export function getRoomStuffs(id: string) {
    return db.stuffs.query( stuff => stuff.id === id);
}

export class Room {
    
}

