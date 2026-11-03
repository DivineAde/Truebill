import React, { useEffect } from 'react';
import { Image, StyleSheet, Text, View, type StyleProp, type ViewStyle } from 'react-native';
import Animated, {
    Easing,
    useAnimatedStyle,
    useSharedValue,
    withDelay,
    withRepeat,
    withSpring,
    withTiming,
} from 'react-native-reanimated';
import netflix from '@/assets/icons/netflix.png';
import { icons } from '../../constants/icons';

interface FloatSpec {
    icon: number;
    size: number;
    duration: number;
    drift: number;
    angle: number;
    style: StyleProp<ViewStyle>;
}

const FLOATERS: FloatSpec[] = [
    {
        icon: icons.spotify,
        size: 48,
        duration: 3400,
        drift: 10,
        angle: 5,
        style: { top: -16, left: -12 },
    },
    {
        icon: netflix,
        size: 44,
        duration: 4100,
        drift: -10,
        angle: -6,
        style: { top: 36, right: -20 },
    },
    {
        icon: icons.notion,
        size: 46,
        duration: 3700,
        drift: 9,
        angle: 6,
        style: { bottom: -10, left: -26 },
    },
    {
        icon: icons.figma,
        size: 40,
        duration: 4300,
        drift: -9,
        angle: -5,
        style: { top: -24, right: 34 },
    },
];

const CARD_ICONS = [icons.spotify, icons.figma, icons.notion];

function FloatingChip({ spec }: { spec: FloatSpec }) {
    const bob = useSharedValue(0);
    const tilt = useSharedValue(0);

    useEffect(() => {
        bob.value = withRepeat(
            withTiming(spec.drift, { duration: spec.duration, easing: Easing.inOut(Easing.sin) }),
            -1,
            true,
        );
        tilt.value = withRepeat(
            withTiming(spec.angle, { duration: spec.duration * 1.7, easing: Easing.inOut(Easing.sin) }),
            -1,
            true,
        );
    }, [bob, tilt, spec]);

    const animatedStyle = useAnimatedStyle(() => ({
        transform: [{ translateY: bob.value }, { rotate: `${tilt.value}deg` }],
    }));

    return (
        <Animated.View
            style={[
                styles.chip,
                spec.style,
                { width: spec.size, height: spec.size, borderRadius: spec.size / 2 },
                animatedStyle,
            ]}
        >
            <Image
                source={spec.icon}
                style={{ width: spec.size * 0.5, height: spec.size * 0.5 }}
                resizeMode="contain"
            />
        </Animated.View>
    );
}

export default function SubscriptionHero() {
    const scale = useSharedValue(0.9);
    const translateY = useSharedValue(26);
    const rotate = useSharedValue(-6);

    useEffect(() => {
        scale.value = withDelay(180, withSpring(1, { damping: 15, stiffness: 140 }));
        translateY.value = withDelay(180, withSpring(0, { damping: 18, stiffness: 120 }));
    }, [scale, translateY]);

    const stackStyle = useAnimatedStyle(() => ({
        transform: [
            { translateY: translateY.value },
            { scale: scale.value },
            { rotate: `${rotate.value}deg` },
        ],
    }));

    return (
        <View style={styles.stage}>
            <View style={styles.backMint} />
            <View style={styles.backGold} />

            <Animated.View style={[styles.stack, stackStyle]}>
                <View style={styles.card}>
                    <View style={styles.cardTop}>
                        <View style={styles.spendDot} />
                        <Text style={styles.spendLabel}>MONTHLY SPEND</Text>
                    </View>
                    <Text style={styles.amount}>$2,489.48</Text>
                    <View style={styles.cardFooter}>
                        <View style={styles.chipRow}>
                            {CARD_ICONS.map((icon, index) => (
                                <View key={index} style={styles.miniChip}>
                                    <Image
                                        source={icon}
                                        style={styles.miniChipIcon}
                                        resizeMode="contain"
                                    />
                                </View>
                            ))}
                        </View>
                        <Text style={styles.moreLabel}>+12 more</Text>
                    </View>
                </View>
            </Animated.View>

            {FLOATERS.map((spec, index) => (
                <FloatingChip key={index} spec={spec} />
            ))}
        </View>
    );
}

const styles = StyleSheet.create({
    stage: {
        width: '100%',
        height: 264,
        alignItems: 'center',
        justifyContent: 'center',
    },
    backMint: {
        position: 'absolute',
        width: 214,
        height: 142,
        borderRadius: 22,
        backgroundColor: 'rgba(143, 209, 189, 0.55)',
        transform: [{ rotate: '7deg' }],
        top: -34,
        left: -8,
    },
    backGold: {
        position: 'absolute',
        width: 226,
        height: 152,
        borderRadius: 22,
        backgroundColor: 'rgba(242, 178, 92, 0.5)',
        transform: [{ rotate: '-8deg' }],
        bottom: -28,
        right: -10,
    },
    stack: {
        zIndex: 2,
    },
    card: {
        width: 252,
        height: 172,
        borderRadius: 26,
        backgroundColor: '#081126',
        paddingHorizontal: 22,
        paddingVertical: 20,
        justifyContent: 'space-between',
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.14)',
        shadowColor: '#081126',
        shadowOpacity: 0.3,
        shadowRadius: 24,
        shadowOffset: { width: 0, height: 16 },
        elevation: 12,
    },
    cardTop: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    spendDot: {
        width: 7,
        height: 7,
        borderRadius: 4,
        backgroundColor: '#8FD1BD',
    },
    spendLabel: {
        fontSize: 10,
        fontFamily: 'sans-semibold',
        color: 'rgba(255, 249, 227, 0.55)',
        letterSpacing: 2,
    },
    amount: {
        marginTop: 4,
        fontSize: 32,
        fontFamily: 'sans-extrabold',
        color: '#FFF9E3',
        letterSpacing: -1,
    },
    cardFooter: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    chipRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    miniChip: {
        width: 24,
        height: 24,
        borderRadius: 12,
        backgroundColor: '#FFFFFF',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: -6,
        borderWidth: 1.5,
        borderColor: '#081126',
    },
    miniChipIcon: {
        width: 12,
        height: 12,
    },
    moreLabel: {
        fontSize: 12,
        fontFamily: 'sans-semibold',
        color: 'rgba(255, 249, 227, 0.6)',
    },
    chip: {
        position: 'absolute',
        backgroundColor: '#FFFFFF',
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: 'rgba(8, 17, 38, 0.07)',
        shadowColor: '#081126',
        shadowOpacity: 0.16,
        shadowRadius: 12,
        shadowOffset: { width: 0, height: 8 },
        elevation: 8,
        zIndex: 3,
    },
});
