import { borderRadius, colors, fontSize, spacing } from "@/constants/theme";
import {
    ActivityIndicator,
    StyleSheet,
    Text,
    TouchableOpacity,
} from "react-native";

interface ButtonProps {
  title: string;
  variant?: "primary" | "secondary";
  loading?: boolean;
}

export function Button({
  title,
  variant = "primary",
  loading = false,
  disable,
  style,
  ...rest
}: ButtonProps) {
  const backgroundColor = variant === "primary" ? colors.green : colors.brand;

  return (
    <TouchableOpacity
      style={[
        { backgroundColor: backgroundColor },
        styles.button,
        (disable || loading) && styles.buttonDisabled,
        style,
      ]}
      {...rest}
    >
      {loading ? (
        <ActivityIndicator color={colors.background} />
      ) : (
        <Text style={styles.buttonText}>{title}</Text>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    width: "100%",
    height: 50,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: borderRadius.md,
    paddingHorizontal: spacing.lg,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: colors.background,
    fontSize: fontSize.lg,
    fontWeight: "600",
  },
});
