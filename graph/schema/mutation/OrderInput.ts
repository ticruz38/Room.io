export default `
    input OrderInput {
        _id: String!
        stuffIds: [String]!
        clientID: String!
        roomId: String!
        message: String
        payed: Boolean!
        amount: Float
    }
`