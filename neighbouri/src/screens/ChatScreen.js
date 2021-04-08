/* eslint-disable react-hooks/exhaustive-deps */
import React, {useState, useCallback, useEffect} from 'react';
import {GiftedChat} from 'react-native-gifted-chat';
import firestore, {firebase} from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import {useNavigation} from '@react-navigation/native';

const chat = firestore().collection('Chats');

export default function ChatScreen({route, navigation}) {
  console.log('route', route);
  const [messages, setMessages] = useState([]);
  const [userChatState, setUserChatState] = useState(null);
  const currentUserId = auth().currentUser.uid;
  const currentUser = auth().currentUser;

  useEffect(() => {
    getPreviousMessages(route.params.docID);
  }, []);

  async function getPreviousMessages(docID) {
    const userChat = await chat.doc(docID).get();
    const msgs = userChat.data().messages.map((message) => {
      const mes = message;
      mes.createdAt = message.createdAt.toDate();
      return mes;
    });

    const sortedMessages = msgs.sort((a, b) => {
      return b.createdAt - a.createdAt;
    });

    setMessages(sortedMessages);
  }
  const handleSend = async (message) => {
    userChatState
      .update({
        messages: firebase.firestore.FieldValue.arrayUnion(...message),
      })
      .then(onSend(message));
  };

  const onSend = useCallback((message = []) => {
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
