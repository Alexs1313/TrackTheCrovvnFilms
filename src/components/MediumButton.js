import { StyleSheet, Text, TouchableOpacity } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

const MediumButton = ({
  title,
  style,
  onPress,
  textStyle,
  colors = ['#CB9920', '#FCCB00', '#FDF3C3'],
  isDisabled,
}) => {
  return (
    <TouchableOpacity
      activeOpacity={0.7}
      style={[{ width: '50%' }, style]}
      onPress={onPress}
      disabled={isDisabled}
    >
      <LinearGradient
        colors={colors}
        start={{ x: 0, y: 0 }}
        end={{ x: 0.9, y: 0 }}
        style={styles.button}
      >
        <Text style={[styles.buttonText, textStyle]}>{title}</Text>
      </LinearGradient>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    width: '100%',
    height: 60,
    borderRadius: 16.4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    fontWeight: '600',
    fontSize: 24,
    color: '#000000',
  },
});

export default MediumButton;
