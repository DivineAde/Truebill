import type { ImageSourcePropType } from 'react-native';
// Backgrounds render full-bleed with contentFit="cover", so anything below
// ~1080px wide gets upscaled to fill the screen and looks zoomed/blurry.
// Supply images >=1080x1920 (portrait, ~9:19.5) for crisp full-screen quality.
import slideTrack from '@/assets/images/onboarding/one.png';
import slideAlerts from '@/assets/images/onboarding/two.png';
import slideSavings from '@/assets/images/onboarding/three.png';

export interface OnboardingSlide {
    id: string;
    background: ImageSourcePropType | string;
    kicker: string;
    headline: string;
    description: string;
}

export const onboardingSlides: OnboardingSlide[] = [
    {
        id: 'track',
        background: slideTrack,
        kicker: 'TRACK EVERYTHING',
        headline: 'Every subscription,\nin one place.',
        description:
            'Connect your accounts and see every service you pay for, instantly organized in one beautiful dashboard.',
    },
    {
        id: 'alerts',
        background: slideAlerts,
        kicker: 'SMART ALERTS',
        headline: 'Never miss\na payment.',
        description:
            'Renewal reminders arrive before charges hit your account, so surprises never catch you off guard.',
    },
    {
        id: 'savings',
        background: slideSavings,
        kicker: 'SPEND SMARTER',
        headline: 'Keep more\nof your money.',
        description:
            'Insights uncover duplicate plans and hidden costs, so you can cancel what you no longer use.',
    },
];
