import React from 'react';
import { View, Text, Image, StyleSheet, Dimensions } from 'react-native';
import { Colors } from '../globalstyles';

const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;

interface PostBoxProps {
  name: string;
  dateTime: string;
  selfieUrl: string;
  profileUrl: string;
  caption: string;
}

const PostBox: React.FC<PostBoxProps> = ({ name, dateTime, selfieUrl, profileUrl, caption }) => {
  return (
    <View style={styles.postContainer}>
      <View style={styles.header}>
        <Image source={{ uri: profileUrl }} style={styles.profilePic} />
        <Text style={styles.name}>{name}</Text>
      </View>
      <Image source={{ uri: selfieUrl }} style={styles.selfie} />
      <Text style={styles.dateTime}>{dateTime}</Text>
      <Text style={styles.caption}>{caption}</Text>
        <View style={styles.divider} />
    </View>
  );
};

const styles = StyleSheet.create({
  postContainer: {
    backgroundColor: Colors.charcoal,
    borderRadius: 10,
    // padding: 10,
    margin: 10,
    width: screenWidth * 0.9,

  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  profilePic: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  name: {
    fontWeight: 'bold',
    color: Colors.white,

  },
  selfie: {
    width: '95%',
    height: 200,
    marginTop: 10,
    borderRadius: 10,
    alignSelf: 'center',
  },
  dateTime: {
    marginTop: 10,
    color: Colors.grey,
  },
  caption: {
    marginTop: 5,
    color: Colors.white,
  },
  divider: {
    height: 3,
    backgroundColor: Colors.grey,
    width: '100%',
    marginTop: 15,
  },
});

export default PostBox;
