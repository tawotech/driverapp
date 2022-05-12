package com.drivernativeapp;

import android.content.Intent;
import android.os.Build;
import android.provider.Settings;
import android.widget.Toast;

import androidx.core.content.ContextCompat;

import com.facebook.react.ReactActivity;
import android.util.Log;

public class MainActivity extends ReactActivity {
  public static final int DRAW_OVER_OTHER_APP_PERMISSION_REQUEST_CODE = 1222;
  private boolean mStarted = false ;
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
      Log.d("RESULT","result code ==== > " + resultCode );
      //if (resultCode == RESULT_OK) {
      if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M && Settings.canDrawOverlays(this)) {
          //If permission granted start floating widget service
          Log.d("start activity service", "service has started" + " can draw: " + Settings.canDrawOverlays(this));
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
  protected String getMainComponentName() {
    return "drivernativeapp";
  }
}
