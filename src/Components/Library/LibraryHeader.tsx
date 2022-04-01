import { useLibraryContext } from './LibraryContext';

export default function LibraryHeader() {
 const { context,send } = useLibraryContext();

  const Logout = () => send('LOGOUT');
  
  return (
    <div className='d-flex bg-secondary bg-gradient'>
      <div className='col-9 p-2 fs-3'>
        {context.currentUser?.name}
      </div>
      <div className='col-3 p-2'>
        <button className='w-100 h-100 btn-dark' onClick={Logout}>Logout</button>
      </div>
    </div>
  )
}
