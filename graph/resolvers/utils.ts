import db from 'graph/IpfsApiStore';

export const addressStamp = (item) => {
    item.ownerAddress = db.ownerAddress;
}