import React, { useContext} from 'react';

const LibraryContext = React.createContext<any>({});

export const useLibraryContext = () => useContext(LibraryContext);
export default LibraryContext;
