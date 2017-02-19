export default class Stuff {
  constructor (params: {
    _id: string
    roomId: string,
    name?: string,
    category?: string,
    description?: string,
    picture?: string,
    price?: number
  }) {
    for (var key in params)
    this[key] = params[key];
  }
}