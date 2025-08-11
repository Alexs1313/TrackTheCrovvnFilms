import {
  Dimensions,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { useState } from 'react';

import AppBackground from '../components/AppBackground';
import { onboardData } from '../data/onboardData';
import MediumButton from '../components/MediumButton';
import { useNavigation } from '@react-navigation/native';

const { height } = Dimensions.get('window');

const Onboarding = () => {
  const [index, setIndex] = useState(0);
  const navigation = useNavigation();

  const handleNextStep = () => {
    index === 4 ? navigation.replace('Main') : setIndex(index + 1);
  };

  return (
    <AppBackground>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.container}>
          <Image source={onboardData[index].image} style={{ height: 500 }} />

          <LinearGradient
            colors={['#CB9920', '#FCCB00', '#FDF3C3']}
            start={{ x: 0, y: 0 }}
            end={{ x: 0.9, y: 0 }}
            style={styles.gradientBorder}
          >
            <View style={styles.innerContainer}>
              <View style={{ alignItems: 'center', justifyContent: 'center' }}>
                <Image source={onboardData[index].title} />
                <Text style={styles.title}>{onboardData[index].subtitle}</Text>
                <MediumButton
                  title={onboardData[index].buttonText}
                  style={{ width: '60%' }}
                  onPress={handleNextStep}
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
    fontWeight: '600',
    fontSize: 15,
    textAlign: 'center',
    color: '#fff',
    marginTop: 15,
    marginBottom: 41,
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

export default Onboarding;
