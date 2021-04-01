/* eslint-disable react-hooks/exhaustive-deps */
import React, {useState, useCallback, useEffect} from 'react';
import {GiftedChat} from 'react-native-gifted-chat';
import firestore, {firebase} from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import {useNavigation} from '@react-navigation/native';

const chat = firestore().collection('Chats');

export default function ChatScreen({route, navigation}) {
  const docID = route.params.docID;
  console.log('docID', docID);
  console.log('route', route);
  const [messages, setMessages] = useState([]);
  const [userChatState, setUserChatState] = useState(null);
  const currentUserId = auth().currentUser.uid;
  const currentUser = auth().currentUser;

  useEffect(() => {
    getPreviousMessages();
  }, []);

  async function getPreviousMessages() {
    const userChat = await chat.doc().get();
    userChat._docs[0]._data.messages.map(
      (message) => (message.createdAt = message.createdAt.toDate()),
    );
    setMessages(userChat._docs[0]._data.messages);
    setUserChatState(userChat);
  }
  const handleSend = async (message) => {
    userChatState
      .update({
        messages: firebase.firestore.FieldValue.arrayUnion(...message),
      })
      .then(onSend(message));
  };

  const onSend = useCallback((messages = []) => {
    setMessages((previousMessages) =>
      GiftedChat.append(previousMessages, messages),
    );
  }, []);
  return (
    <GiftedChat
      messages={messages}
      onSend={async (message) => {
        await handleSend(message);
      }}
      user={{
        _id: currentUserId,
        name: currentUser.displayName ? currentUser.displayName : '',
        avatar: currentUser.photoURL ? currentUser.photoURL : '',
      }}
    />
  );
}
