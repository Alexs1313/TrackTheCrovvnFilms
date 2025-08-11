import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useStore } from '../store/context';
import { useCallback, useEffect, useState } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';
import LottieView from 'lottie-react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const WatchedListCard = ({
  movie,
  setShowLargeCard,
  setSelectedMovie,
  screen,
  showMenu,
}) => {
  const [buttonColor, setButtonColor] = useState(true);
  const {
    fetchMovies,
    fetchFavorites,
    fetchViewedMovie,
    removeViewedMovie,
    saveViewedMovie,
  } = useStore();
  const [viewed, setViewed] = useState(false);

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

          console.log('timeout');
        }, 2);
      }
    }),
  );

  const renderViewed = async item => {
    const jsonValue = await AsyncStorage.getItem('viewed');

    const favoritesList = JSON.parse(jsonValue);

    if (favoritesList != null) {
      let data = favoritesList.find(fav => fav.id === item.id);

      return data == null ? setViewed(false) : setViewed(true);
    }
  };

  const renderFavorites = async item => {
    const jsonValue = await AsyncStorage.getItem('favorites');

    const favoritesList = JSON.parse(jsonValue);

    if (favoritesList != null) {
      let data = favoritesList.find(fav => fav.id === item.id);

      return data == null ? setButtonColor(false) : setButtonColor(true);
    }
  };

  const handleShowLargeCard = () => {
    setSelectedMovie(movie);
    setShowLargeCard(true);
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
      style={styles.cardListBorder}
    >
      <View style={styles.cardListContainer}>
        <View style={{ flexDirection: 'row' }}>
          <Image source={{ uri: movie.image }} style={styles.pickerImage} />
          {buttonColor && (
            <Image
              source={require('../assets/icons/liked.png')}
              style={{ position: 'absolute', left: 110, top: 5 }}
            />
          )}
          <View>
            <Text
              style={[
                styles.cardTitle,
                { textAlign: 'left', marginLeft: 10, fontSize: 12 },
                screen === 'Review' && { marginLeft: 10 },
              ]}
            >
              {movie.movie}
            </Text>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              {screen === 'Review' ? (
                <View>
                  <Text style={styles.cardDate}>
                    Expect: {movie.selectedDate}
                  </Text>
                </View>
              ) : (
                <>
                  <Text style={[styles.cardRating, { fontWeight: '500' }]}>
                    Rating:
                  </Text>
                  <View
                    style={[
                      styles.ratingWrapper,
                      {
                        gap: 1,
                        justifyContent: 'flex-start',
                        marginLeft: 10,
                        marginBottom: 0,
                      },
                    ]}
                  >
                    {[1, 2, 3, 4, 5].map(star => (
                      <View key={star}>
                        <View
                          style={[styles.crownContainer, { marginTop: 16 }]}
                        >
                          {star <= movie.rating ? (
                            <Image
                              source={require('../assets/icons/cardRate.png')}
                              style={{ width: 20, height: 30 }}
                            />
                          ) : (
                            <Image
                              source={require('../assets/icons/cardBluredRate.png')}
                              style={{ width: 20, height: 30 }}
                            />
                          )}
                        </View>
                      </View>
                    ))}
                  </View>
                </>
              )}
            </View>
          </View>
        </View>
        <View
          style={{
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Image source={require('../assets/images/gradient.png')} />
          {screen === 'Review' ? (
            <TouchableOpacity
              onPress={() => handleSaveViewed(movie)}
              style={{ alignItems: 'center', position: 'absolute' }}
            >
              <Image
                source={require('../assets/icons/check.png')}
                style={[
                  { marginTop: 16, marginBottom: 10 },
                  viewed ? { opacity: 1 } : { opacity: 0 },
                ]}
              />
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              style={{ alignItems: 'center', position: 'absolute' }}
              onPress={() => handleShowLargeCard(movie)}
            >
              <LottieView
                source={require('../assets/animations/arrow.json')}
                autoPlay
                style={{
                  width: 40,
                  height: 40,
                  transform: [{ rotate: '270deg' }],
                }}
              />
            </TouchableOpacity>
          )}
        </View>
      </View>
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
  cardListContainer: {
    flex: 1,
    margin: 2,
    backgroundColor: '#000000',
    borderBottomLeftRadius: 10,
    borderTopLeftRadius: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  cardListBorder: {
    width: '100%',
    borderRadius: 10,
    marginBottom: 10,
    justifyContent: 'flex-start',
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
    marginTop: 14,
    marginLeft: 10,
  },
  pickerImage: {
    width: 145,
    height: 105,
    borderTopLeftRadius: 10,
    borderBottomLeftRadius: 10,
  },
});

export default WatchedListCard;
