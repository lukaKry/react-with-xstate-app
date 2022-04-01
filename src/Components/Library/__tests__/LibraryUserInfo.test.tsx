import { libraryMachine } from '../libraryMachine';
import LibraryUserInfo from '../LibraryUserInfo';
import { cleanup, render } from '@testing-library/react';
import { useContext } from 'react';
import LibraryContext from '../LibraryContext';

afterEach(cleanup);


// mockujesz useContext ma zwracać obiekt maszyny
// jak to zrobićć?!?!?!?
const machine = { context: { currentUser: { name: 'Tom', email: 'tom@com.pl', userBooks:[{id: 1, title: 'bookOne'}]}}};
const context = machine.context;
const send = () => {};
const contextValue = { context, send };



// jest.spyOn<any,any>(LibraryContext, 'useLibraryContext').mockImplementation(() => contextValue);


// korzystać z describe celem systematyki i uporządkowania kodu testowego 
describe('Library User Info component', ()=>{
  it('should render user`s name, email and books list', () => {

    // jest.mock('../LibraryContext', () => ({
    //   useLibraryContext: jest.fn(()=>useContext(LibraryContext))
    // }));

    const renderResult = render(
        <LibraryUserInfo/>
    ); 
  
    expect(renderResult.getByText(/Tom/)).toBeDefined();
    expect(renderResult.getByText(/tom@com.pl/)).toBeDefined();
    expect(renderResult.getByText(/bookOne/)).toBeDefined();
    expect(renderResult.getByTestId('user-books-1').children.length).toBe(1);
  });


});




