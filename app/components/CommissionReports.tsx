import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Modal,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  DollarSign,
  TrendingUp,
  Calendar,
  Download,
  Filter,
  Eye,
  CreditCard,
  Clock,
  CheckCircle,
  XCircle,
  ArrowLeft,
} from "lucide-react-native";

interface CommissionRecord {
  id: string;
  date: string;
  clientName: string;
  packageType: string;
  baseAmount: number;
  commissionRate: number;
  commissionAmount: number;
  status: "paid" | "pending" | "processing";
  paymentDate?: string;
  transactionId?: string;
}

interface PaymentSummary {
  totalEarned: number;
  totalPaid: number;
  totalPending: number;
  thisMonth: number;
  lastMonth: number;
  growth: number;
}

interface CommissionReportsProps {
  onBack?: () => void;
}

const CommissionReports: React.FC<CommissionReportsProps> = ({ 
  onBack = () => {} 
}) => {
  const [selectedPeriod, setSelectedPeriod] = useState("thisMonth");
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<CommissionRecord | null>(null);

  const [paymentSummary] = useState<PaymentSummary>({
    totalEarned: 15750,
    totalPaid: 12450,
    totalPending: 3300,
    thisMonth: 2450,
    lastMonth: 2180,
    growth: 12.4,
  });

  const [commissionRecords] = useState<CommissionRecord[]>([
    {
      id: "1",
      date: "2024-01-15",
      clientName: "Ahmad Mahmoud",
      packageType: "Premium Umrah Package",
      baseAmount: 15000,
      commissionRate: 3,
      commissionAmount: 450,
      status: "paid",
      paymentDate: "2024-01-20",
      transactionId: "TXN001234",
    },
    {
      id: "2",
      date: "2024-01-12",
      clientName: "Fatima Al-Saud",
      packageType: "Family Package (4 pax)",
      baseAmount: 45000,
      commissionRate: 2.5,
      commissionAmount: 1125,
      status: "paid",
      paymentDate: "2024-01-18",
      transactionId: "TXN001235",
    },
    {
      id: "3",
      date: "2024-01-10",
      clientName: "Mohammed Hassan",
      packageType: "Budget Umrah Package",
      baseAmount: 25000,
      commissionRate: 2,
      commissionAmount: 500,
      status: "processing",
    },
    {
      id: "4",
      date: "2024-01-08",
      clientName: "Aisha Abdullah",
      packageType: "VIP Umrah Package",
      baseAmount: 35000,
      commissionRate: 4,
      commissionAmount: 1400,
      status: "pending",
    },
    {
      id: "5",
      date: "2024-01-05",
      clientName: "Omar Khalid",
      packageType: "Group Package (8 pax)",
      baseAmount: 80000,
      commissionRate: 3.5,
      commissionAmount: 2800,
      status: "paid",
      paymentDate: "2024-01-12",
      transactionId: "TXN001236",
    },
  ]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "paid":
        return "bg-green-100 text-green-700";
      case "pending":
        return "bg-yellow-100 text-yellow-700";
      case "processing":
        return "bg-blue-100 text-blue-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "paid":
        return <CheckCircle size={16} color="#059669" />;
      case "pending":
        return <Clock size={16} color="#d97706" />;
      case "processing":
        return <CreditCard size={16} color="#2563eb" />;
      default:
        return <XCircle size={16} color="#6b7280" />;
    }
  };

  const handleExportReport = () => {
    Alert.alert(
      "Export Report",
      "Choose export format:",
      [
        { text: "PDF", onPress: () => console.log("Export PDF") },
        { text: "Excel", onPress: () => console.log("Export Excel") },
        { text: "Cancel", style: "cancel" },
      ]
    );
  };

  const periods = [
    { key: "thisMonth", label: "This Month" },
    { key: "lastMonth", label: "Last Month" },
    { key: "last3Months", label: "Last 3 Months" },
    { key: "thisYear", label: "This Year" },
    { key: "all", label: "All Time" },
  ];

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      {/* Header */}
      <View className="bg-emerald-600 px-6 py-4">
        <View className="flex-row items-center justify-between mb-4">
          <TouchableOpacity onPress={onBack} className="p-2">
            <ArrowLeft size={24} color="white" />
          </TouchableOpacity>
          <Text className="text-white text-xl font-bold">Commission Reports</Text>
          <TouchableOpacity onPress={handleExportReport} className="p-2">
            <Download size={24} color="white" />
          </TouchableOpacity>
        </View>

        {/* Summary Cards */}
        <View className="bg-white/10 rounded-2xl p-4">
          <View className="flex-row justify-between items-center mb-3">
            <Text className="text-emerald-100 text-sm">Total Earnings</Text>
            <View className="flex-row items-center">
              <TrendingUp size={16} color="#10b981" />
              <Text className="text-green-300 text-sm font-medium ml-1">
                +{paymentSummary.growth}%
              </Text>
            </View>
          </View>
          <Text className="text-white text-3xl font-bold mb-2">
            ${paymentSummary.totalEarned.toLocaleString()}
          </Text>
          <View className="flex-row justify-between">
            <View>
              <Text className="text-emerald-200 text-xs">Paid</Text>
              <Text className="text-white text-lg font-semibold">
                ${paymentSummary.totalPaid.toLocaleString()}
              </Text>
            </View>
            <View>
              <Text className="text-emerald-200 text-xs">Pending</Text>
              <Text className="text-white text-lg font-semibold">
                ${paymentSummary.totalPending.toLocaleString()}
              </Text>
            </View>
          </View>
        </View>
      </View>

      {/* Filter Bar */}
      <View className="px-6 py-4 bg-white border-b border-gray-200">
        <View className="flex-row justify-between items-center">
          <ScrollView horizontal showsHorizontalScrollIndicator={false} className="flex-1">
            <View className="flex-row space-x-2">
              {periods.map((period) => (
                <TouchableOpacity
                  key={period.key}
                  onPress={() => setSelectedPeriod(period.key)}
                  className={`px-4 py-2 rounded-full ${
                    selectedPeriod === period.key
                      ? "bg-emerald-600"
                      : "bg-gray-100"
                  }`}
                >
                  <Text
                    className={`text-sm font-medium ${
                      selectedPeriod === period.key
                        ? "text-white"
                        : "text-gray-700"
                    }`}
                  >
                    {period.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>
          <TouchableOpacity
            onPress={() => setShowFilterModal(true)}
            className="ml-4 p-2"
          >
            <Filter size={20} color="#059669" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Commission Records */}
      <ScrollView className="flex-1 px-6 py-4">
        <Text className="text-gray-900 text-lg font-bold mb-4">
          Commission History
        </Text>

        {commissionRecords.map((record) => (
          <TouchableOpacity
            key={record.id}
            onPress={() => setSelectedRecord(record)}
            className="bg-white rounded-2xl p-4 mb-3 shadow-sm border border-gray-100"
          >
            <View className="flex-row justify-between items-start mb-2">
              <View className="flex-1">
                <Text className="text-gray-900 font-semibold text-base">
                  {record.clientName}
                </Text>
                <Text className="text-gray-600 text-sm">
                  {record.packageType}
                </Text>
              </View>
              <View className="items-end">
                <Text className="text-emerald-600 font-bold text-lg">
                  +${record.commissionAmount}
                </Text>
                <View className={`flex-row items-center px-2 py-1 rounded-full ${getStatusColor(record.status)}`}>
                  {getStatusIcon(record.status)}
                  <Text className="ml-1 text-xs font-medium">
                    {record.status.charAt(0).toUpperCase() + record.status.slice(1)}
                  </Text>
                </View>
              </View>
            </View>

            <View className="flex-row justify-between items-center pt-2 border-t border-gray-100">
              <View className="flex-row items-center">
                <Calendar size={14} color="#6b7280" />
                <Text className="text-gray-500 text-sm ml-1">{record.date}</Text>
              </View>
              <Text className="text-gray-500 text-sm">
                {record.commissionRate}% of ${record.baseAmount.toLocaleString()}
              </Text>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Record Detail Modal */}
      <Modal
        visible={selectedRecord !== null}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setSelectedRecord(null)}
      >
        <View className="flex-1 bg-black/50 justify-end">
          <View className="bg-white rounded-t-3xl p-6 max-h-4/5">
            <View className="flex-row justify-between items-center mb-6">
              <Text className="text-xl font-bold text-gray-900">
                Commission Details
              </Text>
              <TouchableOpacity onPress={() => setSelectedRecord(null)}>
                <XCircle size={24} color="#6b7280" />
              </TouchableOpacity>
            </View>

            {selectedRecord && (
              <ScrollView showsVerticalScrollIndicator={false}>
                <View>
                  {/* Client Info */}
                  <View className="bg-gray-50 rounded-xl p-4 mb-4">
                    <Text className="text-gray-600 text-sm mb-1">Client</Text>
                    <Text className="text-gray-900 text-lg font-semibold">
                      {selectedRecord.clientName}
                    </Text>
                  </View>

                  {/* Package Info */}
                  <View className="bg-gray-50 rounded-xl p-4 mb-4">
                    <Text className="text-gray-600 text-sm mb-1">Package</Text>
                    <Text className="text-gray-900 text-lg font-semibold">
                      {selectedRecord.packageType}
                    </Text>
                  </View>

                  {/* Financial Details */}
                  <View className="bg-emerald-50 rounded-xl p-4 mb-4">
                    <Text className="text-emerald-700 text-sm mb-3 font-medium">
                      Financial Breakdown
                    </Text>
                    <View>
                      <View className="flex-row justify-between mb-2">
                        <Text className="text-gray-600">Package Value</Text>
                        <Text className="text-gray-900 font-semibold">
                          ${selectedRecord.baseAmount.toLocaleString()}
                        </Text>
                      </View>
                      <View className="flex-row justify-between mb-2">
                        <Text className="text-gray-600">Commission Rate</Text>
                        <Text className="text-gray-900 font-semibold">
                          {selectedRecord.commissionRate}%
                        </Text>
                      </View>
                      <View className="border-t border-emerald-200 pt-2">
                        <View className="flex-row justify-between">
                          <Text className="text-emerald-700 font-semibold">
                            Your Commission
                          </Text>
                          <Text className="text-emerald-700 font-bold text-lg">
                            ${selectedRecord.commissionAmount}
                          </Text>
                        </View>
                      </View>
                    </View>
                  </View>

                  {/* Status & Payment Info */}
                  <View className="bg-gray-50 rounded-xl p-4">
                    <Text className="text-gray-600 text-sm mb-3">Status & Payment</Text>
                    <View>
                      <View className="flex-row justify-between items-center mb-2">
                        <Text className="text-gray-600">Status</Text>
                        <View className={`flex-row items-center px-3 py-1 rounded-full ${getStatusColor(selectedRecord.status)}`}>
                          {getStatusIcon(selectedRecord.status)}
                          <Text className="ml-1 text-sm font-medium">
                            {selectedRecord.status.charAt(0).toUpperCase() + selectedRecord.status.slice(1)}
                          </Text>
                        </View>
                      </View>
                      <View className="flex-row justify-between mb-2">
                        <Text className="text-gray-600">Booking Date</Text>
                        <Text className="text-gray-900 font-semibold">
                          {selectedRecord.date}
                        </Text>
                      </View>
                      {selectedRecord.paymentDate && (
                        <View className="flex-row justify-between mb-2">
                          <Text className="text-gray-600">Payment Date</Text>
                          <Text className="text-gray-900 font-semibold">
                            {selectedRecord.paymentDate}
                          </Text>
                        </View>
                      )}
                      {selectedRecord.transactionId && (
                        <View className="flex-row justify-between">
                          <Text className="text-gray-600">Transaction ID</Text>
                          <Text className="text-gray-900 font-semibold">
                            {selectedRecord.transactionId}
                          </Text>
                        </View>
                      )}
                    </View>
                  </View>
                </View>
              </ScrollView>
            )}
          </View>
        </View>
      </Modal>

      {/* Filter Modal */}
      <Modal
        visible={showFilterModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowFilterModal(false)}
      >
        <View className="flex-1 bg-black/50 justify-end">
          <View className="bg-white rounded-t-3xl p-6">
            <View className="flex-row justify-between items-center mb-6">
              <Text className="text-xl font-bold text-gray-900">Filter Reports</Text>
              <TouchableOpacity onPress={() => setShowFilterModal(false)}>
                <XCircle size={24} color="#6b7280" />
              </TouchableOpacity>
            </View>

            <ScrollView className="max-h-80">
              {/* Status Filter */}
              <View className="mb-6">
                <Text className="text-gray-700 font-semibold mb-3">Status</Text>
                <View className="flex-row flex-wrap">
                  {["all", "paid", "pending", "processing"].map((status) => (
                    <TouchableOpacity
                      key={status}
                      className="bg-gray-100 px-4 py-2 rounded-full mr-2 mb-2"
                    >
                      <Text className="text-gray-700 capitalize">{status}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              {/* Amount Range */}
              <View className="mb-6">
                <Text className="text-gray-700 font-semibold mb-3">Commission Range</Text>
                <View className="flex-row flex-wrap">
                  {["All", "$0-$500", "$500-$1000", "$1000-$2000", "$2000+"].map((range) => (
                    <TouchableOpacity
                      key={range}
                      className="bg-gray-100 px-4 py-2 rounded-full mr-2 mb-2"
                    >
                      <Text className="text-gray-700">{range}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            </ScrollView>

            <TouchableOpacity
              onPress={() => setShowFilterModal(false)}
              className="bg-emerald-600 py-4 rounded-xl mt-4"
            >
              <Text className="text-white text-center font-semibold text-lg">
                Apply Filters
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

export default CommissionReports;
