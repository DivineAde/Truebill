import { View, Text, Pressable, StyleSheet } from 'react-native';
import { Link, useRouter, type Href } from 'expo-router';
import { useSignUp, useAuth } from '@clerk/expo';
import { useEffect, useState } from 'react';
import Animated, {
    interpolateColor,
    useAnimatedStyle,
    useSharedValue,
    withTiming,
} from 'react-native-reanimated';
import { posthog } from '../../config/posthog';
import AuthLayout from '../../../components/auth/AuthLayout';
import AuthLogo from '../../../components/auth/AuthLogo';
import AuthButton from '../../../components/auth/AuthButton';
import AuthField from '../../../components/auth/AuthField';
import GlassCard from '../../../components/auth/GlassCard';
import VerifyCard from '../../../components/auth/VerifyCard';
import Reveal from '../../../components/auth/Reveal';

const STRENGTH_COLORS = ['#DC2626', '#F2B25C', '#EA7A53', '#16A34A'] as const;
const STRENGTH_LABELS = ['Weak', 'Fair', 'Good', 'Strong'] as const;

const passwordStrength = (password: string): number => {
    if (!password) return 0;
    let score = 0;
    if (password.length >= 8) score++;
    if (password.length >= 12) score++;
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) score++;
    if (/\d/.test(password) || /[^A-Za-z0-9]/.test(password)) score++;
    return Math.min(score, 4);
};

function StrengthBar({ active, color }: { active: boolean; color: string }) {
    const progress = useSharedValue(active ? 1 : 0);

    useEffect(() => {
        progress.value = withTiming(active ? 1 : 0, { duration: 300 });
    }, [active, progress]);

    const style = useAnimatedStyle(() => ({
        backgroundColor: interpolateColor(progress.value, [0, 1], ['rgba(8, 17, 38, 0.1)', color]),
        opacity: 0.4 + progress.value * 0.6,
    }));

    return <Animated.View style={[styles.strengthBar, style]} />;
}

function StrengthMeter({ score }: { score: number }) {
    if (score === 0) return null;

    const color = STRENGTH_COLORS[score - 1];
    const label = STRENGTH_LABELS[score - 1];

    return (
        <View style={styles.strengthWrap}>
            <View style={styles.strengthRow}>
                {[1, 2, 3, 4].map((level) => (
                    <StrengthBar key={level} active={level <= score} color={color} />
                ))}
            </View>
            <Text style={[styles.strengthLabel, { color }]}>{label} password</Text>
        </View>
    );
}

const SignUp = () => {
    const { signUp, errors, fetchStatus } = useSignUp();
    const { isSignedIn } = useAuth();
    const router = useRouter();

    const [emailAddress, setEmailAddress] = useState('');
    const [password, setPassword] = useState('');
    const [code, setCode] = useState('');

    // Validation states
    const [emailTouched, setEmailTouched] = useState(false);
    const [passwordTouched, setPasswordTouched] = useState(false);

    // Client-side validation
    const emailValid = emailAddress.length === 0 || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailAddress);
    const passwordValid = password.length === 0 || password.length >= 8;
    const formValid = emailAddress.length > 0 && password.length >= 8 && emailValid;

    const strength = passwordStrength(password);

    const identifyAuthenticatedUser = (userId: string | null | undefined) => {
        if (!userId) return;

        posthog?.identify(userId, {
            $set: {
                email: emailAddress,
            },
            $set_once: {
                first_sign_up_date: new Date().toISOString(),
            },
        });
        posthog?.capture('account_signed_up');
    };

    const handleSubmit = async () => {
        if (!formValid) return;

        const { error } = await signUp.password({
            emailAddress,
            password,
        });

        if (error) {
            console.error(JSON.stringify(error, null, 2));
            //posthog.capture('user_sign_up_failed', {
            //    error_message: error.message,
            //});
            return;
        }

        // Send verification email
        if (!error) {
            await signUp.verifications.sendEmailCode();
        }
    };

    const handleVerify = async () => {
        await signUp.verifications.verifyEmailCode({
            code,
        });

        if (signUp.status === 'complete') {
            await signUp.finalize({
                navigate: ({ session, decorateUrl }) => {
                    if (session?.currentTask) {
                        console.log(session?.currentTask);
                        return;
                    }

                    identifyAuthenticatedUser(session?.id);

                    const url = decorateUrl('/(tabs)');
                    if (url.startsWith('http')) {
                        // Only use window.location on web platform
                        if (typeof window !== 'undefined' && window.location) {
                            window.location.href = url;
                        } else {
                            // On native, just use router navigation
                            router.replace('/(tabs)' as Href);
                        }
                    } else {
                        router.replace(url as Href);
                    }
                },
            });
        } else {
            console.error('Sign-up attempt not complete:', signUp);
        }
    };

    // Don't show anything if already signed in or sign-up is complete
    if (signUp.status === 'complete' || isSignedIn) {
        return null;
    }

    // Show verification screen if email needs verification
    if (
        signUp.status === 'missing_requirements' &&
        signUp.unverifiedFields.includes('email_address') &&
        signUp.missingFields.length === 0
    ) {
        return (
            <AuthLayout>
                <VerifyCard
                    title="Verify your email"
                    subtitle={`We sent a verification code to ${emailAddress}`}
                    code={code}
                    onChangeCode={setCode}
                    error={errors.fields.code?.message ?? undefined}
                    loading={fetchStatus === 'fetching'}
                    buttonLabel="Verify Email"
                    onVerify={handleVerify}
                    onResend={() => signUp.verifications.sendEmailCode()}
                />
            </AuthLayout>
        );
    }

    // Main sign-up form
    return (
        <AuthLayout showBack>
            <View style={{ flexGrow: 1, paddingTop: 8 }}>
                <Reveal delay={40}>
                    <View className="items-center">
                        <AuthLogo size="sm" />
                    </View>
                </Reveal>

                <Reveal delay={120}>
                    <View className="mt-9 items-center px-2">
                        <Text className="auth-headline text-center">Create your account</Text>
                        <Text className="auth-lead mt-3 text-center">
                            Start tracking your subscriptions and never miss a payment
                        </Text>
                    </View>
                </Reveal>

                <Reveal delay={220} distance={20} fade={false}>
                    <GlassCard style={{ marginTop: 32 }}>
                        <AuthField
                            label="Email address"
                            value={emailAddress}
                            onChangeText={setEmailAddress}
                            autoCapitalize="none"
                            keyboardType="email-address"
                            autoComplete="email"
                            textContentType="emailAddress"
                            onBlur={() => setEmailTouched(true)}
                            valid={emailValid}
                            error={
                                emailTouched && !emailValid
                                    ? 'Please enter a valid email address'
                                    : errors.fields.emailAddress?.message ?? undefined
                            }
                        />

                        <AuthField
                            label="Password"
                            value={password}
                            onChangeText={setPassword}
                            secureTextEntry
                            autoComplete="password-new"
                            textContentType="newPassword"
                            onBlur={() => setPasswordTouched(true)}
                            helper={!passwordTouched ? 'Minimum 8 characters required' : undefined}
                            error={
                                passwordTouched && !passwordValid
                                    ? 'Password must be at least 8 characters'
                                    : errors.fields.password?.message ?? undefined
                            }
                        />

                        <StrengthMeter score={strength} />

                        <View style={{ height: 14 }} />

                        <AuthButton
                            label="Create Account"
                            loading={fetchStatus === 'fetching'}
                            disabled={!formValid}
                            onPress={handleSubmit}
                        />
                    </GlassCard>
                </Reveal>

                <View className="flex-1" />

                <Reveal delay={320}>
                    <View className="auth-link-row">
                        <Text className="auth-link-copy">Already have an account?</Text>
                        <Link href="/(auth)/sign-in" asChild>
                            <Pressable>
                                <Text className="auth-link">Sign In</Text>
                            </Pressable>
                        </Link>
                    </View>
                </Reveal>

                {/* Required for Clerk's bot protection */}
                <View nativeID="clerk-captcha" />
            </View>
        </AuthLayout>
    );
};

const styles = StyleSheet.create({
    strengthWrap: {
        marginTop: 10,
        paddingHorizontal: 2,
    },
    strengthRow: {
        flexDirection: 'row',
        gap: 6,
    },
    strengthBar: {
        flex: 1,
        height: 4,
        borderRadius: 2,
    },
    strengthLabel: {
        marginTop: 8,
        fontSize: 12,
        fontFamily: 'sans-semibold',
    },
});

export default SignUp;
