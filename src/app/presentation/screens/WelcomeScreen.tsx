import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  StyleSheet, 
  KeyboardAvoidingView, 
  Platform,
  ActivityIndicator
} from 'react-native';
import { useLoggedUser, useTheme } from '../hooks';

export const WelcomeScreen = ({ navigation }: any) => {
  const { theme } = useTheme();
  const { saveUsername } = useLoggedUser();
  const [username, setUsername] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!username.trim()) {
      setError('Por favor, introduce un nombre de usuario');
      return;
    }

    setError('');
    setIsSubmitting(true);
    
    try {
      const success = await saveUsername(username.trim());
      if (success) {
        console.log('Usuario guardado correctamente');
      } else {
        setError('Error al guardar el nombre de usuario. Inténtalo de nuevo.');
      }
    } catch (error) {
      setError('Ocurrió un error inesperado. Inténtalo de nuevo.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles(theme).container}
    >
      <View style={styles(theme).content}>
        <Text style={styles(theme).title}>Bienvenido a InstaPost</Text>
        
        <Text style={styles(theme).subtitle}>
          Ingrese un nombre de usuario para continuar
        </Text>
        
        <TextInput
          style={styles(theme).input}
          placeholder="Nombre de usuario"
          placeholderTextColor={theme.colors.secondary}
          value={username}
          onChangeText={setUsername}
          autoCapitalize="none"
          autoCorrect={false}
        />
        
        {error ? <Text style={styles(theme).errorText}>{error}</Text> : null}
        
        <TouchableOpacity 
          style={styles(theme).button}
          onPress={handleSubmit}
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <ActivityIndicator color="white" size="small" />
          ) : (
            <Text style={styles(theme).buttonText}>Entrar</Text>
          )}
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = (theme: any) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.lg,
  },
  title: {
    fontSize: theme.typography.fontSize.xxxl,
    fontWeight: 'bold',
    color: theme.colors.primary,
    marginBottom: theme.spacing.md,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.text,
    textAlign: 'center',
    marginBottom: theme.spacing.xl,
  },
  input: {
    width: '100%',
    backgroundColor: theme.colors.card,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.borderRadius.medium,
    padding: theme.spacing.md,
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.text,
    marginBottom: theme.spacing.md,
  },
  errorText: {
    color: theme.colors.error,
    marginBottom: theme.spacing.md,
  },
  button: {
    backgroundColor: theme.colors.primary,
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.xl,
    borderRadius: theme.borderRadius.medium,
    marginTop: theme.spacing.lg,
    width: '100%',
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: theme.typography.fontSize.md,
    fontWeight: 'bold',
  },
});