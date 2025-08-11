import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useCallback, useState } from 'react';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { format } from 'date-fns';
import LinearGradient from 'react-native-linear-gradient';
import { launchImageLibrary } from 'react-native-image-picker';
import { BlurView } from '@react-native-community/blur';

import AppBackground from '../components/AppBackground';
import Header from '../components/Header';
import SmallButton from '../components/SmallButton';
import MediumButton from '../components/MediumButton';
import { useStore } from '../store/context';

const AddReview = ({ route }) => {
  const editReview = route.params;
  const navigation = useNavigation();
  const [step, setStep] = useState(1);
  const [movie, setMovie] = useState(editReview?.movie || '');
  const [image, setImage] = useState(editReview?.image || '');
  const [isVisibleNotification, setIsVisibleNotification] = useState(true);
  const { saveReview, fetchMovies } = useStore();
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [date, setDate] = useState(new Date(2021, 8, 17));
  const [selectedDate, setSelectedDate] = useState(
    editReview?.selectedDate || '',
  );

  useFocusEffect(
    useCallback(() => {
      fetchMovies();
    }, []),
  );

  const onChange = (event, selectedDate) => {
    const formattedDate = format(selectedDate, 'MMMM dd,yyyy');
    if (selectedDate) {
      setDate(selectedDate);
      setSelectedDate(formattedDate);
    }
    setTimeout(() => {
      setShowDatePicker(false);
    }, 4000);
  };

  const imagePicker = () => {
    let options = {
      storageOptions: {
        path: 'image',
        maxHeight: 700,
        maxWidth: 700,
      },
    };
    launchImageLibrary(options, response => {
      if (response.didCancel) return;

      setImage(response.assets[0].uri);
    });
  };

  const handleNextStep = () => {
    if (step === 2) {
      const newMovie = { id: Date.now(), movie, image, selectedDate };
      saveReview(newMovie, editReview);

      setTimeout(() => {
        navigation.goBack();
      }, 300);
    } else setIsVisibleNotification(true), setStep(step + 1);
  };

  return (
    <AppBackground>
      <ScrollView showsVerticalScrollIndicator={false} bounces={false}>
        {isVisibleNotification && step > 0 && (
          <BlurView style={styles.blurBg} blurType="dark" blurAmount={2} />
        )}

        <Header title={`Step ${step}`} />
        <View>
          {step > 0 && (
            <View style={{ alignItems: 'center' }}>
              <View style={styles.inticatorWrap}>
                {step === 1 ? (
                  <>
                    <Image source={require('../assets/images/step1.png')} />
                    <Image source={require('../assets/images/step2.png')} />
                  </>
                ) : (
                  <>
                    <Image source={require('../assets/images/step2.png')} />
                    <Image source={require('../assets/images/step1.png')} />
                  </>
                )}
              </View>

              {showDatePicker ? (
                <>
                  <DateTimePicker
                    testID="dateTimePicker"
                    value={date}
                    mode="date"
                    display="spinner"
                    accentColor="black"
                    style={{
                      backgroundColor: 'rgba(198, 198, 198, 0.78)',
                      borderRadius: 13,
                    }}
                    theme="light"
                    onChange={onChange}
                    textColor="black"
                  />
                </>
              ) : (
                <LinearGradient
                  colors={['#CB9920', '#FCCB00', '#FDF3C3']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 0.9, y: 0 }}
                  style={styles.gradientAddImageBorder}
                >
                  <View style={styles.addImageContainer}>
                    {step === 1 && (
                      <>
                        {image === '' ? (
                          <TouchableOpacity
                            activeOpacity={0.8}
                            style={styles.imagePicker}
                            onPress={imagePicker}
                          >
                            <View style={styles.imageWrapper}>
                              <Image
                                source={require('../assets/icons/addPhoto.png')}
                              />
                              <Text style={styles.addText}>Add a photo</Text>
                            </View>
                          </TouchableOpacity>
                        ) : (
                          <TouchableOpacity
                            activeOpacity={0.7}
                            onPress={imagePicker}
                            style={styles.uploadedImage}
                          >
                            <Image
                              source={{ uri: image }}
                              style={styles.uploadedImage}
                            />
                          </TouchableOpacity>
                        )}
                        <TextInput
                          style={styles.input}
                          placeholder="Title"
                          placeholderTextColor={'#fff'}
                          value={movie}
                          onChangeText={setMovie}
                        />
                      </>
                    )}
                    {step === 2 && (
                      <>
                        <TextInput
                          style={[
                            styles.input,
                            styles.dateInput,
                            selectedDate !== '' && {
                              fontWeight: '700',
                              fontSize: 14,
                              textAlign: 'center',
                            },
                          ]}
                          placeholder="Date"
                          placeholderTextColor={'#fff'}
                          value={selectedDate}
                          onFocus={() => setShowDatePicker(true)}
                        />
                      </>
                    )}
                  </View>
                </LinearGradient>
              )}

              {((image && movie && step === 1) ||
                (selectedDate && step === 2)) && (
                <MediumButton
                  title={step === 1 ? 'Next step' : 'End'}
                  style={{ marginTop: 45, marginBottom: 30 }}
                  onPress={handleNextStep}
                />
              )}

              {isVisibleNotification && (
                <LinearGradient
                  colors={['#CB9920', '#FCCB00', '#FDF3C3']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 0.9, y: 0 }}
                  style={styles.gradientResBorder}
                >
                  <View style={styles.resContainer}>
                    <Image
                      source={require('../assets/images/notificationMan.png')}
                      style={{ marginRight: 17 }}
                    />
                    <Image source={require('../assets/images/line.png')} />

                    <View style={styles.buttonsWrap}>
                      <Text style={styles.notificationText}>
                        {step === 1 &&
                          `In this step, add a photo and the title of the movie you plan to review.`}
                        {step === 2 &&
                          `In this step, set the settings to remind you to watch this movie.`}
                      </Text>
                      <SmallButton
                        title={'Ok'}
                        height={{ height: 20 }}
                        style={{ width: 89 }}
                        textStyle={{ fontSize: 12 }}
                        onPress={() => setIsVisibleNotification(false)}
                      />
                    </View>
                  </View>
                </LinearGradient>
              )}
            </View>
          )}
        </View>
      </ScrollView>
    </AppBackground>
  );
};

const styles = StyleSheet.create({
  inticatorWrap: {
    flexDirection: 'row',
    marginTop: 26,
    marginBottom: 40,
    justifyContent: 'center',
    gap: 15,
  },
  resContainer: {
    flex: 1,
    margin: 2,
    backgroundColor: '#000000',
    borderRadius: 16,
    paddingHorizontal: 17,
    flexDirection: 'row',
  },
  gradientResBorder: {
    width: '90%',
    borderRadius: 16,
    zIndex: 20,
    marginBottom: 30,
  },
  resText: {
    fontWeight: '600',
    fontSize: 20,
    color: '#fff',
    textAlign: 'center',
    marginBottom: 70,
  },
  notificationText: {
    fontWeight: '700',
    fontSize: 13,
    color: '#fff',
    textAlign: 'center',
    width: 220,
  },
  buttonsWrap: {
    justifyContent: 'space-around',
    alignItems: 'center',
    marginLeft: 6,
  },
  addImageContainer: {
    flex: 1,
    margin: 2,
    backgroundColor: '#000000',
    borderRadius: 16,
    paddingHorizontal: 20,
    paddingTop: 42,
    paddingBottom: 65,
    alignItems: 'center',
  },
  gradientAddImageBorder: {
    width: '90%',
    borderRadius: 16,
    marginBottom: 44,
  },
  imageWrapper: { alignItems: 'center', gap: 5 },
  addText: {
    fontWeight: '400',
    fontSize: 14,
    color: '#fff',
    textAlign: 'center',
  },
  imagePicker: {
    width: '90%',
    height: 136,
    backgroundColor: '#262525',
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 51,
  },
  input: {
    width: '100%',
    height: 34,
    backgroundColor: '#262525',
    borderRadius: 10,
    fontSize: 14,
    fontWeight: 400,
    color: '#fff',
    paddingHorizontal: 8,
  },
  uploadedImage: {
    width: '90%',
    height: 136,
    marginBottom: 51,
    borderRadius: 22,
  },
  blurBg: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
    zIndex: 10,
  },
  dateInput: {
    height: 61,
    borderRadius: 22,
    paddingLeft: 15,
  },
  crownContainer: {
    borderRadius: 100,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 30,
    marginBottom: 20,
  },
  ratingWrapper: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 31,
    gap: 24,
  },
});

export default AddReview;
