import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Button, Input } from '@/ui';
import { loginSchema, LoginFormData } from '../schemas/login.schema';

export interface LoginFormProps {
  onSubmit: (data: LoginFormData) => Promise<boolean | void>;
  isLoading?: boolean;
}

export const LoginForm: React.FC<LoginFormProps> = ({ onSubmit, isLoading = false }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSubmit = async () => {
    setErrors({});
    const validation = loginSchema.safeParse({ email, password });

    if (!validation.success) {
      const fieldErrors: Record<string, string> = {};
      validation.error.issues.forEach((issue) => {
        const fieldName = issue.path[0];
        if (fieldName && typeof fieldName === 'string') {
          fieldErrors[fieldName] = issue.message;
        }
      });
      setErrors(fieldErrors);
      return;
    }

    await onSubmit(validation.data);
  };

  return (
    <View style={styles.container}>
      <Input
        label="Email Address"
        placeholder="Enter your email"
        keyboardType="email-address"
        autoCapitalize="none"
        autoCorrect={false}
        value={email}
        onChangeText={setEmail}
        error={errors.email}
        testID="login-email-input"
      />

      <Input
        label="Password"
        placeholder="Enter your password"
        isPassword
        value={password}
        onChangeText={setPassword}
        error={errors.password}
        testID="login-password-input"
      />

      <Button
        label="Sign In"
        onPress={handleSubmit}
        isLoading={isLoading}
        style={styles.submitButton}
        testID="login-submit-button"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  submitButton: {
    marginTop: 8,
  },
});

