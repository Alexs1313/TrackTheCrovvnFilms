import AsyncStorage from '@react-native-async-storage/async-storage';
import { createContext, useContext, useState } from 'react';
import { achievements } from '../data/achievements';

export const StoreContext = createContext();

export const useStore = () => {
  return useContext(StoreContext);
};

export const StoreProvider = ({ children }) => {
  const [savedMovies, setSavedMovies] = useState([]);
  const [savedReviews, setSavedReviews] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [savedAchievements, setSavedAchievements] = useState(achievements);
  const [storedAchievements, setStoredAchievements] = useState(achievements);
  const [result, setResult] = useState(0);
  const [savedViewed, setSavedViewed] = useState([]);

  // wish

  const saveMovie = async (list, editMovie) => {
    try {
      const jsonValue = await AsyncStorage.getItem('movie');
      let parced = jsonValue !== null ? JSON.parse(jsonValue) : [];

      let updatedMovie;

      if (editMovie?.id) {
        updatedMovie = savedMovies.map(movie =>
          movie.id === editMovie.id ? list : movie,
        );
      } else {
        updatedMovie = [...parced, list];
      }

      await AsyncStorage.setItem('movie', JSON.stringify(updatedMovie));
    } catch (e) {
      console.error('Failed', e);
    }
  };

  const fetchMovies = async () => {
    try {
      const savedData = await AsyncStorage.getItem('movie');
      const parsed = JSON.parse(savedData);

      if (parsed != null) {
        setSavedMovies(parsed);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const removeMovie = async selectedId => {
    const jsonValue = await AsyncStorage.getItem('movie');
    let data = jsonValue != null ? JSON.parse(jsonValue) : [];
    const filtered = data.filter(item => item.id !== selectedId.id);

    setSavedMovies(filtered);
    await AsyncStorage.setItem('movie', JSON.stringify(filtered));
  };

  // liked

  const saveFavorite = async data => {
    try {
      const stored = await AsyncStorage.getItem('favorites');
      let favorites = stored !== null ? JSON.parse(stored) : [];

      const updatedFavorites = [...favorites, data];

      await AsyncStorage.setItem('favorites', JSON.stringify(updatedFavorites));
    } catch (e) {
      console.error('Failed', e);
    }
  };

  const fetchFavorites = async () => {
    try {
      const savedData = await AsyncStorage.getItem('favorites');
      const parsed = JSON.parse(savedData);

      if (parsed != null) {
        setFavorites(parsed);
      }
    } catch (error) {
      console.log(error);
    }
  };

  // review

  const saveReview = async (list, editMovie) => {
    try {
      const jsonValue = await AsyncStorage.getItem('review');
      let parced = jsonValue !== null ? JSON.parse(jsonValue) : [];

      let updatedMovie;

      if (editMovie?.id) {
        updatedMovie = savedReviews.map(movie =>
          movie.id === editMovie.id ? list : movie,
        );
      } else {
        updatedMovie = [...parced, list];
      }

      await AsyncStorage.setItem('review', JSON.stringify(updatedMovie));
    } catch (e) {
      console.error('Failed', e);
    }
  };

  const fetchReviews = async () => {
    try {
      const savedData = await AsyncStorage.getItem('review');
      const parsed = JSON.parse(savedData);

      if (parsed != null) {
        setSavedReviews(parsed);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const removeReview = async selectedId => {
    const jsonValue = await AsyncStorage.getItem('review');
    let data = jsonValue != null ? JSON.parse(jsonValue) : [];
    const filtered = data.filter(item => item.id !== selectedId.id);

    setSavedReviews(filtered);
    await AsyncStorage.setItem('review', JSON.stringify(filtered));
  };

  // achievements

  const saveAchievement = async data => {
    try {
      await AsyncStorage.setItem('achievements', JSON.stringify(data));
    } catch (e) {
      console.error('Failed', e);
    }
  };

  const fetchAchievements = async () => {
    try {
      const savedData = await AsyncStorage.getItem('achievements');
      const parsed = JSON.parse(savedData);

      if (parsed != null) {
        setStoredAchievements(parsed);
      }
    } catch (error) {
      console.log(error);
    }
  };

  // viewed

  const saveViewedMovie = async list => {
    try {
      const jsonValue = await AsyncStorage.getItem('viewed');
      let parced = jsonValue !== null ? JSON.parse(jsonValue) : [];

      const updatedMovie = [...parced, list];

      await AsyncStorage.setItem('viewed', JSON.stringify(updatedMovie));
    } catch (e) {
      console.error('Failed', e);
    }
  };

  const fetchViewedMovie = async () => {
    try {
      const savedData = await AsyncStorage.getItem('viewed');
      const parsed = JSON.parse(savedData);

      if (parsed != null) {
        setSavedViewed(parsed);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const removeViewedMovie = async selectedId => {
    const jsonValue = await AsyncStorage.getItem('viewed');
    let data = jsonValue != null ? JSON.parse(jsonValue) : [];
    const filtered = data.filter(item => item.id !== selectedId.id);

    setSavedViewed(filtered);
    await AsyncStorage.setItem('viewed', JSON.stringify(filtered));
  };

  const value = {
    saveMovie,
    fetchMovies,
    removeMovie,
    savedMovies,
    saveFavorite,
    fetchFavorites,
    favorites,
    saveReview,
    fetchReviews,
    removeReview,
    savedReviews,
    savedAchievements,
    setSavedAchievements,
    saveAchievement,
    fetchAchievements,
    storedAchievements,
    setResult,
    result,
    saveViewedMovie,
    fetchViewedMovie,
    removeViewedMovie,
    savedViewed,
  };

  return (
    <StoreContext.Provider value={value}>{children}</StoreContext.Provider>
  );
};
