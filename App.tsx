import 'react-native-gesture-handler';
import React from 'react';
import {Text, View, Button} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {SafeAreaProvider} from 'react-native-safe-area-context';

type RootStackParamList = {Home: undefined; BlankScreen: undefined};

const Stack = createStackNavigator<RootStackParamList>();

const Home: React.FC<{navigation: any}> = ({navigation}) => {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'lightblue',
      }}>
      <Button
        title="Handsome Dan Tracker"
        onPress={() => navigation.navigate('BlankScreen')}
      />
    </View>
  );
};

const BlankScreen: React.FC = () => {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'lightgreen',
      }}>
      <Text>Blank Screen</Text>
    </View>
  );
};

const App: React.FC = () => {
  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Home">
          <Stack.Screen name="Home" component={Home} />
          <Stack.Screen name="BlankScreen" component={BlankScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
};

export default App;
