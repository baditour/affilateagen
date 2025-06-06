import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Linking,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  User,
  TrendingUp,
  Share2,
  Users,
  Gift,
  MessageCircle,
} from "lucide-react-native";
import PromotionalContentLibrary from "./components/PromotionalContentLibrary";

export default function HomeScreen() {
  const [currentView, setCurrentView] = useState<"home" | "promotional">(
    "home",
  );

  if (currentView === "promotional") {
    return <PromotionalContentLibrary onBack={() => setCurrentView("home")} />;
  }
  const handleWhatsAppInvite = () => {
    const message =
      "Join me as an Umrah travel agent and earn great commissions! Download our app and start your journey.";
    const url = `whatsapp://send?text=${encodeURIComponent(message)}`;
    Linking.openURL(url).catch(() => {
      // Fallback to web WhatsApp if app is not installed
      Linking.openURL(`https://wa.me/?text=${encodeURIComponent(message)}`);
    });
  };

  const handlePromotionalTools = () => {
    setCurrentView("promotional");
  };

  const handleLeadTracking = () => {
    // Navigate to lead tracking
    console.log("Navigate to lead tracking");
  };

  const handleCommissionReports = () => {
    // Navigate to commission reports
    console.log("Navigate to commission reports");
  };

  return (
    <SafeAreaView className="flex-1 bg-slate-50">
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View className="bg-emerald-600 px-6 py-8 rounded-b-3xl">
          <Text className="text-white text-center text-lg font-medium mb-2">
            بسم الله الرحمن الرحيم
          </Text>
          <Text className="text-white text-center text-2xl font-bold mb-1">
            Welcome Back, Agent
          </Text>
          <Text className="text-emerald-100 text-center text-base">
            Your Umrah Partnership Dashboard
          </Text>
        </View>

        {/* Stats Cards */}
        <View className="px-6 -mt-6">
          <View className="flex-row space-x-4">
            {/* Commission Card */}
            <View className="flex-1 bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <View className="flex-row items-center justify-between mb-3">
                <View className="bg-emerald-100 p-3 rounded-full">
                  <TrendingUp size={24} color="#059669" />
                </View>
                <Text className="text-emerald-600 text-sm font-medium">
                  +12.5%
                </Text>
              </View>
              <Text className="text-gray-600 text-sm mb-1">
                Current Commission
              </Text>
              <Text className="text-gray-900 text-2xl font-bold">$2,450</Text>
            </View>

            {/* Leads Card */}
            <View className="flex-1 bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <View className="flex-row items-center justify-between mb-3">
                <View className="bg-blue-100 p-3 rounded-full">
                  <Users size={24} color="#2563eb" />
                </View>
                <Text className="text-blue-600 text-sm font-medium">+8</Text>
              </View>
              <Text className="text-gray-600 text-sm mb-1">Total Leads</Text>
              <Text className="text-gray-900 text-2xl font-bold">47</Text>
            </View>
          </View>
        </View>

        {/* Quick Actions */}
        <View className="px-6 mt-8">
          <Text className="text-gray-900 text-xl font-bold mb-4">
            Quick Actions
          </Text>

          <View className="space-y-4">
            {/* Promotional Tools */}
            <TouchableOpacity
              onPress={handlePromotionalTools}
              className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex-row items-center"
              accessibilityLabel="Access promotional tools"
              accessibilityHint="Tap to view and share promotional content"
            >
              <View className="bg-purple-100 p-4 rounded-full mr-4">
                <Share2 size={24} color="#7c3aed" />
              </View>
              <View className="flex-1">
                <Text className="text-gray-900 text-lg font-semibold mb-1">
                  Promotional Tools
                </Text>
                <Text className="text-gray-600 text-sm">
                  Access marketing materials and share content
                </Text>
              </View>
              <View className="bg-purple-50 px-3 py-1 rounded-full">
                <Text className="text-purple-600 text-xs font-medium">NEW</Text>
              </View>
            </TouchableOpacity>

            {/* Lead Tracking */}
            <TouchableOpacity
              onPress={handleLeadTracking}
              className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex-row items-center"
              accessibilityLabel="View lead tracking"
              accessibilityHint="Tap to see your referral pipeline and conversion rates"
            >
              <View className="bg-orange-100 p-4 rounded-full mr-4">
                <TrendingUp size={24} color="#ea580c" />
              </View>
              <View className="flex-1">
                <Text className="text-gray-900 text-lg font-semibold mb-1">
                  Lead Tracking
                </Text>
                <Text className="text-gray-600 text-sm">
                  Monitor your referral pipeline and conversions
                </Text>
              </View>
            </TouchableOpacity>

            {/* Commission Reports */}
            <TouchableOpacity
              onPress={handleCommissionReports}
              className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex-row items-center"
              accessibilityLabel="View commission reports"
              accessibilityHint="Tap to see detailed financial summaries and payment status"
            >
              <View className="bg-green-100 p-4 rounded-full mr-4">
                <Gift size={24} color="#16a34a" />
              </View>
              <View className="flex-1">
                <Text className="text-gray-900 text-lg font-semibold mb-1">
                  Commission Reports
                </Text>
                <Text className="text-gray-600 text-sm">
                  View earnings, payments, and financial summaries
                </Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>

        {/* WhatsApp Invite Section */}
        <View className="px-6 mt-8 mb-8">
          <View className="bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-2xl p-6">
            <View className="flex-row items-center mb-4">
              <View className="bg-white/20 p-3 rounded-full mr-4">
                <MessageCircle size={24} color="white" />
              </View>
              <View className="flex-1">
                <Text className="text-white text-lg font-bold mb-1">
                  Invite & Earn More
                </Text>
                <Text className="text-emerald-100 text-sm">
                  Share the opportunity with fellow agents
                </Text>
              </View>
            </View>

            <TouchableOpacity
              onPress={handleWhatsAppInvite}
              className="bg-white rounded-xl py-4 px-6 flex-row items-center justify-center"
              accessibilityLabel="Invite via WhatsApp"
              accessibilityHint="Tap to share invitation message through WhatsApp"
            >
              <MessageCircle size={20} color="#059669" className="mr-2" />
              <Text className="text-emerald-600 text-base font-semibold ml-2">
                Invite via WhatsApp
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Bottom Spacing */}
        <View className="h-6" />
      </ScrollView>
    </SafeAreaView>
  );
}
