import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import SimpleLineIcon from 'react-native-vector-icons/SimpleLineIcons';
import px2rem from '../../utils/px2rem';


/**
 * ListItem 组件
 * @param  {object} item    上面 menuList[]
*/
export const ListItem =({itemClick, item}) => <TouchableOpacity activeOpacity={1} style={{ marginBottom: item.key===0? px2rem(20) : 0 }} onPress={() => { itemClick && itemClick(item.key) }}>
    <View style={styles.item}>
        <View style={styles.itemLeft}>
            {item.icon}
            <Text style={styles.title}>{item.title}</Text>
        </View>
        <View style={styles.itemLeft}>
            <SimpleLineIcon name='arrow-right' size={px2rem(28)} color='#C1C1C1'/>
        </View>
    </View>
</TouchableOpacity>

const styles = StyleSheet.create({

    item: {
        height: px2rem(100),
        width: Dimensions.get('window').width,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingLeft: px2rem(30),
        paddingRight: px2rem(30),
        backgroundColor: '#ffffff',
        borderBottomColor: '#EFEFEF',
        borderBottomWidth: px2rem(2),
    },
    itemLeft: {
        flexDirection: 'row', alignItems: 'center'
    },
    title: {
        marginLeft: px2rem(20), fontSize: px2rem(30), color: '#333'
    },

    next: {
        width: px2rem(13),
        height: px2rem(26),
    },

    textImage: {
        width: px2rem(40),
        height: px2rem(40)
    }

})
