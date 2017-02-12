import db from 'graph/IpfsApiStore';
import { GraphQLError } from 'graphql';
import { debug } from 'graph/resolvers';

export default {
  room(root, args, context) {
    return db.room.then(roomDb => roomDb.get(args.id)[0]);
  },
  rooms(root, args, context) {
    // each docStore are a promise, resolved when data are loaded 
    return db.room.then(roomDb => roomDb.query(doc => !!doc));
    //console.log('roomsQuery:Resolver', db.room);
    //return all.map(room => room.pictures ? room.pictures : [];
  },
  user(root, args, context) {
    debug('user');
    console.log('resolve user');
    return db.user.then(userDb => {
      const user = userDb.query(u => u._id === args.id)[0]
      return user;
    });
  },
  login(root, args, context) {
    return new Promise((resolve, reject) => {
      db.user.then(userDb => {
        const user = userDb.get(args.email)[0];
        if (!user) reject(new GraphQLError(args.email + ' is not registered in the network'));
        return user.password === args.password ? resolve(user) : reject(new GraphQLError('The password do not match the email'))
      });
    });
  }
}