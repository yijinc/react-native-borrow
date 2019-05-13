import React from 'react';
import { StyleSheet, Text } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import px2rem from '../../utils/px2rem';

const Theme = {
    default: ['#FF5143', '#ff673b', '#FF8131'],
    blue: ['#3AA1FF', '#53aaff', '#62B4FF']
}



export default Button = ({title, color='default'}) => <LinearGradient start={{x: 0, y: 0}} end={{x: 1, y: 0}} colors={Theme[color]} style={styles.linearGradient}>
    <Text style={styles.btnText}>
        {title}
    </Text>
</LinearGradient>




const active1 = ['#FF5143', '#ff673b', '#FF8131'];
const inActive = ['transparent', 'transparent', 'transparent'];
export const ActButton = ({title, active}) => <LinearGradient 
    start={{x: 0, y: 0}} 
    end={{x: 1, y: 0}}
    colors={ active ? active1 : inActive }
    style={ active ? styles.active : styles.inActive } >
        <Text style={{ color: active? '#fff' : '#333' , fontSize: px2rem(30)}}>{title}</Text>
</LinearGradient>



const styles = StyleSheet.create({
    linearGradient: {
        width: px2rem(650),
        height: px2rem(90),
        borderRadius: px2rem(12),
        justifyContent: 'center',
        alignItems: 'center'
    },
    btnText: {
        color: '#fff',
        textAlign: 'center',
        fontSize: px2rem(30),
    },



    /**
     * ActButton
     */
    active: {
        paddingLeft: px2rem(36),
        paddingRight: px2rem(36),
        paddingTop: px2rem(4),
        paddingBottom: px2rem(4),
        borderColor: 'transparent',
        borderWidth: 0,
        borderRadius: px2rem(28),
    },
    inActive: {
        paddingLeft: px2rem(36),
        paddingRight: px2rem(36),
        paddingTop: px2rem(4),
        paddingBottom: px2rem(4),
        borderColor: '#EFEFEF',
        borderWidth: px2rem(4),
        borderRadius: px2rem(28),
    },
})