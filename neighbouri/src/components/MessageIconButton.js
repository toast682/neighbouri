import React from 'react';
import {
    View
} from 'react-native';
import {Icon} from 'react-native-elements';

export default function MessageIconButton(props) {
    const { navigation } = props;
    return (
        <View
            style={{
                backgroundColor: 'white',
                width: 40,
                height: 40,
                borderRadius: 12,
                justifyContent: 'center',
                alignSelf: 'center'
             }}>
            <Icon
                name="commenting-o"
                type="font-awesome"
                color="#6C6767"
                onPress={() => console.log(navigation.navigate('ChatsList'))}
            />
        </View>
    );
}