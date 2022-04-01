import React from 'react'

interface SwButtonProps {
  fetch: () => void;
}

export default function SwButton({fetch}: SwButtonProps) {
  return (
    <button onClick={fetch}>
      Fetch
    </button>
  )
}
