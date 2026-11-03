import React, { useEffect } from 'react';
import { type StyleProp, type ViewStyle } from 'react-native';
import Animated, {
    interpolate,
    useAnimatedStyle,
    useReducedMotion,
    useSharedValue,
    withDelay,
    withSpring,
    withTiming,
} from 'react-native-reanimated';

interface RevealProps {
    children: React.ReactNode;
    delay?: number;
    distance?: number;
    fade?: boolean;
    style?: StyleProp<ViewStyle>;
}

export default function Reveal({ children, delay = 0, distance = 26, fade = true, style }: RevealProps) {
    const reduced = useReducedMotion();
    const progress = useSharedValue(0);

    useEffect(() => {
        if (reduced) {
            progress.value = withDelay(0, withTiming(1, { duration: 1 }));
            return;
        }
        progress.value = withDelay(delay, withSpring(1, { damping: 20, stiffness: 150 }));
    }, [delay, progress, reduced]);

    const animatedStyle = useAnimatedStyle(() => {
        if (reduced) {
            return { opacity: fade ? progress.value : 1, transform: [{ translateY: 0 }] };
        }
        return {
            opacity: fade ? progress.value : 1,
            transform: [{ translateY: interpolate(progress.value, [0, 1], [distance, 0]) }],
        };
    });

    return <Animated.View style={[animatedStyle, style]}>{children}</Animated.View>;
}
