import React, {useEffect, useState} from 'react';
import {
  View
} from 'react-native';
import {Icon} from 'react-native-elements';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

const usersCollection = firestore().collection('Users');

export default function BookmarkButton({itemID}) {
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [userBookmarks, setUserBookmarks] = useState([]);
  const [userDocumentId, setUserDocumentId] = useState('');
  const currentUser = auth().currentUser;
  const currentUserId = currentUser.uid;

  useEffect(() => {
    getCurrentUser();
  }, []);

  async function getCurrentUser() {
    await firestore()
      .collection('Users')
      .where('uid', '==', currentUserId)
      .get()
      .then((userDocs) => {
        setUserDocumentId(userDocs.docs[0].id);
        const bookmarks =
          userDocs.docs[0].data() && userDocs.docs[0].data().bookmarks;
        setUserBookmarks(bookmarks);
        if (bookmarks.includes(itemID)) {
          setIsBookmarked(true);
        }
      })
      .catch((e) => {
        console.log('There was an error getting user: ', e);
      });
  }

  async function addToBookmarks() {
    await usersCollection
      .doc(userDocumentId)
      .update({
        bookmarks: [...userBookmarks, itemID],
      })
      .then(() => {
        setIsBookmarked(true);
      })
      .catch((e) => {
        console.log('There was an error adding bookmark added to user: ', e);
      });
  }

  async function removeFromBookmarks() {
    const rmBookmarks = userBookmarks.filter((b) => b !== itemID);
    await usersCollection
      .doc(userDocumentId)
      .update({
        bookmarks: rmBookmarks,
      })
      .then(() => {
        setIsBookmarked(false);
      })
      .catch((e) => {
        console.log('There was an error removing bookmark from user: ', e);
      });
  }

  return (
    <View>
        {isBookmarked ? (
            <View style={{
                backgroundColor: '#FFC978',
                width: 40,
                height: 40,
                borderRadius: 12,
                borderWidth: 2,
                borderColor: '#F9A528',
                justifyContent: 'center',
                alignSelf: 'center'
            }}>
                <Icon
                    name="bookmark"
                    type="font-awesome"
                    color="#B96F00"
                    onPress={() => removeFromBookmarks()}
                />
            </View>
            ) : (
            <View style={{
                width: 40,
                height: 40,
                borderRadius: 12,
                borderWidth: 2,
                borderColor: '#F9A528',
                justifyContent: 'center',
                alignSelf: 'center'
            }}>
                <Icon
                name="bookmark-o"
                type="font-awesome"
                color="#F9A528"
                onPress={() => addToBookmarks()}
                />
            </View>
            )}
    </View>
  );
}
