import { BookItem, LibraryContext, libraryMachine, User } from "./../libraryMachine";

// constants
const testUserLoginInput = { email: 'test@com', password: 'test' };
const incorrectLoginInput = { email: 'wrong', password: 'wrong' };

const bookOne: BookItem = { id: 1, title: 'book one', quantity: 2, borrowed: 0}
const bookOne_notAvailable: BookItem = { id: 1, title: 'book one', quantity: 2, borrowed: 2}


// helpers
class ContextBuilder {
  private context: LibraryContext = {books: [], users: [], currentUser: undefined};

  logInUser(user: User): ContextBuilder {
    this.context.currentUser = JSON.parse(JSON.stringify(user));
    return this;
  }

  addUser(user: User): ContextBuilder {
    this.context.users.push(JSON.parse(JSON.stringify(user)));
    return this;
  }

  addBook(book: BookItem): ContextBuilder {
    this.context.books.push(JSON.parse(JSON.stringify(book)));
    return this;
  }

  create(): LibraryContext {
    return this.context;
  }
}

class UserBuilder {
  private user: User = {name: '', email: '', password: '', userBooks: []};

  constructor () {
    this.user.name = 'test';
    this.user.email = 'test@com';
    this.user.password = 'test';
  }

  assignBook(book: { id: number; title: string}): UserBuilder {
    this.user.userBooks.push({...book});
    return this;
  }

  create(): User{
    return this.user;
  }
}


// LOGIN action tests
it('should log in given "logged_out" when the "LOGIN" event occurs with correct user data', () => {

  const expectedValue = 'logged_in';

  const user = new UserBuilder().create();
  const context = new ContextBuilder().addUser(user).create();
  const machine = libraryMachine.withContext(context);

  const actualState = machine.transition('logged_out', { type: 'LOGIN', input: testUserLoginInput});

  expect(actualState.matches(expectedValue)).toBeTruthy();
});

it('should update context.currentUser property given "logged_out" when the "LOGIN" event occurs with correct user data', () => {

  const user = new UserBuilder().create();
  const context = new ContextBuilder().addUser(user).create();
  const machine = libraryMachine.withContext(context);

  const actualState = machine.transition('logged_out', { type: 'LOGIN', input: testUserLoginInput});
  
  expect(actualState.context.currentUser?.email).toBe(testUserLoginInput.email);
});

it('should not log in given "logged_out" when the "LOGIN" event occurs with incorrect user data', () => {

  const expectedValue = 'logged_in';

  const user = new UserBuilder().create();
  const context = new ContextBuilder().addUser(user).create();
  const machine = libraryMachine.withContext(context);

  const actualState = machine.transition('logged_out', { type: 'LOGIN', input: incorrectLoginInput});

  expect(actualState.matches(expectedValue)).toBeFalsy();
});


// LOGOUT action tests
it('should log out given "logged_in" when the "LOGOUT" event occurs', () => {

  const expectedValue = 'logged_out';

  const user = new UserBuilder().create();
  const context = new ContextBuilder().addUser(user).create();
  const machine = libraryMachine.withContext(context);

  const actualState = machine.transition('logged_in', { type: 'LOGOUT' });

  expect(actualState.matches(expectedValue)).toBeTruthy();
});

it('should update context.currentUser property "logged_in" when the "LOGOUT" event occurs', () => {

  const user = new UserBuilder().create();
  const context = new ContextBuilder().addUser(user).create();
  const machine = libraryMachine.withContext(context);

  const actualState = machine.transition('logged_in', { type: 'LOGOUT' });

  expect(actualState.context.currentUser).toBeUndefined();
});


// BORROW action tests
it('should update context when user has no book & book is available', () => {
  const user = new UserBuilder().create();
  const context = new ContextBuilder().addBook({...bookOne}).addUser(user).logInUser(user).create();
  const machine = libraryMachine.withContext(context);

  const bookItemIdToBorrow = 1;
  const bookStateBeforeUpdate_borrowed = machine.context.books.find( book => book.id === bookItemIdToBorrow)?.borrowed;
  const hasUserTheBook_before = machine.context.currentUser?.userBooks.some( book => book.id === bookItemIdToBorrow);

  const actualState = machine.transition( 'logged_in', {type: 'BORROW', bookItemId: bookItemIdToBorrow});

  const bookStateUpdated = actualState.context.books.find( book => book.id === bookItemIdToBorrow);
  const hasUserTheBook_after = machine.context.currentUser?.userBooks.some( book => book.id === bookItemIdToBorrow);
  
  expect(bookStateUpdated!.borrowed - 1).toBe(bookStateBeforeUpdate_borrowed);
  expect(hasUserTheBook_before).toBeFalsy();
  expect(hasUserTheBook_after).toBeTruthy();
});

it( 'should not update context when user already has a book with the same title as one to borrow & book is available', () => {
    const user = new UserBuilder().assignBook({...bookOne}).create();
    const context = new ContextBuilder().addBook({...bookOne}).addUser(user).logInUser(user).create();
    const machine = libraryMachine.withContext(context);

    const bookItemIdToBorrow = 1;
    const bookStateBeforeAction_borrowed = machine.context.books.find( book => book.id === bookItemIdToBorrow)?.borrowed;

    machine.transition( 'logged_in', {type: 'BORROW', bookItemId: bookItemIdToBorrow});

    const bookStateAfterAction_borrowed = machine.context.books.find( book => book.id === bookItemIdToBorrow)?.borrowed;

    expect(bookStateAfterAction_borrowed).toBe(bookStateBeforeAction_borrowed);
  }
);

it( 'should not update context when user with no book with the same title as one to borrow & book is not available', () => {
    const user = new UserBuilder().create();
    const context = new ContextBuilder().addBook({...bookOne_notAvailable}).addUser(user).logInUser(user).create();
    const machine = libraryMachine.withContext(context);

    const bookItemIdToBorrow = 1;
    const bookStateBeforeAction_borrowed = machine.context.books.find( book => book.id === bookItemIdToBorrow)?.borrowed;

    machine.transition( 'logged_in', {type: 'BORROW', bookItemId: bookItemIdToBorrow});

    const bookStateAfterAction_borrowed = machine.context.books.find( book => book.id === bookItemIdToBorrow)?.borrowed;

    expect(bookStateAfterAction_borrowed).toBe(bookStateBeforeAction_borrowed);
  }
);

it( 'should not update context when user already has a book with the same title as one to borrow & book is not available', () => {
    const user = new UserBuilder().assignBook({...bookOne_notAvailable}).create();
    const context = new ContextBuilder().addBook({...bookOne_notAvailable}).addUser(user).logInUser(user).create();
    const machine = libraryMachine.withContext(context);

    const bookItemIdToBorrow = 1;
    const bookStateBeforeAction_borrowed = machine.context.books.find( book => book.id === bookItemIdToBorrow)?.borrowed;

    machine.transition( 'logged_in', {type: 'BORROW', bookItemId: bookItemIdToBorrow});

    const bookStateAfterAction_borrowed = machine.context.books.find( book => book.id === bookItemIdToBorrow)?.borrowed;

    expect(bookStateAfterAction_borrowed).toBe(bookStateBeforeAction_borrowed);
  }
);


// RETURN action
it( 'should update context when user already has a book with the same title as one to return', 
  () => {
    const user = new UserBuilder().assignBook({...bookOne_notAvailable}).create();
    const context = new ContextBuilder().addBook({...bookOne_notAvailable}).addUser(user).logInUser(user).create();
    const machine = libraryMachine.withContext(context);

    const bookItemIdToReturn = 1;
    const bookStateBeforeAction_borrowed = machine.context.books.find( book => book.id === bookItemIdToReturn)?.borrowed;
    const currentUserBooks_before = machine.context.currentUser?.userBooks.some( book => book.id === bookItemIdToReturn);

    machine.transition( 'logged_in', {type: 'RETURN', bookItemId: bookItemIdToReturn});

    const bookStateAfterAction_borrowed = machine.context.books.find( book => book.id === bookItemIdToReturn)?.borrowed;
    const currentUserBooks_after = machine.context.currentUser?.userBooks.some( book => book.id === bookItemIdToReturn);
    
    expect(bookStateAfterAction_borrowed).toBe(bookStateBeforeAction_borrowed! - 1);
    expect(currentUserBooks_before).toBeTruthy();
    expect(currentUserBooks_after).toBeFalsy();
  }
);

it('should not update context when user has no book with the same title as one to return', () => {
  const user = new UserBuilder().create();
  const context = new ContextBuilder().addBook({...bookOne_notAvailable}).addUser(user).logInUser(user).create();
  const machine = libraryMachine.withContext(context);

  const bookItemIdToReturn = 1;
  const bookStateBeforeAction_borrowed = machine.context.books.find( book => book.id === bookItemIdToReturn)?.borrowed;

  machine.transition( 'logged_in', { type: 'RETURN', bookItemId: bookItemIdToReturn});

  const bookStateAfterAction_borrowed = machine.context.books.find( book => book.id === bookItemIdToReturn)?.borrowed;

  expect(bookStateAfterAction_borrowed).toBe(bookStateBeforeAction_borrowed);

})


// logged_out state
it('BORROW should not update context when user is logged out', () => {
  const user = new UserBuilder().create();
  const context = new ContextBuilder().addBook({...bookOne}).addUser(user).create();
  const machine = libraryMachine.withContext(context);

  const bookItemIdToBorrow = 1;
  const bookStateBeforeAction_borrowed = machine.context.books.find( book => book.id === bookItemIdToBorrow)?.borrowed;

  machine.transition( 'logged_out', {type: 'BORROW', bookItemId: bookItemIdToBorrow});

  const bookStateAfterAction_borrowed = machine.context.books.find( book => book.id === bookItemIdToBorrow)?.borrowed;

  expect(bookStateAfterAction_borrowed).toBe(bookStateBeforeAction_borrowed);
});

it('RETURN should not update context when user is logged out', () => {
  const user = new UserBuilder().assignBook({...bookOne_notAvailable}).create();
  const context = new ContextBuilder().addBook({...bookOne_notAvailable}).addUser(user).create();
  const machine = libraryMachine.withContext(context);

  const bookItemIdToReturn = 1;
  const bookStateBeforeAction_borrowed = machine.context.books.find( book => book.id === bookItemIdToReturn)?.borrowed;

  machine.transition( 'logged_out', {type: 'RETURN', bookItemId: bookItemIdToReturn});

  const bookStateAfterAction_borrowed = machine.context.books.find( book => book.id === bookItemIdToReturn)?.borrowed;

  expect(bookStateAfterAction_borrowed).toBe(bookStateBeforeAction_borrowed);
});
