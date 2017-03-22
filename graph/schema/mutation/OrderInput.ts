export default `
    input OrderInput {
        _id: String!
        stuffIds: [String]!
        clientId: String!
        roomId: String!
        message: String
        payed: Boolean!
        treated: Boolean
        amount: Float
    }
`