import React from 'react';
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import AnimatedBackground from './AnimatedBackground';
import { ChevronLeftIcon } from './icons';
import { haptics } from './useHaptics';

interface AuthLayoutProps {
    children: React.ReactNode;
    showBack?: boolean;
    onBack?: () => void;
}

export default function AuthLayout({ children, showBack = false, onBack }: AuthLayoutProps) {
    const router = useRouter();

    const handleBack = () => {
        haptics.light();
        if (router.canGoBack()) {
            router.back();
        } else {
            router.replace('/onboarding');
        }
    };

    return (
        <View style={styles.root}>
            <StatusBar style="dark" />
            <AnimatedBackground />
            <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
                <KeyboardAvoidingView
                    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                    style={styles.flex}
                >
                    <ScrollView
                        contentContainerStyle={styles.scroll}
                        keyboardShouldPersistTaps="handled"
                        showsVerticalScrollIndicator={false}
                    >
                        {showBack ? (
                            <View style={styles.backRow}>
                                <Pressable
                                    onPress={onBack ?? handleBack}
                                    hitSlop={8}
                                    style={styles.backBtn}
                                    accessibilityRole="button"
                                    accessibilityLabel="Go back"
                                >
                                    <ChevronLeftIcon size={20} color="#081126" strokeWidth={2.4} />
                                </Pressable>
                            </View>
                        ) : null}
                        {children}
                    </ScrollView>
                </KeyboardAvoidingView>
            </SafeAreaView>
        </View>
    );
}

const styles = StyleSheet.create({
    root: {
        flex: 1,
        backgroundColor: '#FFF9E3',
        overflow: 'hidden',
    },
    flex: {
        flex: 1,
    },
    safe: {
        flex: 1,
    },
    scroll: {
        flexGrow: 1,
        paddingHorizontal: 24,
        paddingTop: 8,
        paddingBottom: 32,
    },
    backRow: {
        height: 56,
        justifyContent: 'flex-start',
    },
    backBtn: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: 'rgba(255, 255, 255, 0.72)',
        borderWidth: 1,
        borderColor: 'rgba(8, 17, 38, 0.08)',
        alignItems: 'center',
        justifyContent: 'center',
    },
});
