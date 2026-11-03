import * as Haptics from 'expo-haptics';
import { Platform } from 'react-native';

const isNative = Platform.OS !== 'web';

export const haptics = {
    light: () => {
        if (isNative) Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
    },
    medium: () => {
        if (isNative) Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium).catch(() => {});
    },
    success: () => {
        if (isNative) Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
    },
    selection: () => {
        if (isNative) Haptics.selectionAsync().catch(() => {});
    },
};
