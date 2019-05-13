import React from 'react';
import { Modal, ActivityIndicator, View } from 'react-native';

const blank = ()=>{};

/***
 * Loading 组件
 * @param  {boolean} visible    显示/隐藏
 * @param  {string} color       颜色值
 * @param  {number} size        大小，ios只支持 'small'/ 'large'
 * 
*/

export default Loading = ({visible, color='#FF6A3A', size=80}) => <Modal
    animationType='none'
    transparent={true}
    visible={visible}
    onRequestClose={blank} >
        <View style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: '#fff',
            opacity: 0.6
        }}>
            <ActivityIndicator size={size} color={color} />
        </View>

</Modal>