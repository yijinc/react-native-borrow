import React from 'react';
import { Image, StyleSheet } from 'react-native';
import px2rem from '../../utils/px2rem';


// AppLogo
export default AppLogo = ({style}) => <Image source={require('../../assets/images/logo.png')} style={[styles.logo, style]} />

const styles = StyleSheet.create({
    logo: {
        width: px2rem(150),
        height: px2rem(150),
        marginTop: px2rem(96)
    }
})