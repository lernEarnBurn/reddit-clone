import React, { useState, useEffect } from 'react';
import {
  collection,
  query,
  where,
  getDocs,
  getFirestore,
  DocumentData,
} from 'firebase/firestore';

import { Link } from 'react-router-dom';

const SearchBar: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<DocumentData[]>([]);

  useEffect(() => {
    const search = async () => {
      if (searchQuery.trim() === '') {
        setSearchResults([]);
        return;
      }

      const q = query(
        collection(getFirestore(), 'subgeddits'),
        where('name', '>=', searchQuery),
        where('name', '<=', searchQuery + '\uf8ff')
      );

      const snapshot = await getDocs(q);
      const results = snapshot.docs.map((doc) => doc.data());

      setSearchResults(results);
    };

    search();
  }, [searchQuery]);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  };

  function clearInput() {
    setSearchQuery('');
  }
  return (
    <div className="ml-60 flex-col items-center justify-center">
      <input
        className=" flex h-10 w-[32vw] rounded-md border border-gray-900 border-input  bg-transparent px-3 py-2 text-sm font-medium text-gray-200 ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus:border-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
        placeholder="Search Geddit"
        type="text"
        value={searchQuery}
        onChange={handleInputChange}
      />
      <ul className="absolute top-14 rounded-sm">
        {searchResults.map((result) => (
          <li
            key={result.name}
            className={` flex h-8 w-[32vw] items-center justify-center overflow-visible rounded-sm bg-gray-800 hover:bg-gray-900`}
          >
            <Link
              onClick={clearInput}
              to={`/subgeddits/${result.name}`}
              className="text-center text-gray-300"
            >
              {result.name}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SearchBar;
