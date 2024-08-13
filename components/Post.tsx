import React from 'react';
import {View, Text, Image, StyleSheet} from 'react-native';

interface PostProps {
  profilePicture: any;
  username: string;
  location: string;
  time: string;
  postImage: any;
}

const Post: React.FC<PostProps> = ({
  profilePicture,
  username,
  location,
  time,
  postImage,
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Image source={profilePicture} style={styles.profilePicture} />
        <View style={styles.userInfo}>
          <Text style={styles.username}>{username}</Text>
          <Text style={styles.location}>{location}</Text>
        </View>
        <Text style={styles.time}>{time}</Text>
      </View>
      <Image source={postImage} style={styles.postImage} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
  },
  profilePicture: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  userInfo: {
    flex: 1,
    marginLeft: 10,
  },
  username: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  location: {
    fontSize: 14,
    color: '#666',
  },
  time: {
    fontSize: 12,
    color: '#888',
  },
  postImage: {
    width: '100%',
    height: 500,
  },
});

export default Post;
