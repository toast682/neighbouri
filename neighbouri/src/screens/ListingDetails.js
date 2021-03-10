import React, { useEffect, useState } from 'react';
import { Button, SafeAreaView, ImageBackground, Text, View, ScrollView } from 'react-native';
import RelatedItemsList from '../components/details/RelatedItemsList';
import { Icon } from 'react-native-elements';
import SellerInfoCard from '../components/details/SellerInfoCard';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

const usersCollection = firestore().collection('Users');

export default function ListingDetailsScreen({ route, navigation }) {
    const item = route.params;
    const [isBookmarked, setIsBookmarked] = useState(false);
    const [userBookmarks, setUserBookmarks] = useState([]);
    const [userDocumentId, setUserDocumentId] = useState("");
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
                const bookmarks = userDocs.docs[0].data() && userDocs.docs[0].data().bookmarks;
                setUserBookmarks(bookmarks);
                if (bookmarks.includes(item.ListingID)) {
                    setIsBookmarked(true);
                }
            }).catch(e => {
                console.log("There was an error getting user: ", e);
            });
    }

    async function addToBookmarks() {
        await usersCollection
            .doc(userDocumentId)
            .update({
                bookmarks:[...userBookmarks, item.ListingID]
            })
            .then(() => {
                setIsBookmarked(true);
            }).catch(e => {
                console.log("There was an error adding bookmark added to user: ", e);
            });
    }
    
    async function removeFromBookmarks() {
        const rmBookmarks = userBookmarks.filter((b) => b !== item.ListingID);
        await usersCollection
            .doc(userDocumentId)
            .update({
                bookmarks: rmBookmarks
            })
            .then(() => {
                setIsBookmarked(false);
            }).catch(e => {
                console.log("There was an error removing bookmark from user: ", e);
            });
    }

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
            <ScrollView>
                <View style={{
                    flex: 1,
                    flexDirection: 'row',
                    justifyContent: 'flex-end',
                    marginRight: 20,
                    marginTop: 15
                    }}>
                    <Icon
                        name='shopping-cart'
                        type='font-awesome'
                        color='gold'
                        onPress={() => console.log('navigate.navigate to cart page')}
                    />
                </View>
                <View style={{
                    alignItems: 'center',
                    alignSelf: 'stretch',
                    margin: 5,
                    marginTop: 10
                    }}>
                    <Text style={{ fontSize: 25, fontWeight: 'bold', color: 'dodgerblue' }}>
                        {item.Item}
                    </Text>
                </View>
                <View  style={{
                    alignSelf: 'stretch',
                    alignItems: 'center',
                    margin: 10,
                    borderRadius: 8,
                    backgroundColor:'#f0f0f0'
                    }}>
                    <ImageBackground
                        source={item.photo}
                        style={{width: 200, height: 200}}
                    >
                    <View  style={{
                        flex: 1,
                        flexDirection: 'row',
                        justifyContent: 'flex-end',
                        margin: 10,
                        marginLeft: 100
                    }}>
                    {isBookmarked ? <Icon
                            name='bookmark'
                            type='font-awesome'
                            color='gold'
                            onPress={() => removeFromBookmarks()}
                        /> :
                        <Icon
                            name='bookmark-o'
                            type='font-awesome'
                            color='gold'
                            onPress={() => addToBookmarks()}
                        />}
                    </View>
                    </ImageBackground>
                </View>
                <View style={{
                    alignSelf: 'stretch',
                    margin: 10,
                    borderRadius: 8,
                    padding: 5,
                    backgroundColor:'#f0f0f0'
                    }}>
                    <Text  style={{ fontSize: 16 }}>
                        {item.Description}
                    </Text>
                </View>
                <View style={{ margin: 10, borderRadius: 8 }} >
                    <Button
                        title="Add to Cart"
                        onPress={() => { console.log("add to cart") }}
                    />
                </View>
                <View style={{
                    alignSelf: 'stretch',
                    marginLeft: 10,
                    marginTop: 10
                    }}>
                    <Text style={ { fontSize: 16 } }>Seller Info</Text>
                </View>
                <SellerInfoCard SellerID={item.SellerID}/>
                <View style={{
                    alignSelf: 'stretch',
                    margin: 10,
                    borderRadius: 8,
                    padding: 5
                    }}>
                    <Text  style={{ fontSize: 16 }}>
                        Products related to this item
                    </Text>
                    <RelatedItemsList
                        currentItemId={item.ListingID}
                        currentItemTitle={item.Item}
                        navigation={navigation}
                    />
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

