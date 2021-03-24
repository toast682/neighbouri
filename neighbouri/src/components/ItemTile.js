import React from 'react'
import {
    Text,
    View,
    TouchableOpacity,
    Image
  } from 'react-native';
import BookmarkButton from './BookmarkButton';

export default function ItemTile({item, navigation, bookmarks, userDocumentId}) {
    return (
        <TouchableOpacity
            style={{
              width: '48%',
              marginHorizontal: '1%',
              marginBottom: 10,
              height: 220,
              borderRadius: 8,
              backgroundColor: '#faf9f9',
            }}
            onPress={() => navigation.navigate('ListingDetails', item)}>
            <View
              style={{
                borderRadius: 8,
                flexDirection: 'row-reverse',
              }}>
              <Image
                source={item.photo}
                style={{
                    width: '100%',
                    height: 150,
                    borderRadius: 10,
                    resizeMode: 'cover',
                    position: 'absolute',
                    }}
              />
              <View style={{ margin: 5 }}>
                <BookmarkButton
                    itemID={item.ListingID}
                    bookmarks={bookmarks}
                    userDocumentId={userDocumentId}
                />
              </View>
            </View>
            <View style={{padding: 5, marginTop: 100}}>
              <Text style={{fontWeight: 'bold'}}>{item.Item}</Text>
              <Text>${item.Price}</Text>
              <Text>{item.Name}</Text>
            </View>
          </TouchableOpacity>
    );
}