import PostHog from "posthog-react-native";

const projectToken = process.env.EXPO_PUBLIC_POSTHOG_PROJECT_TOKEN;
const host = process.env.EXPO_PUBLIC_POSTHOG_HOST;

function requirePostHogConfig(value: string | undefined, variable: string) {
  if (value) return value;
  if (__DEV__) {
    throw new Error(
      `${variable} variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once ${variable} is configured`,
    );
  }
  return undefined;
}

const configuredToken = requirePostHogConfig(
  projectToken,
  "EXPO_PUBLIC_POSTHOG_PROJECT_TOKEN",
);
const configuredHost = requirePostHogConfig(
  host,
  "EXPO_PUBLIC_POSTHOG_HOST",
);

export const posthog =
  configuredToken && configuredHost
    ? new PostHog(configuredToken, {
        host: configuredHost,
        captureAppLifecycleEvents: true,
      })
    : null;
