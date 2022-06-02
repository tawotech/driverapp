package com.drivernativeapp;

public class ActionObject {

    public static final String UPDATE_PASSENGER = "UPDATE_PASSENGER";
    public static final String PICK_ALL_PASSENGERS = "PICK_ALL_PASSENGERS";
    public static final String TRIPS_COMPLETED = "TRIPS_COMPLETED";
    public static final String END_TRIP = "END_TRIP";

    public static final String START_TRACKING = "START_TRACKING";
    public static final String END_TRACKING = "END_TRACKING";
    public static final String ARRIVED_PASSENGER = "ARRIVED_PASSENGER";



    private String location;
    private String destination;
    private String name;
    private String type;
    private String bound;

    public String getBound() {
        return bound;
    }

    public void setBound(String bound) {
        this.bound = bound;
    }

    public String getLocation() {
        return location;
    }

    public void setLocation(String location) {
        this.location = location;
    }

    public String getDestination() {
        return destination;
    }

    public void setDestination(String destination) {
        this.destination = destination;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public ActionObject(String location, String destination, String name, String type,String bound) {
        this.location = location;
        this.destination = destination;
        this.name = name;
        this.type = type;
        this.bound = bound;
    }

    public ActionObject() {}

}
