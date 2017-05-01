export default `
    input OrderInput {
        _id: String!
        stuffIds: [String]!
        clientId: String!
        roomId: String!
        message: String
        payed: Boolean!
        created: Int
        treated: Boolean
        amount: Float # deprecated this is calculated from the stuffIds
    }
`