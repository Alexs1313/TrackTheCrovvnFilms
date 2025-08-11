import { Dimensions, Image, ScrollView, StyleSheet, View } from 'react-native';
import AppBackground from './AppBackground';
import LottieView from 'lottie-react-native';

const { height } = Dimensions.get('window');

const Loader = () => {
  return (
    <AppBackground>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.container}>
          <Image source={require('../assets/images/loader.png')} />
          <LottieView
            source={require('../assets/animations/crown.json')}
            autoPlay
            style={{ width: 263, height: 199 }}
          />
        </View>
      </ScrollView>
    </AppBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    gap: height * 0.2,
    marginTop: height * 0.15,
  },
});

export default Loader;
