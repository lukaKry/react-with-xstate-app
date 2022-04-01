import React, { useState } from 'react'
import { useLibraryContext } from './LibraryContext';
import { loginInput } from './libraryMachine';
import './library.css';

interface LibraryLoginProps  {
  error: string;
}


export default function LibraryLogin(props: LibraryLoginProps) {
  const { error } = props;
  const [input, setInput] = useState({} as loginInput);
  const { send } = useLibraryContext();


  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInput( (prev: loginInput) => {return {...prev, [event.target.name]: event.target.value}});
  }

  const login = (event: any, input : loginInput) => {
    event.preventDefault();
    send('LOGIN', { input: input });
  }
  
  return (
    <form onSubmit={(e) => login(e, input)}>

      <div className='form-inner'>
        <h2>Login</h2>
        {error && <div className='error'>{error}</div>}
        <div className='form-group'>
          <label htmlFor='email'>Email</label>
          <input type="text" name='email' onChange={handleChange}/>
          
          <label htmlFor='password'>Password</label>
          <input type="password" name='password' onChange={handleChange} />
          
          <button type="submit">Login</button>
        </div>
      </div>
    </form>
  )
}
