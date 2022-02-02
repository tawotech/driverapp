import { position } from "native-base/lib/typescript/theme/styled-system";
import React, { useState } from "react";
import { View,Text } from "native-base";
import { PanGestureHandler } from "react-native-gesture-handler";
import Animated, { Extrapolate, interpolate, runOnJS, useAnimatedGestureHandler, useAnimatedStyle, useSharedValue, withSpring } from "react-native-reanimated";

const BUTTON_WIDTH = 350;
const BUTTON_HEIGHT = 60;
const BUTTON_PADDING = 4;
const SWIPABALE_DIMENSIONS = BUTTON_HEIGHT - (2 * BUTTON_PADDING);


const H_WAVE_RANGE = SWIPABALE_DIMENSIONS + 2 * BUTTON_PADDING;
const H_SWIPE_RANGE = BUTTON_WIDTH - 2 * BUTTON_PADDING - SWIPABALE_DIMENSIONS;
const ToggledStates = ["left", "center", "right" ]

const SwipeButton = ({onToggle, status, leftText, rightText}) => {
    const [toggled, setToggled] = useState(ToggledStates[1])
    const X = useSharedValue(H_SWIPE_RANGE/2);

    const handleComplete = (isToggled)=>{
        if(isToggled !== toggled)
        {
            console.log("handle complete value is: " + isToggled);
            setToggled(isToggled);
            onToggle(status, isToggled);
        }
    }
    const animatedGestureHandler = useAnimatedGestureHandler({
        onStart: (e, ctx)=>{
            ctx.completed = toggled
        },
        onActive:(e, ctx)=>{
            let newValue;
            if(ctx.completed == ToggledStates[0]) // left
            {
                newValue = e.translationX
            }
            else if(ctx.completed == ToggledStates[1]) // center
            {
                newValue = H_SWIPE_RANGE/2 + e.translationX
            }
            else if(ctx.completed == ToggledStates[2]) // right
            {
                newValue = H_SWIPE_RANGE + e.translationX
            }
            else
            {
                newValue = e.translationX;
            }

            if(newValue >= 0 && newValue <= H_SWIPE_RANGE)
            {
                X.value = newValue;
            }
        },
        onEnd:(e)=>{
            if(X.value <= SWIPABALE_DIMENSIONS/2 + 10)
            {
                X.value = withSpring(0);
                runOnJS(handleComplete)("left");
            }
            else if(X.value > (H_SWIPE_RANGE  - (SWIPABALE_DIMENSIONS/2) - 10))
            {
                X.value = withSpring(H_SWIPE_RANGE);
                runOnJS(handleComplete)("right");
            }
            else{
                X.value = withSpring(H_SWIPE_RANGE/2);
                runOnJS(handleComplete)("center");
            }
        }
    });


    const InterpolateXInput1 = [0, H_SWIPE_RANGE/2];
    const InterpolateXInput2 = [H_SWIPE_RANGE/2,H_SWIPE_RANGE];

    const AnimatedStyles = {
        swipable: useAnimatedStyle(()=>{
            return {
                transform: [{translateX: X.value}]
            }
        }),
        swipeTextAccept: useAnimatedStyle(()=>{
            return {
                opacity: interpolate(X.value, InterpolateXInput1,
                    [
                        0,0.8
                    ],
                    Extrapolate.CLAMP
                ),
                transform: [{
                    translateX: interpolate(X.value -BUTTON_WIDTH/2 ,InterpolateXInput1,[
                        SWIPABALE_DIMENSIONS + BUTTON_PADDING,
                        BUTTON_WIDTH/2 - SWIPABALE_DIMENSIONS,
                        Extrapolate.CLAMP
                    ])
                }]
            }
        }),
        swipeTextDecline: useAnimatedStyle(()=>{
            return {
                opacity: interpolate(X.value, InterpolateXInput2,
                    [
                        0.8,0
                    ],
                    Extrapolate.CLAMP
                ),
                transform: [{
                    translateX: interpolate(X.value - BUTTON_WIDTH/2,InterpolateXInput2,[
                        BUTTON_WIDTH/2,
                        BUTTON_WIDTH - SWIPABALE_DIMENSIONS + BUTTON_PADDING,
                        Extrapolate.CLAMP
                    ])
                }]
            }
        }),
        /*swipeTextOnDeclined: useAnimatedStyle(()=>{
            return {
                opacity: interpolate(X.value, InterpolateXInput1,
                    [
                        0.8,0
                    ],
                    Extrapolate.CLAMP
                ),
                transform: [{
                    translateX: interpolate(X.value,InterpolateXInput1,[
                        0,
                        BUTTON_WIDTH/2 - SWIPABALE_DIMENSIONS,
                        Extrapolate.CLAMP
                    ])
                }]
            }
        }),
        swipeTextOnAccepted: useAnimatedStyle(()=>{
            return {
                opacity: interpolate(X.value, InterpolateXInput2,
                    [
                        0,0.8
                    ],
                    Extrapolate.CLAMP
                ),
                transform: [{
                    translateX: interpolate(X.value,InterpolateXInput2,[
                        0,
                        BUTTON_WIDTH/2 - SWIPABALE_DIMENSIONS,
                        Extrapolate.CLAMP
                    ])
                }]
            }
        })*/
    }
    return (

    <View
        style ={{
            width:100+"%",
            alignItems: "center"
        }}
    >

        <View
            style ={{
                flexDirection: "row",
                justifyContent: "space-between",
                width: 100 + "%",
                paddingHorizontal: 10,
                paddingBottom: 10
            }}
        >
            <Animated.Text
                style = {[
                    {
                        alignSelf: "center",
                        fontSize: 20,
                        fontWeight: "bold",
                        color : "red",
                    },
                    //AnimatedStyles.swipeTextAccept
                ]}
            >
                {leftText}
            </Animated.Text>
            <Animated.Text
                style = {[
                    {
                        alignSelf: "center",
                        fontSize: 20,
                        fontWeight: "bold",
                        color : "green",
                    },
                    //AnimatedStyles.swipeTextDecline
                ]}
            >
                {rightText}
            </Animated.Text>
        </View>

        <View
            style ={{
                height: BUTTON_HEIGHT,
                width: BUTTON_WIDTH,
                padding: BUTTON_PADDING,
                display: 'flex',
                alignItems: "center",
                justifyContent: "center",
                borderRadius: BUTTON_HEIGHT,
                backgroundColor: 'rgb(171,241,156)'
            }}
        >
            <PanGestureHandler
                onGestureEvent={animatedGestureHandler}
            >
                <Animated.View
                    style = {[
                        AnimatedStyles.swipable,
                        {
                            height: SWIPABALE_DIMENSIONS,
                            width: SWIPABALE_DIMENSIONS,
                            borderRadius: SWIPABALE_DIMENSIONS,
                            backgroundColor: 'green',
                            position: 'absolute',
                            left: BUTTON_PADDING,
                            //padding: BUTTON_PADDING,
                            zIndex: 3,
                            alignSelf: "center",
                            padding: 10
                        }
                    ]}
                    
                >
                </Animated.View>
            </PanGestureHandler>
            {
                /*
                
                */
            }
            
            {
                /*
                <View
                style ={{
                    height: BUTTON_HEIGHT,
                    width: BUTTON_WIDTH,
                    padding: BUTTON_PADDING,
                    //display: 'flex',
                    alignItems: "center",
                    justifyContent: "center",
                    borderRadius: BUTTON_HEIGHT,
                    //backgroundColor: 'white',
                    position: "absolute",
                    zIndex: 2

                }}
            >
                <Animated.Text
                    style = {[
                        {
                            alignSelf: "center",
                            fontSize: 20,
                            fontWeight: "bold",
                            color : "blue",
                        },
                        AnimatedStyles.swipeTextOnAccepted
                    ]}
                >
                    Accepted
                </Animated.Text>
            </View>
            <View
                style ={{
                    height: BUTTON_HEIGHT,
                    width: BUTTON_WIDTH,
                    padding: BUTTON_PADDING,
                    //display: 'flex',
                    alignItems: "center",
                    justifyContent: "center",
                    borderRadius: BUTTON_HEIGHT,
                    //backgroundColor: 'white',
                    position: "absolute",
                    zIndex: 2

                }}
            >
                <Animated.Text
                    style = {[
                        {
                            alignSelf: "center",
                            fontSize: 20,
                            fontWeight: "bold",
                            color : "blue",
                        },
                        AnimatedStyles.swipeTextOnDeclined
                    ]}
                >
                    Declined
                </Animated.Text>
            </View>*/
            }
            
        </View>
    </View>
    )
}

export default SwipeButton;