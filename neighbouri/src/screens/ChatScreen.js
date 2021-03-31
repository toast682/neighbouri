import React, {useState, useCallback, useEffect} from 'react';
import {GiftedChat} from 'react-native-gifted-chat';
import firestore, {firebase} from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';

const chat = firestore().collection('Chats');

export default function ChatScreen() {
  const [messages, setMessages] = useState([]);
  const [userChatState, setUserChatState] = useState(null);
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
    setUserChatState(chat.doc('375GBe05aRCeeTyaPkSy'));
    // console.log(userChat.docs[0].id);
    return Promise.resolve();
    // console.log(currentUserId);
  }
  const handleSend = async (message) => {
    // userChatState.update({
    //   messages: admin.firestore.FieldValue.arrayUnion(message),
    // });
    userChatState
      .update({
        messages: firebase.firestore.FieldValue.arrayUnion(...message),
      })
      .then(onSend(message));
  };

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

  const onSend = useCallback((messages = []) => {
    setMessages((previousMessages) =>
      GiftedChat.append(previousMessages, messages),
    );
  }, []);
  return (
    <GiftedChat
      messages={messages}
      onSend={async (message) => {
        // const userChat = await chat
        //   .where('chatMembers', 'array-contains', currentUserId)
        //   .get();
        // const userChatMessages = userChat._docs[0]._data.messages;
        // userChatMessages.add(messages[0]);
        // console.log(messages);
        // console.log(userChat);
        // console.log(userChatMessages);
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
