package com.drivernativeapp;

import android.app.Notification;
import android.app.PendingIntent;
import android.app.Service;
import android.content.Intent;
import android.content.res.Configuration;
import android.graphics.Paint;
import android.graphics.PixelFormat;
import android.graphics.Point;
import android.os.Build;
import android.os.CountDownTimer;
import android.os.Handler;
import android.os.IBinder;
import android.util.Log;
import android.view.Gravity;
import android.view.LayoutInflater;
import android.view.MotionEvent;
import android.view.View;
import android.view.WindowManager;
import android.widget.ImageView;
import android.widget.TextView;

import androidx.annotation.Nullable;
import androidx.core.app.NotificationCompat;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.WritableMap;

import static com.facebook.react.bridge.UiThreadUtil.runOnUiThread;

import static com.drivernativeapp.MainApplication.CHANNEL_ID;

/**
 * Created by sonu on 28/03/17.
 */

public class FloatingWidgetService extends Service implements View.OnClickListener {
    public static final String FLOATING_WIDGET_ID = "1222";
    private WindowManager mWindowManager;
    private static View mFloatingWidgetView,
            collapsedView, expandedView,
            passengerView, yesNoView,
            endTripView,pickupAllPassengersView,
            pickupAllPassengers,
            arrivedPassengerView,
            removeFloatingWidgetView;
    private static TextView passengerName,
            passengerAddress,yesNoText,
            yesNoButtonText,acceptPickupDropoffButtonText,
            trackingText;

    //private static View passengerStaticView, endTripStaticView;
    private ImageView remove_image_view;
    private Point szWindow = new Point();

    private String action = "none";
    private static String bound = "inbound";
    private static String type = ActionObject.UPDATE_PASSENGER;

    private int x_init_cord, y_init_cord, x_init_margin, y_init_margin;

    //Variable to check if the Floating widget view is on left side or in right side
    // initially we are displaying Floating widget view to Left side so set it to true
    private boolean isLeft = true;

    public FloatingWidgetService() {

    }

    public static String getClassName (){
        return "com.drivernativeapp.FloatingWidgetService";
    }

    @Nullable
    @Override
    public IBinder onBind(Intent intent) {
        return null;
    }

    @Override
    public int onStartCommand(Intent intent, int flags, int startId) {
        String input = intent.getStringExtra("Displaying Etapath widget");

        Intent notificationIntent = new Intent(this, MainActivity.class);
        PendingIntent pendingIntent = PendingIntent.getActivity(this,
                0, notificationIntent, 0);

        Notification notification = new NotificationCompat.Builder(this, CHANNEL_ID)
                .setContentTitle("Etapath Widget Service")
                .setContentText(input)
                .setSmallIcon(R.mipmap.ic_launcher)
                .setContentIntent(pendingIntent)
                .build();

        startForeground(1, notification);

        //do heavy work on a background thread
        //stopSelf();

        return START_NOT_STICKY;
    }

    @Override
    public void onCreate() {
        //init WindowManager
        mWindowManager = (WindowManager) getSystemService(WINDOW_SERVICE);

        getWindowManagerDefaultDisplay();

        //Init LayoutInflater
        LayoutInflater inflater = (LayoutInflater) getSystemService(LAYOUT_INFLATER_SERVICE);

        addRemoveView(inflater);
        addFloatingWidgetView(inflater);
        implementClickListeners();
        implementTouchListenerToFloatingWidgetView();
        ReactApplicationContext reactContext = (ReactApplicationContext) CalendarModule.getContext();
        Intent activityIntent = (Intent) createSingleInstanceIntent();
        reactContext.startActivity(activityIntent);
    }

    private Intent createSingleInstanceIntent() {
        ReactApplicationContext reactContext = (ReactApplicationContext) CalendarModule.getContext();
        String packageName = reactContext.getPackageName();
        Intent launchIntent = reactContext.getPackageManager().getLaunchIntentForPackage(packageName);
        String className = launchIntent.getComponent().getClassName();
        Intent activityIntent = null;
        try {

            Class<?> activityClass = Class.forName(className);

            activityIntent = new Intent(reactContext, activityClass);

            activityIntent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);

        } catch (Exception e) {
            stopCurrentService();
            Log.e("POIFOIWEGBF", "Class not found", e);

        }
        return activityIntent;
    }

    private void stopCurrentService ()
    {
        stopSelf();
    }


    /*  Add Remove View to Window Manager  */
    private View addRemoveView(LayoutInflater inflater) {
        //Inflate the removing view layout we created
        removeFloatingWidgetView = inflater.inflate(R.layout.remove_floating_widget_layout, null);

        int LAYOUT_FLAG;
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            LAYOUT_FLAG = WindowManager.LayoutParams.TYPE_APPLICATION_OVERLAY;
        } else {
            LAYOUT_FLAG = WindowManager.LayoutParams.TYPE_PHONE ;
        }

        //Add the view to the window.
        WindowManager.LayoutParams paramRemove = new WindowManager.LayoutParams(
                WindowManager.LayoutParams.WRAP_CONTENT,
                WindowManager.LayoutParams.WRAP_CONTENT,
                LAYOUT_FLAG,
                WindowManager.LayoutParams.FLAG_NOT_FOCUSABLE | WindowManager.LayoutParams.FLAG_WATCH_OUTSIDE_TOUCH | WindowManager.LayoutParams.FLAG_LAYOUT_NO_LIMITS,
                PixelFormat.TRANSLUCENT);
        //Specify the view position
        paramRemove.gravity = Gravity.TOP | Gravity.LEFT;

        //Initially the Removing widget view is not visible, so set visibility to GONE
        removeFloatingWidgetView.setVisibility(View.GONE);
        remove_image_view = (ImageView) removeFloatingWidgetView.findViewById(R.id.remove_img);

        //Add the view to the window
        mWindowManager.addView(removeFloatingWidgetView, paramRemove);
        return remove_image_view;
    }

    /*  Add Floating Widget View to Window Manager  */
    private void addFloatingWidgetView(LayoutInflater inflater) {
        //Inflate the floating view layout we created
        mFloatingWidgetView = inflater.inflate(R.layout.floating_widget_layout, null);

        //Add the view to the window.
        final WindowManager.LayoutParams params = new WindowManager.LayoutParams(
                WindowManager.LayoutParams.WRAP_CONTENT,
                WindowManager.LayoutParams.WRAP_CONTENT,
                WindowManager.LayoutParams.TYPE_APPLICATION_OVERLAY,
                WindowManager.LayoutParams.FLAG_NOT_FOCUSABLE,
                PixelFormat.TRANSLUCENT);
        //TYPE_APPLICATION_OVERLAY : TYPE_PHONE
        //Specify the view position
        params.gravity = Gravity.TOP | Gravity.LEFT;

        //Initially view will be added to top-left corner, you change x-y coordinates according to your need
        params.x = 0;
        params.y = 100;

        //Add the view to the window
        mWindowManager.addView(mFloatingWidgetView, params);

        //find id of collapsed view layout
        collapsedView = mFloatingWidgetView.findViewById(R.id.collapse_view);

        //find id of the expanded view layout
        expandedView = mFloatingWidgetView.findViewById(R.id.expanded_container);

        // find id of passenger view
        passengerView = mFloatingWidgetView.findViewById(R.id.passenger_view);

        // find ye/no view
        yesNoView = mFloatingWidgetView.findViewById(R.id.yes_no_view);

        // find passenger name text field
        passengerName = mFloatingWidgetView.findViewById(R.id.floating_widget_passenger_name);

        // find passenger address text field
        passengerAddress = mFloatingWidgetView.findViewById(R.id.floating_widget_address);

        // find end trip view
        endTripView = mFloatingWidgetView.findViewById(R.id.end_trip_view);

        // find pickup all passengers view
        pickupAllPassengersView = mFloatingWidgetView.findViewById(R.id.pickup_all_passengers_view);

        // find pickup all passengers button
        pickupAllPassengers = mFloatingWidgetView.findViewById(R.id.pickup_all_passengers_button);

        // find yes no text area
        yesNoText = mFloatingWidgetView.findViewById(R.id.yes_no_text);

        // find yes/no button text
        yesNoButtonText = mFloatingWidgetView.findViewById(R.id.yes);

        // find accept pickup dropoff button text
        acceptPickupDropoffButtonText = mFloatingWidgetView.findViewById(R.id.accept);

        // find tracking text
        trackingText = mFloatingWidgetView.findViewById(R.id.floating_widget_tracking_text);

        // find arrived at passenger view
        arrivedPassengerView =mFloatingWidgetView.findViewById(R.id.arrived_passenger_view);
    }

    private void getWindowManagerDefaultDisplay() {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.HONEYCOMB_MR2)
            mWindowManager.getDefaultDisplay().getSize(szWindow);
        else {
            int w = mWindowManager.getDefaultDisplay().getWidth();
            int h = mWindowManager.getDefaultDisplay().getHeight();
            szWindow.set(w, h);
        }
    }

    /*  Implement Touch Listener to Floating Widget Root View  */
    private void implementTouchListenerToFloatingWidgetView() {
        //Drag and move floating view using user's touch action.
        mFloatingWidgetView.findViewById(R.id.root_container).setOnTouchListener(new View.OnTouchListener() {

            long time_start = 0, time_end = 0;

            boolean isLongClick = false;//variable to judge if user click long press
            boolean inBounded = false;//variable to judge if floating view is bounded to remove view
            int remove_img_width = 0, remove_img_height = 0;

            Handler handler_longClick = new Handler();
            Runnable runnable_longClick = new Runnable() {
                @Override
                public void run() {
                    //On Floating Widget Long Click

                    //Set isLongClick as true
                    isLongClick = true;

                    //Set remove widget view visibility to VISIBLE
                    removeFloatingWidgetView.setVisibility(View.VISIBLE);

                    onFloatingWidgetLongClick();
                }
            };

            @Override
            public boolean onTouch(View v, MotionEvent event) {

                //Get Floating widget view params
                WindowManager.LayoutParams layoutParams = (WindowManager.LayoutParams) mFloatingWidgetView.getLayoutParams();

                //get the touch location coordinates
                int x_cord = (int) event.getRawX();
                int y_cord = (int) event.getRawY();

                int x_cord_Destination, y_cord_Destination;

                switch (event.getAction()) {
                    case MotionEvent.ACTION_DOWN:
                        time_start = System.currentTimeMillis();

                        handler_longClick.postDelayed(runnable_longClick, 600);

                        remove_img_width = remove_image_view.getLayoutParams().width;
                        remove_img_height = remove_image_view.getLayoutParams().height;

                        x_init_cord = x_cord;
                        y_init_cord = y_cord;

                        //remember the initial position.
                        x_init_margin = layoutParams.x;
                        y_init_margin = layoutParams.y;

                        return true;
                    case MotionEvent.ACTION_UP:
                        isLongClick = false;
                        removeFloatingWidgetView.setVisibility(View.GONE);
                        remove_image_view.getLayoutParams().height = remove_img_height;
                        remove_image_view.getLayoutParams().width = remove_img_width;
                        handler_longClick.removeCallbacks(runnable_longClick);

                        //If user drag and drop the floating widget view into remove view then stop the service
                        if (inBounded) {
                            stopSelf();
                            inBounded = false;
                            break;
                        }


                        //Get the difference between initial coordinate and current coordinate
                        int x_diff = x_cord - x_init_cord;
                        int y_diff = y_cord - y_init_cord;

                        //The check for x_diff <5 && y_diff< 5 because sometime elements moves a little while clicking.
                        //So that is click event.
                        if (Math.abs(x_diff) < 5 && Math.abs(y_diff) < 5) {
                            time_end = System.currentTimeMillis();

                            //Also check the difference between start time and end time should be less than 300ms
                            if ((time_end - time_start) < 300)
                                onFloatingWidgetClick();

                        }

                        y_cord_Destination = y_init_margin + y_diff;

                        int barHeight = getStatusBarHeight();
                        if (y_cord_Destination < 0) {
                            y_cord_Destination = 0;
                        } else if (y_cord_Destination + (mFloatingWidgetView.getHeight() + barHeight) > szWindow.y) {
                            y_cord_Destination = szWindow.y - (mFloatingWidgetView.getHeight() + barHeight);
                        }

                        layoutParams.y = y_cord_Destination;

                        inBounded = false;

                        //reset position if user drags the floating view
                        resetPosition(x_cord);

                        return true;
                    case MotionEvent.ACTION_MOVE:
                        int x_diff_move = x_cord - x_init_cord;
                        int y_diff_move = y_cord - y_init_cord;

                        x_cord_Destination = x_init_margin + x_diff_move;
                        y_cord_Destination = y_init_margin + y_diff_move;

                        //If user long click the floating view, update remove view
                        if (isLongClick) {
                            int x_bound_left = szWindow.x / 2 - (int) (remove_img_width * 1.5);
                            int x_bound_right = szWindow.x / 2 + (int) (remove_img_width * 1.5);
                            int y_bound_top = szWindow.y - (int) (remove_img_height * 1.5);

                            //If Floating view comes under Remove View update Window Manager
                            if ((x_cord >= x_bound_left && x_cord <= x_bound_right) && y_cord >= y_bound_top) {
                                inBounded = true;

                                int x_cord_remove = (int) ((szWindow.x - (remove_img_height * 1.5)) / 2);
                                int y_cord_remove = (int) (szWindow.y - ((remove_img_width * 1.5) + getStatusBarHeight()));

                                if (remove_image_view.getLayoutParams().height == remove_img_height) {
                                    remove_image_view.getLayoutParams().height = (int) (remove_img_height * 1.5);
                                    remove_image_view.getLayoutParams().width = (int) (remove_img_width * 1.5);

                                    WindowManager.LayoutParams param_remove = (WindowManager.LayoutParams) removeFloatingWidgetView.getLayoutParams();
                                    param_remove.x = x_cord_remove;
                                    param_remove.y = y_cord_remove;

                                    mWindowManager.updateViewLayout(removeFloatingWidgetView, param_remove);
                                }

                                layoutParams.x = x_cord_remove + (Math.abs(removeFloatingWidgetView.getWidth() - mFloatingWidgetView.getWidth())) / 2;
                                layoutParams.y = y_cord_remove + (Math.abs(removeFloatingWidgetView.getHeight() - mFloatingWidgetView.getHeight())) / 2;

                                //Update the layout with new X & Y coordinate
                                mWindowManager.updateViewLayout(mFloatingWidgetView, layoutParams);
                                break;
                            } else {
                                //If Floating window gets out of the Remove view update Remove view again
                                inBounded = false;
                                remove_image_view.getLayoutParams().height = remove_img_height;
                                remove_image_view.getLayoutParams().width = remove_img_width;
                                onFloatingWidgetClick();
                            }

                        }


                        layoutParams.x = x_cord_Destination;
                        layoutParams.y = y_cord_Destination;

                        //Update the layout with new X & Y coordinate
                        mWindowManager.updateViewLayout(mFloatingWidgetView, layoutParams);
                        return true;
                }
                return false;
            }
        });
    }

    private void implementClickListeners() {
        //mFloatingWidgetView.findViewById(R.id.close_floating_view).setOnClickListener(this);
        mFloatingWidgetView.findViewById(R.id.close_expanded_view).setOnClickListener(this);
        mFloatingWidgetView.findViewById(R.id.accept).setOnClickListener(this);
        mFloatingWidgetView.findViewById(R.id.decline).setOnClickListener(this);
        mFloatingWidgetView.findViewById(R.id.yes).setOnClickListener(this);
        mFloatingWidgetView.findViewById(R.id.no).setOnClickListener(this);
        mFloatingWidgetView.findViewById(R.id.end_trip_button).setOnClickListener(this);
        mFloatingWidgetView.findViewById(R.id.pickup_all_passengers_view).setOnClickListener(this);
        mFloatingWidgetView.findViewById(R.id.pickup_all_passengers_button).setOnClickListener(this);
    }

    private static void showTrackingText(boolean show){
        if(show == true)
        {
            runOnUiThread(new Runnable() {
                @Override
                public void run() {
                    trackingText.setVisibility(View.VISIBLE);
                }
            });
        }
        else
        {
            runOnUiThread(new Runnable() {
                @Override
                public void run() {
                    trackingText.setVisibility(View.GONE);
                }
            });
        }
    }

    private static void showArrivedPassengerView(boolean show){
        if(show == true)
        {
            runOnUiThread(new Runnable() {
                @Override
                public void run() {
                    collapsedView.setVisibility(View.GONE);
                    expandedView.setVisibility(View.VISIBLE);
                    arrivedPassengerView.setVisibility(View.VISIBLE);
                }
            });
        }
        else
        {
            runOnUiThread(new Runnable() {
                @Override
                public void run() {
                    arrivedPassengerView.setVisibility(View.GONE);
                }
            });
        }
    }

    public static void handleAction (ActionObject action)
    {
        bound = action.getBound();
        type = action.getType();

        switch (action.getType()){
            case ActionObject.UPDATE_PASSENGER:
                updatePassengerDetails(action);
                showArrivedPassengerView(false);
                break;
            case ActionObject.PICK_ALL_PASSENGERS:
                showPickupAllPassengers(action);
                showArrivedPassengerView(false);
                break;
            case ActionObject.TRIPS_COMPLETED:
                showEndTripButton(action);
                showArrivedPassengerView(false);
                break;
            case ActionObject.END_TRIP:
                onTripEnded(action);
                showArrivedPassengerView(false);
                break;
            case ActionObject.START_TRACKING:
                showTrackingText(true);
                showArrivedPassengerView(false);
                break;
            case ActionObject.ARRIVED_PASSENGER:
                showArrivedPassengerView(true);
                break;
            case ActionObject.END_TRACKING:
                showTrackingText(false);
                showArrivedPassengerView(false);
                break;
        }
    }
    public static void onTripEnded(ActionObject action){
        runOnUiThread(new Runnable() {
            @Override
            public void run() {
                passengerView.setVisibility(View.GONE);
                endTripView.setVisibility(View.GONE);
                pickupAllPassengersView.setVisibility(View.GONE);
            }
        });
    }
    public static void showPickupAllPassengers(ActionObject action){
        runOnUiThread(new Runnable() {
            @Override
            public void run() {
                passengerView.setVisibility(View.GONE);
                endTripView.setVisibility(View.GONE);
                pickupAllPassengersView.setVisibility(View.VISIBLE);
            }
        });
    }

    public static void showEndTripButton(ActionObject action){
        // update the passenger name, address,
        runOnUiThread(new Runnable() {
            @Override
            public void run() {
                passengerView.setVisibility(View.GONE);
                pickupAllPassengersView.setVisibility(View.GONE);
                endTripView.setVisibility(View.VISIBLE);
            }
        });
    }

    public static void updatePassengerDetails(ActionObject action){
        // update the passenger name, address,
        runOnUiThread(new Runnable() {
            @Override
            public void run() {
                passengerView.setVisibility(View.VISIBLE);
                endTripView.setVisibility(View.GONE);
                yesNoView.setVisibility(View.GONE);
                pickupAllPassengersView.setVisibility(View.GONE);
                passengerName.setText(action.getName());
                passengerName.setPaintFlags(passengerName.getPaintFlags() | Paint.UNDERLINE_TEXT_FLAG);

                if( bound.equalsIgnoreCase("inbound"))
                {
                    passengerAddress.setText(action.getLocation());; // Shows view
                    acceptPickupDropoffButtonText.setText(R.string.accept_pickup_button_text);
                }
                else
                {
                    passengerAddress.setText(action.getDestination());
                    acceptPickupDropoffButtonText.setText(R.string.accept_dropoff_button_text);
                }
            }
        });
    }

    private void onAccept(){
        action = "accept";
        passengerView.setVisibility(View.GONE);
        endTripView.setVisibility(View.GONE);
        pickupAllPassengersView.setVisibility(View.GONE);
        yesNoView.setVisibility(View.VISIBLE);

        runOnUiThread(new Runnable() {
            @Override
            public void run() {
                if(bound.equalsIgnoreCase("inbound"))
                {
                    yesNoText.setText(R.string.yes_no_confirm_pickup_passenger_text);
                }
                else
                {
                    yesNoText.setText(R.string.yes_no_confirm_dropoff_passenger_text);
                }
                yesNoButtonText.setText(R.string.yes_confirm_button_text);
                yesNoButtonText.setBackgroundResource(R.drawable.yes_button);
                yesNoButtonText.setTextColor( getResources().getColor( R.color.white));


            }
        });
    }

    private void onDecline(){
        action = "decline";
        passengerView.setVisibility(View.GONE);
        endTripView.setVisibility(View.GONE);
        pickupAllPassengersView.setVisibility(View.GONE);
        yesNoView.setVisibility(View.VISIBLE);
        runOnUiThread(new Runnable() {
            @Override
            public void run() {
                if(bound.equalsIgnoreCase("inbound"))
                {
                    yesNoText.setText(R.string.yes_no_decline_pickup_passenger_text);
                }
                else
                {
                    yesNoText.setText(R.string.yes_no_decline_dropoff_passenger_text);
                }
                yesNoButtonText.setText(R.string.yes_decline_button_text);
                yesNoButtonText.setBackgroundResource(R.drawable.decline_button);
                yesNoButtonText.setTextColor( getResources().getColor( R.color.red));
            }
        });
    }

    private void onEndTrip()
    {
        action = "end_trip";
        passengerView.setVisibility(View.GONE);
        endTripView.setVisibility(View.GONE);
        pickupAllPassengersView.setVisibility(View.GONE);
        yesNoView.setVisibility(View.VISIBLE);
        runOnUiThread(new Runnable() {
            @Override
            public void run() {
                yesNoText.setText(R.string.yes_no_end_trip_text);
                yesNoButtonText.setText(R.string.yes_end_button_text);
                yesNoButtonText.setBackgroundResource(R.drawable.yes_button);
                yesNoButtonText.setTextColor( getResources().getColor( R.color.white));


            }
        });
    }

    private void onPickupAllPassengers(){
        action = "pickup_all_passengers";
        passengerView.setVisibility(View.GONE);
        endTripView.setVisibility(View.GONE);
        pickupAllPassengersView.setVisibility(View.GONE);
        yesNoView.setVisibility(View.VISIBLE);
        runOnUiThread(new Runnable() {
            @Override
            public void run() {

                yesNoButtonText.setText(R.string.accept_pickup_button_text);
                yesNoText.setText(R.string.yes_no_pickup_all_passengers);
                yesNoButtonText.setBackgroundResource(R.drawable.yes_button);
                yesNoButtonText.setTextColor( getResources().getColor( R.color.white));

            }
        });
    }

    private void onYes()
    {
        WritableMap params = Arguments.createMap();
        ReactApplicationContext reactContext = (ReactApplicationContext) CalendarModule.getContext();
        params.putString("eventProperty", "someValue");
        switch(action){
            case "accept":
                CalendarModule.sendEvent(reactContext, "EtapathAcceptPassenger", params);
                passengerView.setVisibility(View.VISIBLE);
                break;
            case "decline":
                CalendarModule.sendEvent(reactContext, "EtapathDeclinePassenger", params);
                passengerView.setVisibility(View.VISIBLE);
                break;
            case "end_trip":
                CalendarModule.sendEvent(reactContext, "EtapathEndTrip", params);
                endTripView.setVisibility(View.GONE);
                CalendarModule.bringApplicationToFront(reactContext);
                onCloseWidget();
                stopSelf();
                break;
            case "pickup_all_passengers":
                CalendarModule.sendEvent(reactContext, "EtapathPickupAllPassengers", params);
                pickupAllPassengersView.setVisibility(View.VISIBLE);
                break;
        }

        yesNoView.setVisibility(View.GONE);
        // hide expanded view
        collapsedView.setVisibility(View.VISIBLE);
        expandedView.setVisibility(View.GONE);
    }

    private void onNo(){

        switch(action)
        {
            case "accept":
            case "decline":
                passengerView.setVisibility(View.VISIBLE);
                break;
            case "end_trip":
                endTripView.setVisibility(View.VISIBLE);
                break;
            case "pickup_all_passengers":
                pickupAllPassengersView.setVisibility(View.VISIBLE);
                break;
        }
        yesNoView.setVisibility(View.GONE);
    }

    private void onCloseWidget()
    {
        WritableMap params = Arguments.createMap();
        ReactApplicationContext reactContext = (ReactApplicationContext) CalendarModule.getContext();
        params.putString("eventProperty", "false");
        CalendarModule.sendEvent(reactContext, "EtapathUpdateWidgetStatus", params);
    }


    @Override
    public void onClick(View v) {
        switch (v.getId()) {
            /*case R.id.close_floating_view:
                //close the service and remove the from from the window
                onCloseWidget();
                stopSelf();
                break;*/
            case R.id.close_expanded_view:
                collapsedView.setVisibility(View.VISIBLE);
                expandedView.setVisibility(View.GONE);
                break;
            case R.id.accept:
                onAccept();
                break;
            case R.id.decline:
                onDecline();
                break;
            case R.id.yes:
                onYes();
                break;
            case R.id.no:
                onNo();
                break;
            case R.id.end_trip_button:
                onEndTrip();
                break;
            case R.id.pickup_all_passengers_button:
                onPickupAllPassengers();
                break;


            /*case R.id.open_activity_button:
                //open the activity and stop service
                Intent intent = new Intent(FloatingWidgetService.this, MainActivity.class);
                intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
                startActivity(intent);

                //close the service and remove view from the view hierarchy
                stopSelf();
                break;*/
        }
    }

    /*  on Floating Widget Long Click, increase the size of remove view as it look like taking focus */
    private void onFloatingWidgetLongClick() {
        //Get remove Floating view params
        WindowManager.LayoutParams removeParams = (WindowManager.LayoutParams) removeFloatingWidgetView.getLayoutParams();

        //get x and y coordinates of remove view
        int x_cord = (szWindow.x - removeFloatingWidgetView.getWidth()) / 2;
        int y_cord = szWindow.y - (removeFloatingWidgetView.getHeight() + getStatusBarHeight());


        removeParams.x = x_cord;
        removeParams.y = y_cord;

        //Update Remove view params
        mWindowManager.updateViewLayout(removeFloatingWidgetView, removeParams);
    }

    /*  Reset position of Floating Widget view on dragging  */
    private void resetPosition(int x_cord_now) {
        if (x_cord_now <= szWindow.x / 2) {
            isLeft = true;
            moveToLeft(x_cord_now);
        } else {
            isLeft = false;
            moveToRight(x_cord_now);
        }

    }


    /*  Method to move the Floating widget view to Left  */
    private void moveToLeft(final int current_x_cord) {
        final int x = szWindow.x - current_x_cord;

        new CountDownTimer(500, 5) {
            //get params of Floating Widget view
            WindowManager.LayoutParams mParams = (WindowManager.LayoutParams) mFloatingWidgetView.getLayoutParams();

            public void onTick(long t) {
                long step = (500 - t) / 5;

                mParams.x = 0 - (int) (current_x_cord * current_x_cord * step);

                //If you want bounce effect uncomment below line and comment above line
                // mParams.x = 0 - (int) (double) bounceValue(step, x);


                //Update window manager for Floating Widget
                mWindowManager.updateViewLayout(mFloatingWidgetView, mParams);
            }

            public void onFinish() {
                mParams.x = 0;

                //Update window manager for Floating Widget
                mWindowManager.updateViewLayout(mFloatingWidgetView, mParams);
            }
        }.start();
    }

    /*  Method to move the Floating widget view to Right  */
    private void moveToRight(final int current_x_cord) {

        new CountDownTimer(500, 5) {
            //get params of Floating Widget view
            WindowManager.LayoutParams mParams = (WindowManager.LayoutParams) mFloatingWidgetView.getLayoutParams();

            public void onTick(long t) {
                long step = (500 - t) / 5;

                mParams.x = (int) (szWindow.x + (current_x_cord * current_x_cord * step) - mFloatingWidgetView.getWidth());

                //If you want bounce effect uncomment below line and comment above line
                //  mParams.x = szWindow.x + (int) (double) bounceValue(step, x_cord_now) - mFloatingWidgetView.getWidth();

                //Update window manager for Floating Widget
                mWindowManager.updateViewLayout(mFloatingWidgetView, mParams);
            }

            public void onFinish() {
                mParams.x = szWindow.x - mFloatingWidgetView.getWidth();

                //Update window manager for Floating Widget
                mWindowManager.updateViewLayout(mFloatingWidgetView, mParams);
            }
        }.start();
    }

    /*  Get Bounce value if you want to make bounce effect to your Floating Widget */
    private double bounceValue(long step, long scale) {
        double value = scale * java.lang.Math.exp(-0.055 * step) * java.lang.Math.cos(0.08 * step);
        return value;
    }


    /*  Detect if the floating view is collapsed or expanded */
    private boolean isViewCollapsed() {
        return mFloatingWidgetView == null || mFloatingWidgetView.findViewById(R.id.collapse_view).getVisibility() == View.VISIBLE;
    }


    /*  return status bar height on basis of device display metrics  */
    private int getStatusBarHeight() {
        return (int) Math.ceil(25 * getApplicationContext().getResources().getDisplayMetrics().density);
    }


    /*  Update Floating Widget view coordinates on Configuration change  */
    @Override
    public void onConfigurationChanged(Configuration newConfig) {
        super.onConfigurationChanged(newConfig);

        getWindowManagerDefaultDisplay();

        WindowManager.LayoutParams layoutParams = (WindowManager.LayoutParams) mFloatingWidgetView.getLayoutParams();

        if (newConfig.orientation == Configuration.ORIENTATION_LANDSCAPE) {


            if (layoutParams.y + (mFloatingWidgetView.getHeight() + getStatusBarHeight()) > szWindow.y) {
                layoutParams.y = szWindow.y - (mFloatingWidgetView.getHeight() + getStatusBarHeight());
                mWindowManager.updateViewLayout(mFloatingWidgetView, layoutParams);
            }

            if (layoutParams.x != 0 && layoutParams.x < szWindow.x) {
                resetPosition(szWindow.x);
            }

        } else if (newConfig.orientation == Configuration.ORIENTATION_PORTRAIT) {

            if (layoutParams.x > szWindow.x) {
                resetPosition(szWindow.x);
            }

        }

    }

    /*  on Floating widget click show expanded view  */
    private void onFloatingWidgetClick() {
        if (isViewCollapsed()) {
            //When user clicks on the image view of the collapsed layout,
            //visibility of the collapsed layout will be changed to "View.GONE"
            //and expanded view will become visible.
            collapsedView.setVisibility(View.GONE);
            expandedView.setVisibility(View.VISIBLE);

        }
    }

    @Override
    public void onDestroy() {
        super.onDestroy();

        /*  on destroy remove both view from window manager */

        if (mFloatingWidgetView != null)
            mWindowManager.removeView(mFloatingWidgetView);

        if (removeFloatingWidgetView != null)
            mWindowManager.removeView(removeFloatingWidgetView);

    }
}