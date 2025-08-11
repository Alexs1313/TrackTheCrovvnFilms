import {
  Dimensions,
  Image,
  Platform,
  ScrollView,
  Share,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useCallback, useState } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';
import { BlurView } from '@react-native-community/blur';

import { useStore } from '../store/context';
import AppBackground from '../components/AppBackground';
import Header from '../components/Header';
import SmallButton from '../components/SmallButton';

const { height } = Dimensions.get('window');

const Achievement = () => {
  const [showInfo, setShowInfo] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [selectedCrown, setSelectedCrown] = useState(null);

  const {
    savedReviews,
    savedMovies,
    fetchMovies,
    savedAchievements,
    setSavedAchievements,
    fetchAchievements,
    storedAchievements,
    saveAchievement,
    result,
  } = useStore();

  useFocusEffect(
    useCallback(() => {
      fetchMovies();
    }, []),
  );

  useFocusEffect(
    useCallback(() => {
      fetchMovies();
      updateAchievements();
      fetchAchievements();
    }, []),
  );

  const correctAnswerPercentage = (result / 40) * 100;

  const updateAchievements = () => {
    const isUpdated = savedAchievements.map((achive, idx) => {
      if (savedMovies.length > 0 && idx === 0) {
        if (!achive.unlocked) return { ...achive, unlocked: true };
      } else if (savedReviews.length > 10 && idx === 1) {
        if (!achive.unlocked) return { ...achive, unlocked: true };
      } else if (savedReviews.length >= 3 && idx === 2) {
        if (!achive.unlocked) return { ...achive, unlocked: true };
      } else if (savedMovies.length >= 5 && idx === 3) {
        if (!achive.unlocked) return { ...achive, unlocked: true };
      } else if (correctAnswerPercentage >= 80 && idx === 5) {
        if (!achive.unlocked) return { ...achive, unlocked: true };
      } else if (savedReviews.length >= 50 && idx === 6) {
        if (!achive.unlocked) return { ...achive, unlocked: true };
      } else if (savedMovies.length >= 100 && idx === 8) {
        if (!achive.unlocked) return { ...achive, unlocked: true };
      }
      return achive;
    });

    setSavedAchievements(isUpdated);
    saveAchievement(isUpdated);
  };

  const handleShare = async () => {
    try {
      await Share.share({
        message: `You have reached ${selectedCrown.title}
${selectedCrown.description}`,
      });
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <AppBackground>
      <ScrollView showsVerticalScrollIndicator={false}>
        {(showInfo || showDetails) && (
          <BlurView style={styles.blurBg} blurType="dark" blurAmount={2} />
        )}
        <Header title={'Achievement'} />

        <View style={styles.crownsWrapper}>
          {storedAchievements.map((achievement, idx) => (
            <TouchableOpacity
              activeOpacity={0.7}
              key={idx}
              disabled={!achievement.unlocked}
              onPress={() => {
                setShowDetails(true), setSelectedCrown(achievement);
              }}
            >
              {Platform.OS === 'ios' && (
                <>
                  {!achievement.unlocked && (
                    <BlurView
                      style={styles.blur}
                      blurType="dark"
                      blurAmount={1}
                    />
                  )}
                </>
              )}
              <TouchableOpacity
                style={styles.infoBtn}
                activeOpacity={0.7}
                onPress={() => {
                  setShowInfo(true), setSelectedCrown(achievement);
                }}
              >
                <Image source={require('../assets/icons/info.png')} />
              </TouchableOpacity>

              <LinearGradient
                colors={['#CB9920', '#FCCB00', '#FDF3C3']}
                start={{ x: 0, y: 0 }}
                end={{ x: 0.9, y: 0 }}
                style={styles.gradientResBorder}
              >
                <View style={styles.resContainer}>
                  <Image
                    source={achievement.image}
                    style={[
                      styles.crownImage,
                      Platform.OS === 'android' && { opacity: 0.6 },
                    ]}
                  />
                </View>
              </LinearGradient>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.largeCardWrap}>
          {showInfo && (
            <LinearGradient
              colors={['#CB9920', '#FCCB00', '#FDF3C3']}
              start={{ x: 0, y: 0 }}
              end={{ x: 0.9, y: 0 }}
              style={[styles.largeCardBorder]}
            >
              <View style={styles.largeCardContainer}>
                <Image
                  source={selectedCrown.image}
                  style={[styles.crownImage]}
                />
                <TouchableOpacity
                  style={{ position: 'absolute', left: 8, top: 12 }}
                  onPress={() => setShowInfo(false)}
                  activeOpacity={0.7}
                >
                  <Image source={require('../assets/icons/back.png')} />
                </TouchableOpacity>
                <Image
                  source={require('../assets/images/horizontalLine.png')}
                  style={{ width: '100%' }}
                />

                <Text style={styles.cardTitle}>{selectedCrown.title}</Text>
                <Text style={styles.cardDescription}>
                  {selectedCrown.description}
                </Text>
              </View>
            </LinearGradient>
          )}

          {showDetails && (
            <LinearGradient
              colors={['#CB9920', '#FCCB00', '#FDF3C3']}
              start={{ x: 0, y: 0 }}
              end={{ x: 0.9, y: 0 }}
              style={[styles.largeCardBorder]}
            >
              <View style={styles.largeCardContainer}>
                <Image
                  source={selectedCrown.image}
                  style={[styles.crownImage]}
                />
                <TouchableOpacity
                  style={{ position: 'absolute', left: 8, top: 12 }}
                  onPress={() => setShowDetails(false)}
                  activeOpacity={0.7}
                >
                  <Image source={require('../assets/icons/back.png')} />
                </TouchableOpacity>
                <Image
                  source={require('../assets/images/horizontalLine.png')}
                  style={{ width: '100%' }}
                />

                <Text style={[styles.cardTitle, { fontSize: 16 }]}>
                  You have reached {selectedCrown.title}
                </Text>
                <Text style={styles.cardDescription}>
                  {selectedCrown.description}
                </Text>

                <SmallButton title={'Share'} onPress={handleShare} />
              </View>
            </LinearGradient>
          )}
        </View>
      </ScrollView>
    </AppBackground>
  );
};

const styles = StyleSheet.create({
  container: { paddingBottom: 30 },
  resContainer: {
    flex: 1,
    margin: 2,
    backgroundColor: '#000000',
    borderRadius: 16,
    paddingHorizontal: 17,
    alignItems: 'center',
    paddingHorizontal: 22,
  },
  gradientResBorder: {
    width: '100%',
    borderRadius: 16,
    marginBottom: 30,
  },
  resText: {
    fontWeight: '600',
    fontSize: 20,
    color: '#fff',
    textAlign: 'center',
    marginBottom: 70,
  },
  blur: {
    position: 'absolute',
    top: 3,
    left: 4,
    bottom: 33,
    right: 9,
    zIndex: 1,
    borderRadius: 10,
  },
  crownImage: {
    width: 130,
    height: 180,
  },
  crownsWrapper: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingHorizontal: 17,
    marginTop: 60,
  },
  infoBtn: {
    position: 'absolute',
    right: 7,
    top: 6,
    zIndex: 20,
  },
  largeCardContainer: {
    flex: 1,
    margin: 2,
    backgroundColor: '#000000',
    borderRadius: 10,
    paddingBottom: 15,
    alignItems: 'center',
  },
  largeCardBorder: {
    width: '100%',
    borderRadius: 10,
    marginBottom: 10,
    zIndex: 30,
  },
  cardTitle: {
    fontWeight: '700',
    fontSize: 24,
    color: '#fff',
    textAlign: 'center',
    marginTop: 13,
    marginBottom: 20,
  },
  cardDescription: {
    fontWeight: '400',
    fontSize: 15,
    color: '#fff',
    marginBottom: 40,
    textAlign: 'center',
  },
  largeCardWrap: {
    alignItems: 'center',
    position: 'absolute',
    width: '100%',
    paddingHorizontal: 30,
    top: height * 0.2,
  },
  blurBg: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
    zIndex: 10,
  },
});

export default Achievement;
