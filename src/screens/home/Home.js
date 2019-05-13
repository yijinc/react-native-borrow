import React, { Component } from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity, ToastAndroid } from 'react-native';
import SwitchSelector from 'react-native-switch-selector';
import px2rem from '../../utils/px2rem';
import Button from '../../component/common/Button';
import { getProductOptions } from '../../utils/systemOptions';

const formatSwitchOptions = Products => {
    const options = Products.map(p=>{
        return {
            label: 'Rp '+ p.amount,
            value: p.id
        }
    });
    if(options.length > 2) options.length=2;
    return options;
}

type Props = {};
export default class HomeDefault extends Component<Props> {

    state = {
        productId: 0,
        products: [
            { amount: 100, id: 1, interestAmount: 10, tenor: 14, tenorUnit: 1 },
            { amount: 200, id: 2, interestAmount: 12, tenor: 14, tenorUnit: 1 }
        ],
    }

    async componentDidMount() {
        const products = await getProductOptions();
        global.product = products[0];
        this.setState({
            products,
            productId: global.product.id
        })
    }

    _onPressMoney = productId => this.setState({productId})

    _loan = () => {
        const { userInfo, t } = this.props;
        if(userInfo.isFetching) {
            // 服务器获取用户信息过慢，等待（用户所有信息获取可能比较慢）
            ToastAndroid.show(t('systemException'), ToastAndroid.SHORT);
            return;
        }
        const { productId, products } = this.state;
        global.product = products.find(i=>i.id===productId);
        if(global.product === undefined) {
            // global.product 没有被赋值，可能获取产品信息（getProductOptions）失败
            ToastAndroid.show(t('systemException'), ToastAndroid.SHORT);
            return;
        }
        this.props.navigation.push('Identification')
    }


    render() {
        const { t } = this.props;
        const { productId, products } = this.state;
        const product = products.find(i=>i.id===productId) || {};
        return (
            <View style={{flex: 1}}>
                <View style={styles.header}>
                        <Text style={styles.h1}>{t('home.title')}</Text>
                        <Text style={styles.h2}>{t('home.desc')}</Text>
                        <Image style={styles.coinPic} source={require('../../assets/images/rpCoin.png')}/>
                </View>
                <View style={styles.contentBox}>
                    <Text style={styles.title}>{t('home.chooseAmount')}</Text>
                    <View style={styles.switch}>
                        <SwitchSelector
                            initial={0}
                            onPress={this._onPressMoney}
                            textColor='#333333'
                            selectedColor='#FFFFFF'
                            buttonColor='#FF8131'
                            borderColor='#EFEFEF'
                            hasPadding
                            options={formatSwitchOptions(products)} />
                    </View>
                    <Text style={styles.title}>{t('home.repaymentPeriod')}</Text>
                    <Text style={{fontSize: px2rem(34), color: '#999'}}> {product.tenor} {product.tenorUnit===1? t('Days') : t('Months')} </Text>
                    <View style={styles.line} />
                    <Text style={styles.totalDesc}>{t('home.totalAmountToBeRepaid')}</Text>
                    <Text style={styles.total}>Rp {product.amount+product.interestAmount}</Text>
                </View>
                <TouchableOpacity activeOpacity={0.6} onPress={this._loan} style={styles.loanBtn}>
                    <Button title={t('home.loanImmediately')} />
                </TouchableOpacity>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    header: {
        // flex: 1,
        width: px2rem(690),
        height: px2rem(372),
        marginLeft: 'auto',
        marginRight: 'auto',
        paddingTop: px2rem(80)
    },
    h1: {
        color: '#fff',
        fontSize: px2rem(36),
        marginBottom: px2rem(36),
        paddingLeft: px2rem(20)
    },
    h2: {
        color: '#fff',
        fontSize: px2rem(30),
        paddingLeft: px2rem(20)
    },
    coinPic: {
        width: px2rem(190),
        height: px2rem(152),
        position: 'absolute',
        right: px2rem(50),
        top: px2rem(86)
    },







    /**   contentBox ***/
    contentBox: {
        width: px2rem(690),
        height: px2rem(650),
        marginLeft: 'auto',
        marginRight: 'auto',
        // justifyContent: 'center',
        alignItems: 'center',
        marginTop: px2rem(-138),
        backgroundColor: '#fff',
        borderRadius: px2rem(20),
        borderColor: '#ccc',
        borderWidth: px2rem(1),
        
    },
    title: {
        color: '#999',
        fontSize: px2rem(30),
        marginTop: px2rem(40),
        marginBottom: px2rem(40)
    },
    switch: {
        width: px2rem(500)
    },
    line: {
        width: px2rem(600),
        height: px2rem(1),
        backgroundColor: '#EFEFEF',
        marginTop: px2rem(50),
        marginBottom: px2rem(30),
    },
    total: {
        color: '#333',
        fontSize: px2rem(48),
    },
    totalDesc: {
        color: '#333',
        fontSize: px2rem(30),
        marginBottom: px2rem(30)
    },
    loanBtn: {
        marginTop: px2rem(174),
        marginLeft: 'auto',
        marginRight: 'auto',
    }
});
