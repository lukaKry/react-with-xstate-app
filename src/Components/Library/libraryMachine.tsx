import { assign, createMachine } from "xstate";

// Types
type BookActionEvent = {
  type: string,
  target: string,
  bookItemId: number
};

type LoginEvent = {
  type: string,
  target: string,
  input: loginInput
}

export type loginInput = {
  email: string,
  password: string
}

export type BookItem = {
  id: number,
  title: string,
  quantity: number,
  borrowed: number,
}

export type UserBookItem = {
  id: number,
  title: string,
}

export type User = {
  name: string,
  email: string,
  password: string,
  userBooks: UserBookItem[]
}

export interface LibraryContext {
  books: BookItem[];
  users: User[];
  currentUser?: User;
}

// initial books array
const booksRepository: BookItem[] = [
  {
    id: 1, 
    title: 'George Orwell - Rok 1984',
    quantity: 3,
    borrowed: 0,
  },
  {
    id: 2, 
    title: 'Stephen Hawking - Krótka historia czasu',
    quantity: 5,
    borrowed: 4
  },
  {
    id: 3, 
    title: 'Dave Eggers - Wstrząsające dzieło kulejącego geniusza',
    quantity: 6,
    borrowed: 4
  },
]

// inital users array
const usersRepository: User[] = [
  {
    name: 'admin',
    email: 'admin@com.pl',
    password: 'admin',
    userBooks: [] as UserBookItem[]
  },
  {
    name: 'user',
    email: 'user@com.pl',
    password: 'user',
    userBooks: [] as UserBookItem[]
  }
]; 


export const libraryMachine = createMachine(
  {
    id: 'library',
    initial: 'logged_out',
    schema: {
      context: {} as LibraryContext
    },
    context: {
      books: booksRepository,
      users: usersRepository,
      currentUser: undefined,
    },
    states: {
      logged_in: {
        entry: () => { console.log('you are logged in!')},
        on: {
          BORROW: {
            actions: 'borrowItem',
            cond: {type: 'canBorrow'},
          }, 
          RETURN: {
            actions: 'returnItem',
            cond: {type: 'canReturn'},
          },
          LOGOUT: {
            target: 'logged_out',
            actions: 'logout',
          }
        }
      },
      logged_out: {
        entry:  () => { console.log('you are logged out!')},
        on: {
          LOGIN: {
            target: 'logged_in',
            actions: 'login',
            cond: { type: 'isLoginDataCorrect'}
          }
        }
      }
    },
  },
  {
    actions: {
      borrowItem: assign(
        (context, event) => 
        {
          const books = context.books;
          const selectedItemIndex = books.findIndex(book => book.id === (event as BookActionEvent).bookItemId)
          if ( selectedItemIndex >= 0 ) {
            books[selectedItemIndex].borrowed++;

            // add book to userbooks
            context.currentUser?.userBooks.push({
              id: books[selectedItemIndex].id,
              title: books[selectedItemIndex].title,
            });
          }
          return {
            books: books
          };
        }
      ),
      returnItem: assign(
        (context, event) => 
        {
          const books = context.books;
          const selectedItemIndex = books.findIndex(book => book.id === (event as BookActionEvent).bookItemId)
          if ( selectedItemIndex >= 0 ) {
            books[selectedItemIndex].borrowed--;
            // remove book from userbooks
            const userbookIndexToRemove = context.currentUser?.userBooks.findIndex(userbook => userbook.id === (event as BookActionEvent).bookItemId);
            if ( userbookIndexToRemove != undefined && userbookIndexToRemove >= 0 ) {
              context.currentUser?.userBooks.splice(userbookIndexToRemove, 1);
            }
          }
          return {
            books: books
          };
        }
      ),
      login: assign(
        (context, event) =>
        {
          const inputData = (event as LoginEvent).input;
          const newUser = context.users.find( user => user.email === inputData.email && user.password === inputData.password);
          return { currentUser: newUser };
        }
      ),
      logout: assign(
        (context, event) => 
        {
          const updatedUser = context.currentUser;
          let updatedUsers = context.users;
          if (updatedUser && updatedUsers){
            let updatedUserIndex = context.users.indexOf(updatedUser);
            if( updatedUserIndex >= 0){
              updatedUsers[updatedUserIndex] = updatedUser;
            }
          }

          return { users: updatedUsers, currentUser: undefined};
        }
      ),
    },
    guards: {
      canBorrow: (context, event) => {
        const selectedItemId = context.books.findIndex(book => book.id === (event as BookActionEvent).bookItemId);
        
        const isBookAvailableInStorage = context.books[selectedItemId].borrowed < context.books[selectedItemId].quantity;
        const hasUserAlreadyBorrowed = context.currentUser ? 
          context.currentUser.userBooks.some( book => book.id === (event as BookActionEvent).bookItemId)
          : false;

        return isBookAvailableInStorage && !hasUserAlreadyBorrowed;
      },
      canReturn: (context, event) => {
        return context.currentUser ? 
          context.currentUser.userBooks.some( book => book.id === (event as BookActionEvent).bookItemId)
          : false;
      },
      isLoginDataCorrect: (context, event) => {
        const inputData = (event as LoginEvent).input;
        return context.users.some( user => user.email === inputData.email && user.password === inputData.password);
      }
    }
  }
);
