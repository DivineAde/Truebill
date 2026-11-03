import React from 'react';
import Svg, { Circle, Line, Path, Polygon, Polyline, Rect } from 'react-native-svg';

export type IconProps = {
    size?: number;
    color?: string;
    strokeWidth?: number;
};

const Base = ({ size = 24, color = '#081126', strokeWidth = 2, children }: IconProps & { children: React.ReactNode }) => (
    <Svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
    >
        {children}
    </Svg>
);

export const ZapIcon = (props: IconProps) => (
    <Base {...props}>
        <Polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
    </Base>
);

export const TrendingUpIcon = (props: IconProps) => (
    <Base {...props}>
        <Polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
        <Polyline points="17 6 23 6 23 12" />
    </Base>
);

export const BellIcon = (props: IconProps) => (
    <Base {...props}>
        <Path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
        <Path d="M13.73 21a2 2 0 0 1-3.46 0" />
    </Base>
);

export const WalletIcon = (props: IconProps) => (
    <Base {...props}>
        <Path d="M21 12V7H5a2 2 0 0 1 0-4h14v4" />
        <Path d="M3 5v14a2 2 0 0 0 2 2h16v-5" />
        <Path d="M18 12a2 2 0 0 0 0 4h4v-4Z" />
    </Base>
);

export const ShieldIcon = (props: IconProps) => (
    <Base {...props}>
        <Path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </Base>
);

export const ArrowRightIcon = (props: IconProps) => (
    <Base {...props}>
        <Line x1="5" y1="12" x2="19" y2="12" />
        <Polyline points="12 5 19 12 12 19" />
    </Base>
);

export const ChevronLeftIcon = (props: IconProps) => (
    <Base {...props}>
        <Polyline points="15 18 9 12 15 6" />
    </Base>
);

export const CheckIcon = (props: IconProps) => (
    <Base {...props}>
        <Polyline points="20 6 9 17 4 12" />
    </Base>
);

export const AlertIcon = (props: IconProps) => (
    <Base {...props}>
        <Circle cx="12" cy="12" r="10" />
        <Line x1="12" y1="8" x2="12" y2="12" />
        <Line x1="12" y1="16" x2="12.01" y2="16" />
    </Base>
);

export const EyeIcon = (props: IconProps) => (
    <Base {...props}>
        <Path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
        <Circle cx="12" cy="12" r="3" />
    </Base>
);

export const EyeOffIcon = (props: IconProps) => (
    <Base {...props}>
        <Path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
        <Path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
        <Line x1="1" y1="1" x2="23" y2="23" />
    </Base>
);

export const RefreshIcon = (props: IconProps) => (
    <Base {...props}>
        <Polyline points="23 4 23 10 17 10" />
        <Polyline points="1 20 1 14 7 14" />
        <Path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" />
    </Base>
);

export const MailIcon = (props: IconProps) => (
    <Base {...props}>
        <Path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
        <Polyline points="22,6 12,13 2,6" />
    </Base>
);

export const LockIcon = (props: IconProps) => (
    <Base {...props}>
        <Rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
        <Path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </Base>
);
