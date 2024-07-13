import 'react-native-gesture-handler';
import React from 'react';
import {Text, View, Button} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {WebView} from 'react-native-webview';

type RootStackParamList = {Home: undefined; MapScreen: undefined};

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
        onPress={() => navigation.navigate('MapScreen')}
      />
    </View>
  );
};

const MapScreen: React.FC = () => {
  const mapHtml = `
    <!DOCTYPE html>
    <html class="use-all-space">
      <head>
        <meta http-equiv="X-UA-Compatible" content="IE=Edge" />
        <meta charset="UTF-8" />
        <title>Handsome Dan Map</title>
        <meta
          name="viewport"
          content="width=device-width,initial-scale=1,maximum-scale=1,user-scalable=no"
        />
        <link
          rel="stylesheet"
          type="text/css"
          href="https://api.tomtom.com/maps-sdk-for-web/cdn/6.x/6.25.0/maps/maps.css"
        />
        <style>
          #map {
            width: 100vw;
            height: 100vh;
          }
        </style>
      </head>
      <body>
        <div id="map" class="map"></div>
        <script src="https://api.tomtom.com/maps-sdk-for-web/cdn/6.x/6.25.0/maps/maps-web.min.js"></script>
        <script>
          tt.setProductInfo("test", "1.0");
          var map = tt.map({
            key: "qW6EE7UA0YvKE47p38CubARSzjclDEYP",
            container: "map",
            center: [-72.9223, 41.3123],
            zoom: 14,
          });
          function updateMapLocation(longitude, latitude, time) {
            map.flyTo({
              center: [longitude, latitude],
              zoom: 17,
            });
            var marker = new tt.Marker()
              .setLngLat([longitude, latitude])
              .addTo(map);
            var popup = new tt.Popup({ offset: 35 }).setText(
              "Last seen here " + time
            );
            marker.setPopup(popup).togglePopup();
          }
          var userLongitude = -72.925055;
          var userLatitude = 41.311033;
          updateMapLocation(userLongitude, userLatitude, "(just now)");
        </script>
      </body>
    </html>
  `;

  return (
    <WebView
      originWhitelist={['*']}
      source={{html: mapHtml}}
      style={{flex: 1}}
    />
  );
};

const App: React.FC = () => {
  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Home">
          <Stack.Screen name="Home" component={Home} />
          <Stack.Screen name="MapScreen" component={MapScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
};

export default App;
