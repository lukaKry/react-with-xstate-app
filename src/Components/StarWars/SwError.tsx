import React from 'react'

interface SwErrorProps {
  error: string;
}

export default function SwError({error}: SwErrorProps) {
  const style= {
    width: '100vh',
    height: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  }
  
  console.log('rendering...', error);
  

  return (
    <div style={style}>{error}</div>
  )
}
