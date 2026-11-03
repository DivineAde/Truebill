import React, { useEffect, useState } from 'react';
import {
    Pressable,
    StyleSheet,
    Text,
    TextInput,
    View,
    type StyleProp,
    type TextInputProps,
    type ViewStyle,
} from 'react-native';
import Animated, {
    interpolate,
    interpolateColor,
    useAnimatedStyle,
    useDerivedValue,
    useSharedValue,
    withSequence,
    withSpring,
    withTiming,
} from 'react-native-reanimated';
import { CheckIcon, EyeIcon, EyeOffIcon } from './icons';
import { haptics } from './useHaptics';

const HEIGHT = 62;
const LABEL_IDLE_TOP = 20;
const LABEL_FLOAT_TOP = 6;
const LABEL_IDLE_SIZE = 16;
const LABEL_FLOAT_SIZE = 12;

const BORDER_IDLE = 'rgba(8, 17, 38, 0.14)';
const BORDER_FOCUS = '#EA7A53';
const BORDER_ERROR = '#DC2626';
const TEXT_MUTED = 'rgba(8, 17, 38, 0.45)';
const TEXT_ACCENT = '#EA7A53';
const TEXT_ERROR = '#DC2626';

interface AuthFieldProps {
    label: string;
    value: string;
    onChangeText: (text: string) => void;
    error?: string;
    helper?: string;
    valid?: boolean;
    secureTextEntry?: boolean;
    autoComplete?: TextInputProps['autoComplete'];
    textContentType?: TextInputProps['textContentType'];
    keyboardType?: TextInputProps['keyboardType'];
    autoCapitalize?: TextInputProps['autoCapitalize'];
    maxLength?: number;
    autoFocus?: boolean;
    onBlur?: () => void;
    onFocus?: () => void;
}

export default function AuthField({
    label,
    value,
    onChangeText,
    error,
    helper,
    valid = false,
    secureTextEntry = false,
    autoComplete,
    textContentType,
    keyboardType,
    autoCapitalize,
    maxLength,
    autoFocus,
    onBlur,
    onFocus,
}: AuthFieldProps) {
    const [focused, setFocused] = useState(false);
    const [secure, setSecure] = useState(!!secureTextEntry);

    const focus = useSharedValue(0);
    const float = useSharedValue(0);
    const errFlag = useSharedValue(0);
    const shake = useSharedValue(0);
    const check = useSharedValue(0);
    const eyePop = useSharedValue(1);
    const errIn = useSharedValue(0);

    const hasValue = value.length > 0;
    const showError = !!error;
    const showCheck = valid && hasValue && !showError;

    useEffect(() => {
        errFlag.value = withTiming(error ? 1 : 0, { duration: 220 });
    }, [error, errFlag]);

    useEffect(() => {
        if (!focused) {
            float.value = withTiming(hasValue ? 1 : 0, { duration: 200 });
        }
    }, [hasValue, focused, float]);

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
        check.value = showCheck ? withTiming(1, { duration: 240 }) : withTiming(0, { duration: 150 });
    }, [showCheck, check]);

    useEffect(() => {
        errIn.value = withTiming(error ? 1 : 0, { duration: 240 });
    }, [error, errIn]);

    const containerColor = useDerivedValue(() => {
        'worklet';
        if (errFlag.value > 0.5) return BORDER_ERROR;
        return interpolateColor(focus.value, [0, 1], [BORDER_IDLE, BORDER_FOCUS]);
    });

    const containerStyle = useAnimatedStyle(() => ({
        borderColor: containerColor.value,
        shadowOpacity: errFlag.value > 0.5 ? 0.22 : focus.value * 0.3,
        shadowRadius: errFlag.value > 0.5 ? 14 : 18,
        elevation: errFlag.value > 0.5 ? 4 : Math.round(focus.value * 4),
    }));

    const labelStyle = useAnimatedStyle(() => ({
        top: interpolate(float.value, [0, 1], [LABEL_IDLE_TOP, LABEL_FLOAT_TOP]),
        fontSize: interpolate(float.value, [0, 1], [LABEL_IDLE_SIZE, LABEL_FLOAT_SIZE]),
        color:
            errFlag.value > 0.5
                ? TEXT_ERROR
                : interpolateColor(float.value, [0, 1], [TEXT_MUTED, TEXT_ACCENT]),
    }));

    const shakeStyle = useAnimatedStyle(() => ({
        transform: [{ translateX: shake.value }],
    }));

    const checkStyle = useAnimatedStyle(() => ({
        opacity: check.value,
        transform: [{ scale: 0.4 + check.value * 0.6 }],
    }));

    const eyeStyle = useAnimatedStyle(() => ({
        transform: [{ scale: eyePop.value }],
    }));

    const errStyle = useAnimatedStyle(() => ({
        opacity: errIn.value,
        transform: [{ translateY: interpolate(errIn.value, [0, 1], [4, 0]) }],
    }));

    const handleFocus = () => {
        setFocused(true);
        focus.value = withTiming(1, { duration: 220 });
        float.value = withTiming(1, { duration: 220 });
        onFocus?.();
    };

    const handleBlur = () => {
        setFocused(false);
        focus.value = withTiming(0, { duration: 200 });
        float.value = withTiming(hasValue ? 1 : 0, { duration: 200 });
        onBlur?.();
    };

    const toggleSecure = () => {
        haptics.selection();
        eyePop.value = withSequence(withSpring(1.3, { damping: 9, stiffness: 260 }), withSpring(1, { damping: 16, stiffness: 200 }));
        setSecure((prev) => !prev);
    };

    const message = error || helper;

    return (
        <View style={styles.wrap}>
            <Animated.View style={[styles.inputShell, containerStyle, shakeStyle]}>
                <TextInput
                    style={styles.input}
                    value={value}
                    onChangeText={onChangeText}
                    secureTextEntry={secure}
                    onFocus={handleFocus}
                    onBlur={handleBlur}
                    autoFocus={autoFocus}
                    autoComplete={autoComplete}
                    textContentType={textContentType}
                    keyboardType={keyboardType}
                    autoCapitalize={autoCapitalize}
                    maxLength={maxLength}
                    placeholderTextColor="transparent"
                    accessibilityLabel={label}
                />
                <Animated.Text pointerEvents="none" style={[styles.label, labelStyle]}>
                    {label}
                </Animated.Text>

                {secureTextEntry ? (
                    <Animated.View style={eyeStyle}>
                        <Pressable onPress={toggleSecure} hitSlop={12} style={styles.trailingBtn} accessibilityRole="button" accessibilityLabel={secure ? 'Show password' : 'Hide password'}>
                            {secure ? <EyeOffIcon size={20} color={TEXT_MUTED} /> : <EyeIcon size={20} color={TEXT_ACCENT} />}
                        </Pressable>
                    </Animated.View>
                ) : (
                    <Animated.View style={checkStyle} pointerEvents="none">
                        <View style={styles.checkBadge}>
                            <CheckIcon size={12} color="#FFF9E3" strokeWidth={3} />
                        </View>
                    </Animated.View>
                )}
            </Animated.View>

            <View style={styles.messageSlot} pointerEvents="none">
                {message ? (
                    <Animated.View style={errStyle}>
                        <Text style={[styles.messageText, showError && styles.messageError]}>{message}</Text>
                    </Animated.View>
                ) : null}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    wrap: {
        gap: 0,
    },
    inputShell: {
        height: HEIGHT,
        borderRadius: 18,
        borderWidth: 1.5,
        backgroundColor: 'rgba(255, 255, 255, 0.7)',
        flexDirection: 'row',
        alignItems: 'center',
        shadowColor: '#EA7A53',
        shadowOffset: { width: 0, height: 6 },
    },
    input: {
        flex: 1,
        height: HEIGHT,
        paddingTop: 22,
        paddingBottom: 8,
        paddingLeft: 18,
        paddingRight: 12,
        fontSize: 16,
        color: '#081126',
        fontFamily: 'sans-medium',
    },
    label: {
        position: 'absolute',
        left: 18,
        fontFamily: 'sans-semibold',
        letterSpacing: 0.2,
    },
    trailingBtn: {
        width: 52,
        height: '100%',
        alignItems: 'center',
        justifyContent: 'center',
    },
    checkBadge: {
        width: 22,
        height: 22,
        borderRadius: 11,
        backgroundColor: '#EA7A53',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 16,
    },
    messageSlot: {
        height: 20,
        paddingTop: 4,
    },
    messageText: {
        fontSize: 12,
        fontFamily: 'sans-medium',
        color: TEXT_MUTED,
    },
    messageError: {
        color: TEXT_ERROR,
    },
});
