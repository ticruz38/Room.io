# Room.io ® 

Room.io is a peer to peer business area. it let it's **Roomer** offer any goods or services in a decentralized way.

It uses IPFS as its DataStorage and Ethereum for everything that is related to authentication, money transaction and Roomer/Customer contract.


## Install
```bash
> npm i -g ipfs
> npm i -g yarn
> npm i -g typescript
> yarn
```

## Bootstrap
first run the guard node
```bash
yarn run guardnode
```
then in another bash window
```bash
> yarn start
```

## In the browser
To fulfill the app with data run:

```JavaScript
populateDb('room')
populateDb('user')
populateDb('stuff')
populateDb('order')
```

Login to your room with these credentials:
- email: thib.duchene@gmail.com
- password: Password69

start playing around


## Project Folders
### components
- Generic list of component used throughout the application

### contract
- Ethereum code used for payment authentication and db securization WIP

### graph
- This is where the application data is computed
- Schema => Graphql schema
- GraphQl Resolver, they are basically services for each type entry

### mocks
- this is just for dev purpose, we fulfill the app with mock data

### models
- All the client side models (user, room, stuffs, orders) it's typescript classes that are able to query, update, mutate and delete themself.

### routes
- This is where the React application stands


## Tips and tricks
These apps has been developped using Visual Studio Code, with GraphQl for VSCode plugin, using this plugin will be easier for you to navigate through .gql files.