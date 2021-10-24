
import React, { useEffect, useState } from 'react'
import Authors from './components/Authors'
import Books from './components/Books'
import NewBook from './components/NewBook'
import LoginForm from './components/LoginForm'
import Recommended from './components/Recommended'
import { ME, BOOK_ADDED, ALL_BOOKS } from './queries'
import { useQuery, useLazyQuery, useApolloClient, useSubscription } from '@apollo/client'

const App = () => {
  const [page, setPage] = useState('login')
  const [token, setToken] = useState(null)
  const [user, setUser] = useState(null)
  const [getUser, result ] = useLazyQuery(ME, {
    fetchPolicy: "network-only"
  })
  const client = useApolloClient()
  const [books, setBooks] = useState([])
  const [genres, setGenres] = useState([])
  const allBooksResults = useQuery(ALL_BOOKS)


  useEffect(() => {
    if(allBooksResults.data) {
      setBooks(allBooksResults.data.allBooks)
    
      const genreList = allBooksResults.data.allBooks.reduce((genreSheet, { genres }) => {
        let filterCheck = genres.filter(genre => !genreSheet.includes(genre))
        return [...genreSheet, ...filterCheck]
      }, [])
      setGenres(genreList)
    }
  }, [allBooksResults.data])

  const updateCacheWith = (addedBook) => {
    const includedIn = (set, object) => 
      set.map(b => b.id).includes(object.id)

    const dataInStore = client.readQuery({ query: ALL_BOOKS })
    if(!includedIn(dataInStore.allBooks, addedBook)) {
      client.writeQuery({
        query: ALL_BOOKS,
        data: { allBooks: dataInStore.allBooks.concat(addedBook)}
      })
    }
  }

  useSubscription(BOOK_ADDED, {
    onSubscriptionData: ({ subscriptionData }) => {
      const addedBook = subscriptionData.data.bookAdded
      window.alert(`New book added -- ${addedBook.title}`)
      updateCacheWith(addedBook)
    }
  })

  useEffect(() => {
    const token = localStorage.getItem('library-user-token')
    if(token) {
      setToken(token)
    }
  }, [])

  useEffect(() => {
    if(token) {
      getUser()
    }
  }, [token])

  useEffect(() => {
    if(result.data) {
      setUser(result.data.me)
    }
    
  }, [result.data])

  const logout = () => {
    localStorage.clear()
    client.resetStore()
    setToken(null)
    setUser(null)
    setPage('login')
  }

  const switchFunction = (page) => {
    switch(page) {
      case 'login':
        return <LoginForm setToken={setToken} />
      case 'authors':
        return <Authors />
      case 'books':
        return <Books user={user} books={books} genres={genres} />
      case 'recommended':
        return <Recommended user={user} />
      case 'add':
        return <NewBook updateCacheWith={updateCacheWith} />
      default:
        return null
    }
  }


  return (
    <div>
      {!token && page !== 'login' ? <button onClick={() => setPage('login')}>Login</button> : null}
      <div>
        <button onClick={() => setPage('authors')}>authors</button>
        <button onClick={() => setPage('books')}>books</button>
        {token
          ? <>
            <button onClick={() => setPage('add')}>add book</button> 
            <button onClick={() => setPage('recommended')}>recommended</button>
            <button onClick={logout}>Logout</button>
            </>
          : 
            null }
        
      </div>
      {switchFunction(page)}
    </div>
  )
}

export default App