package com.drivernativeapp;

import android.content.Intent;
import android.os.Build;
import android.provider.Settings;
import android.widget.Toast;

import androidx.core.content.ContextCompat;

import com.facebook.react.ReactActivity;
import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.modules.core.DeviceEventManagerModule;

import android.util.Log;

public class MainActivity extends ReactActivity {
  public static final int DRAW_OVER_OTHER_APP_PERMISSION_REQUEST_CODE = 1222;
  private boolean mStarted = false ;
  public  boolean  isOnNewIntent = false;

  /**
   * Returns the name of the main component registered from JavaScript. This is used to schedule
   * rendering of the component.
   */
  private void startFloatingWidgetService() {
    if (!mStarted) {
      Intent intent = new Intent(this, FloatingWidgetService.class);
      ContextCompat.startForegroundService(this, intent);
      if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
        this.startForegroundService(intent);
      }else{
        startService(intent);
      }
      mStarted = true;
      finish();
    }
  }
  @Override
  public void onActivityResult(int requestCode, int resultCode, Intent data) {
    if (requestCode == DRAW_OVER_OTHER_APP_PERMISSION_REQUEST_CODE) {
      //Check if the permission is granted or not.
      //if (resultCode == RESULT_OK) {
      if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M && Settings.canDrawOverlays(this)) {
          //If permission granted start floating widget service
          startFloatingWidgetService();
      }
      else
        //Permission is not available then display toast
        Toast.makeText(this,
                getResources().getString(R.string.draw_other_app_permission_denied),
                Toast.LENGTH_SHORT).show();

    } else {
      super.onActivityResult(requestCode, resultCode, data);
    }
  }
  @Override
  public  void  onNewIntent(Intent  intent) {
    super.onNewIntent(intent);
    isOnNewIntent = true;
    ForegroundEmitter();
  }

  @Override
  protected  void  onStart() {
    super.onStart();
    if(isOnNewIntent == true){}else {
      ForegroundEmitter();
    }
  }

  public  void  ForegroundEmitter(){
// this method is to send back data from java to javascript so one can easily
// know which button from notification or the notification button is clicked
    String  main = getIntent().getStringExtra("mainOnPress");
    String  btn = getIntent().getStringExtra("buttonOnPress");
    WritableMap map = Arguments.createMap();
    if (main != null) {
      map.putString("main", main);
    }
    if (btn != null) {
      map.putString("button", btn);
    }
    try {
      getReactInstanceManager().getCurrentReactContext()
              .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
              .emit("notificationClickHandle", map);
    } catch (Exception  e) {
      Log.e("SuperLog", "Caught Exception: " + e.getMessage());
    }
  }

  @Override
  protected String getMainComponentName() {
    return "drivernativeapp";
  }
}
