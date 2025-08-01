import { useState } from 'react';
import { smartSearch, searchFiles } from '../services/api';

export const useSearch = () => {
  const [context, setContext] = useState(null);
  
  const enhanceSearch = async (query) => {
    try {
      // First try smart search
      const { results, context } = await smartSearch(query);
      setContext(context || { 
        originalQuery: query,
        fileTypes: [],
        resultsCount: results.length 
      });
      return results;
    } catch (error) {
      console.log('Falling back to regular search');
      // Fallback to regular search
      const results = await searchFiles(query);
      setContext({
        originalQuery: query,
        fileTypes: [],
        resultsCount: results.length
      });
      return results;
    }
  };

  return {
    context,
    setContext,
    enhanceSearch
  };
};