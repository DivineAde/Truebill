import React, { useEffect } from 'react';
import { StyleSheet } from 'react-native';
import Animated, {
    Easing,
    useAnimatedStyle,
    useReducedMotion,
    useSharedValue,
    withDelay,
    withSpring,
    withTiming,
} from 'react-native-reanimated';

const HOLD_MS = 11500;
const FADE_OUT_MS = 450;

interface OnboardingIntroProps {
    onDone: () => void;
}

export default function OnboardingIntro({ onDone }: OnboardingIntroProps) {
    const reduced = useReducedMotion();

    const fade = useSharedValue(1);
    const markScale = useSharedValue(0.82);

    useEffect(() => {
        if (reduced) {
            const timer = setTimeout(onDone, 280);
            return () => clearTimeout(timer);
        }

        markScale.value = withDelay(90, withSpring(1, { damping: 14, stiffness: 150 }));

        fade.value = withDelay(HOLD_MS, withTiming(0, { duration: FADE_OUT_MS, easing: Easing.inOut(Easing.sin) }));

        const timer = setTimeout(onDone, HOLD_MS + FADE_OUT_MS + 60);
        return () => clearTimeout(timer);
    }, [fade, markScale, onDone, reduced]);

    const fadeStyle = useAnimatedStyle(() => ({ opacity: fade.value }));

    const markStyle = useAnimatedStyle(() => ({
        transform: [{ scale: markScale.value }],
    }));

    return (
        <Animated.View style={[StyleSheet.absoluteFill, styles.root, fadeStyle]}>
            <Animated.Image
                source={require('../../assets/brand/pockur-logo-full.png')}
                style={[styles.mark, markStyle]}
                resizeMode="contain"
            />
        </Animated.View>
    );
}

const styles = StyleSheet.create({
    root: {
        backgroundColor: '#0B0D12',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 20,
    },
    mark: {
        width: 300,
        height: 300,
        elevation: 10,
    },
});