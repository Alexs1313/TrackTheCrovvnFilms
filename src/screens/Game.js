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
import LinearGradient from 'react-native-linear-gradient';
import { useEffect, useRef, useState } from 'react';
import { useNavigation } from '@react-navigation/native';

import MediumButton from '../components/MediumButton';
import AppBackground from '../components/AppBackground';
import { quiz } from '../data/quiz';
import SmallButton from '../components/SmallButton';
import { useStore } from '../store/context';

const { height } = Dimensions.get('window');

const Game = () => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const navigation = useNavigation();
  const [isCorrect, setIsCorrect] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);
  const [isDisabled, setIsDisabled] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [timeLeft, setTimeLeft] = useState(15);
  const { result, setResult } = useStore();
  const intervalRef = useRef(null);

  const startTimer = () => {
    clearInterval(intervalRef.current);
    setTimeLeft(15);
    intervalRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(intervalRef.current);

          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  useEffect(() => {
    startTimer();

    return () => clearInterval(intervalRef.current);
  }, []);

  const formatTime = seconds => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  const handleSelectOption = selectedOption => {
    const isCorrectAnswer = quiz[currentQuestionIndex].answer == selectedOption;

    if (isCorrectAnswer) {
      setResult(result + 1);
    }

    setIsDisabled(true);
    setIsCorrect(isCorrectAnswer);

    setSelectedOption(selectedOption);

    if (currentQuestionIndex === quiz.length - 1) {
      setTimeout(() => {
        setShowResult(true);
      }, 1000);
    } else {
      setTimeout(() => {
        setCurrentQuestionIndex(currentQuestionIndex + 1);
        setIsCorrect(false);
        setIsDisabled(false);
        setSelectedOption(null);
        startTimer();
      }, 800);
    }
  };

  const handleShare = async () => {
    try {
      await Share.share({
        message: `Congratulations on completing the quiz, you have a great result.`,
      });
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <AppBackground>
      <ScrollView showsVerticalScrollIndicator={false} bounces={false}>
        <View style={styles.container}>
          <LinearGradient
            colors={['#CB9920', '#FCCB00', '#FDF3C3']}
            start={{ x: 0, y: 0 }}
            end={{ x: 0.9, y: 0 }}
            style={styles.gradientHeaderBorder}
          >
            <View style={styles.hederContainer}>
              {!showResult && (
                <>
                  <View style={styles.headerWrap}>
                    <Image source={require('../assets/icons/timer.png')} />
                    <Text style={styles.timerText}>{formatTime(timeLeft)}</Text>
                  </View>
                  <TouchableOpacity
                    activeOpacity={0.7}
                    style={styles.backBtn}
                    onPress={() => navigation.goBack()}
                  >
                    <Image source={require('../assets/icons/back.png')} />
                  </TouchableOpacity>
                </>
              )}

              <View style={styles.headTextWrap}>
                <Text style={styles.headerTitle}>
                  {!showResult
                    ? `Question ${currentQuestionIndex + 1}`
                    : 'Quiz'}
                </Text>
              </View>
            </View>
          </LinearGradient>

          {showResult ? (
            <View style={{ alignItems: 'center' }}>
              <Image source={require('../assets/images/quizRes.png')} />
              <LinearGradient
                colors={['#CB9920', '#FCCB00', '#FDF3C3']}
                start={{ x: 0, y: 0 }}
                end={{ x: 0.9, y: 0 }}
                style={styles.gradientResBorder}
              >
                <View style={styles.resContainer}>
                  <Text style={styles.resText}>
                    Congratulations on completing the quiz, you have a great
                    result.
                  </Text>

                  <View style={styles.buttonsWrap}>
                    <SmallButton title={'Share'} onPress={handleShare} />
                    <SmallButton
                      title={'Back to home'}
                      onPress={() => navigation.popToTop('Main')}
                    />
                  </View>
                </View>
              </LinearGradient>
            </View>
          ) : (
            <>
              <View style={{ alignItems: 'center' }}>
                <Text style={styles.question}>
                  {quiz[currentQuestionIndex].question}
                </Text>
              </View>

              <LinearGradient
                colors={['#CB9920', '#FCCB00', '#FDF3C3']}
                start={{ x: 0, y: 0 }}
                end={{ x: 0.9, y: 0 }}
                style={styles.gradientBorder}
              >
                <View style={styles.innerContainer}>
                  <View style={styles.btnWrapper}>
                    {quiz[currentQuestionIndex].options.map(option => (
                      <MediumButton
                        key={option}
                        title={option}
                        colors={
                          selectedOption === option
                            ? isCorrect
                              ? ['#00FF26', '#00FF26']
                              : ['#FF0000', '#FF0000']
                            : ['#CB9920', '#FCCB00', '#FDF3C3']
                        }
                        style={{ width: '100%', marginBottom: 44 }}
                        onPress={() => handleSelectOption(option)}
                        textStyle={styles.optionText}
                        isDisabled={isDisabled}
                      />
                    ))}
                  </View>
                </View>
              </LinearGradient>
            </>
          )}
        </View>
      </ScrollView>
    </AppBackground>
  );
};

const styles = StyleSheet.create({
  container: {},
  bottomWelcomeContainer: {
    paddingHorizontal: 44,
    paddingTop: 26,
    alignItems: 'center',
  },
  question: {
    fontWeight: '700',
    fontSize: 20,
    textAlign: 'center',
    color: '#fff',
    marginVertical: 73,
    width: '90%',
    height: 70,
  },
  headerTitle: {
    fontWeight: '700',
    fontSize: 24,
    textAlign: 'center',
    color: '#fff',
  },
  timerText: {
    fontWeight: '700',
    fontSize: 24,
    color: '#fff',
  },
  gradientBorder: {
    width: '100%',
    height: '100%',
    borderRadius: 16,
  },
  innerContainer: {
    flex: 1,
    margin: 2,
    backgroundColor: '#000000',
    borderRadius: 16,
    paddingTop: 68,
    paddingHorizontal: 53,
    paddingBottom: 30,
  },
  hederContainer: {
    marginHorizontal: 2,
    backgroundColor: '#000000',
    borderRadius: 22,
    paddingTop: height * 0.062,
    paddingHorizontal: 12,
    paddingBottom: 20,
    height: 165,
  },
  gradientHeaderBorder: {
    width: '100%',
    height: 167,
    borderRadius: 22,
  },
  backBtn: {
    position: 'absolute',
    left: 8,
    top: height * 0.11,
  },
  optionText: { fontWeight: '700', fontSize: 20 },
  headerWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    justifyContent: 'center',
  },
  resContainer: {
    flex: 1,
    margin: 2,
    backgroundColor: '#000000',
    borderRadius: 16,
    paddingTop: 40,
    paddingHorizontal: 17,
    paddingBottom: 30,
  },
  gradientResBorder: {
    width: '90%',
    borderRadius: 16,
    top: -60,
  },
  resText: {
    fontWeight: '600',
    fontSize: 20,
    color: '#fff',
    textAlign: 'center',
    marginBottom: 70,
  },
  buttonsWrap: { flexDirection: 'row', justifyContent: 'space-between' },
  btnWrapper: { alignItems: 'center', justifyContent: 'center' },
  headTextWrap: { alignItems: 'center', marginTop: 28 },
});

export default Game;
