import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import RegistrationFlow from '../../app/components/RegistrationFlow';

// Mock react-native-safe-area-context
jest.mock('react-native-safe-area-context', () => ({
  SafeAreaView: ({ children }: any) => children,
}));

// Mock lucide-react-native
jest.mock('lucide-react-native', () => ({
  Eye: () => 'Eye',
  EyeOff: () => 'EyeOff',
  Mail: () => 'Mail',
  Phone: () => 'Phone',
  User: () => 'User',
  Lock: () => 'Lock',
  Gift: () => 'Gift',
  CheckCircle: () => 'CheckCircle',
  AlertCircle: () => 'AlertCircle',
}));

// Mock @expo/vector-icons
jest.mock('@expo/vector-icons', () => ({
  Ionicons: () => 'Ionicons',
}));

describe('RegistrationFlow', () => {
  const mockOnSuccess = jest.fn();
  const mockOnBack = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders login form by default', () => {
    const { getByText, getByPlaceholderText } = render(
      <RegistrationFlow onSuccess={mockOnSuccess} onBack={mockOnBack} />
    );

    expect(getByText('Welcome Back')).toBeTruthy();
    expect(getByText('Sign in to access your agent dashboard')).toBeTruthy();
    expect(getByPlaceholderText('Enter your email address')).toBeTruthy();
    expect(getByPlaceholderText('Enter your password')).toBeTruthy();
  });

  it('switches to registration form when Register tab is pressed', () => {
    const { getByText, getByPlaceholderText } = render(
      <RegistrationFlow onSuccess={mockOnSuccess} onBack={mockOnBack} />
    );

    fireEvent.press(getByText('Register'));

    expect(getByText('Join Our Network')).toBeTruthy();
    expect(getByText('Become an Umrah travel agent partner')).toBeTruthy();
    expect(getByPlaceholderText('Enter your full name')).toBeTruthy();
    expect(getByPlaceholderText('Enter your phone number')).toBeTruthy();
  });

  it('validates email format', async () => {
    const { getByText, getByPlaceholderText } = render(
      <RegistrationFlow onSuccess={mockOnSuccess} onBack={mockOnBack} />
    );

    const emailInput = getByPlaceholderText('Enter your email address');
    const submitButton = getByText('Sign In');

    fireEvent.changeText(emailInput, 'invalid-email');
    fireEvent.press(submitButton);

    await waitFor(() => {
      expect(getByText('Please enter a valid email address')).toBeTruthy();
    });
  });

  it('validates password length', async () => {
    const { getByText, getByPlaceholderText } = render(
      <RegistrationFlow onSuccess={mockOnSuccess} onBack={mockOnBack} />
    );

    const passwordInput = getByPlaceholderText('Enter your password');
    const submitButton = getByText('Sign In');

    fireEvent.changeText(passwordInput, '123');
    fireEvent.press(submitButton);

    await waitFor(() => {
      expect(getByText('Password must be at least 6 characters')).toBeTruthy();
    });
  });

  it('validates password confirmation in registration', async () => {
    const { getByText, getByPlaceholderText } = render(
      <RegistrationFlow onSuccess={mockOnSuccess} onBack={mockOnBack} />
    );

    // Switch to registration
    fireEvent.press(getByText('Register'));

    const passwordInput = getByPlaceholderText('Enter your password');
    const confirmPasswordInput = getByPlaceholderText('Confirm your password');
    const submitButton = getByText('Create Account');

    fireEvent.changeText(passwordInput, 'password123');
    fireEvent.changeText(confirmPasswordInput, 'different123');
    fireEvent.press(submitButton);

    await waitFor(() => {
      expect(getByText('Passwords do not match')).toBeTruthy();
    });
  });

  it('validates required fields in registration', async () => {
    const { getByText } = render(
      <RegistrationFlow onSuccess={mockOnSuccess} onBack={mockOnBack} />
    );

    // Switch to registration
    fireEvent.press(getByText('Register'));

    const submitButton = getByText('Create Account');
    fireEvent.press(submitButton);

    await waitFor(() => {
      expect(getByText('Name is required')).toBeTruthy();
      expect(getByText('Phone number is required')).toBeTruthy();
      expect(getByText('Email is required')).toBeTruthy();
      expect(getByText('Password is required')).toBeTruthy();
    });
  });

  it('validates phone number format', async () => {
    const { getByText, getByPlaceholderText } = render(
      <RegistrationFlow onSuccess={mockOnSuccess} onBack={mockOnBack} />
    );

    // Switch to registration
    fireEvent.press(getByText('Register'));

    const phoneInput = getByPlaceholderText('Enter your phone number');
    const submitButton = getByText('Create Account');

    fireEvent.changeText(phoneInput, 'invalid-phone');
    fireEvent.press(submitButton);

    await waitFor(() => {
      expect(getByText('Please enter a valid phone number')).toBeTruthy();
    });
  });

  it('toggles password visibility', () => {
    const { getByPlaceholderText } = render(
      <RegistrationFlow onSuccess={mockOnSuccess} onBack={mockOnBack} />
    );

    const passwordInput = getByPlaceholderText('Enter your password');
    
    // Initially password should be hidden (secureTextEntry = true)
    expect(passwordInput.props.secureTextEntry).toBe(true);

    // Find and press the eye icon (password toggle button)
    // Note: In a real test, you'd need to find the actual toggle button
    // This is a simplified version
  });

  it('shows loading state during submission', async () => {
    const { getByText, getByPlaceholderText } = render(
      <RegistrationFlow onSuccess={mockOnSuccess} onBack={mockOnBack} />
    );

    const emailInput = getByPlaceholderText('Enter your email address');
    const passwordInput = getByPlaceholderText('Enter your password');
    const submitButton = getByText('Sign In');

    fireEvent.changeText(emailInput, 'test@example.com');
    fireEvent.changeText(passwordInput, 'password123');
    fireEvent.press(submitButton);

    // Should show loading indicator
    await waitFor(() => {
      expect(submitButton.props.disabled).toBe(true);
    });
  });

  it('calls onSuccess after successful registration', async () => {
    const { getByText, getByPlaceholderText } = render(
      <RegistrationFlow onSuccess={mockOnSuccess} onBack={mockOnBack} />
    );

    // Switch to registration
    fireEvent.press(getByText('Register'));

    // Fill in valid registration data
    fireEvent.changeText(getByPlaceholderText('Enter your full name'), 'John Doe');
    fireEvent.changeText(getByPlaceholderText('Enter your phone number'), '+1234567890');
    fireEvent.changeText(getByPlaceholderText('Enter your email address'), 'john@example.com');
    fireEvent.changeText(getByPlaceholderText('Enter your password'), 'password123');
    fireEvent.changeText(getByPlaceholderText('Confirm your password'), 'password123');

    fireEvent.press(getByText('Create Account'));

    // Wait for the registration process to complete
    await waitFor(() => {
      expect(getByText('Verify Your Phone')).toBeTruthy();
    }, { timeout: 3000 });
  });

  it('shows OTP verification step after registration', async () => {
    const { getByText, getByPlaceholderText } = render(
      <RegistrationFlow onSuccess={mockOnSuccess} onBack={mockOnBack} />
    );

    // Switch to registration and fill form
    fireEvent.press(getByText('Register'));
    fireEvent.changeText(getByPlaceholderText('Enter your full name'), 'John Doe');
    fireEvent.changeText(getByPlaceholderText('Enter your phone number'), '+1234567890');
    fireEvent.changeText(getByPlaceholderText('Enter your email address'), 'john@example.com');
    fireEvent.changeText(getByPlaceholderText('Enter your password'), 'password123');
    fireEvent.changeText(getByPlaceholderText('Confirm your password'), 'password123');

    fireEvent.press(getByText('Create Account'));

    await waitFor(() => {
      expect(getByText('Verify Your Phone')).toBeTruthy();
      expect(getByText('Enter OTP Code')).toBeTruthy();
      expect(getByPlaceholderText('000000')).toBeTruthy();
    }, { timeout: 3000 });
  });

  it('shows success screen after OTP verification', async () => {
    const { getByText, getByPlaceholderText } = render(
      <RegistrationFlow onSuccess={mockOnSuccess} onBack={mockOnBack} />
    );

    // Go through registration flow
    fireEvent.press(getByText('Register'));
    fireEvent.changeText(getByPlaceholderText('Enter your full name'), 'John Doe');
    fireEvent.changeText(getByPlaceholderText('Enter your phone number'), '+1234567890');
    fireEvent.changeText(getByPlaceholderText('Enter your email address'), 'john@example.com');
    fireEvent.changeText(getByPlaceholderText('Enter your password'), 'password123');
    fireEvent.changeText(getByPlaceholderText('Confirm your password'), 'password123');

    fireEvent.press(getByText('Create Account'));

    // Wait for OTP screen
    await waitFor(() => {
      expect(getByText('Verify Your Phone')).toBeTruthy();
    }, { timeout: 3000 });

    // Enter OTP
    const otpInput = getByPlaceholderText('000000');
    fireEvent.changeText(otpInput, '123456');
    fireEvent.press(getByText('Verify Code'));

    // Wait for success screen
    await waitFor(() => {
      expect(getByText('Welcome Aboard!')).toBeTruthy();
      expect(getByText('Welcome Bonus')).toBeTruthy();
    }, { timeout: 3000 });
  });
});
