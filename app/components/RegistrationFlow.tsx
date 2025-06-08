import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import {
  Eye,
  EyeOff,
  Mail,
  Phone,
  User,
  Lock,
  Gift,
  CheckCircle,
  AlertCircle,
} from "lucide-react-native";

interface FormData {
  name: string;
  phone: string;
  email: string;
  password: string;
  confirmPassword: string;
  referralCode: string;
}

interface ValidationErrors {
  name?: string;
  phone?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
}

interface RegistrationFlowProps {
  onSuccess?: (userData: any) => void;
  onBack?: () => void;
}

const RegistrationFlow: React.FC<RegistrationFlowProps> = ({
  onSuccess = () => {},
  onBack = () => {},
}) => {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [step, setStep] = useState(1); // 1: Form, 2: OTP Verification, 3: Success
  const [otpCode, setOtpCode] = useState("");

  const [formData, setFormData] = useState<FormData>({
    name: "",
    phone: "",
    email: "",
    password: "",
    confirmPassword: "",
    referralCode: "",
  });

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field as keyof ValidationErrors]) {
      setErrors({ ...errors, [field]: undefined });
    }
  };

  const validateForm = (): boolean => {
    const newErrors: ValidationErrors = {};

    if (!isLogin) {
      if (!formData.name.trim()) {
        newErrors.name = "Name is required";
      }
      if (!formData.phone.trim()) {
        newErrors.phone = "Phone number is required";
      } else if (!/^\+?[\d\s-()]+$/.test(formData.phone)) {
        newErrors.phone = "Please enter a valid phone number";
      }
      if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = "Passwords do not match";
      }
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!formData.password.trim()) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setIsLoading(true);

    try {
      if (isLogin) {
        // Simulate login API call
        await new Promise(resolve => setTimeout(resolve, 2000));

        // Mock successful login
        const userData = {
          id: "user123",
          name: "Agent User",
          email: formData.email,
          role: "agent",
        };

        onSuccess(userData);
        Alert.alert("Success", "Login successful!");
      } else {
        // Simulate registration API call
        await new Promise(resolve => setTimeout(resolve, 2000));

        // Move to OTP verification step
        setStep(2);
        Alert.alert("Verification", "Please check your phone for OTP code");
      }
    } catch (error) {
      Alert.alert("Error", "Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleOTPVerification = async () => {
    if (!otpCode || otpCode.length !== 6) {
      Alert.alert("Error", "Please enter a valid 6-digit OTP code");
      return;
    }

    setIsLoading(true);

    try {
      // Simulate OTP verification
      await new Promise(resolve => setTimeout(resolve, 1500));

      if (otpCode === "123456") { // Mock OTP
        setStep(3);

        // Mock successful registration
        const userData = {
          id: "user" + Date.now(),
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          role: "agent",
          referralCode: formData.referralCode,
        };

        setTimeout(() => {
          onSuccess(userData);
        }, 2000);
      } else {
        Alert.alert("Error", "Invalid OTP code. Please try again.");
      }
    } catch (error) {
      Alert.alert("Error", "Verification failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const resendOTP = async () => {
    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      Alert.alert("Success", "OTP code has been resent to your phone");
    } catch (error) {
      Alert.alert("Error", "Failed to resend OTP. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const InputField = ({
    label,
    value,
    onChangeText,
    placeholder,
    secureTextEntry = false,
    keyboardType = "default",
    showPasswordToggle = false,
    onTogglePassword,
    optional = false,
    error,
    icon,
  }: {
    label: string;
    value: string;
    onChangeText: (text: string) => void;
    placeholder: string;
    secureTextEntry?: boolean;
    keyboardType?: "default" | "email-address" | "phone-pad";
    showPasswordToggle?: boolean;
    onTogglePassword?: () => void;
    optional?: boolean;
    error?: string;
    icon?: React.ReactNode;
  }) => (
    <View className="mb-4">
      <Text className="text-gray-700 text-sm font-medium mb-2">
        {label} {optional && <Text className="text-gray-400">(Optional)</Text>}
      </Text>
      <View className="relative">
        <TextInput
          className={`bg-white border ${error ? 'border-red-300' : 'border-gray-200'} rounded-lg px-4 py-3 text-gray-800 shadow-sm ${icon ? 'pl-12' : ''}`}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor="#9CA3AF"
          secureTextEntry={secureTextEntry}
          keyboardType={keyboardType}
          autoCapitalize={keyboardType === "email-address" ? "none" : "words"}
        />
        {icon && (
          <View className="absolute left-3 top-3">
            {icon}
          </View>
        )}
        {showPasswordToggle && (
          <TouchableOpacity
            className="absolute right-3 top-3"
            onPress={onTogglePassword}
          >
            {secureTextEntry ? (
              <EyeOff size={20} color="#6B7280" />
            ) : (
              <Eye size={20} color="#6B7280" />
            )}
          </TouchableOpacity>
        )}
      </View>
      {error && (
        <View className="flex-row items-center mt-1">
          <AlertCircle size={14} color="#ef4444" />
          <Text className="text-red-500 text-sm ml-1">{error}</Text>
        </View>
      )}
    </View>
  );

  // OTP Verification Step
  if (step === 2) {
    return (
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1 bg-emerald-50"
      >
        <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
          <View className="px-6 pt-16 pb-8">
            {/* Header */}
            <View className="items-center mb-8">
              <View className="bg-emerald-600 w-16 h-16 rounded-full items-center justify-center mb-4 shadow-lg">
                <Phone size={28} color="white" />
              </View>
              <Text className="text-2xl font-bold text-gray-800 mb-2">
                Verify Your Phone
              </Text>
              <Text className="text-gray-600 text-center leading-5">
                We've sent a 6-digit code to {formData.phone}
              </Text>
            </View>

            {/* OTP Input */}
            <View className="mb-6">
              <Text className="text-gray-700 text-sm font-medium mb-2">
                Enter OTP Code
              </Text>
              <TextInput
                className="bg-white border border-gray-200 rounded-lg px-4 py-3 text-gray-800 shadow-sm text-center text-2xl tracking-widest"
                value={otpCode}
                onChangeText={setOtpCode}
                placeholder="000000"
                placeholderTextColor="#9CA3AF"
                keyboardType="number-pad"
                maxLength={6}
              />
            </View>

            {/* Resend OTP */}
            <View className="flex-row justify-center mb-6">
              <Text className="text-gray-600">Didn't receive the code? </Text>
              <TouchableOpacity onPress={resendOTP} disabled={isLoading}>
                <Text className="text-emerald-600 font-medium">Resend</Text>
              </TouchableOpacity>
            </View>

            {/* Verify Button */}
            <TouchableOpacity
              className={`py-4 rounded-lg shadow-lg ${isLoading ? 'bg-gray-400' : 'bg-emerald-600'}`}
              onPress={handleOTPVerification}
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator color="white" />
              ) : (
                <Text className="text-white text-center font-semibold text-lg">
                  Verify Code
                </Text>
              )}
            </TouchableOpacity>

            {/* Back Button */}
            <TouchableOpacity
              className="mt-4 py-3"
              onPress={() => setStep(1)}
            >
              <Text className="text-emerald-600 text-center font-medium">
                Back to Registration
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    );
  }

  // Success Step
  if (step === 3) {
    return (
      <View className="flex-1 bg-emerald-50 justify-center items-center px-6">
        <View className="items-center">
          <View className="bg-emerald-600 w-20 h-20 rounded-full items-center justify-center mb-6 shadow-lg">
            <CheckCircle size={40} color="white" />
          </View>
          <Text className="text-3xl font-bold text-gray-800 mb-4 text-center">
            Welcome Aboard!
          </Text>
          <Text className="text-gray-600 text-center leading-6 mb-8">
            Your account has been successfully created. You can now start earning commissions as an Umrah travel agent.
          </Text>
          <View className="bg-emerald-50 rounded-2xl p-6 w-full">
            <View className="flex-row items-center mb-3">
              <Gift size={24} color="#059669" />
              <Text className="text-emerald-700 font-semibold ml-2">
                Welcome Bonus
              </Text>
            </View>
            <Text className="text-gray-700">
              You've earned a $50 welcome bonus! Start referring clients to unlock more rewards.
            </Text>
          </View>
        </View>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      className="flex-1 bg-emerald-50"
    >
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        <View className="px-6 pt-16 pb-8">
          {/* Header */}
          <View className="items-center mb-8">
            <View className="bg-emerald-600 w-16 h-16 rounded-full items-center justify-center mb-4 shadow-lg">
              <Ionicons name="business" size={28} color="white" />
            </View>
            <Text className="text-2xl font-bold text-gray-800 mb-2">
              {isLogin ? "Welcome Back" : "Join Our Network"}
            </Text>
            <Text className="text-gray-600 text-center leading-5">
              {isLogin
                ? "Sign in to access your agent dashboard"
                : "Become an Umrah travel agent partner"}
            </Text>
          </View>

          {/* Toggle Buttons */}
          <View className="flex-row bg-gray-100 rounded-lg p-1 mb-6">
            <TouchableOpacity
              className={`flex-1 py-3 rounded-md ${
                isLogin ? "bg-white shadow-sm" : "bg-transparent"
              }`}
              onPress={() => setIsLogin(true)}
            >
              <Text
                className={`text-center font-medium ${
                  isLogin ? "text-emerald-600" : "text-gray-600"
                }`}
              >
                Login
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              className={`flex-1 py-3 rounded-md ${
                !isLogin ? "bg-white shadow-sm" : "bg-transparent"
              }`}
              onPress={() => setIsLogin(false)}
            >
              <Text
                className={`text-center font-medium ${
                  !isLogin ? "text-emerald-600" : "text-gray-600"
                }`}
              >
                Register
              </Text>
            </TouchableOpacity>
          </View>

          {/* Form Fields */}
          <View>
            {!isLogin && (
              <InputField
                label="Full Name"
                value={formData.name}
                onChangeText={(text) => handleInputChange("name", text)}
                placeholder="Enter your full name"
                icon={<User size={20} color="#6B7280" />}
                error={errors.name}
              />
            )}

            {!isLogin && (
              <InputField
                label="Phone Number"
                value={formData.phone}
                onChangeText={(text) => handleInputChange("phone", text)}
                placeholder="Enter your phone number"
                keyboardType="phone-pad"
                icon={<Phone size={20} color="#6B7280" />}
                error={errors.phone}
              />
            )}

            <InputField
              label="Email Address"
              value={formData.email}
              onChangeText={(text) => handleInputChange("email", text)}
              placeholder="Enter your email address"
              keyboardType="email-address"
              icon={<Mail size={20} color="#6B7280" />}
              error={errors.email}
            />

            <InputField
              label="Password"
              value={formData.password}
              onChangeText={(text) => handleInputChange("password", text)}
              placeholder="Enter your password"
              secureTextEntry={!showPassword}
              showPasswordToggle
              onTogglePassword={() => setShowPassword(!showPassword)}
              icon={<Lock size={20} color="#6B7280" />}
              error={errors.password}
            />

            {!isLogin && (
              <InputField
                label="Confirm Password"
                value={formData.confirmPassword}
                onChangeText={(text) =>
                  handleInputChange("confirmPassword", text)
                }
                placeholder="Confirm your password"
                secureTextEntry={!showConfirmPassword}
                showPasswordToggle
                onTogglePassword={() =>
                  setShowConfirmPassword(!showConfirmPassword)
                }
                icon={<Lock size={20} color="#6B7280" />}
                error={errors.confirmPassword}
              />
            )}

            {!isLogin && (
              <InputField
                label="Referral Code"
                value={formData.referralCode}
                onChangeText={(text) => handleInputChange("referralCode", text)}
                placeholder="Enter referral code (if any)"
                optional
                icon={<Gift size={20} color="#6B7280" />}
              />
            )}
          </View>

          {/* Forgot Password Link */}
          {isLogin && (
            <TouchableOpacity className="self-end mt-2 mb-6">
              <Text className="text-emerald-600 text-sm font-medium">
                Forgot Password?
              </Text>
            </TouchableOpacity>
          )}

          {/* Submit Button */}
          <TouchableOpacity
            className={`py-4 rounded-lg shadow-lg mt-6 ${isLoading ? 'bg-gray-400' : 'bg-emerald-600'}`}
            onPress={handleSubmit}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text className="text-white text-center font-semibold text-lg">
                {isLogin ? "Sign In" : "Create Account"}
              </Text>
            )}
          </TouchableOpacity>

          {/* Terms and Privacy */}
          {!isLogin && (
            <Text className="text-xs text-gray-500 text-center mt-4 leading-4">
              By creating an account, you agree to our{" "}
              <Text className="text-emerald-600 font-medium">
                Terms of Service
              </Text>{" "}
              and{" "}
              <Text className="text-emerald-600 font-medium">
                Privacy Policy
              </Text>
            </Text>
          )}

          {/* Islamic Accent */}
          <View className="items-center mt-8">
            <View className="flex-row items-center">
              <View className="h-px bg-gray-300 flex-1" />
              <Text className="mx-4 text-gray-500 text-sm font-arabic">
                بسم الله الرحمن الرحيم
              </Text>
              <View className="h-px bg-gray-300 flex-1" />
            </View>
            <Text className="text-xs text-gray-400 mt-2 text-center">
              "And whoever relies upon Allah - then He is sufficient for him."
            </Text>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default RegistrationFlow;
