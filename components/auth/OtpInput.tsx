import React, { useEffect, useRef, useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withSequence, withSpring, withTiming } from 'react-native-reanimated';

interface OtpInputProps {
    value: string;
    onChangeText: (value: string) => void;
    length?: number;
    error?: string;
    autoFocus?: boolean;
    onFilled?: () => void;
}

const BOX_SIZE = 46;
const BOX_GAP = 10;
const BORDER_IDLE = 'rgba(8, 17, 38, 0.14)';
const BORDER_ACTIVE = '#EA7A53';
const BORDER_ERROR = '#DC2626';

function OtpBox({ digit, active, error }: { digit: string; active: boolean; error: boolean }) {
    const pop = useSharedValue(1);

    useEffect(() => {
        if (digit) {
            pop.value = withSequence(withSpring(1.28, { damping: 10, stiffness: 240 }), withSpring(1, { damping: 16, stiffness: 180 }));
        }
    }, [digit, pop]);

    const popStyle = useAnimatedStyle(() => ({
        transform: [{ scale: pop.value }],
    }));

    return (
        <Animated.View style={[styles.box, active && styles.boxActive, error && styles.boxError, popStyle]}>
            <Text style={styles.boxText}>{digit}</Text>
            {active && !digit ? <View style={styles.caret} /> : null}
        </Animated.View>
    );
}

export default function OtpInput({ value, onChangeText, length = 6, error, autoFocus = false, onFilled }: OtpInputProps) {
    const inputRef = useRef<TextInput>(null);
    const firedRef = useRef(false);
    const [focused, setFocused] = useState(false);
    const shake = useSharedValue(0);
    const filled = value.length === length;

    useEffect(() => {
        if (error) {
            shake.value = 0;
            shake.value = withSequence(
                withTiming(-9, { duration: 70 }),
                withTiming(9, { duration: 70 }),
                withTiming(-6, { duration: 70 }),
                withTiming(0, { duration: 70 }),
            );
        }
    }, [error, shake]);

    useEffect(() => {
        if (filled && !firedRef.current) {
            firedRef.current = true;
            onFilled?.();
        } else if (!filled) {
            firedRef.current = false;
        }
    }, [filled, onFilled]);

    const shakeStyle = useAnimatedStyle(() => ({
        transform: [{ translateX: shake.value }],
    }));

    const handleChange = (text: string) => {
        onChangeText(text.replace(/\D/g, '').slice(0, length));
    };

    const handlePress = () => {
        inputRef.current?.focus();
    };

    const boxes = Array.from({ length }, (_, index) => (
        <OtpBox key={index} digit={value[index] ?? ''} active={focused && index === value.length} error={!!error} />
    ));

    return (
        <View style={styles.wrap}>
            <Animated.View style={[styles.row, shakeStyle]}>
                <Pressable style={styles.row} onPress={handlePress} accessibilityLabel="Enter verification code">
                    {boxes}
                </Pressable>
                <TextInput
                    ref={inputRef}
                    style={styles.hiddenInput}
                    value={value}
                    onChangeText={handleChange}
                    keyboardType="number-pad"
                    maxLength={length}
                    autoFocus={autoFocus}
                    autoComplete="one-time-code"
                    onFocus={() => setFocused(true)}
                    onBlur={() => setFocused(false)}
                    caretHidden
                    selectionColor="transparent"
                />
            </Animated.View>

            <View style={styles.messageSlot} pointerEvents="none">
                {error ? (
                    <Text style={styles.errorText}>{error}</Text>
                ) : (
                    <Text style={styles.helperText}>{filled ? 'Code looks good' : 'Enter the 6-digit code'}</Text>
                )}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    wrap: {
        alignItems: 'center',
    },
    row: {
        flexDirection: 'row',
        gap: BOX_GAP,
        alignSelf: 'center',
    },
    hiddenInput: {
        position: 'absolute',
        width: 1,
        height: 1,
        opacity: 0.01,
        backgroundColor: 'transparent',
        color: 'transparent',
    },
    box: {
        width: BOX_SIZE,
        height: 58,
        borderRadius: 16,
        borderWidth: 1.5,
        borderColor: BORDER_IDLE,
        backgroundColor: 'rgba(255, 255, 255, 0.7)',
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#EA7A53',
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0,
        shadowRadius: 0,
        elevation: 0,
    },
    boxActive: {
        borderColor: BORDER_ACTIVE,
        shadowOpacity: 0.22,
        shadowRadius: 12,
        elevation: 3,
    },
    boxError: {
        borderColor: BORDER_ERROR,
    },
    boxText: {
        fontSize: 22,
        fontFamily: 'sans-extrabold',
        color: '#081126',
    },
    caret: {
        position: 'absolute',
        bottom: 10,
        width: 18,
        height: 2.5,
        borderRadius: 2,
        backgroundColor: '#EA7A53',
    },
    messageSlot: {
        height: 24,
        paddingTop: 6,
    },
    errorText: {
        fontSize: 12,
        fontFamily: 'sans-medium',
        color: '#DC2626',
        textAlign: 'center',
    },
    helperText: {
        fontSize: 12,
        fontFamily: 'sans-medium',
        color: 'rgba(8, 17, 38, 0.45)',
        textAlign: 'center',
    },
});
