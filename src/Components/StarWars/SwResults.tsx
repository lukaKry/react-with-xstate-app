import React from 'react'

interface SwResultsProps {
  results: []
}

export default function SwResults({results}: SwResultsProps) {
  return (
    <ol>
          {results.map((item: {name: string, alias: string}, index: number) => (
            <li key={index}>
              <span>{item.name} </span>
              <span> {item.alias}</span>
            </li>
          ))}
    </ol>
  )
}
