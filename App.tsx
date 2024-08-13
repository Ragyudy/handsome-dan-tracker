import React from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  Image,
  ScrollView,
} from 'react-native';
import Post from './components/Post';

const App = () => {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.topBar}>
        <Text style={styles.topBarText}>dog feed</Text>
        <Image
          source={require('./images/dogfeed.png')}
          style={styles.dogfeedicon}
        />
      </View>
      <ScrollView>
        <Post
          profilePicture={require('./images/randompfp.png')}
          username="random.username"
          location="Schwarzman Center"
          time="5 hours ago"
          postImage={require('./images/randompost.png')}
        />
        <Post
          profilePicture={require('./images/randompfp.png')}
          username="random.username"
          location="Schwarzman Center"
          time="5 hours ago"
          postImage={require('./images/randompost.png')}
        />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f0f0',
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 63,
    backgroundColor: '#00356b',
  },
  dogfeedicon: {
    width: 24,
    height: 24,
    marginLeft: 10,
  },
  topBarText: {
    fontSize: 20,
    color: 'white',
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 20,
    color: '#333',
  },
});

export default App;
