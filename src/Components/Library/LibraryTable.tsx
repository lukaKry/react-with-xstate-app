import { useContext } from 'react'
import { useLibraryContext } from './LibraryContext';

export default function LibraryTable() {
  const { machine, send } = useLibraryContext();

  const handleBorrow = (index: number): void => {
    send({type: 'BORROW', bookItemId: index});
  }

  const handleReturn = (index: number): void => {
    send({type: 'RETURN', bookItemId: index});
  }

  return (
    <div className='library-table'>
      <table className='table table-secondary table-striped'>
          <thead>
            <tr>
              <th>id</th>
              <th>title</th>
              <th>quantity</th>
              <th>borrowed</th>
              <th>actions</th>
            </tr>
          </thead>  
          <tbody>
            {machine.context.books.map((item: any, index: any)=>(
              <tr key={'tr_'+index}>
                <td>{item.id}</td>
                <td>{item.title}</td>
                <td>{item.quantity}</td>
                <td>{item.borrowed}</td>
                <td>
                  <button
                    id={'book_btn_'+index} 
                    className='btn btn-primary' 
                    style={{marginBottom: 5, marginRight: 5, width: '5em'}} 
                    type='button' 
                    onClick={() => handleBorrow(item.id)}
                    disabled={!machine.can({type: 'BORROW', bookItemId: item.id})}
                    >
                    Borrow
                    </button>
                  <button 
                    className='btn btn-warning' 
                    style={{marginBottom: 5, marginRight: 5, width: '5em'}} 
                    type='button' 
                    onClick={() => handleReturn(item.id)}
                    disabled={!machine.can({type: 'RETURN', bookItemId: item.id})}
                    >
                    Return
                    </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
    </div>
  )
}
