package com.drivernativeapp; // replace com.your-app-name with your app’s name
import com.facebook.react.bridge.NativeModule;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import java.util.Map;
import java.util.HashMap;
import com.facebook.react.modules.core.DeviceEventManagerModule;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.bridge.Arguments;

import android.app.Activity;
import android.app.ActivityManager;
import android.app.PendingIntent;
import android.content.Context;
import android.content.Intent;
import android.net.Uri;
import android.os.Build;
import android.provider.Settings;
import android.util.Log;

import androidx.annotation.Nullable;
import androidx.core.content.ContextCompat;

public class CalendarModule extends ReactContextBaseJavaModule {


    private static ReactApplicationContext appContext;

    CalendarModule(ReactApplicationContext context) {
        super(context);
        appContext = context;
    }

    public static ReactApplicationContext getContext() {
        return appContext;
    }

    @Override
    public String getName() {
        return "CalendarModule";
    }

    // react method to start service for overlay component


    @ReactMethod
    public void isWidgetOpen(Promise promise) {
        try{
            ActivityManager manager = (ActivityManager) getReactApplicationContext().getSystemService(Context.ACTIVITY_SERVICE);
            for (ActivityManager.RunningServiceInfo service : manager.getRunningServices(Integer.MAX_VALUE)) {
                if (FloatingWidgetService.getClassName().equals(service.service.getClassName())) {
                    promise.resolve(true);
                    return;
                }
            }
            promise.resolve(false);
        }catch (Exception e){
            promise.reject(e);
        }
    }

    @ReactMethod
    public void startService(Promise promise) {

        String result = "Success";
        Activity activity = getCurrentActivity();
        if (activity != null) {
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M && !Settings.canDrawOverlays(getReactApplicationContext())) {
                Intent intent = new Intent(Settings.ACTION_MANAGE_OVERLAY_PERMISSION,
                        Uri.parse("package:" + getCurrentActivity().getPackageName()));
                getCurrentActivity().startActivityForResult(intent, MainActivity.DRAW_OVER_OTHER_APP_PERMISSION_REQUEST_CODE);
            }
        }

        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M && Settings.canDrawOverlays(getReactApplicationContext())) {
            try {
                Intent intent = new Intent(FloatingWidgetService.FLOATING_WIDGET_ID);
                intent.setClass(this.getReactApplicationContext(), FloatingWidgetService.class);
                getReactApplicationContext().startService(intent);
            } catch (Exception e) {
                promise.reject(e);
                return;
            }
        }
        promise.resolve(result);
    }

    public static void bringApplicationToFront(ReactContext context) {
        try {
            Intent intent = new Intent(context, MainActivity.class);
            intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK|Intent.FLAG_ACTIVITY_SINGLE_TOP);
            PendingIntent pendingIntent = PendingIntent.getActivity(context, 0, intent, 0);

            pendingIntent.send();
        } catch (Exception e) {
            return;
        }
    }

    public static void sendEvent(ReactContext reactContext,
                           String eventName,
                           @Nullable WritableMap params) {
        reactContext
                .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
                .emit(eventName, params);
    }

    @ReactMethod
    public void addListener(String eventName) {
        // Set up any upstream listeners or background tasks as necessary
    }

    @ReactMethod
    public void removeListeners(Integer count) {
        // Remove upstream listeners, stop unnecessary background tasks
    }


    @ReactMethod
    public void performAction(String type, String name, String passengerLocation, String passengerDestination, String bound) {
        ActionObject action = new ActionObject(passengerLocation,passengerDestination,name,type,bound);
        FloatingWidgetService.handleAction(action);
    }

}