import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { render, fireEvent } from '@testing-library/react'
import { prettyDOM } from '@testing-library/dom'
import BlogForm from './BlogForm'

describe('<BlogForm />', () => {
  let component
  let createBlog
  beforeEach(() => {
    createBlog = jest.fn()
    component = render(
      <BlogForm author='Travis' handleSubmit={createBlog} />
    )
  })

  test('form calls event handler it received as props with right details when blog is created', () => {
    const input = component.container.querySelector('.blogFormTitle')
    const form = component.container.querySelector('form')

    fireEvent.change(input, {
      target: { value: 'Testing the value change for text input on Blog Form' }
    })
    fireEvent.submit(form)

    expect(component.container.querySelector('h2')).toHaveTextContent('Create New Blog')
    expect(createBlog.mock.calls).toHaveLength(1)
    expect(createBlog.mock.calls[0][0].title).toBe('Testing the value change for text input on Blog Form')
  })
})