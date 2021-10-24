import React, { useEffect, useState } from 'react'
import { useLazyQuery } from '@apollo/client'
import { FILTER_BOOKS } from '../queries'
import { BookListing } from './Books'

const Recommended = ({ user, show }) => {
  const [books, setBooks] = useState([])
  const [getFilteredResults, result] = useLazyQuery(FILTER_BOOKS)

  useEffect(() => {
    const asyncFunction = async(user) => {
      getFilteredResults({
        variables: { genre: user.favoriteGenre }
      })
    }
    if(user?.favoriteGenre) asyncFunction(user)
  }, [user])

  useEffect(() => {
    if(result.data) setBooks(result.data.allBooks)
  }, [result.data])

  //if(!show) return null
  return (
    <div>
      <table>
        <tbody>
          <tr>
            <th>
              title
            </th>
            <th>
              author
            </th>
            <th>
              published
            </th>
          </tr>
          {books.map(book => <BookListing key={book.title} a={book} />)}
        </tbody>
      </table>
    </div>
  )
}

export default Recommended