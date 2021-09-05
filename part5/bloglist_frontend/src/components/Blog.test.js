import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { render, fireEvent } from '@testing-library/react'
import { prettyDOM } from '@testing-library/dom'
import { Blog, MoreInfo } from './Blog'

describe('<Blog />', () => {
  let component

  beforeEach(() => {
    const blog = {
      title: 'Hello World!',
      url: 'www.testBlog.com',
      likes: 2,
      author: {
        username: 'Daniel Draper',
        name: 'Travis'
      },
    }

    const blogs = [
      blog,
      blog
    ]

    component = render(
      <Blog blog={blog} blogs={blogs} />
    )
  })

  test('Blog renders only title and author initially', () => {
    expect(component.container).not.toHaveTextContent('www.testBlog.com')
    expect(component.container).toHaveTextContent('Travis')
  })

  test('Clicking show more reveals blog url and number of likes', () => {
    const button = component.getByText('Show')
    fireEvent.click(button)

    expect(component.container).toHaveTextContent('www.testBlog.com')
    expect(component.container).toHaveTextContent('2')

    expect(button).toHaveTextContent('Hide')
  })

  test('liked button fires twice when clicked twice', () => {
    const mockHandler = jest.fn()

    const component = render(
      <MoreInfo 
        url='www.testBlog.com'
        likes={2}
        username='Daniel Draper'
        updateLikes={mockHandler}
        handleDelete={() => 2}
      />
    )
    const button = component.getByText('Like')
    fireEvent.click(button)
    fireEvent.click(button)

    expect(mockHandler.mock.calls).toHaveLength(2)
  })
})


