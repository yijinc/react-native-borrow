package com.paydayloan;

import android.content.pm.ApplicationInfo;
import android.content.pm.PackageManager;
import com.facebook.react.bridge.Callback;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.paydayloan.utils.RSAUtils;

import java.io.IOException;
import java.security.InvalidKeyException;
import java.security.NoSuchAlgorithmException;
import java.security.spec.InvalidKeySpecException;

import javax.crypto.BadPaddingException;
import javax.crypto.IllegalBlockSizeException;
import javax.crypto.NoSuchPaddingException;

/**
 * Created by dengchuanming on 2018/11/21.
 */

public class RSAModule extends ReactContextBaseJavaModule {

    private ReactApplicationContext mContext;

    @ReactMethod
    public void encryptedData(String password, Callback callback) throws BadPaddingException, NoSuchAlgorithmException, IllegalBlockSizeException, IOException, NoSuchPaddingException, InvalidKeyException, InvalidKeySpecException {
        ApplicationInfo ai = null;
        try {
            ai = getReactApplicationContext().getPackageManager().getApplicationInfo(
                    getReactApplicationContext().getPackageName(), PackageManager.GET_META_DATA);
        } catch (PackageManager.NameNotFoundException e) {
            e.printStackTrace();
        }
        if (ai == null) return;
        String value = ai.metaData.getString("PUBLICKEY");

        String data = "";
        data = RSAUtils.encryptByPublicKey(password, value);
        callback.invoke(data);
    }

    public RSAModule(ReactApplicationContext reactContext) {
        super(reactContext);
        mContext = reactContext;
    }

    @Override
    public String getName() {
        return "RSAModule";
    }
}
