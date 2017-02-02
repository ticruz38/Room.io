export default `
    type User {
        _id: String!
        name: String
        email: String!
        password: String! #hash256 password
        rooms: [String] #user rooms listed by Id
    }
`;
