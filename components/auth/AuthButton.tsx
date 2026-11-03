import React from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text, type StyleProp, type ViewStyle } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';
import { haptics } from './useHaptics';

type Variant = 'primary' | 'secondary' | 'ghost';
type Size = 'lg' | 'sm';

interface AuthButtonProps {
    label: string;
    onPress?: () => void;
    loading?: boolean;
    disabled?: boolean;
    variant?: Variant;
    size?: Size;
    icon?: React.ReactNode;
    style?: StyleProp<ViewStyle>;
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export default function AuthButton({
    label,
    onPress,
    loading = false,
    disabled = false,
    variant = 'primary',
    size = 'lg',
    icon,
    style,
}: AuthButtonProps) {
    const scale = useSharedValue(1);
    const isDisabled = disabled || loading;

    const pressStyle = useAnimatedStyle(() => ({
        transform: [{ scale: scale.value }],
    }));

    const handlePressIn = () => {
        if (isDisabled) return;
        haptics.light();
        scale.value = withSpring(0.965, { damping: 20, stiffness: 340 });
    };

    const handlePressOut = () => {
        scale.value = withSpring(1, { damping: 20, stiffness: 340 });
    };

    const spinnerColor = variant === 'primary' ? '#FFF9E3' : variant === 'secondary' ? '#081126' : '#EA7A53';

    return (
        <AnimatedPressable
            accessibilityRole="button"
            accessibilityState={{ disabled: isDisabled, busy: loading }}
            onPress={onPress}
            onPressIn={handlePressIn}
            onPressOut={handlePressOut}
            disabled={isDisabled}
            style={[styles.base, styles[size], styles[variant], isDisabled && styles.disabled, pressStyle, style]}
        >
            {loading ? (
                <ActivityIndicator color={spinnerColor} size="small" />
            ) : (
                <>
                    <Text
                        style={[
                            styles.label,
                            variant === 'primary' && styles.labelPrimary,
                            variant === 'secondary' && styles.labelSecondary,
                            variant === 'ghost' && styles.labelGhost,
                        ]}
                    >
                        {label}
                    </Text>
                    {icon ?? null}
                </>
            )}
        </AnimatedPressable>
    );
}

const styles = StyleSheet.create({
    base: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 18,
        paddingHorizontal: 22,
        gap: 10,
    },
    lg: {
        height: 58,
    },
    sm: {
        height: 48,
    },
    primary: {
        backgroundColor: '#081126',
        shadowColor: '#081126',
        shadowOpacity: 0.25,
        shadowRadius: 14,
        shadowOffset: { width: 0, height: 8 },
        elevation: 4,
    },
    secondary: {
        backgroundColor: 'rgba(255, 255, 255, 0.72)',
        borderWidth: 1,
        borderColor: 'rgba(8, 17, 38, 0.12)',
    },
    ghost: {
        backgroundColor: 'transparent',
    },
    disabled: {
        opacity: 0.4,
    },
    label: {
        fontSize: 16,
        fontFamily: 'sans-bold',
        letterSpacing: 0.2,
    },
    labelPrimary: {
        color: '#FFF9E3',
    },
    labelSecondary: {
        color: '#081126',
    },
    labelGhost: {
        color: '#EA7A53',
    },
});
