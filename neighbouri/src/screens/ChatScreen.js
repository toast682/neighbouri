import React, {useState, useCallback, useEffect} from 'react';
import {GiftedChat} from 'react-native-gifted-chat';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';

const chat = firestore().collection('Chat');

export default function ChatScreen() {
  const [messages, setMessages] = useState([]);
  const currentUserId = auth().currentUser;

  //   useEffect(() => {
  //     getPreviousMessages();
  //   }, []);

  useEffect(() => {
    setMessages([
      {
        _id: 1,
        text: 'Hello developer',
        createdAt: new Date(),
        user: {
          _id: 2,
          name: 'React Native',
          avatar: 'https://placeimg.com/140/140/any',
        },
      },
    ]);
  }, []);

  async function getPreviousMessages() {
    // await messageStorage
    //   .where('uid', '==', currentUserId)
    //   .get()
    //   .then((messages) => {
    //     setMessages([messages]);
    //   })
    //   .catch((e) => {
    //     console.log('You fucked up');
    //   });
  }

  const upDatefirestore = async (messages) => {
    chat.add(messages);
  };

  const onSend = useCallback((messages = []) => {
    setMessages((previousMessages) =>
      GiftedChat.append(previousMessages, messages),
    );
    upDatefirestore(messages).then(() => {
      console.log('success');
    });
  }, []);

  return (
    <GiftedChat
      messages={messages}
      onSend={(messages) => onSend(messages)}
      user={{
        _id: currentUserId,
      }}
    />
  );
}
