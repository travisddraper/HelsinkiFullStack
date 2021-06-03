import React from 'react';

const Header = ({ courseName }) => {
  return (
    <h2>{courseName}</h2>
  )
}

const Total = ({ courseParts }) => {

  const total = courseParts.reduce((s, p) => {
    if(s.exercises) { return s.exercises + p.exercises }
    return s + p.exercises
  })

  return (
    <p><b>Total of exercises {total}</b></p>
  ) 
}

const Part = ({part}) => {
  return (
    <p>
      {part.name} {part.exercises}
    </p>    
  )
}

const Content = ({ courseParts }) => {
  return (
    <div>
      {courseParts.map(part =>
        <Part key={part.id} part={part} />
      )}
    </div>
  )
}

const Course =({courses}) => {

  return (
    <>
        {courses.map(course =>
        <>
            <Header courseName={course.name} />
            <Content courseParts={course.parts} />
            <Total courseParts={course.parts} />
        </>
        )}
    </>
  )
}

export default Course