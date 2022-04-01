import { useLibraryContext } from './LibraryContext';
import { UserBookItem } from './libraryMachine';

export default function LibraryUserInfo() {
  const { context } = useLibraryContext();

  return (
    <div data-testid="libraryUserInfo-1" className='user-info'>
      <h6>User info:</h6>
      <p id="user-name">name: {context.currentUser?.name}</p>
      <p id="user-mail">mail: {context.currentUser?.email}</p>
      <p >Books:</p>
      <div data-testid="user-books-1">
      {context.currentUser?.userBooks.map( (item: UserBookItem, index: number) => (
        <p key={'book_' + index}>{item.title}</p>
        ))}
      </div>
    </div>
  )
}
