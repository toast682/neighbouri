import * as React from 'react';
import { SafeAreaView, Image, Text, View, ScrollView, FlatList } from 'react-native';
import RelatedItemsList from '../components/details/RelatedItemsList';

import SellerInfoCard from '../components/details/SellerInfoCard';


export default function ListingDetailsScreen({ route, navigation }) {
    const item = route.params;

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
            <ScrollView>
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
                    <Image
                        source={item.photo}
                        style={{width: 200, height: 200}}
                    />
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
                    />
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

