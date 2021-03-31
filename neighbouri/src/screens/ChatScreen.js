/* eslint-disable react-hooks/exhaustive-deps */
import React, {useState, useCallback, useEffect} from 'react';
import {GiftedChat} from 'react-native-gifted-chat';
import firestore, {firebase} from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import {useNavigation} from '@react-navigation/native';

const chat = firestore().collection('Chats');

export default function ChatScreen({route, navigation}) {
  // const [currentDocID, setCurrentDocID] = useState(route.params.docID);
  // const docID = route.params.docID;
  // console.log('docID', docID);
  // console.log('route', route);
  const [messages, setMessages] = useState([]);
  const [userChatState, setUserChatState] = useState(null);
  const currentUserId = auth().currentUser.uid;
  const currentUser = auth().currentUser;

  useEffect(() => {
    if (route.params.docID) {
      getPreviousMessages(route.params.docID);
    }
  });

  async function getPreviousMessages(id) {
    const docID = id;
    const userChat = await chat.doc(docID).get();

    userChat._docs[0]._data.messages.map(
      (message) => (message.createdAt = message.createdAt.toDate()),
    );
    setMessages(userChat._docs[0]._data.messages);
    setUserChatState(chat.doc(docID));
  }
  const handleSend = async (message) => {
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
