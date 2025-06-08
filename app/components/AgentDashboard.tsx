import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  TrendingUp,
  Users,
  DollarSign,
  Target,
  Calendar,
  Award,
  ArrowUp,
  ArrowDown,
  Eye,
  MessageCircle,
  Share2,
  Bell,
} from "lucide-react-native";

interface DashboardMetrics {
  totalCommission: number;
  monthlyCommission: number;
  totalLeads: number;
  convertedLeads: number;
  conversionRate: number;
  activeReferrals: number;
  pendingPayments: number;
  thisMonthGrowth: number;
}

interface RecentActivity {
  id: string;
  type: "lead" | "commission" | "referral" | "payment";
  title: string;
  description: string;
  amount?: number;
  timestamp: string;
  status: "success" | "pending" | "failed";
}

interface AgentDashboardProps {
  onNavigate?: (screen: string) => void;
}

const AgentDashboard: React.FC<AgentDashboardProps> = ({
  onNavigate = () => {}
}) => {
  const [metrics, setMetrics] = useState<DashboardMetrics>({
    totalCommission: 12450,
    monthlyCommission: 2450,
    totalLeads: 47,
    convertedLeads: 12,
    conversionRate: 25.5,
    activeReferrals: 8,
    pendingPayments: 1200,
    thisMonthGrowth: 12.5,
  });

  const [recentActivities, setRecentActivities] = useState<RecentActivity[]>([
    {
      id: "1",
      type: "commission",
      title: "Commission Earned",
      description: "Ahmad Mahmoud - Premium Package",
      amount: 450,
      timestamp: "2 hours ago",
      status: "success",
    },
    {
      id: "2",
      type: "lead",
      title: "New Lead",
      description: "Fatima Al-Saud interested in family package",
      timestamp: "4 hours ago",
      status: "pending",
    },
    {
      id: "3",
      type: "referral",
      title: "New Agent Referral",
      description: "Mohammed Hassan joined through your link",
      amount: 200,
      timestamp: "1 day ago",
      status: "success",
    },
    {
      id: "4",
      type: "payment",
      title: "Payment Processed",
      description: "Monthly commission payment",
      amount: 2450,
      timestamp: "2 days ago",
      status: "success",
    },
  ]);

  const screenWidth = Dimensions.get("window").width;

  const getActivityIcon = (type: string) => {
    switch (type) {
      case "commission":
        return <DollarSign size={16} color="#10b981" />;
      case "lead":
        return <Users size={16} color="#3b82f6" />;
      case "referral":
        return <Share2 size={16} color="#8b5cf6" />;
      case "payment":
        return <Award size={16} color="#f59e0b" />;
      default:
        return <Bell size={16} color="#6b7280" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "success":
        return "text-green-600";
      case "pending":
        return "text-yellow-600";
      case "failed":
        return "text-red-600";
      default:
        return "text-gray-600";
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 20 }}
      >
        {/* Header */}
        <View className="bg-gradient-to-r from-emerald-600 to-emerald-700 px-6 py-8 rounded-b-3xl">
          <View className="flex-row justify-between items-center mb-4">
            <View>
              <Text className="text-emerald-100 text-sm">Good morning</Text>
              <Text className="text-white text-2xl font-bold">Agent Dashboard</Text>
            </View>
            <TouchableOpacity className="bg-white/20 p-3 rounded-full">
              <Bell size={24} color="white" />
            </TouchableOpacity>
          </View>

          {/* Quick Stats */}
          <View className="bg-white/10 rounded-2xl p-4">
            <View className="flex-row justify-between items-center">
              <View>
                <Text className="text-emerald-100 text-sm">This Month</Text>
                <Text className="text-white text-3xl font-bold">
                  ${metrics.monthlyCommission.toLocaleString()}
                </Text>
              </View>
              <View className="flex-row items-center">
                <ArrowUp size={16} color="#10b981" />
                <Text className="text-green-300 text-sm font-medium ml-1">
                  +{metrics.thisMonthGrowth}%
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Metrics Cards */}
        <View className="px-6 -mt-6">
          <View className="flex-row flex-wrap justify-between">
            {/* Total Commission */}
            <View className="w-[48%] bg-white rounded-2xl p-4 shadow-sm border border-gray-100 mb-4">
              <View className="flex-row items-center justify-between mb-3">
                <View className="bg-green-100 p-3 rounded-full">
                  <DollarSign size={20} color="#059669" />
                </View>
                <Text className="text-green-600 text-xs font-medium">Total</Text>
              </View>
              <Text className="text-gray-600 text-xs mb-1">Total Commission</Text>
              <Text className="text-gray-900 text-xl font-bold">
                ${metrics.totalCommission.toLocaleString()}
              </Text>
            </View>

            {/* Conversion Rate */}
            <View className="w-[48%] bg-white rounded-2xl p-4 shadow-sm border border-gray-100 mb-4">
              <View className="flex-row items-center justify-between mb-3">
                <View className="bg-blue-100 p-3 rounded-full">
                  <Target size={20} color="#2563eb" />
                </View>
                <Text className="text-blue-600 text-xs font-medium">Rate</Text>
              </View>
              <Text className="text-gray-600 text-xs mb-1">Conversion Rate</Text>
              <Text className="text-gray-900 text-xl font-bold">
                {metrics.conversionRate}%
              </Text>
            </View>
          </View>
        </View>

        {/* Performance Overview */}
        <View className="px-6 mt-6">
          <Text className="text-gray-900 text-xl font-bold mb-4">Performance Overview</Text>

          <View className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <View className="flex-row justify-between items-center mb-4">
              <Text className="text-gray-700 text-lg font-semibold">Lead Pipeline</Text>
              <TouchableOpacity
                onPress={() => onNavigate("leads")}
                className="bg-blue-50 px-3 py-1 rounded-full"
              >
                <Text className="text-blue-600 text-sm font-medium">View All</Text>
              </TouchableOpacity>
            </View>

            <View className="space-y-3">
              <View className="flex-row justify-between items-center">
                <Text className="text-gray-600">Total Leads</Text>
                <Text className="text-gray-900 font-semibold">{metrics.totalLeads}</Text>
              </View>
              <View className="flex-row justify-between items-center">
                <Text className="text-gray-600">Converted</Text>
                <Text className="text-green-600 font-semibold">{metrics.convertedLeads}</Text>
              </View>
              <View className="flex-row justify-between items-center">
                <Text className="text-gray-600">Active Referrals</Text>
                <Text className="text-blue-600 font-semibold">{metrics.activeReferrals}</Text>
              </View>
              <View className="flex-row justify-between items-center">
                <Text className="text-gray-600">Pending Payments</Text>
                <Text className="text-orange-600 font-semibold">
                  ${metrics.pendingPayments.toLocaleString()}
                </Text>
              </View>
            </View>

            {/* Progress Bar */}
            <View className="mt-4">
              <View className="flex-row justify-between items-center mb-2">
                <Text className="text-gray-600 text-sm">Conversion Progress</Text>
                <Text className="text-gray-900 text-sm font-medium">
                  {metrics.convertedLeads}/{metrics.totalLeads}
                </Text>
              </View>
              <View className="bg-gray-200 rounded-full h-2">
                <View
                  className="bg-emerald-500 rounded-full h-2"
                  style={{ width: `${metrics.conversionRate}%` }}
                />
              </View>
            </View>
          </View>
        </View>

        {/* Quick Actions */}
        <View className="px-6 mt-6">
          <Text className="text-gray-900 text-xl font-bold mb-4">Quick Actions</Text>

          <View className="flex-row flex-wrap justify-between">
            <TouchableOpacity
              onPress={() => onNavigate("promotional")}
              className="w-[48%] bg-white rounded-2xl p-4 shadow-sm border border-gray-100 mb-4"
            >
              <View className="bg-purple-100 p-3 rounded-full mb-3 self-start">
                <Share2 size={20} color="#7c3aed" />
              </View>
              <Text className="text-gray-900 font-semibold mb-1">Share Content</Text>
              <Text className="text-gray-600 text-sm">Access promotional materials</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => onNavigate("leads")}
              className="w-[48%] bg-white rounded-2xl p-4 shadow-sm border border-gray-100 mb-4"
            >
              <View className="bg-blue-100 p-3 rounded-full mb-3 self-start">
                <Users size={20} color="#2563eb" />
              </View>
              <Text className="text-gray-900 font-semibold mb-1">Manage Leads</Text>
              <Text className="text-gray-600 text-sm">Track your referrals</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => onNavigate("commission")}
              className="w-[48%] bg-white rounded-2xl p-4 shadow-sm border border-gray-100 mb-4"
            >
              <View className="bg-green-100 p-3 rounded-full mb-3 self-start">
                <DollarSign size={20} color="#059669" />
              </View>
              <Text className="text-gray-900 font-semibold mb-1">Commission</Text>
              <Text className="text-gray-600 text-sm">View earnings & reports</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => onNavigate("invite")}
              className="w-[48%] bg-white rounded-2xl p-4 shadow-sm border border-gray-100 mb-4"
            >
              <View className="bg-orange-100 p-3 rounded-full mb-3 self-start">
                <MessageCircle size={20} color="#ea580c" />
              </View>
              <Text className="text-gray-900 font-semibold mb-1">Invite Agents</Text>
              <Text className="text-gray-600 text-sm">Expand your network</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Recent Activities */}
        <View className="px-6 mt-6">
          <View className="flex-row justify-between items-center mb-4">
            <Text className="text-gray-900 text-xl font-bold">Recent Activities</Text>
            <TouchableOpacity>
              <Text className="text-emerald-600 text-sm font-medium">View All</Text>
            </TouchableOpacity>
          </View>

          <View className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            {recentActivities.map((activity, index) => (
              <View
                key={activity.id}
                className={`p-4 ${index !== recentActivities.length - 1 ? 'border-b border-gray-100' : ''}`}
              >
                <View className="flex-row items-start">
                  <View className="bg-gray-50 p-2 rounded-full mr-3 mt-1">
                    {getActivityIcon(activity.type)}
                  </View>
                  <View className="flex-1">
                    <View className="flex-row justify-between items-start mb-1">
                      <Text className="text-gray-900 font-semibold flex-1">
                        {activity.title}
                      </Text>
                      {activity.amount && (
                        <Text className="text-emerald-600 font-bold">
                          +${activity.amount}
                        </Text>
                      )}
                    </View>
                    <Text className="text-gray-600 text-sm mb-1">
                      {activity.description}
                    </Text>
                    <View className="flex-row justify-between items-center">
                      <Text className="text-gray-500 text-xs">
                        {activity.timestamp}
                      </Text>
                      <Text className={`text-xs font-medium ${getStatusColor(activity.status)}`}>
                        {activity.status.charAt(0).toUpperCase() + activity.status.slice(1)}
                      </Text>
                    </View>
                  </View>
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* Achievement Badge */}
        <View className="px-6 mt-6">
          <View className="bg-gradient-to-r from-yellow-400 to-orange-500 rounded-2xl p-6">
            <View className="flex-row items-center">
              <View className="bg-white/20 p-3 rounded-full mr-4">
                <Award size={24} color="white" />
              </View>
              <View className="flex-1">
                <Text className="text-white text-lg font-bold mb-1">
                  Top Performer
                </Text>
                <Text className="text-yellow-100 text-sm">
                  You're in the top 10% of agents this month!
                </Text>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default AgentDashboard;
