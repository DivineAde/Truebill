import React, { useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';

interface AuthLogoProps {
    size?: 'sm' | 'lg';
}

export default function AuthLogo({ size = 'lg' }: AuthLogoProps) {
    const isLg = size === 'lg';
    const markScale = useSharedValue(0.86);

    useEffect(() => {
        markScale.value = withSpring(1, { damping: 14, stiffness: 160 });
    }, [markScale]);

    const markStyle = useAnimatedStyle(() => ({
        transform: [{ scale: markScale.value }],
    }));

    return (
        <View style={styles.container}>
            <Animated.Image
                            source={require('../../assets/brand/pockur-icon.png')}
                            className="w-14 h-14  flex items-center justify-center"
                            
                        />
            <View style={styles.copy}>
                <Text style={[styles.wordmark, isLg ? styles.wordmarkLg : styles.wordmarkSm]}>Pockur</Text>
                <Text style={styles.wordmarkSub}>SUBSCRIPTIONS</Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    mark: {
        borderRadius: 22,
        backgroundColor: '#081126',
        alignItems: 'center',
        justifyContent: 'center',
    },
    markLg: {
        width: 68,
        height: 68,
    },
    markSm: {
        width: 56,
        height: 56,
        borderRadius: 18,
    },
    markText: {
        color: '#FFF9E3',
        fontFamily: 'sans-extrabold',
    },
    markTextLg: {
        fontSize: 30,
        lineHeight: 34,
    },
    markTextSm: {
        fontSize: 24,
        lineHeight: 28,
    },
    copy: {
        alignItems: 'flex-start',
    },
    wordmark: {
        color: '#081126',
        fontFamily: 'sans-extrabold',
        letterSpacing: -0.5,
    },
    wordmarkLg: {
        fontSize: 30,
        lineHeight: 34,
    },
    wordmarkSm: {
        fontSize: 24,
        lineHeight: 28,
    },
    wordmarkSub: {
        marginTop: 2,
        fontSize: 10,
        fontFamily: 'sans-semibold',
        color: 'rgba(8, 17, 38, 0.5)',
        letterSpacing: 2.2,
    },
});
