import React, { Component } from 'react';
import { Modal, View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import px2rem from '../utils/px2rem'

export default class BaseDialog extends Component {
    constructor(props) {
        super(props);
        this.state = {
        };
    }

    render() {
        const { modalVisible, title, content, buttonContent, closeTitle } = this.props
        return (
            <Modal
                animationType={'none'}
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => { }}
            >
                <View style={styles.modal}>
                    <View style={styles.dialog}>
                        <View >
                            {title && <View style={styles.title}><Text>{title}</Text></View>}
                            {content && <View style={styles.content}><Text>{content}</Text></View>}
                        </View>
                        <View style={styles.bottom}>
                            <TouchableOpacity style={styles.bottomButton} activeOpacity={1} onPress={() => { this.props.open() }}><View ><Text>{buttonContent}</Text></View></TouchableOpacity>
                            <TouchableOpacity style={styles.bottomButton} activeOpacity={1} onPress={() => { this.props.close() }}><View ><Text>{closeTitle}</Text></View></TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
        );
    }
}

const styles = StyleSheet.create({
    modal: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.3)',
        alignItems: 'center',
        justifyContent: 'center'
    },
    dialog: {
        marginBottom: px2rem(100),
        backgroundColor: '#fff',
        width: px2rem(636),
        height: px2rem(350),
        borderRadius: px2rem(10),
    },
    top: {
    },

    bottom: {
        flexDirection: 'row',
        flex: 1,
    },

    bottomButton: {
        flex: 1,
        fontSize: px2rem(30),
        alignItems: 'center',
        justifyContent: 'center'
    },
    title: {
        marginTop: px2rem(50),
        fontSize: px2rem(32),
        alignItems: 'center',
        justifyContent: 'center',
    },

    content: {
        fontSize: px2rem(32),
        marginTop: px2rem(42),
        marginLeft: px2rem(90),
        marginRight: px2rem(90),
        alignItems: 'center',
        justifyContent: 'center',
    }

})
