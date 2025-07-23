import React from 'react';
import { TouchableOpacity, Text, StyleSheet, Alert } from 'react-native';
import { useAuthStore } from '../store/authStore';

interface LogoffButtonProps {
  title?: string;
  style?: any;
  textStyle?: any;
  onLogoff?: () => void;
}

const LogoffButton: React.FC<LogoffButtonProps> = ({ 
  title = 'Sair', 
  style, 
  textStyle,
  onLogoff 
}) => {
  const logout = useAuthStore(state => state.logout);

  const handleLogoff = () => {
    Alert.alert(
      'Confirmar Logout',
      'Tem certeza que deseja sair da aplicação?',
      [
        {
          text: 'Cancelar',
          style: 'cancel',
        },
        {
          text: 'Sair',
          style: 'destructive',
          onPress: () => {
            logout();
            onLogoff?.();
          },
        },
      ]
    );
  };

  return (
    <TouchableOpacity
      style={[styles.button, style]}
      onPress={handleLogoff}
      activeOpacity={0.8}
    >
      <Text style={[styles.buttonText, textStyle]}>{title}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#dc2626',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default LogoffButton;
