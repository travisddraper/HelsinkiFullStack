import React, { useEffect, useState } from 'react'
import { useQuery, useLazyQuery } from '@apollo/client'
import { GET_GENRES_LIST, FILTER_BOOKS, ALL_BOOKS  } from '../queries'

export const BookListing = ({ a }) => {
  return (
    <tr key={a.title}>
      <td>{a.title}</td>
      <td>{a.author.name}</td>
      <td>{a.published}</td>
    </tr>
  )
}

const Books = ({ books, user, genres }) => {
  const [filter, setFilter] = useState(user?.favoriteGenre)
  const [fetchGenres, result] = useLazyQuery(GET_GENRES_LIST)
  //const [filterBooks, bookResults ] = useLazyQuery(FILTER_BOOKS)
  
  useEffect(() => {
    fetchGenres()
  }, [])

  /*useEffect(() => {
    if(result.data){
      const genreList = allBooksResults.data.allBooks.reduce((genreSheet, { genres }) => {
        let filterCheck = genres.filter(genre => !genreSheet.includes(genre))
        return [...genreSheet, ...filterCheck]
      }, [])
    } 
  },[result.data]) */

  /*useEffect(() => {
    filterBooks({
      variables: { genre: filter }
    })
  }, [filter])

  useEffect(() => {
    if(bookResults.data) setBooks(bookResults.data.allBooks)
  }, [bookResults.data]) */

  if(result.loading) return <div>Loading...</div>
  //if(!show) return null
  return (
    <div>
      <h2>books</h2>

      <table>
        <tbody>
          <tr>
            <th></th>
            <th>
              author
            </th>
            <th>
              published
            </th>
          </tr>
          {books.map(a => {
            if(filter) {
              return a.genres.includes(filter)
                ? <BookListing key={a.title} a={a} />
                : null
            } else {
              return <BookListing key={a.title} a={a} />
            }
          }
          )}
        </tbody>
      </table>

      {genres.map(genre => {
        return (
          <button key={genre} onClick={() => setFilter(genre)}>{genre}</button>
        )
      })}<br/>
      <button onClick={() => setFilter('')}>Clear Filter</button>
    </div>
  )
}

export default Books