import { ScrollView, StyleSheet, View } from 'react-native';
import { useCallback, useState } from 'react';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import SegmentedControl from 'react-native-segmented-control-2';
import { BlurView } from '@react-native-community/blur';

import { useStore } from '../store/context';
import AppBackground from '../components/AppBackground';
import Header from '../components/Header';
import AddButton from '../components/AddButton';
import WatchedListCard from '../components/WatchedListCard';
import ReviewCard from '../components/ReviewCard';

const Review = () => {
  const [selectedTab, setSelectedTab] = useState(0);
  const navigation = useNavigation();
  const [showLargeCard, setShowLargeCard] = useState(false);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const { fetchReviews, savedReviews } = useStore();

  useFocusEffect(
    useCallback(() => {
      fetchReviews();
    }, []),
  );

  return (
    <AppBackground>
      <ScrollView showsVerticalScrollIndicator={false} bounces={false}>
        {showLargeCard && (
          <BlurView style={styles.blurBg} blurType="dark" blurAmount={2} />
        )}
        <Header title={'Plans for review'} />
        <View style={styles.container}>
          <View style={{}}>
            <View style={{ alignItems: 'center' }}>
              <SegmentedControl
                style={[
                  styles.segmentControl,
                  savedReviews.length !== 0 && { marginBottom: 40 },
                ]}
                gap={0.1}
                activeTabColor="#fff"
                activeTextColor="#000"
                textStyle={styles.segmentControlText}
                tabs={['Column', 'List']}
                selectedTabStyle={{
                  borderRadius: 22,
                }}
                onChange={index => setSelectedTab(index)}
              />
            </View>

            {selectedTab === 0 ? (
              <View style={styles.cardsWrapper}>
                {savedReviews.map((movie, idx) => (
                  <ReviewCard
                    movie={movie}
                    setShowLargeCard={setShowLargeCard}
                    setSelectedMovie={setSelectedMovie}
                    selectedMovie={selectedMovie}
                    key={idx}
                    showLargeCard={showLargeCard}
                  />
                ))}
              </View>
            ) : (
              <View
                style={{
                  paddingHorizontal: 15,
                }}
              >
                {savedReviews.map((movie, idx) => (
                  <WatchedListCard
                    movie={movie}
                    setShowLargeCard={setShowLargeCard}
                    setSelectedMovie={setSelectedMovie}
                    selectedMovie={selectedMovie}
                    key={idx}
                    showLargeCard={showLargeCard}
                    screen={'Review'}
                  />
                ))}
              </View>
            )}

            <View
              style={[
                { alignItems: 'center' },
                savedReviews.length !== 0 && { marginTop: 74 },
              ]}
            >
              <AddButton
                title={'Add a movie'}
                onPress={() => navigation.navigate('AddReview')}
              />
            </View>
          </View>
        </View>
      </ScrollView>
    </AppBackground>
  );
};

const styles = StyleSheet.create({
  container: { paddingBottom: 30 },
  segmentControl: {
    marginTop: 17,
    marginBottom: 92,
    backgroundColor: '#000000',
    borderRadius: 22,
    height: 44,
    width: '70%',
    borderColor: '#FCCB00',
    borderWidth: 1,
  },
  segmentControlText: { color: '#fff', fontSize: 16, fontWeight: '700' },
  resContainer: {
    flex: 1,
    margin: 2,
    backgroundColor: '#000000',
    borderRadius: 16,
    paddingHorizontal: 17,
    paddingTop: 30,
    paddingBottom: 18,
  },
  cardsWrapper: {
    paddingHorizontal: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
  },
  gradientResBorder: {
    width: '90%',
    borderRadius: 16,
    zIndex: 20,
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
  blurBg: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
    zIndex: 10,
  },
  buttonsWrap: { flexDirection: 'row', justifyContent: 'space-between' },
});

export default Review;
