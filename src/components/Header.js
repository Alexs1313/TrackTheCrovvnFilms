import { useNavigation } from '@react-navigation/native';
import {
  Dimensions,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

const { height } = Dimensions.get('window');

const Header = ({ onPress, title }) => {
  const navigation = useNavigation();

  return (
    <View>
      <LinearGradient
        colors={['#CB9920', '#FCCB00', '#FDF3C3']}
        start={{ x: 0, y: 0 }}
        end={{ x: 0.9, y: 0 }}
        style={styles.gradientHeaderBorder}
      >
        <View style={styles.hederContainer}>
          <TouchableOpacity
            activeOpacity={0.7}
            style={styles.backBtn}
            onPress={() => navigation.goBack()}
          >
            <Image source={require('../assets/icons/back.png')} />
          </TouchableOpacity>
          <View style={styles.headTextWrap}>
            <Image source={require('../assets/images/headerLogo.png')} />
            <Text style={styles.headerTitle}>{title}</Text>
          </View>
        </View>
      </LinearGradient>
    </View>
  );
};

const styles = StyleSheet.create({
  hederContainer: {
    marginHorizontal: 2,
    marginBottom: 2,
    backgroundColor: '#000000',
    borderRadius: 22,
    paddingTop: height * 0.062,
    paddingHorizontal: 12,
    paddingBottom: 20,
  },
  gradientHeaderBorder: {
    width: '100%',
    borderRadius: 22,
  },
  backBtn: {
    position: 'absolute',
    left: 8,
    top: height * 0.13,
  },
  headerTitle: {
    fontWeight: '700',
    fontSize: 24,
    textAlign: 'center',
    color: '#fff',
  },
  headTextWrap: { alignItems: 'center', gap: 10 },
});

export default Header;
