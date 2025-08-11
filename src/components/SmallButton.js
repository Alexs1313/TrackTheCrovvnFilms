import { StyleSheet, Text, TouchableOpacity } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

const SmallButton = ({
  title,
  style,
  onPress,
  textStyle,
  colors = ['#CB9920', '#FCCB00', '#FDF3C3'],
  isDisabled,
  height,
}) => {
  return (
    <TouchableOpacity
      activeOpacity={0.7}
      style={[{ width: '40%' }, style]}
      onPress={onPress}
      disabled={isDisabled}
    >
      <LinearGradient
        colors={colors}
        start={{ x: 0, y: 0 }}
        end={{ x: 0.9, y: 0 }}
        style={[styles.button, height]}
      >
        <Text style={[styles.buttonText, textStyle]}>{title}</Text>
      </LinearGradient>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    height: 30,
    borderRadius: 7,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    fontWeight: '700',
    fontSize: 13.5,
    color: '#000000',
  },
});

export default SmallButton;
