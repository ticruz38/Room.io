import db from 'graph/IpfsApiStore';

export const addressStamp = (item) => {
    item.ownerAddress = db.ownerAddress;
}

export const uniq = (array: string[]) => {
    const map = {};
    array.map(a => map[a] = 1);
    return Object.keys(map);
}