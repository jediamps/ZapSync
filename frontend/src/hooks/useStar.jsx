// hooks/useStar.js
import { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { activateStar, checkForStarred } from '../services/api'; 

const useStar = () => {
  const [isLoading, setIsLoading] = useState(false);

  const toggleStar = async (id, type, currentStarredState) => {
    setIsLoading(true);
    try {
      const response = await activateStar( id, type, !currentStarredState);
      
      return response.isStarred;
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update star status');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const checkStarred = async (id, type) => {
    try {
      const response = await checkForStarred(id, type);
      return response.isStarred;
    } catch (error) {
      console.error('Error checking star status:', error);
      return false;
    }
  };


  return { toggleStar, checkStarred, isLoading };
};

export default useStar;