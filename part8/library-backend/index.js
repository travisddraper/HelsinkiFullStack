const { ApolloServer, gql, UserInputError, AuthenticationError } = require('apollo-server-express')
const mongoose = require('mongoose')
const express = require('express')

const { createServer } = require('http')
const { execute, subscribe } = require('graphql')
const { SubscriptionServer } = require('subscriptions-transport-ws')
const { makeExecutableSchema } = require('@graphql-tools/schema')

const { PubSub } = require('graphql-subscriptions')

const jwt = require('jsonwebtoken')
const { v1: uuid } = require('uuid')
const Author = require('./models/Author')
const Book = require('./models/Book')
const User = require('./models/User')
const pubsub = new PubSub()

const MONGODB_URI = 'mongodb+srv://fullstack3:projectFullstack3@cluster0.rsz5m.mongodb.net/libraryBackend?retryWrites=true&w=majority'
const JWT_SECRET = "secret"

console.log('connecting to', MONGODB_URI)


mongoose.connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('connected to MongoDB')
  })
  .catch(error => {
    console.log('error connecting to MongoDB', error.message)
  })



/*
 * Suomi:
 * Saattaisi olla järkevämpää assosioida kirja ja sen tekijä tallettamalla kirjan yhteyteen tekijän nimen sijaan tekijän id
 * Yksinkertaisuuden vuoksi tallennamme kuitenkin kirjan yhteyteen tekijän nimen
 *
 * English:
 * It might make more sense to associate a book with its author by storing the author's name in the context of the book instead of the author's id
 * However, for simplicity, we will store the author's name in connection with the book
*/



const typeDefs = gql`
  type User {
    username: String!
    favoriteGenre: String!
    id: ID!
  }

  type Token {
    value: String!
  }

  type Author {
    name: String!
    id: ID!
    born: Int
    bookCount: Int!
  }

  type Book {
    title: String!
    published: Int!
    author: Author!
    id: ID!
    genres: [String!]!
  }

  type Query {
    bookCount: Int!
    authorCount: Int!
    allBooks(author: String, genre: String): [Book]
    allAuthors: [Author!]!
    me: User
  }

  type Mutation {
    addBook(
      title: String!
      author: String!
      published: Int!
      genres: [String]
    ): Book
    editAuthor(
      name: String!
      setBornTo: Int!
    ): Author
    createUser(
      username: String!
      favoriteGenre: String!
    ): User
    login(
      username: String!
      password: String!
    ): Token
  },
  type Subscription {
    bookAdded: Book
  }
`
const bookSearcher = async(id = null, genre = null) => {
  if(id && genre) return await Book.find( {
    genres: { $in: [ genre ] },
    author: id.toString()
  } ).populate('author')

  if(genre) return await Book.find( { 
    genres: { $in: [ genre ] }
   } ).populate('author')

  if(id) return await Book.find({ author: id.toString()}).populate('author')

  else {
    return null
  }
}

const resolvers = {
  Query: {
    bookCount: () => Book.collection.countDocuments(),

    authorCount: () => Author.collection.countDocuments(),

    allBooks: async(root, args) => {
      if(!args.author && !args.genre) {
        const books =  await Book.find({}).populate('author')
        return books
      }

      let author;
      try {
        author = args.author
          ? await Author.findOne( { name: args.author } )
          : null

        return await bookSearcher(author?._id, args.genre)
      } catch(error) {
        throw new UserInputError(error.message, {
          invalidArgs: args
        })
      }
    },

    allAuthors: async() => {
      try {
        return await Author.find({})
      } catch(error) {
        console.log('error occured: ', error.message)
      }
      
    },

    me: (root, args, context) => {
      return context.currentUser 
    }
  },


  Author: {
    bookCount: async (root) =>  ( await Book.find( { author: root._id })).length
  },


  Mutation: {
    addBook: async (root, args, { currentUser } ) => {
      if(!currentUser) {
        throw new AuthenticationError('Not authenticated!')
      }
      const authorSearch = await Author.findOne({ name: args.author })

      if(authorSearch === null) {
        const newAuthor = new Author({ name: args.author})
        const savedAuthor = await newAuthor.save()
        const book = new Book({ ...args, author: savedAuthor._id })
        const savedBook = await (await book.save()).populate('author')
        pubsub.publish('BOOK_ADDED', { bookAdded: savedBook })
        return savedBook
      }
      const book = new Book({ ...args, author: authorSearch._id })
      const savedBook = await (await book.save()).populate('author')
      pubsub.publish('BOOK_ADDED', { bookAdded: savedBook })
      return savedBook
    },

    editAuthor: async(root, args, { currentUser } ) => {
      if(!currentUser) {
        throw new AuthenticationError('Not authenticated!')
      }
      const author = await Author.findOne({ name: args.name })
      if (!author) throw new Error('No author exists in database')
      try {
        return await Author.findOneAndUpdate({ name: args.name }, { 
          born: args.setBornTo
        }, { new: true })
      } catch(error) {
        throw new UserInputError(error.message, {
          invalidArgs: args
        })
      }
    },

    createUser: async(root, args) => {
      const user = new User({ 
        username: args.username, 
        favoriteGenre: args.favoriteGenre 
      })

      return user.save()
        .catch(error => {
          throw new UserInputError(error.message, {
            invalidArgs: args
          })
        })
    },

    login: async(root, args) => {
      const user = await User.findOne({ username: args.username })

      if( !user || args.password !== "secret") {
        throw new UserInputError('Wrong credentials!')
      }

      const userForToken = {
        username: user.username,
        id: user._id,
      }

      return { value: jwt.sign(userForToken, JWT_SECRET) }
    }
  },

  Subscription: {
    bookAdded: {
      subscribe: () => pubsub.asyncIterator(['BOOK_ADDED'])
    }
  }
}

const PORT = 4000;
async function startApolloServer() {
  const app = express()
  const httpServer = createServer(app)
  const schema = makeExecutableSchema({
    typeDefs,
    resolvers
  })

  const server = new ApolloServer({
    schema,
    context: async({ req }) => {
      const auth = req ? req.headers.authorization : null
      if(auth && auth.toLowerCase().includes('bearer ')) {
        const decodedToken = jwt.verify(
          auth.substring(7), JWT_SECRET
        )
  
        const currentUser = await User
          .findById(decodedToken.id)
        return { currentUser }
      }
    }
  });

  await server.start()
  server.applyMiddleware({ app })

  SubscriptionServer.create(
    { schema, execute, subscribe },
    { server: httpServer, path: server.graphqlPath }
  )

  httpServer.listen(PORT, () => {
    console.log(`Query endpoint ready at http://locahost${PORT}${server.graphqlPath}`)
    console.log(`Subscription endpoint readay at ws://localhost:${PORT}${server.graphqlPath}`)
  })
}

startApolloServer()
/*
const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: async({ req }) => {
    const auth = req ? req.headers.authorization : null
    if(auth && auth.toLowerCase().includes('bearer ')) {
      const decodedToken = jwt.verify(
        auth.substring(7), JWT_SECRET
      )

      const currentUser = await User
        .findById(decodedToken.id)
      return { currentUser }
    }
  }
})

server.listen().then(({ url }) => {
  console.log(`Server ready at ${url}`)
})
*/