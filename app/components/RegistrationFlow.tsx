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
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface FormData {
  name: string;
  phone: string;
  email: string;
  password: string;
  confirmPassword: string;
  referralCode: string;
}

const RegistrationFlow = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
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
  };

  const handleSubmit = () => {
    if (isLogin) {
      // Handle login logic
      if (!formData.email || !formData.password) {
        Alert.alert("Error", "Please fill in all required fields");
        return;
      }
      Alert.alert("Success", "Login successful!");
    } else {
      // Handle registration logic
      if (
        !formData.name ||
        !formData.phone ||
        !formData.email ||
        !formData.password
      ) {
        Alert.alert("Error", "Please fill in all required fields");
        return;
      }
      if (formData.password !== formData.confirmPassword) {
        Alert.alert("Error", "Passwords do not match");
        return;
      }
      Alert.alert("Success", "Registration successful!");
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
  }) => (
    <View className="mb-4">
      <Text className="text-gray-700 text-sm font-medium mb-2">
        {label} {optional && <Text className="text-gray-400">(Optional)</Text>}
      </Text>
      <View className="relative">
        <TextInput
          className="bg-white border border-gray-200 rounded-lg px-4 py-3 text-gray-800 shadow-sm"
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor="#9CA3AF"
          secureTextEntry={secureTextEntry}
          keyboardType={keyboardType}
          autoCapitalize={keyboardType === "email-address" ? "none" : "words"}
        />
        {showPasswordToggle && (
          <TouchableOpacity
            className="absolute right-3 top-3"
            onPress={onTogglePassword}
          >
            <Ionicons
              name={secureTextEntry ? "eye-off" : "eye"}
              size={20}
              color="#6B7280"
            />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      className="flex-1 bg-gradient-to-b from-emerald-50 to-white"
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
          <View className="space-y-4">
            {!isLogin && (
              <InputField
                label="Full Name"
                value={formData.name}
                onChangeText={(text) => handleInputChange("name", text)}
                placeholder="Enter your full name"
              />
            )}

            {!isLogin && (
              <InputField
                label="Phone Number"
                value={formData.phone}
                onChangeText={(text) => handleInputChange("phone", text)}
                placeholder="Enter your phone number"
                keyboardType="phone-pad"
              />
            )}

            <InputField
              label="Email Address"
              value={formData.email}
              onChangeText={(text) => handleInputChange("email", text)}
              placeholder="Enter your email address"
              keyboardType="email-address"
            />

            <InputField
              label="Password"
              value={formData.password}
              onChangeText={(text) => handleInputChange("password", text)}
              placeholder="Enter your password"
              secureTextEntry={!showPassword}
              showPasswordToggle
              onTogglePassword={() => setShowPassword(!showPassword)}
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
              />
            )}

            {!isLogin && (
              <InputField
                label="Referral Code"
                value={formData.referralCode}
                onChangeText={(text) => handleInputChange("referralCode", text)}
                placeholder="Enter referral code (if any)"
                optional
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
            className="bg-emerald-600 py-4 rounded-lg shadow-lg mt-6"
            onPress={handleSubmit}
          >
            <Text className="text-white text-center font-semibold text-lg">
              {isLogin ? "Sign In" : "Create Account"}
            </Text>
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
