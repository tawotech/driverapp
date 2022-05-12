import React, { useState } from "react";
import { View,
    Text, 
    Button,
    Pressable, 
    Center,
    HamburgerIcon 
} from "native-base";
import { PanGestureHandler } from "react-native-gesture-handler";
import Animated, { Extrapolate, interpolate, runOnJS, useAnimatedGestureHandler, useAnimatedStyle, useSharedValue, withSpring } from "react-native-reanimated";

const BUTTON_WIDTH = 350;
const BUTTON_HEIGHT = 60;
const BUTTON_PADDING = 4;
const SWIPABALE_DIMENSIONS = BUTTON_HEIGHT - (2 * BUTTON_PADDING);


const H_WAVE_RANGE = SWIPABALE_DIMENSIONS + 2 * BUTTON_PADDING;
const H_SWIPE_RANGE = BUTTON_WIDTH - 2 * BUTTON_PADDING - SWIPABALE_DIMENSIONS;

const SwipeButton = ({onToggle, status, headingText}) => {
    const [toggled, setToggled] = useState(false)
    const X = useSharedValue(0);

    const handleComplete = (isToggled)=>{
        if(isToggled !== toggled)
        {
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
            if(ctx.completed) // left
            {
                newValue = e.translationX
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
            if(X.value > H_SWIPE_RANGE - (SWIPABALE_DIMENSIONS/2) - 5)
            {
                X.value = withSpring(H_SWIPE_RANGE);
                runOnJS(handleComplete)(true);
            }
            else
            {
                runOnJS(handleComplete)(false);
                X.value = withSpring(0);
            }
        }
    });

    const AnimatedStyles = {
        swipable: useAnimatedStyle(()=>{
            return {
                transform: [{translateX: X.value}]
            }
        })
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
                justifyContent: "center",
                width: 100 + "%",
                paddingHorizontal: 10,
                paddingBottom: 10
            }}
        >
            <Animated.Text
                style = {[
                    {
                        alignSelf: "center",
                        fontSize: 15,
                        fontWeight: "bold",
                        color : "gray",
                    },
                ]}
            >
                {headingText}
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
        </View>
    </View>
    )
}

export default SwipeButton;