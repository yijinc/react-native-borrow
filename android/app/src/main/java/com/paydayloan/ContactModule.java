package com.paydayloan;

import android.Manifest;
import android.app.Activity;
import android.content.ContentResolver;
import android.content.Intent;
import android.content.pm.PackageManager;
import android.database.Cursor;
import android.net.Uri;
import android.provider.ContactsContract;
import android.widget.Toast;

import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ActivityEventListener;
import com.facebook.react.bridge.BaseActivityEventListener;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.bridge.WritableNativeMap;


import static android.app.Activity.RESULT_OK;

/**
 * Created by dengchuanming on 2018/4/25.
 */

public class ContactModule extends ReactContextBaseJavaModule {

    ReactApplicationContext mContext;
    Activity mActivity;
    private static final int CONTACT_SELECT_REQUEST = 99;
    private static final String CONTACT_SELECT_CANCEL = "CONTACT_SELECT_CANCEL";
    private static final String CONTACT_SELECT_FAILED = "CONTACT_SELECT_FAILED";

    private Promise contactPromise;

    public ContactModule(ReactApplicationContext reactContext) {
        super(reactContext);
        mContext = reactContext;
        mActivity = reactContext.getCurrentActivity();
        reactContext.addActivityEventListener(mActivityEventListener);
    }


    private final ActivityEventListener mActivityEventListener = new BaseActivityEventListener() {

        @Override
        public void onActivityResult(Activity activity, int requestCode, int resultCode, Intent data) {
            super.onActivityResult(activity, requestCode, resultCode, data);

            if (resultCode == RESULT_OK && requestCode== CONTACT_SELECT_REQUEST) {
                Uri uri;
                String[] contacts;
                WritableMap writableMap;
                uri = data.getData();
                contacts = getPhoneContacts(uri);
                writableMap = new WritableNativeMap();
                writableMap.putString("name", contacts[0]);
                writableMap.putString("phone", contacts[1]);
                if(contactPromise != null) {
                    contactPromise.resolve(writableMap);
                }
            } else {
                if(contactPromise != null) {
                    contactPromise.reject(CONTACT_SELECT_CANCEL);
                }
            }
            contactPromise = null;
        }
    };

    @ReactMethod
    public void openContact(Promise promise) {
        if (isReadContact()) {
            Activity currentActivity = getCurrentActivity();

            if (currentActivity == null) {
                promise.reject(CONTACT_SELECT_FAILED);
                return;
            }

            // Store the promise to resolve/reject when returns data
            contactPromise = promise;

            try {
                final Intent intent = new Intent(Intent.ACTION_PICK, ContactsContract.Contacts.CONTENT_URI);
                currentActivity.startActivityForResult(intent, CONTACT_SELECT_REQUEST);
            } catch (Exception e) {
                contactPromise.reject(CONTACT_SELECT_FAILED);
                contactPromise = null;
            }

        }
    }

    private boolean isReadContact() {
        if (android.os.Build.VERSION.SDK_INT >= android.os.Build.VERSION_CODES.M) {
            int hasWriteContactsPermission = getCurrentActivity().checkSelfPermission(Manifest.permission.READ_CONTACTS);
            if (hasWriteContactsPermission != PackageManager.PERMISSION_GRANTED) {
                getCurrentActivity().requestPermissions(new String[]{Manifest.permission.READ_CONTACTS}, 122);
                Toast.makeText(getCurrentActivity(), "请打开通讯录权限", Toast.LENGTH_SHORT).show();
                return false;
            }
        }
        return true;
    }

    @Override
    public String getName() {
        return "AndroidContactModule";
    }

    private String[] getPhoneContacts(Uri uri) {
        String[] contact = new String[2];
        //得到ContentResolver对象
        ContentResolver cr = mContext.getContentResolver();
        //取得电话本中开始一项的光标
        Cursor cursor = cr.query(uri, null, null, null, null);
        Cursor phone = null;
        if (cursor != null) {
            cursor.moveToFirst();
            //取得联系人姓名
            int nameFieldColumnIndex = cursor.getColumnIndex(ContactsContract.Contacts.DISPLAY_NAME);
            if (nameFieldColumnIndex == -1) {
                return null;
            }
            try {
                contact[0] = cursor.getString(nameFieldColumnIndex);
                //取得电话号码
                String ContactId = cursor.getString(cursor.getColumnIndex(ContactsContract.Contacts._ID));
                phone = cr.query(ContactsContract.CommonDataKinds.Phone.CONTENT_URI, null,
                        ContactsContract.CommonDataKinds.Phone.CONTACT_ID + "=" + ContactId, null, null);
                if (phone != null) {
                    phone.moveToFirst();
                    contact[1] = phone.getString(phone.getColumnIndex(ContactsContract.CommonDataKinds.Phone.NUMBER));
                }
            } catch (Exception e) {
                e.printStackTrace();
                Toast.makeText(getCurrentActivity(), "请打开通讯录权限", Toast.LENGTH_SHORT).show();
            } finally {
                if(phone!=null){
                    phone.close();
                }
                if(cursor!=null) {
                    cursor.close();
                }
            }
        } else {
            return null;
        }
        return contact;
    }

}

