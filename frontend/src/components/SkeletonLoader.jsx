import React, { useEffect, useState } from 'react'

const SkeletonLoader = ({ step }) => {
  const [lines, setLines] = useState([])

  // Function to generate a random width between 30% and 100%
  const getRandomWidth = () => `${Math.floor(Math.random() * 70) + 30}%`

  // Function to add three new skeleton lines
  const addThreeLines = () => {
    const newLines = Array.from({ length: 3 }, () => getRandomWidth())
    setLines([...lines, ...newLines])
  }

  useEffect(() => {
    if (lines?.length < 12) {
      addThreeLines()
    }
  }, [step])

  return (
    <div>
      <div className='skeleton-container'>
        {lines.map((width, index) => (
          <div key={index} className='skeleton-line' style={{ width: width }}></div>
        ))}
      </div>
    </div>
  )
}

export default SkeletonLoader
