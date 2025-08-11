import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useStore } from '../store/context';
import { useCallback, useState } from 'react';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';

import AsyncStorage from '@react-native-async-storage/async-storage';

const ReviewCard = ({ movie }) => {
  const [buttonColor, setButtonColor] = useState(true);
  const {
    fetchMovies,
    fetchFavorites,
    removeReview,
    saveFavorite,
    saveViewedMovie,
    removeViewedMovie,
    fetchViewedMovie,
  } = useStore();
  const [showMenu, setShowMenu] = useState(false);
  const [viewed, setViewed] = useState(false);
  const navigation = useNavigation();

  useFocusEffect(
    useCallback(() => {
      fetchMovies();
      fetchFavorites();
      renderFavorites(movie);
      renderViewed(movie);
      fetchViewedMovie();
    }, []),
  );

  useFocusEffect(
    useCallback(() => {
      if (showMenu) {
        setTimeout(() => {
          fetchFavorites();
          renderFavorites(movie);
        }, 2);
      }
    }),
  );

  const renderFavorites = async item => {
    const jsonValue = await AsyncStorage.getItem('favorites');

    const favoritesList = JSON.parse(jsonValue);

    if (favoritesList != null) {
      let data = favoritesList.find(fav => fav.id === item.id);

      return data == null ? setButtonColor(false) : setButtonColor(true);
    }
  };

  const renderViewed = async item => {
    const jsonValue = await AsyncStorage.getItem('viewed');

    const favoritesList = JSON.parse(jsonValue);

    if (favoritesList != null) {
      let data = favoritesList.find(fav => fav.id === item.id);

      return data == null ? setViewed(false) : setViewed(true);
    }
  };

  const handleDeleteMovie = () => {
    removeReview(movie);
    setShowMenu(false);
  };

  const handleSaveFavorites = item => {
    saveFavorite(item);
    handleCloseModal();
  };

  const handleCloseModal = () => {
    fetchFavorites();

    setTimeout(() => {
      setShowMenu(false);
    }, 5000);
  };

  const handleSaveViewed = item => {
    if (viewed) {
      removeViewedMovie(item);
      setViewed(false);
    } else {
      saveViewedMovie(item);
      setViewed(true);
    }
  };

  return (
    <LinearGradient
      colors={['#CB9920', '#FCCB00', '#FDF3C3']}
      start={{ x: 0, y: 0 }}
      end={{ x: 0.9, y: 0 }}
      style={styles.cardBorder}
    >
      <View style={styles.cardContainer}>
        <Image
          source={{ uri: movie.image }}
          style={{
            width: '100%',
            height: 123,
            borderTopRightRadius: 10,
            borderTopLeftRadius: 10,
          }}
        />
        {buttonColor && (
          <Image
            source={require('../assets/icons/liked.png')}
            style={{ position: 'absolute', left: 5, top: 5 }}
          />
        )}

        <TouchableOpacity
          style={{ position: 'absolute', right: 5, top: 5 }}
          activeOpacity={0.7}
          onPress={() => setShowMenu(!showMenu)}
        >
          <Image source={require('../assets/icons/cardMenu.png')} />
        </TouchableOpacity>

        {showMenu && (
          <View style={styles.menu}>
            <TouchableOpacity
              activeOpacity={0.8}
              style={styles.menuWrap}
              onPress={handleDeleteMovie}
            >
              <Image
                source={require('../assets/icons/delete.png')}
                style={styles.icon}
              />
              <Text style={styles.menuText}>Delete</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => handleSaveFavorites(movie)}
              activeOpacity={0.8}
              style={[styles.menuWrap, { gap: 6 }]}
            >
              <Image
                source={require('../assets/icons/like.png')}
                style={[styles.icon, { width: 12, height: 10 }]}
              />
              <Text style={styles.menuText}>Like</Text>
            </TouchableOpacity>
            <TouchableOpacity
              activeOpacity={0.8}
              style={[styles.menuWrap, { gap: 10, borderBottomWidth: 0 }]}
              onPress={() => {
                navigation.navigate('AddReview', movie), setShowMenu(false);
              }}
            >
              <Image
                source={require('../assets/icons/edit.png')}
                style={styles.icon}
              />
              <Text style={styles.menuText}>Edit</Text>
            </TouchableOpacity>
          </View>
        )}
        <Text style={styles.cardTitle}>{movie.movie}</Text>
        <Text style={styles.cardDate}>Expect:</Text>

        <Text style={styles.cardRating}>{movie.selectedDate}</Text>
      </View>
      <TouchableOpacity
        activeOpacity={0.7}
        onPress={() => handleSaveViewed(movie)}
        style={{ alignItems: 'center' }}
      >
        <Image
          source={require('../assets/icons/check.png')}
          style={[
            { marginTop: 16, marginBottom: 10 },
            viewed ? { opacity: 1 } : { opacity: 0 },
          ]}
        />
      </TouchableOpacity>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  crownContainer: {
    borderRadius: 100,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 30,
    marginBottom: 20,
  },
  ratingWrapper: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 31,
    gap: 24,
  },
  cardContainer: {
    flex: 1,
    margin: 2,
    backgroundColor: '#000000',
    borderTopRightRadius: 10,
    borderTopLeftRadius: 10,
    paddingBottom: 26,
  },
  cardBorder: {
    width: '48%',
    borderRadius: 10,
    marginBottom: 10,
  },
  cardTitle: {
    fontWeight: '600',
    fontSize: 10,
    color: '#fff',
    textAlign: 'center',
    marginTop: 10,
    marginBottom: 5,
  },
  cardRating: {
    fontWeight: '400',
    fontSize: 10,
    color: '#fff',
    marginBottom: 5,
    marginLeft: 10,
  },
  cardDate: {
    fontWeight: '400',
    fontSize: 12,
    color: '#fff',
    marginBottom: 5,
    marginLeft: 10,
  },

  menuText: {
    fontWeight: '600',
    fontSize: 7.5,
    color: '#fff',
  },
  menu: {
    width: 60,
    height: 70,
    backgroundColor: '#262424',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#000',
    position: 'absolute',
    right: 3,
    top: 30,
  },
  menuWrap: {
    flexDirection: 'row',
    gap: 9,
    borderBottomWidth: 1,
    marginTop: 4,
    paddingBottom: 7,
    paddingHorizontal: 8,
  },
  alertWrapper: {
    alignItems: 'center',
    position: 'absolute',
    width: '100%',
    paddingHorizontal: 30,
    top: 300,
  },
  icon: {
    width: 8,
    height: 11,
  },
});

export default ReviewCard;
