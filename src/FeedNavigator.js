import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import FeedScreen from './FeedScreen';
import StepByStepScreen from './StepByStepScreen';

const Stack = createStackNavigator();

const FeedNavigator = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Feed" component={FeedScreen} />
      <Stack.Screen name="StepByStep" component={StepByStepScreen} />
    </Stack.Navigator>
  );
};

export default FeedNavigator;
