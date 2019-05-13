import React, {Component} from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Image, Alert, ToastAndroid } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import ImagePicker from 'react-native-image-picker';
import px2rem from '../../../utils/px2rem';
import Button from '../../../component/common/Button';
import { uploadImage } from '../../../api/accountInfoApi';
import ConfirmIDCardModal from './ConfirmIDCardModal';
import Loading from '../../../component/Loading';

const MAX_SIZE = 1 * 1024 * 1024;

type Props = {
    t: Function
};
export default class IdCardUpload extends Component<Props> {

    state = {
        imageSource: null,
        imageSource1: null,
        imageSource2: null,
        info: {
            idCard: '',
            userName: '',
            gender: 1, //1:男  2:女
            birthAddress: '',
            birthDay: ''
        },
        modalVisible: false,
        loading: false
    }

    // More info on all the options is below in the API Reference... just some common use cases shown here
    options = {
        title: this.props.t('uploadIDPhotoTitle'),
        cancelButtonTitle: this.props.t('Cancel'),
        takePhotoButtonTitle: this.props.t('takePhoto'),
        chooseFromLibraryButtonTitle: this.props.t('chooseFromLibrary'),
        storageOptions: {
            skipBackup: true,
            path: 'images',
        },
    };


    _opneImagePicker = (type=0) => { // 0:正面照，1：背面照：2手持照
        const { t } = this.props;

        /**
         * The first arg is the options object for customization (it can also be null or omitted for default options),
         * The second arg is the callback which sends object: response (more info in the API Reference)
         */
        ImagePicker.showImagePicker(this.options, async (response) => {

            if (response.fileSize > MAX_SIZE) {
                Alert.alert('', t('photoSizeTooBig'), [{text: t('OK')}]);
                return;
            }
            if (response.didCancel) {
                console.log('User cancelled image picker');
            } else if (response.error) {
                console.log('ImagePicker Error: ', response.error);
            } else if (response.customButton) {
                console.log('User tapped custom button: ', response.customButton);
            } else {
                const source = { uri: response.uri };
                // You can also display the image using data:
                // const source = { uri: 'data:image/jpeg;base64,' + response.data };

                this.setState({loading: true})

                try {
                    const res = await uploadImage(response.uri, type, response.fileName);
                    this.setState({loading: false});
                    if(res.result === 'SUCCESS') {
                        if (type === 0) {
                            this.setState({
                                imageSource: source,
                                modalVisible: true,
                                info: {
                                    userName: res.userName,
                                    idCard: res.idCard,
                                    gender: res.gender,
                                    birthAddress: res.birthAddress,
                                    birthDay: res.birthDay
                                }
                            });
                        } else if (type === 1) {
                            this.setState({imageSource1: source});
                        } else if (type === 2) {
                            this.setState({imageSource2: source});
                        }
                    } else {
                        ToastAndroid.show(res.message, ToastAndroid.SHORT)
                    }
                } catch(error) {
                    this.setState({loading: false});
                    ToastAndroid.show(error.message, ToastAndroid.SHORT)
                }

            }
        });
    }

    _next = () => {
        const { imageSource, imageSource1, imageSource2, info } = this.state;
        const { photoComplete, next, t } = this.props;
        if(!photoComplete) {
            if (imageSource===null || imageSource1===null || imageSource2===null ) {
                ToastAndroid.show(t('uploadAllPls'), ToastAndroid.SHORT);
                return;
            }
        }
        if (!info.userName || !info.idCard) {
            ToastAndroid.show(t('photoResolutionFailed'), ToastAndroid.SHORT);
            return;
        }
        next();
    }

    _open = () => {
        this._close();
        this._opneImagePicker(0)
    }
    _close = () => this.setState({modalVisible: false})

    render() {
        const { t } = this.props;
        const { imageSource, imageSource1, imageSource2, info, modalVisible, loading } = this.state;
        return (
            <ScrollView style={{flex: 1, width: px2rem(750)}}>
                <Loading visible={loading} />
                <ConfirmIDCardModal visible={modalVisible} open={this._open} close={this._close} info={info} t={t} />
                <View style={styles.container}>
                    <TouchableOpacity style={styles.fileBox} onPress={_=>this._opneImagePicker(0)}>
                        <Icon name='photo-camera' color='#999' size={px2rem(100)} />
                        <Text style={styles.desc}>{t('uploadIdCardFront')}</Text>
                        {
                            imageSource && <Image source={imageSource} style={styles.imageSource} />
                        }
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.fileBox} onPress={_=>this._opneImagePicker(1)}>
                        <Icon name='photo-camera' color='#999' size={px2rem(100)} />
                        <Text style={styles.desc}>{t('uploadIdCardBack')}</Text>
                        {
                            imageSource1 && <Image source={imageSource1} style={styles.imageSource} />
                        }
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.fileBox} onPress={_=>this._opneImagePicker(2)}>
                        <Icon name='photo-camera' color='#999' size={px2rem(100)} />
                        <Text style={styles.desc}>{t('uploadHandheldId')}</Text>
                        {
                            imageSource2 && <Image source={imageSource2} style={styles.imageSource} />
                        }
                    </TouchableOpacity>

                    <TouchableOpacity activeOpacity={0.6} style={styles.btn} onPress={this._next}>
                        <Button title={t('Submit')} />
                    </TouchableOpacity>

                </View>
            </ScrollView>
        );
    }
}

const select = state => {
    return {

    }
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        // justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
    },
    fileBox: {
        width: px2rem(360),
        height: px2rem(240),
        backgroundColor: '#F8F8F8',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: px2rem(12),
        marginTop: px2rem(40),
        position: 'relative',
    },
    imageSource: {
        position: 'absolute',
        width: px2rem(360),
        height: px2rem(240),
        zIndex: 2
    },
    desc: {
        color: '#999999',
        fontSize: px2rem(26),
        marginTop: px2rem(40),
    },
    btn: {
        marginTop: px2rem(60),
        marginBottom: px2rem(60),
    }
});
