import { View } from 'react-native';
import React, { useState } from 'react';
import { Redirect, useRouter, type Href } from 'expo-router';
import { useAuth } from '@clerk/expo';
import { StatusBar } from 'expo-status-bar';
import { haptics } from '../../components/auth/useHaptics';
import OnboardingIntro from '../../components/onboarding/OnboardingIntro';
import OnboardingCarousel from '../../components/onboarding/OnboardingCarousel';
import { onboardingSlides } from '../../components/onboarding/slides';

const Onboarding = () => {
    const router = useRouter();
    const { isSignedIn, isLoaded } = useAuth();
    const [started, setStarted] = useState(false);

    if (!isLoaded) return null;

    if (isSignedIn) {
        return <Redirect href="/(tabs)" />;
    }

    const goToSignUp = () => {
        haptics.medium();
        router.push('/(auth)/sign-up' as Href);
    };

    const goToSignIn = () => {
        haptics.medium();
        router.push('/(auth)/sign-in' as Href);
    };

    return (
        <View style={{ flex: 1, backgroundColor: '#0D1020' }}>
            <StatusBar style="light" />
            <OnboardingCarousel
                slides={onboardingSlides}
                started={started}
                onGetStarted={goToSignUp}
                onSignIn={goToSignIn}
            />
            {!started && <OnboardingIntro onDone={() => setStarted(true)} />}
        </View>
    );
};

export default Onboarding;
