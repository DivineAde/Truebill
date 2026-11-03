import React from 'react';
import { Platform, StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';
import { GlassView, isLiquidGlassAvailable } from 'expo-glass-effect';

interface GlassCardProps {
    children: React.ReactNode;
    style?: StyleProp<ViewStyle>;
    padded?: boolean;
}

export default function GlassCard({ children, style, padded = true }: GlassCardProps) {
    const nativeGlass = Platform.OS === 'ios' && isLiquidGlassAvailable();
    const cardStyle = [styles.card, padded && styles.padded, style];

    if (nativeGlass) {
        return (
            <GlassView style={cardStyle} glassEffectStyle="clear" tintColor="#FFF9E3">
                {children}
            </GlassView>
        );
    }

    return <View style={cardStyle}>{children}</View>;
}

const styles = StyleSheet.create({
    card: {
        borderRadius: 28,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.85)',
        backgroundColor: 'rgba(255, 255, 255, 0.55)',
        shadowColor: '#081126',
        shadowOpacity: 0.06,
        shadowRadius: 24,
        shadowOffset: { width: 0, height: 12 },
        elevation: 3,
    },
    padded: {
        padding: 24,
    },
});
