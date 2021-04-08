import React, {useEffect, useState} from 'react';
import {
  Text,
  View,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
} from 'react-native';
import firestore from '@react-native-firebase/firestore';
import storage from '@react-native-firebase/storage';
import auth from '@react-native-firebase/auth';
import {useIsFocused} from '@react-navigation/native';
import {Icon} from 'react-native-elements';

export default function ChatsListScreen(props) {
  const [latestChatMessages, setLatestChatMessages] = useState([]);
  const isFocused = useIsFocused();
  const navigation = props.navigation;

  useEffect(() => {
    setLatestChatMessages([]);
    getUserChats();
  }, [props, isFocused]);

  async function getUserChats() {
    const currentUser = auth().currentUser;
    const currentUserId = currentUser.uid;
    /* todo - make more efficient: maybe give each message a uid 
    and store message uid in an array in each user document. Then I can query for the
    messages with the proper uids instead of fetching all messages in the db */
    await firestore()
      .collection('Chats')
      .where('chatMembers', 'array-contains', auth().currentUser.uid)
      .get()
      .then((chatDocs) => {
        const chats = chatDocs.docs.map((d) => {
          const doc = d.data()
          doc.docID = d.id;
          return doc;
        });
        const userchts = chats.filter((ch) => {
          return ch.chatMembers.includes(currentUserId);
        });
        const latestMsgs = userchts.map((ch) => {
          const doc = ch.messages.pop()
          doc.docID = ch.docID;
          return doc;
        });
        const sortedLatestMsgs = latestMsgs.sort((a, b) => {
          return b.createdAt.toDate() - a.createdAt.toDate();
        });
        setLatestChatMessages(sortedLatestMsgs);
        getLatestMessengerImage(sortedLatestMsgs);
      })
      .catch((e) => {
        console.log('There was an error getting user messages: ', e);
      });
  }

  async function getLatestMessengerImage(latest) {
    const lastMessengerIds = latest.map((msg) => msg.user._id);
    const lastMessengerIdSet = new Set(lastMessengerIds);
    if (lastMessengerIds.length > 0) {
      await firestore()
        .collection('Users')
        .where('uid', 'in', [...lastMessengerIdSet])
        .get()
        .then((userDocs) => {
          userDocs.forEach((doc) => {
            buildObject(doc, latest);
          });
        })
        .catch((e) => {
          console.log('There was an error getting messager image: ', e);
        });
    }
  }

  async function buildObject(doc, latest) {
    let reference = null;
    if (doc.data().IconURI) {
      reference = await storage().ref(doc.data().IconURI).getDownloadURL();
    }
    const latestMsgsWPic = latest.map((msg) => {
      if (msg.user._id == doc.data().uid && !msg.user.avatar) {
        msg.user.avatar = reference;
      }
      return msg;
    });
    setLatestChatMessages(latestMsgsWPic);
  }

  function buildCreatedAtDateString(msgObject) {
    const date = msgObject.createdAt.toDate();
    const hourMin = date
      .toLocaleTimeString('en-US', {hour: '2-digit', minute: '2-digit'})
      .split(':');
    const monthDay = date
      .toLocaleDateString('en-US', {month: 'short', day: 'numeric'})
      .split(',')[0];
    let isNow = false;
    const now = new Date();
    if (
      date.getDate() == now.getDate() &&
      date.getMonth() == now.getMonth() &&
      date.getFullYear() == now.getFullYear() &&
      date.getHours() == now.getHours() &&
      date.getMinutes() == now.getMinutes()
    ) {
      isNow = true;
    }
    const monthDayOrNow = isNow ? 'now' : monthDay;
    const dateTimeString =
      hourMin[0] + ':' + hourMin[1] + '(' + monthDayOrNow + ')';
    return dateTimeString;
  }

  return (
    <View style={styles.container}>
      <FlatList
        style={{marginHorizontal: '5%'}}
        showsVerticalScrollIndicator={false}
        data={latestChatMessages}
        ListHeaderComponent={
          <View style={{width: '100%'}}>
            <View
              style={{
                flex: 1,
                margin: 10,
                flexDirection: 'row-reverse',
              }}>
              {/* <MessageIconButton navigation={navigation}/> */}
            </View>
            <Text
              style={{
                color: '#48CA36',
                fontSize: 24,
                alignSelf: 'center',
                marginBottom: 10,
              }}>
              NOTIFICATIONS
            </Text>
            <View
              style={{
                borderWidth: 1,
                borderColor: '#E5E5E5',
                width: '100%',
                minWidth: '100%',
                marginBottom: 5,
              }}
            />
          </View>
        }
        renderItem={({item}) => {
          const date = buildCreatedAtDateString(item);
          return (
            <TouchableOpacity
              onPress={() => {
                console.log(item)
                navigation.push('ChatScreen', {
                  docID: item.docID,
                });
              }}
              style={{
                alignSelf: 'stretch',
                borderColor: '#E5E5E5',
                borderBottomWidth: 2,
              }}>
              <View
                style={{
                  alignSelf: 'stretch',
                  marginLeft: 10,
                  marginRight: 10,
                  padding: 5,
                }}>
                <View style={{flexDirection: 'row'}}>
                  <View style={{flex: 1, minHeight: 70}}>
                    {!!item.user.avatar ? (
                      <Image
                        source={{uri: item.user.avatar}}
                        style={{
                          width: 60,
                          height: 60,
                          flex: 1,
                          alignItems: 'center',
                          justifyContent: 'center',
                          borderRadius: 30,
                          margin: 5,
                        }}
                      />
                    ) : (
                      <View
                        style={{
                          width: 60,
                          height: 50,
                          flex: 1,
                          alignItems: 'center',
                          justifyContent: 'center',
                          borderRadius: 30,
                          borderWidth: 1,
                          marginBottom: 15,
                          marginRight: 5,
                        }}>
                        <Icon name="user" type="font-awesome" color="#6C6767" />
                      </View>
                    )}
                  </View>
                  <View
                    style={{
                      flex: 2,
                      justifyContent: 'center',
                      padding: 10,
                      minHeight: 70,
                    }}>
                    <Text style={{fontWeight: 'bold'}}>
                      {item && item.user.name}
                    </Text>
                    <Text>{item && item.text}</Text>
                  </View>
                  <View
                    style={{
                      flex: 2,
                      paddingTop: 10,
                      flexDirection: 'row',
                      minHeight: 70,
                    }}>
                    <Text>{date}</Text>
                  </View>
                </View>
              </View>
            </TouchableOpacity>
          );
        }}
        keyExtractor={(msg, index) => index.toString()}
        numColumns={1}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
    alignItems: 'center',
    width: '100%',
    paddingTop: 30,
  },
  title: {
    color: '#48CA36',
    fontSize: 24,
    marginTop: 70,
    alignSelf: 'flex-start',
    marginBottom: 10,
  },
});
