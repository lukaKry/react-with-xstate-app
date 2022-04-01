import React, { useCallback, useEffect, useState } from 'react'

const styles: React.CSSProperties = {
  fontSize: "x-large",
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: 'center',
  margin: 20
}

const Heading = ({title}: {title: string}) => (
  <h2>{title}</h2>
)

const Box: React.FunctionComponent = ({children}) => {
  return (
    <div style={{border: '1px solid black', padding: 20}}>
      {children}
    </div>
  )
}

interface ListProps {
  items: string[];
  onClick?: (item: string)=>void;
}

const List = ({items, onClick}: ListProps) => {
  return (
    <ul>
      {items.map((item,index) => (
        <li key={index} onClick={()=> onClick?.(item)}>{item}</li>
      ))}
    </ul>
  );
}

interface Payload {
  text: string;
}


export default function Dashboard() {
  const onListClick = useCallback((item: string)=>{alert(item)}, [])

  const [payload, setPayload]= useState<Payload | null>(null);

  useEffect(()=>{
    fetch('/payload.json')
      .then(response => {console.log(response); return response.json()})
      .then(data =>{console.log(data); return setPayload(data)})
  }, [])


  return (
    <div style={styles as React.CSSProperties}>
      <Heading title='Introduction'/>
      <Box><p>hello</p></Box>
      <List items={['one', 'two', 'three']} onClick={onListClick} />
      <Box>
        {JSON.stringify(payload)}
      </Box>
    </div>
  )
}
