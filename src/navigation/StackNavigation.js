import { createStackNavigator } from '@react-navigation/stack';
import Onboarding from '../screens/Onboarding';
import Main from '../screens/Main';
import Quiz from '../screens/Quiz';
import Game from '../screens/Game';
import Watched from '../screens/Watched';
import AddMovie from '../screens/AddMovie';
import Review from '../screens/Review';
import AddReview from '../screens/AddReview';
import Achievement from '../screens/Achievement';

const Stack = createStackNavigator();

const StackNavigation = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Onboarding" component={Onboarding} />
      <Stack.Screen name="Main" component={Main} />
      <Stack.Screen name="Quiz" component={Quiz} />
      <Stack.Screen name="Game" component={Game} />
      <Stack.Screen name="Watched" component={Watched} />
      <Stack.Screen name="AddMovie" component={AddMovie} />
      <Stack.Screen name="Review" component={Review} />
      <Stack.Screen name="AddReview" component={AddReview} />
      <Stack.Screen name="Achievement" component={Achievement} />
    </Stack.Navigator>
  );
};

export default StackNavigation;
