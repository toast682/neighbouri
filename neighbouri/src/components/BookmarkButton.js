import React, {useEffect, useState} from 'react';
import {
  View
} from 'react-native';
import {Icon} from 'react-native-elements';
import firestore from '@react-native-firebase/firestore';
import { useIsFocused } from "@react-navigation/native";

const usersCollection = firestore().collection('Users');

export default function BookmarkButton(props) {
  const {itemID, bookmarks, userDocumentId} = props;
  const [isBookmarked, setIsBookmarked] = useState(false);
  const isFocused = useIsFocused();

  useEffect(() => {
    if (bookmarks.includes(itemID)) {
      setIsBookmarked(true);
    }
  }, [props, isFocused]);

  async function addToBookmarks() {
    if (!bookmarks.includes(itemID)) {
      await usersCollection
      .doc(userDocumentId)
      .update({
        bookmarks: [...bookmarks, itemID],
      })
      .then(() => {
        setIsBookmarked(true);
      })
      .catch((e) => {
        console.log('There was an error adding bookmark added to user: ', e);
      });
    }
  }

  async function removeFromBookmarks() {
    const rmBookmarks = bookmarks.filter((b) => b !== itemID);
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
