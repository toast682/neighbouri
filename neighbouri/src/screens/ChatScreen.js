import React, {useState, useCallback, useEffect} from 'react';
import {GiftedChat} from 'react-native-gifted-chat';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';

const chat = firestore().collection('Chats');

export default function ChatScreen() {
  const [messages, setMessages] = useState([]);
  const currentUserId = auth().currentUser.uid;
  const currentUser = auth().currentUser;

  useEffect(() => {
    getPreviousMessages();
  }, [getPreviousMessages, messages]);

  // Esteban Codes Message
  //   const unsubscribe = chat.onSnapshot((querySnapshot) => {
  //     const messagesFirestore = querySnapshot
  //       .docChanges()
  //       .filter(({type}) => type === 'added')
  //       .map(({doc}) => {
  //         const message = doc.data();
  //         return {...message, createdAt: message.createdAt.toDate()};
  //       })
  //       .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  //     appendMessages(messagesFirestore);
  //   });
  //   return () => unsubscribe();
  // }, []);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  async function getPreviousMessages() {
    const userChat = await chat
      .where('chatMembers', 'array-contains', currentUserId)
      .get();
    userChat._docs[0]._data.messages.map(
      (message) => (message.createdAt = message.createdAt.toDate()),
    );
    setMessages(userChat._docs[0]._data.messages);
  }

  //   useEffect(() => {
  //     readUser()
  //     const unsubscribe = chatsRef.onSnapshot((querySnapshot) => {
  //         const messagesFirestore = querySnapshot
  //             .docChanges()
  //             .filter(({ type }) => type === 'added')
  //             .map(({ doc }) => {
  //                 const message = doc.data()
  //                 //createdAt is firebase.firestore.Timestamp instance
  //                 //https://firebase.google.com/docs/reference/js/firebase.firestore.Timestamp
  //                 return { ...message, createdAt: message.createdAt.toDate() }
  //             })
  //             .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
  //         appendMessages(messagesFirestore)
  //     })
  //     return () => unsubscribe()
  // }, [])




  // const onSend = useCallback((messages = []) => {
  //   setMessages((previousMessages) =>
  //     GiftedChat.append(previousMessages, messages),
  //   );
  // }, []);
  return (
    <GiftedChat
      messages={messages}
      onSend={async (messages) => {

        // const userChat = await chat
        //   .where('chatMembers', 'array-contains', currentUserId)
        //   .get();
        // const userChatMessages = userChat._docs[0]._data.messages;
        // userChatMessages.add(messages[0]);
        // console.log(messages);
        // console.log(userChat);
        // console.log(userChatMessages);
      }}
      user={{
        _id: currentUserId,
        name: currentUser.displayName ? currentUser.displayName : '',
        avatar: currentUser.photoURL ? currentUser.photoURL : '',
      }}
    />
  );
}
