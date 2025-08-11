import { Image, StyleSheet, Text, TouchableOpacity } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

const AddButton = ({
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
      style={style}
      onPress={onPress}
      disabled={isDisabled}
    >
      <LinearGradient
        colors={colors}
        start={{ x: 0, y: 0 }}
        end={{ x: 0.9, y: 0 }}
        style={styles.button}
      >
        <Image source={require('../assets/icons/add.png')} />
        <Text style={[styles.buttonText, textStyle]}>{title}</Text>
      </LinearGradient>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    width: 180,
    height: 44,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 5,
  },
  buttonText: {
    fontWeight: '700',
    fontSize: 16,
    color: '#000000',
  },
});

export default AddButton;
