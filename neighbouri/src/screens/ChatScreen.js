import React, {useState, useCallback, useEffect} from 'react';
import {GiftedChat} from 'react-native-gifted-chat';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';

const chat = firestore().collection('Chats');

export default function ChatScreen() {
  const [messages, setMessages] = useState([]);
  const currentUserId = auth().currentUser.uid;

  useEffect(() => {
    getPreviousMessages();
    console.log(currentUserId);
    console.log(auth().currentUser.displayName);
  }, []);

  // useEffect(() => {
  // fetch messages from conversation between current user and user they are talking to.
  // setMessages([
  //   {
  //     _id: 1,    // Message Id
  //     text: 'Hello developer', // Text of Message
  //     createdAt: new Date(), // Timestamp of when message was created
  //     user: {
  //       _id: 2,              // UserID of person who sent the message
  //       name: 'React Native',   // Name of the User
  //       avatar: 'https://placeimg.com/140/140/any',    // Link of User Profile Picture
  //     },
  //   },
  //   {
  //     _id: 2321,
  //     text: 'Hello developer',
  //     createdAt: new Date(),
  //     user: {
  //       _id: 2,
  //       name: 'React Native',
  //       avatar: 'https://placeimg.com/140/140/any',
  //     },
  //   },
  //   {
  //     _id: 2,
  //     text: 'Hello',
  //     createdAt: new Date(),
  //     user: {
  //       _id: currentUserId,
  //       name: 'React Native',
  //       avatar: 'https://placeimg.com/140/140/any',
  //     },
  //   },
  //   {
  //     _id: 6969,
  //     text: 'Hello',
  //     createdAt: new Date(),
  //     user: {
  //       _id: currentUserId,
  //       name: 'React Native',
  //       avatar: 'https://placeimg.com/140/140/any',
  //     },
  //   },
  // ]);
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
  async function getPreviousMessages() {
    const chatsWhereUser1IsCurrentUser = await chat
      .where('User1', '==', currentUserId)
      .get();
    // .then(() => {
    //   setMessages(chatsWhereUser1IsCurrentUser.docs.messages);
    // });
    // const chatsWhereUser2IsCurrentUser = await chat
    //   .where('User2', '==', currentUserId)
    //   .get();
    // const messageArrayUser2 = chatsWhereUser2IsCurrentUser.docs;

    //Note that we don't need to de-duplicate in this case
    // chatsWhereUser1IsCurrentUser._docs[0]._data.messages.map((message) =>
    //   message.messages.createdAt.toDate(),
    // );
    chatsWhereUser1IsCurrentUser._docs[0]._data.messages[0].createdAt = chatsWhereUser1IsCurrentUser._docs[0]._data.messages[0].createdAt.toDate();
    setMessages(chatsWhereUser1IsCurrentUser._docs[0]._data.messages);
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

  // async function getPreviousMessages() {
  //   await chat
  //     .where('User1', '==', currentUserId)
  //     .get()
  //     .then((messages) => {
  //       setMessages([messages]);
  //     })
  //     .catch((e) => {
  //       console.log('No messages found');
  //     });
  // }

  return (
    <GiftedChat
      messages={messages}
      onSend={(messages) => onSend(messages)}
      user={{
        _id: currentUserId,
        name: 'React Native',
        avatar: 'https://placeimg.com/140/140/any',
      }}
    />
  );
}
