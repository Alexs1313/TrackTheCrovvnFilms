import {
  Dimensions,
  Image,
  ScrollView,
  Share,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useCallback, useState } from 'react';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import SegmentedControl from 'react-native-segmented-control-2';
import LinearGradient from 'react-native-linear-gradient';
import { BlurView } from '@react-native-community/blur';

import { useStore } from '../store/context';
import AppBackground from '../components/AppBackground';
import Header from '../components/Header';
import AddButton from '../components/AddButton';
import SmallButton from '../components/SmallButton';
import WatchedCard from '../components/WatchedCard';
import WatchedListCard from '../components/WatchedListCard';

const { height } = Dimensions.get('window');

const Watched = () => {
  const [selectedTab, setSelectedTab] = useState(0);
  const navigation = useNavigation();
  const [showLargeCard, setShowLargeCard] = useState(false);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [showMenu, setShowMenu] = useState(false);
  const [showAlert, setShowAlert] = useState(false);

  const {
    fetchMovies,
    removeMovie,
    savedMovies,
    saveFavorite,
    fetchFavorites,
  } = useStore();

  useFocusEffect(
    useCallback(() => {
      fetchMovies();
    }, []),
  );

  const handleShare = async () => {
    try {
      await Share.share({
        message: `${selectedMovie.movie}
Rating: ${selectedMovie.rating}
${selectedMovie.description}`,
      });
    } catch (error) {
      alert(error.message);
    }

    setShowLargeCard(false);
    setShowMenu(false);
  };

  const handleDeleteMovie = () => {
    removeMovie(selectedMovie);
    setShowLargeCard(false);
    setShowMenu(false);
    setShowAlert(false);
  };

  const handleSaveFavorites = () => {
    saveFavorite(selectedMovie);
    handleCloseModal();
  };

  const handleCloseModal = () => {
    fetchFavorites();

    setShowLargeCard(false);

    setShowAlert(false);

    setTimeout(() => {
      setShowMenu(false);
    }, 5000);
  };

  return (
    <AppBackground>
      <ScrollView showsVerticalScrollIndicator={false} bounces={false}>
        {showLargeCard && (
          <BlurView style={styles.blurBg} blurType="dark" blurAmount={2} />
        )}
        <Header title={'Movies watched'} />
        <View style={styles.container}>
          <View>
            <View style={{ alignItems: 'center' }}>
              <SegmentedControl
                style={[
                  styles.segmentControl,
                  savedMovies.length !== 0 && { marginBottom: 40 },
                ]}
                gap={0.1}
                activeTabColor="#fff"
                activeTextColor="#000"
                textStyle={[styles.segmentControlText]}
                tabs={['Column', 'List']}
                selectedTabStyle={{
                  borderRadius: 22,
                }}
                onChange={index => setSelectedTab(index)}
              />
            </View>

            {selectedTab === 0 ? (
              <View style={styles.cardsWrapper}>
                {savedMovies.map((movie, idx) => (
                  <WatchedCard
                    movie={movie}
                    setShowLargeCard={setShowLargeCard}
                    setSelectedMovie={setSelectedMovie}
                    selectedMovie={selectedMovie}
                    key={idx}
                    showLargeCard={showLargeCard}
                    showMenu={showMenu}
                    setShowMenu={setShowMenu}
                    handleCloseModal={handleCloseModal}
                  />
                ))}
              </View>
            ) : (
              <View
                style={{
                  paddingHorizontal: 15,
                }}
              >
                {savedMovies.map((movie, idx) => (
                  <WatchedListCard
                    movie={movie}
                    setShowLargeCard={setShowLargeCard}
                    setSelectedMovie={setSelectedMovie}
                    selectedMovie={selectedMovie}
                    key={idx}
                    showLargeCard={showLargeCard}
                    showMenu={showMenu}
                  />
                ))}
              </View>
            )}

            <View
              style={[
                { alignItems: 'center' },
                savedMovies.length !== 0 && { marginTop: 74 },
              ]}
            >
              <AddButton
                title={'Add a movie'}
                onPress={() => navigation.navigate('AddMovie')}
              />
            </View>
          </View>
        </View>
        <View style={styles.largeCardWrap}>
          {showLargeCard && (
            <LinearGradient
              colors={['#CB9920', '#FCCB00', '#FDF3C3']}
              start={{ x: 0, y: 0 }}
              end={{ x: 0.9, y: 0 }}
              style={[styles.largeCardBorder, showAlert && { zIndex: 0 }]}
            >
              <View style={styles.largeCardContainer}>
                <Image
                  source={{ uri: selectedMovie.image }}
                  style={styles.largeCardImage}
                />
                <TouchableOpacity
                  style={{ position: 'absolute', right: 14, top: 12 }}
                  activeOpacity={0.7}
                  onPress={() => setShowMenu(!showMenu)}
                >
                  <Image source={require('../assets/icons/details.png')} />
                </TouchableOpacity>
                {showMenu && (
                  <View style={styles.menu}>
                    <TouchableOpacity
                      activeOpacity={0.8}
                      style={styles.menuWrap}
                      onPress={() => setShowAlert(true)}
                    >
                      <Image source={require('../assets/icons/delete.png')} />
                      <Text style={styles.menuText}>Delete</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={handleSaveFavorites}
                      activeOpacity={0.8}
                      style={[styles.menuWrap, { gap: 11 }]}
                    >
                      <Image source={require('../assets/icons/like.png')} />
                      <Text style={styles.menuText}>Like</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      activeOpacity={0.8}
                      style={[styles.menuWrap, { gap: 15 }]}
                      onPress={() => {
                        navigation.navigate('AddMovie', selectedMovie),
                          setShowLargeCard(false);
                        setShowMenu(false);
                      }}
                    >
                      <Image source={require('../assets/icons/edit.png')} />
                      <Text style={styles.menuText}>Edit</Text>
                    </TouchableOpacity>
                  </View>
                )}

                <Text style={styles.largeCardTitle}>{selectedMovie.movie}</Text>

                <View style={{ flexDirection: 'row', gap: 17 }}>
                  <Text style={styles.largeCardRating}>Rating:</Text>

                  <View style={[styles.ratingWrapper, styles.rating]}>
                    {[1, 2, 3, 4, 5].map(star => (
                      <View key={star}>
                        <View
                          style={[
                            styles.crownContainer,
                            { marginTop: 0, marginBottom: 0 },
                          ]}
                        >
                          {star <= selectedMovie.rating ? (
                            <Image
                              source={require('../assets/icons/cardRate.png')}
                            />
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
                <Image
                  source={require('../assets/images/horizontalLine.png')}
                  style={{ width: '100%' }}
                />
                <Text style={styles.largeCardDescription}>
                  {selectedMovie.description}
                </Text>
                <View style={{ alignItems: 'center' }}>
                  <SmallButton title={'Share'} onPress={() => handleShare()} />
                </View>
              </View>
            </LinearGradient>
          )}
        </View>

        {showAlert && (
          <View style={styles.alertWrapper}>
            <LinearGradient
              colors={['#CB9920', '#FCCB00', '#FDF3C3']}
              start={{ x: 0, y: 0 }}
              end={{ x: 0.9, y: 0 }}
              style={styles.gradientResBorder}
            >
              <View style={styles.resContainer}>
                <Text style={styles.resText}>
                  Are you sure you want to delete?
                </Text>

                <View style={styles.buttonsWrap}>
                  <SmallButton title={'Yes'} onPress={handleDeleteMovie} />
                  <SmallButton
                    title={'No'}
                    onPress={() => setShowAlert(false)}
                  />
                </View>
              </View>
            </LinearGradient>
          </View>
        )}
      </ScrollView>
    </AppBackground>
  );
};

const styles = StyleSheet.create({
  container: { paddingBottom: 30 },
  segmentControl: {
    marginTop: 17,
    marginBottom: 92,
    backgroundColor: '#000000',
    borderRadius: 22,
    height: 44,
    width: '70%',
    borderColor: '#FCCB00',
    borderWidth: 1,
  },
  segmentControlText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
  resContainer: {
    flex: 1,
    margin: 2,
    backgroundColor: '#000000',
    borderRadius: 16,
    paddingHorizontal: 17,
    paddingTop: 30,
    paddingBottom: 18,
  },
  cardsWrapper: {
    paddingHorizontal: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
  },
  gradientResBorder: {
    width: '90%',
    borderRadius: 16,
    zIndex: 20,
  },
  resText: {
    fontWeight: '600',
    fontSize: 20,
    color: '#fff',
    textAlign: 'center',
    marginBottom: 70,
  },
  notificationText: {
    fontWeight: '700',
    fontSize: 13,
    color: '#fff',
    textAlign: 'center',
    width: 220,
  },
  buttonsWrap: {
    justifyContent: 'space-around',
    alignItems: 'center',
    marginLeft: 6,
  },
  blurBg: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
    zIndex: 10,
  },
  buttonsWrap: { flexDirection: 'row', justifyContent: 'space-between' },
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
  largeCardContainer: {
    flex: 1,
    margin: 2,
    backgroundColor: '#000000',
    borderRadius: 26,
    paddingBottom: 15,
  },
  largeCardBorder: {
    width: '100%',
    borderRadius: 26,
    marginBottom: 10,
    zIndex: 30,
  },
  largeCardImage: {
    width: '100%',
    height: 173,
    borderTopRightRadius: 26,
    borderTopLeftRadius: 26,
  },
  largeCardTitle: {
    fontWeight: '600',
    fontSize: 16,
    color: '#fff',
    textAlign: 'center',
    marginTop: 10,
    marginBottom: 20,
  },
  largeCardRating: {
    fontWeight: '500',
    fontSize: 14,
    color: '#fff',
    marginBottom: 16,
    marginLeft: 14,
  },
  largeCardDescription: {
    fontWeight: '700',
    fontSize: 14,
    color: '#fff',
    marginBottom: 16,
    marginLeft: 14,
    marginTop: 26,
    marginBottom: 100,
  },
  menuText: {
    fontWeight: '600',
    fontSize: 13,
    color: '#fff',
  },
  menu: {
    width: 102,
    height: 129,
    backgroundColor: '#262424',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#000',
    position: 'absolute',
    right: 5,
    top: 50,
  },
  menuWrap: {
    flexDirection: 'row',
    gap: 17,
    borderBottomWidth: 1,
    marginTop: 13,
    paddingBottom: 10,
    paddingHorizontal: 8,
  },
  alertWrapper: {
    alignItems: 'center',
    position: 'absolute',
    width: '100%',
    paddingHorizontal: 30,
    top: 300,
  },
  rating: {
    gap: 1,
    justifyContent: 'flex-start',
    marginLeft: 10,
    marginBottom: 0,
    top: -8,
  },
  largeCardWrap: {
    alignItems: 'center',
    position: 'absolute',
    width: '100%',
    paddingHorizontal: 30,
    top: height * 0.2,
  },
});

export default Watched;
