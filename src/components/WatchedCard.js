import {
  Image,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useStore } from '../store/context';
import { useCallback, useState } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';
import LottieView from 'lottie-react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const WatchedCard = ({
  movie,
  setShowLargeCard,
  setSelectedMovie,
  showMenu,
}) => {
  const [buttonColor, setButtonColor] = useState(
    Platform.OS === 'ios' ? true : false,
  );
  const { fetchMovies, fetchFavorites } = useStore();

  useFocusEffect(
    useCallback(() => {
      fetchMovies();
      fetchFavorites();
      renderFavorites(movie);
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

  const handleShowLargeCard = () => {
    setSelectedMovie(movie);
    setShowLargeCard(true);
  };

  return (
    <LinearGradient
      colors={['#CB9920', '#FCCB00', '#FDF3C3']}
      start={{ x: 0, y: 0 }}
      end={{ x: 0.9, y: 0 }}
      style={styles.cardBorder}
    >
      <View style={styles.cardContainer}>
        <Image source={{ uri: movie.image }} style={styles.pickerImage} />
        {buttonColor && (
          <Image
            source={require('../assets/icons/liked.png')}
            style={{ position: 'absolute', right: 5, top: 5 }}
          />
        )}

        <Text style={styles.cardTitle}>{movie.movie}</Text>
        <Text style={styles.cardRating}>Rating:</Text>

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
              <View style={[styles.crownContainer, { marginTop: 0 }]}>
                {star <= movie.rating ? (
                  <Image source={require('../assets/icons/cardRate.png')} />
                ) : (
                  <Image
                    source={require('../assets/icons/cardBluredRate.png')}
                    style={{ top: -1.9 }}
                  />
                )}
              </View>
            </View>
          ))}
        </View>
      </View>
      <TouchableOpacity
        style={{ alignItems: 'center' }}
        onPress={() => handleShowLargeCard()}
      >
        <LottieView
          source={require('../assets/animations/arrow.json')}
          autoPlay
          style={{ width: 40, height: 40 }}
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
  pickerImage: {
    width: '100%',
    height: 123,
    borderTopRightRadius: 10,
    borderTopLeftRadius: 10,
  },
});

export default WatchedCard;
