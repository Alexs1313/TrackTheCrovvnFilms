import {
  Dimensions,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { useNavigation } from '@react-navigation/native';

import AppBackground from '../components/AppBackground';
import { onboardData } from '../data/onboardData';
import MediumButton from '../components/MediumButton';

const { height } = Dimensions.get('window');

const Quiz = () => {
  const navigation = useNavigation();

  return (
    <AppBackground>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.container}>
          <Image source={onboardData[4].image} />

          <LinearGradient
            colors={['#CB9920', '#FCCB00', '#FDF3C3']}
            start={{ x: 0, y: 0 }}
            end={{ x: 0.9, y: 0 }}
            style={styles.gradientBorder}
          >
            <View style={styles.innerContainer}>
              <View style={{ alignItems: 'center', justifyContent: 'center' }}>
                <Text style={styles.title}>
                  You will have 5 questions with 4 correct answers. You need to
                  answer them in 15 seconds.
                </Text>
                <MediumButton
                  title={'Start'}
                  style={{ width: '60%' }}
                  onPress={() => navigation.navigate('Game')}
                />
              </View>
            </View>
          </LinearGradient>
        </View>
      </ScrollView>
    </AppBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginTop: height * 0.044,
  },
  bottomWelcomeContainer: {
    paddingHorizontal: 44,
    paddingTop: 26,
    alignItems: 'center',
  },
  title: {
    fontWeight: '500',
    fontSize: 20,
    textAlign: 'center',
    color: '#fff',
    marginTop: 50,
    marginBottom: 86,
  },
  gradientBorder: {
    width: '100%',
    height: '100%',
    borderRadius: 12,
  },
  innerContainer: {
    flex: 1,
    margin: 3,
    backgroundColor: '#000000',
    borderRadius: 10,
    paddingTop: 26,
    paddingHorizontal: 46,
    paddingBottom: 30,
  },
});

export default Quiz;
