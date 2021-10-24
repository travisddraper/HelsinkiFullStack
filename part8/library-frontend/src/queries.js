import { gql } from '@apollo/client'

const BOOK_DETAILS = gql`
fragment BookDetails on Book {
  title
  published
  author {
    name
    id
  }
  id 
  genres
}
`

export const ALL_AUTHORS = gql`
query {
  allAuthors {
    name
    id
    born
    bookCount
  }
}
`

export const ALL_BOOKS = gql`
query {
  allBooks {
    title
    published
    author {
      name
      id
    }
    id
    genres
  }
}
`

export const FILTER_BOOKS = gql`
query filterBooks($author: String, $genre: String) {
  allBooks(author: $author, genre: $genre) {
    title
    published
    author {
      name
      id
    }
    id
    genres
  }
}
`

export const GET_GENRES_LIST = gql`
query {
  allBooks {
    genres
  }
}
`

export const ME = gql`
query {
  me {
    username,
    favoriteGenre
    id
  }
}
`

export const ADD_BOOK = gql`
mutation addBook($title: String!, $published: Int!, $author: String!, $genres: [String]) {
  addBook(
    title: $title
    author: $author
    published: $published
    genres: $genres
  ) {
    title
    published
    author {
      name
      id
      born
      bookCount
    }
    id
    genres
  }
}
`

export const EDIT_AUTHOR = gql`
mutation editAuthor($name: String!, $setBornTo: Int!) {
  editAuthor(
    name: $name
    setBornTo: $setBornTo
  ) {
    name
    id
    born
    bookCount
  }
}
`

export const LOGIN = gql`
mutation login($username: String!, $password: String!) {
  login(
    username: $username
    password: $password
  ) {
    value
  }
}
`
export const BOOK_ADDED = gql`
subscription {
  bookAdded {
    ...BookDetails
  }
}
${BOOK_DETAILS}
`
