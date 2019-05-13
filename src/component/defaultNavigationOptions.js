import React from 'react';
import Icon from 'react-native-vector-icons/MaterialIcons';
import px2rem from '../utils/px2rem';


export const HeaderLeft = ({onPress}) => <Icon name="arrow-back" style={{marginLeft: px2rem(12)}} size={px2rem(54)} color="#333" onPress={onPress} />

export const HeaderRight = ({onPress}) => <Icon name="arrow-forward" style={{marginLeft: px2rem(12)}} size={px2rem(54)} color="#333" onPress={onPress} />


const defaultNavigationOptions = ({navigation}) => {
    return {
        headerLeft: <HeaderLeft onPress={_=>navigation.goBack()} />,
        headerStyle: {
            backgroundColor: '#fff',
        },
        headerTintColor: '#333',
        headerTitleStyle: {
            fontWeight: 'bold',
            fontSize: px2rem(36)
        },
    }
}

export default defaultNavigationOptions;