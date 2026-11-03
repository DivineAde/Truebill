import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import AuthLogo from './AuthLogo';
import AuthButton from './AuthButton';
import GlassCard from './GlassCard';
import OtpInput from './OtpInput';
import Reveal from './Reveal';
import { RefreshIcon } from './icons';

interface VerifyCardProps {
    title: string;
    subtitle: string;
    code: string;
    onChangeCode: (value: string) => void;
    error?: string;
    loading?: boolean;
    buttonLabel?: string;
    onVerify: () => void;
    onResend: () => void;
    onStartOver?: () => void;
}

export default function VerifyCard({
    title,
    subtitle,
    code,
    onChangeCode,
    error,
    loading = false,
    buttonLabel = 'Verify',
    onVerify,
    onResend,
    onStartOver,
}: VerifyCardProps) {
    return (
        <View style={styles.container}>
            <Reveal delay={60}>
                <View style={styles.brand}>
                    <AuthLogo size="sm" />
                </View>
            </Reveal>

            <Reveal delay={140}>
                <View style={styles.head}>
                    <Text style={styles.title}>{title}</Text>
                    <Text style={styles.subtitle}>{subtitle}</Text>
                </View>
            </Reveal>

            <Reveal delay={240} distance={20} fade={false}>
                <GlassCard style={styles.card}>
                    <OtpInput
                        value={code}
                        onChangeText={onChangeCode}
                        length={6}
                        error={error}
                        autoFocus
                        onFilled={() => {
                            if (!loading) onVerify();
                        }}
                    />
                    <View style={styles.spacer} />
                    <AuthButton
                        label={buttonLabel}
                        onPress={onVerify}
                        loading={loading}
                        disabled={!code}
                    />
                    <AuthButton
                        label="Resend Code"
                        variant="ghost"
                        size="sm"
                        icon={<RefreshIcon size={16} color="#EA7A53" strokeWidth={2.2} />}
                        onPress={onResend}
                        disabled={loading}
                    />
                    {onStartOver ? (
                        <AuthButton
                            label="Start Over"
                            variant="ghost"
                            size="sm"
                            onPress={onStartOver}
                            disabled={loading}
                            style={styles.startOver}
                        />
                    ) : null}
                </GlassCard>
            </Reveal>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
    },
    brand: {
        marginTop: 24,
        alignItems: 'center',
    },
    head: {
        marginTop: 36,
        alignItems: 'center',
    },
    title: {
        fontSize: 30,
        fontFamily: 'sans-extrabold',
        color: '#081126',
        letterSpacing: -0.5,
        textAlign: 'center',
    },
    subtitle: {
        marginTop: 10,
        fontSize: 16,
        fontFamily: 'sans-medium',
        color: 'rgba(8, 17, 38, 0.55)',
        lineHeight: 24,
        textAlign: 'center',
        paddingHorizontal: 8,
    },
    card: {
        marginTop: 32,
    },
    spacer: {
        height: 24,
    },
    startOver: {
        marginTop: -4,
    },
});
