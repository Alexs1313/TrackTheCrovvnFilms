import {
  Dimensions,
  Image,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  PanResponder,
  Animated,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { useCallback, useEffect, useRef, useState } from 'react';
import Orientation from 'react-native-orientation-locker';
import { BlurView } from '@react-native-community/blur';
import { useFocusEffect, useNavigation } from '@react-navigation/native';

import AppBackground from '../components/AppBackground';
import { useStore } from '../store/context';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { height } = Dimensions.get('window');

const BUTTONS = ['Movies watched', 'Achievement', 'Quiz', 'Plans for review'];
const ANIMATION_DURATION = 90;

const Main = () => {
  const [index, setIndex] = useState(0);
  const animation = useRef(new Animated.Value(0)).current;
  const navigation = useNavigation();
  const {
    fetchMovies,
    savedMovies,
    savedAchievements,
    setSavedAchievements,
    savedReviews,
    saveAchievement,
    result,
  } = useStore();

  useEffect(() => {
    Orientation.lockToPortrait();
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchMovies();
      updateAchievements();
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
      } else if (savedMovies.length >= 1 && idx === 8) {
        if (!achive.unlocked) return { ...achive, unlocked: true };
      }
      return achive;
    });

    setSavedAchievements(isUpdated);
    saveAchievement(isUpdated);
  };

  const animateSwitch = direction => {
    Animated.timing(animation, {
      toValue: direction * 900,
      duration: ANIMATION_DURATION,
      useNativeDriver: true,
    }).start(() => {
      animation.setValue(0);

      setIndex(prev => {
        const newIndex = (prev + direction + BUTTONS.length) % BUTTONS.length;
        return newIndex;
      });
    });
  };
  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, gestureState) =>
        Math.abs(gestureState.dy) > 20,
      onPanResponderRelease: (_, gestureState) => {
        if (gestureState.dy < -20) animateSwitch(1);
        else if (gestureState.dy > 20) animateSwitch(-1);
      },
    }),
  ).current;

  const getItem = offset => {
    const newIndex = (index + offset + BUTTONS.length) % BUTTONS.length;
    return BUTTONS[newIndex];
  };

  const translateY = animation.interpolate({
    inputRange: [-100, 0, 100],
    outputRange: [-100, 0, 100],
  });

  const handleNavigate = screen => {
    switch (screen) {
      case 'Movies watched':
        navigation.navigate('Watched');
        break;
      case 'Quiz':
        navigation.navigate('Quiz');
        break;
      case 'Plans for review':
        navigation.navigate('Review');
        break;
      case 'Achievement':
        navigation.navigate('Achievement');
        break;
      default:
        break;
    }
  };

  return (
    <AppBackground>
      <View>
        <View style={{ alignItems: 'center', marginTop: height * 0.06 }}>
          <Image
            source={require('../assets/images/main.png')}
            style={styles.logo}
          />
        </View>

        <View style={styles.container} {...panResponder.panHandlers}>
          <Animated.View
            style={[styles.stack, { transform: [{ translateY }] }]}
          >
            {[-1, 0, 1].map((offset, i) => {
              const label = getItem(offset);
              const isCenter = offset === 0;

              return (
                <TouchableOpacity
                  key={i}
                  activeOpacity={0.9}
                  style={[
                    styles.button,
                    isCenter ? styles.centerButton : styles.sideButton,
                    { overflow: 'hidden' },
                  ]}
                  onPress={() => {
                    if (offset === -1) animateSwitch(-1);
                    if (offset === 1) animateSwitch(1);
                    handleNavigate(label);
                  }}
                >
                  <LinearGradient
                    colors={['#CB9920', '#FCCB00', '#FDF3C3']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 0.9, y: 0 }}
                    style={[
                      styles.gradientBorder,
                      !isCenter && { marginHorizontal: 55 },
                    ]}
                  >
                    {!isCenter && (
                      <BlurView
                        style={StyleSheet.absoluteFill}
                        blurType="dark"
                        blurAmount={10}
                      />
                    )}
                    <View style={[styles.innerContainer]}>
                      <Text
                        style={[
                          styles.text,
                          {
                            fontSize: isCenter ? 22 : 16,
                            opacity: isCenter ? 1 : 0.2,
                          },
                        ]}
                      >
                        {label}
                      </Text>
                    </View>
                  </LinearGradient>
                </TouchableOpacity>
              );
            })}
          </Animated.View>
        </View>
      </View>
    </AppBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 500,
    overflow: 'hidden',
    justifyContent: 'center',
    padding: 17,
    marginTop: 30,
  },
  stack: {
    height: 300,
    justifyContent: 'center',
  },
  centerButton: {
    transform: [{ scale: 1.1 }],
  },
  sideButton: {
    transform: [{ scale: 0.9 }],
  },
  text: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 24,
  },
  gradientBorder: {
    borderRadius: 22,
    marginBottom: 20,
    marginHorizontal: 20,
    overflow: 'hidden',
  },
  innerContainer: {
    margin: 3,
    backgroundColor: '#000000',
    borderRadius: 22,
    height: 117,
    alignItems: 'center',
    justifyContent: 'center',
  },
  button: { overflow: 'hidden' },
});

export default Main;
