export default `
    type Order {
        _id: String!
        stuffId: String! # Which stuff does that order points to
        roomId: String!
        message: String # Additional message the customer has put on its order
        payed: Boolean
        amount: Float
    }
`