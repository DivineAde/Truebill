import React, { useEffect, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, {
    Easing,
    useAnimatedStyle,
    useReducedMotion,
    useSharedValue,
    withSpring,
    withTiming,
    type SharedValue,
} from 'react-native-reanimated';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ArrowRightIcon } from '../auth/icons';
import { haptics } from '../auth/useHaptics';
import type { OnboardingSlide } from './slides';

const SLIDE_DURATION = 4500;
const TRANSITION_MS = 650;
const GAP = 6;

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);
const AnimatedImage = Animated.createAnimatedComponent(Image);

interface OnboardingCarouselProps {
    slides: OnboardingSlide[];
    started: boolean;
    onGetStarted: () => void;
    onSignIn: () => void;
}

interface SlideTextProps {
    slide: OnboardingSlide;
    index: number;
    position: SharedValue<number>;
    top: number;
}

function SlideText({ slide, index, position, top }: SlideTextProps) {
    const style = useAnimatedStyle(() => {
        const diff = position.value - index;
        const opacity = 1 - Math.min(Math.abs(diff), 1);
        return {
            opacity,
            transform: [{ translateX: diff * -30 }],
        };
    });

    return (
        <Animated.View pointerEvents="none" style={[styles.textBlock, { top }, style]}>
            <Text style={styles.kicker}>{slide.kicker}</Text>
            <Text style={styles.headline}>{slide.headline}</Text>
            {/*<Text style={styles.description}>{slide.description}</Text>*/}
        </Animated.View>
    );
}

interface SlideBackgroundProps {
    slide: OnboardingSlide;
    index: number;
    position: SharedValue<number>;
}

function SlideBackground({ slide, index, position }: SlideBackgroundProps) {
    const style = useAnimatedStyle(() => {
        const diff = position.value - index;
        const opacity = 1 - Math.min(Math.abs(diff), 1);
        return { opacity };
    });

    return (
        <AnimatedImage
            source={slide.background}
            style={[StyleSheet.absoluteFill, style]}
            contentFit="cover"
            transition={600}
        />
    );
}

interface ProgressBarProps {
    index: number;
    activeIndex: SharedValue<number>;
    progress: SharedValue<number>;
}

function ProgressBar({ index, activeIndex, progress }: ProgressBarProps) {
    const style = useAnimatedStyle(() => {
        const fill =
            activeIndex.value > index ? 1 : activeIndex.value === index ? progress.value : 0;
        return {
            transform: [{ scaleX: fill }],
            transformOrigin: 'left',
        };
    });

    return (
        <View style={styles.barTrack}>
            <Animated.View style={[styles.barFill, style]} />
        </View>
    );
}

interface CtaButtonProps {
    onPress: () => void;
}

function CtaButton({ onPress }: CtaButtonProps) {
    const scale = useSharedValue(1);

    const style = useAnimatedStyle(() => ({
        transform: [{ scale: scale.value }],
    }));

    const handlePressIn = () => {
        haptics.light();
        scale.value = withSpring(0.97, { damping: 20, stiffness: 340 });
    };

    const handlePressOut = () => {
        scale.value = withSpring(1, { damping: 20, stiffness: 340 });
    };

    return (
        <AnimatedPressable
            accessibilityRole="button"
            onPress={onPress}
            onPressIn={handlePressIn}
            onPressOut={handlePressOut}
            style={[styles.cta, style]}
        >
            <Text style={styles.ctaText}>Get Started</Text>
            <ArrowRightIcon size={18} color="#081126" strokeWidth={2.4} />
        </AnimatedPressable>
    );
}

export default function OnboardingCarousel({ slides, started, onGetStarted, onSignIn }: OnboardingCarouselProps) {
    const insets = useSafeAreaInsets();
    const reduced = useReducedMotion();

    const [index, setIndex] = useState(0);
    const position = useSharedValue(0);
    const progress = useSharedValue(0);
    const activeIndex = useSharedValue(0);

    useEffect(() => {
        if (!started) return;

        activeIndex.value = index;

        if (reduced) {
            position.value = index;
            progress.value = 1;
        } else {
            progress.value = 0;
            progress.value = withTiming(1, { duration: SLIDE_DURATION, easing: Easing.linear });
            position.value = withTiming(index, { duration: TRANSITION_MS, easing: Easing.inOut(Easing.cubic) });
        }

        const timer = setTimeout(() => setIndex((i) => (i + 1) % slides.length), SLIDE_DURATION);
        return () => clearTimeout(timer);
    }, [activeIndex, index, position, progress, reduced, slides.length, started]);

    const textTop = insets.top + 92;

    return (
        <View style={styles.root}>
            {slides.map((slide, i) => (
                <SlideBackground key={slide.id} slide={slide} index={i} position={position} />
            ))}

            <LinearGradient
                colors={['rgba(7, 10, 24, 0.45)', 'rgba(7, 10, 24, 0.1)', 'rgba(7, 10, 24, 0.6)']}
                style={StyleSheet.absoluteFill}
                start={{ x: 0, y: 0.25 }}
                end={{ x: 0, y: 1 }}
            />

            {slides.map((slide, i) => (
                <SlideText key={slide.id} slide={slide} index={i} position={position} top={textTop} />
            ))}

            <View style={[styles.progressRow, { paddingTop: insets.top + 14 }]}>
                {slides.map((_, i) => (
                    <ProgressBar key={i} index={i} activeIndex={activeIndex} progress={progress} />
                ))}
            </View>

            <View style={[styles.footer, { paddingBottom: insets.bottom + 14 }]}>
                <CtaButton onPress={onGetStarted} />
                <Pressable onPress={onSignIn} style={styles.signIn} hitSlop={8} accessibilityRole="link">
                    <Text style={styles.signInText}>I already have an account</Text>
                </Pressable>
                <Text style={styles.legal}>By continuing you agree to our Terms of Service and Privacy Policy.</Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    root: {
        flex: 1,
        backgroundColor: '#0D1020',
        overflow: 'hidden',
    },
    textBlock: {
        position: 'absolute',
        left: 28,
        right: 28,
    },
    kicker: {
        fontSize: 11,
        fontFamily: 'sans-bold',
        color: 'rgba(255, 249, 227, 0.7)',
        letterSpacing: 3,
        marginBottom: 14,
    },
    headline: {
        fontSize: 38,
        lineHeight: 44,
        fontFamily: 'sans-extrabold',
        color: '#FFF9E3',
        letterSpacing: -0.8,
        marginBottom: 14,
    },
    description: {
        fontSize: 16,
        lineHeight: 24,
        fontFamily: 'sans-medium',
        color: 'rgba(255, 249, 227, 0.78)',
        maxWidth: 320,
    },
    progressRow: {
        flexDirection: 'row',
        gap: GAP,
        paddingHorizontal: 28,
    },
    barTrack: {
        flex: 1,
        height: 3,
        borderRadius: 2,
        backgroundColor: 'rgba(255, 249, 227, 0.25)',
        overflow: 'hidden',
    },
    barFill: {
        position: 'absolute',
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
        backgroundColor: '#FFF9E3',
    },
    footer: {
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: 0,
        paddingHorizontal: 24,
    },
    cta: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 10,
        height: 62,
        borderRadius: 31,
        backgroundColor: '#EA7A53',
        shadowColor: '#000000',
        shadowOpacity: 0.28,
        shadowRadius: 18,
        shadowOffset: { width: 0, height: 10 },
        elevation: 8,
    },
    ctaText: {
        fontSize: 17,
        fontFamily: 'sans-bold',
        color: '#081126',
        letterSpacing: 0.3,
    },
    signIn: {
        alignItems: 'center',
        paddingVertical: 14,
        marginTop: 4,
    },
    signInText: {
        fontSize: 15,
        fontFamily: 'sans-semibold',
        color: 'rgba(255, 249, 227, 0.85)',
    },
    legal: {
        fontSize: 11,
        fontFamily: 'sans-medium',
        color: 'rgba(255, 249, 227, 0.45)',
        textAlign: 'center',
        marginTop: 2,
    },
});
