export default `
    input UserInput {
        _id: String
        name: String!
        email: String!
        password: String!
    }
    input UserSignup {
        _id: String!
        name: String!
        email: String!
        password: String!
    }
`