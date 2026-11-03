import { View, Text, Pressable } from 'react-native';
import { Link, useRouter, type Href } from 'expo-router';
import { useSignIn } from '@clerk/expo';
import { useState } from 'react';
import { posthog } from '../../config/posthog';
import AuthLayout from '../../../components/auth/AuthLayout';
import AuthLogo from '../../../components/auth/AuthLogo';
import AuthButton from '../../../components/auth/AuthButton';
import AuthField from '../../../components/auth/AuthField';
import GlassCard from '../../../components/auth/GlassCard';
import VerifyCard from '../../../components/auth/VerifyCard';
import Reveal from '../../../components/auth/Reveal';

const SignIn = () => {
    const { signIn, errors, fetchStatus } = useSignIn();
    const router = useRouter();

    const [emailAddress, setEmailAddress] = useState('');
    const [password, setPassword] = useState('');
    const [code, setCode] = useState('');

    // Validation states
    const [emailTouched, setEmailTouched] = useState(false);
    const [passwordTouched, setPasswordTouched] = useState(false);

    // Client-side validation
    const emailValid = emailAddress.length === 0 || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailAddress);
    const passwordValid = password.length > 0;
    const formValid = emailAddress.length > 0 && password.length > 0 && emailValid;

    const identifyAuthenticatedUser = (userId: string | null | undefined) => {
        if (!userId) return;

        posthog?.identify(userId, {
            $set: {
                email: emailAddress,
            },
        });
        posthog?.capture('account_signed_in');
    };

    const handleSubmit = async () => {
        if (!formValid) return;

        const { error } = await signIn.password({
            emailAddress,
            password,
        });

        if (error) {
            console.error(JSON.stringify(error, null, 2));
            //posthog.capture('user_sign_in_failed', {
            //    error_message: error.message,
            //});
            return;
        }

        if (signIn.status === 'complete') {
            await signIn.finalize({
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
        } else if (signIn.status === 'needs_second_factor') {
            // Handle MFA if needed (not implemented in this basic flow)
            console.log('MFA required');
        } else if (signIn.status === 'needs_client_trust') {
            // Send email code for client trust verification
            const emailCodeFactor = signIn.supportedSecondFactors.find(
                (factor) => factor.strategy === 'email_code'
            );

            if (emailCodeFactor) {
                await signIn.mfa.sendEmailCode();
            }
        } else {
            console.error('Sign-in attempt not complete:', signIn);
        }
    };

    const handleVerify = async () => {
        await signIn.mfa.verifyEmailCode({ code });

        if (signIn.status === 'complete') {
            await signIn.finalize({
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
            console.error('Sign-in attempt not complete:', signIn);
        }
    };

    // Show verification screen if client trust is needed
    if (signIn.status === 'needs_client_trust') {
        return (
            <AuthLayout>
                <VerifyCard
                    title="Verify your identity"
                    subtitle="We sent a verification code to your email"
                    code={code}
                    onChangeCode={setCode}
                    error={errors.fields.code?.message ?? undefined}
                    loading={fetchStatus === 'fetching'}
                    onVerify={handleVerify}
                    onResend={() => signIn.mfa.sendEmailCode()}
                    onStartOver={() => signIn.reset()}
                />
            </AuthLayout>
        );
    }

    // Main sign-in form
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
                        <Text className="auth-headline text-center">Welcome back</Text>
                        <Text className="auth-lead mt-3 text-center">
                            Sign in to continue managing your subscriptions
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
                                    : errors.fields.identifier?.message ?? undefined
                            }
                        />

                        <AuthField
                            label="Password"
                            value={password}
                            onChangeText={setPassword}
                            secureTextEntry
                            autoComplete="password"
                            textContentType="password"
                            onBlur={() => setPasswordTouched(true)}
                            error={
                                passwordTouched && !passwordValid
                                    ? 'Password is required'
                                    : errors.fields.password?.message ?? undefined
                            }
                        />

                        <View style={{ height: 14 }} />

                        <AuthButton
                            label="Sign In"
                            loading={fetchStatus === 'fetching'}
                            disabled={!formValid}
                            onPress={handleSubmit}
                        />
                    </GlassCard>
                </Reveal>

                <View className="flex-1" />

                <Reveal delay={320}>
                    <View className="auth-link-row">
                        <Text className="auth-link-copy">Don't have an account?</Text>
                        <Link href="/(auth)/sign-up" asChild>
                            <Pressable>
                                <Text className="auth-link">Create Account</Text>
                            </Pressable>
                        </Link>
                    </View>
                </Reveal>
            </View>
        </AuthLayout>
    );
};

export default SignIn;
