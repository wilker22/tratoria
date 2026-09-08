import { Button } from "@/components/button";
import { Input } from "@/components/Input";
import { colors, fontSize, spacing } from "@/constants/theme";
import { useState } from "react";
import {
  KeyboardAvoidingView,
  ScrollView,
  StyleSheet,
  Text,
  View
} from "react-native";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  function handleLogin() {
    console.log({ email, password });
  }

  return (
    <KeyboardAvoidingView style={styles.container} behavior={"padding"}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.logoContainer}>
          <Text style={styles.logoText}>
            WJ<Text style={styles.logoBrand}>Pizzaria</Text>
          </Text>
          <Text style={styles.logoSubtitle}>Garçon App</Text>
        </View>

        <View style={styles.formContainer}>
          <Input
            Label="E-mail"
            placeholder="Digite seu e-mail..."
            placeholderTextColor={colors.gray}
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
          />
          <Input
            Label="Senha"
            placeholder="Digite sua senha..."
            placeholderTextColor={colors.gray}
            secureTextEntry={true}
            value={password}
            onChangeText={setPassword}
          />
          <Button title="Acessar" loading={loading} onPress={handleLogin} />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.background,
    flex: 1,
  },
  scrollContent: {
    justifyContent: "center",
    flexGrow: 1,
    paddingHorizontal: spacing.xl,
  },
  logoContainer: {
    alignItems: "center",
    marginBottom: spacing.xl,
  },
  logoText: {
    fontSize: 34,
    fontWeight: "bold",
    color: colors.primary,
  },
  logoBrand: {
    color: colors.brand,
  },
  logoSubtitle: {
    color: colors.primary,
    fontSize: fontSize.lg,
  },
  formContainer: {
    gap: spacing.md,
  },
});
