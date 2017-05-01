export default `
    input UserInput {
        _id: String
        name: String!
        email: String!
        picture: String
        password: String!
        roomId: String
    }
    input UserSignup {
        _id: String!
        name: String!
        email: String!
        password: String!
    }
`