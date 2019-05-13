package com.paydayloan.utils;

import javax.crypto.BadPaddingException;
import javax.crypto.Cipher;
import javax.crypto.IllegalBlockSizeException;
import javax.crypto.NoSuchPaddingException;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.math.BigInteger;
import java.nio.charset.StandardCharsets;
import java.security.*;
import java.security.spec.InvalidKeySpecException;
import java.security.spec.PKCS8EncodedKeySpec;
import java.security.spec.RSAPublicKeySpec;
import java.security.spec.X509EncodedKeySpec;
import android.util.Base64;

/**
 * @author Aaron
 * @date 2018/11/8 下午1:27
 */
public final class RSAUtils {

    private static final String PUBLIC_KEY  = "MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQDiZP34Foobh+kEbsqzNVfeXf6CYccu9EmJ6Hwz4lidHwECUrpAjLnwlme/cE5vNwU//jXJ57VVFwzxtSzY5vGAxLdn3yIXyFc1lBBR3KQhausx9x8MZSWhDJC49eGl8faAsJbC/g5GcWTYBAf8E2N/mVf9ZOsi16sa7H1AazF3+QIDAQAB";
    
    private static final int MAX_ENCRYPT_BLOCK = 117;

    private static KeyPair generateRSAKeyPair(int keyLength) throws NoSuchAlgorithmException {
        KeyPairGenerator generator = KeyPairGenerator.getInstance("RSA");
        generator.initialize(keyLength);
        return generator.generateKeyPair();
    }

    /**
     * 获取publicKey
     *
     * @param modulus
     * @param publicKey
     * @return
     * @throws NoSuchAlgorithmException
     * @throws InvalidKeySpecException
     */
    public static PublicKey getPublicKey(String modulus, String publicKey) throws NoSuchAlgorithmException,
                                                                           InvalidKeySpecException {
        BigInteger bigIntModulus = new BigInteger(modulus);
        BigInteger bigIntPrivateExponent = new BigInteger(publicKey);
        RSAPublicKeySpec keySpec = new RSAPublicKeySpec(bigIntModulus, bigIntPrivateExponent);
        KeyFactory keyFactory = KeyFactory.getInstance("RSA/ECB/PKCS1Padding");
        return keyFactory.generatePublic(keySpec);
    }

    /**
     * 通过公钥byte[](publicKey.getEncoded())将公钥还原，适用于RSA算法
     *
     * @param publicKey
     * @return
     * @throws NoSuchAlgorithmException
     * @throws InvalidKeySpecException
     */
    public static PublicKey getPublicKey(String publicKey) throws NoSuchAlgorithmException, InvalidKeySpecException {
        byte[] bytes = Base64.decode(publicKey, Base64.NO_WRAP);
        X509EncodedKeySpec keySpec = new X509EncodedKeySpec(bytes);
        KeyFactory keyFactory = KeyFactory.getInstance("RSA");
        return keyFactory.generatePublic(keySpec);
    }


    /**
     * 用公钥加密 <br>
     * 每次加密的字节数，不能超过密钥的长度值减去11
     *
     * @param data 需加密数据的byte数据
     * @param publicKey 公钥
     * @return 加密后的byte型数据
     */
    private static byte[] encryptData(byte[] data, PublicKey publicKey) throws NoSuchPaddingException,
                                                                        NoSuchAlgorithmException, InvalidKeyException,
                                                                        BadPaddingException, IllegalBlockSizeException,
                                                                        IOException {
        Cipher cipher = Cipher.getInstance("RSA/ECB/PKCS1Padding");
        // 编码前设定编码方式及密钥
        cipher.init(Cipher.ENCRYPT_MODE, publicKey);
        // 传入编码数据并返回编码结果
        int inputLen = data.length;
        ByteArrayOutputStream out = new ByteArrayOutputStream();
        int offSet = 0;
        byte[] cache;
        int i = 0;
        // 对数据分段加密
        while (inputLen - offSet > 0) {
            if (inputLen - offSet > MAX_ENCRYPT_BLOCK) {
                cache = cipher.doFinal(data, offSet, MAX_ENCRYPT_BLOCK);
            } else {
                cache = cipher.doFinal(data, offSet, inputLen - offSet);
            }
            out.write(cache, 0, cache.length);
            i++;
            offSet = i * MAX_ENCRYPT_BLOCK;
        }
        byte[] encryptedData = out.toByteArray();
        out.close();
        return encryptedData;
    }

    public static String encryptByPublicKey(String data, String publicKeyStr) throws InvalidKeySpecException,
                                                                              NoSuchAlgorithmException,
                                                                              IllegalBlockSizeException,
                                                                              InvalidKeyException, BadPaddingException,
                                                                              NoSuchPaddingException, IOException {
        PublicKey publicKey = getPublicKey(publicKeyStr);
        byte[] bytes = encryptData(data.getBytes(), publicKey);
        return Base64.encodeToString(bytes, Base64.NO_WRAP);
    }

}
