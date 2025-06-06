import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
} from "react-native";
import {
  ChevronDown,
  Filter,
  Search,
  User,
  Calendar,
  TrendingUp,
  CheckCircle,
  Clock,
  XCircle,
  AlertCircle,
} from "lucide-react-native";

type LeadStatus = "new" | "contacted" | "interested" | "converted" | "lost";

interface Lead {
  id: string;
  name: string;
  phone: string;
  email: string;
  date: string;
  status: LeadStatus;
  notes?: string;
}

interface LeadTrackingSystemProps {
  leads?: Lead[];
  onLeadSelect?: (lead: Lead) => void;
}

const statusColors = {
  new: "bg-blue-100 text-blue-700",
  contacted: "bg-purple-100 text-purple-700",
  interested: "bg-amber-100 text-amber-700",
  converted: "bg-green-100 text-green-700",
  lost: "bg-red-100 text-red-700",
};

const statusIcons = {
  new: <User size={16} color="#1d4ed8" />,
  contacted: <Clock size={16} color="#7e22ce" />,
  interested: <AlertCircle size={16} color="#b45309" />,
  converted: <CheckCircle size={16} color="#15803d" />,
  lost: <XCircle size={16} color="#b91c1c" />,
};

const defaultLeads: Lead[] = [
  {
    id: "1",
    name: "Ahmad Mahmoud",
    phone: "+966 50 123 4567",
    email: "ahmad@example.com",
    date: "2023-05-15",
    status: "new",
    notes: "Interested in family package for 4 people",
  },
  {
    id: "2",
    name: "Fatima Al-Saud",
    phone: "+966 55 987 6543",
    email: "fatima@example.com",
    date: "2023-05-12",
    status: "contacted",
    notes: "Called on May 13, will decide by end of week",
  },
  {
    id: "3",
    name: "Mohammed Hassan",
    phone: "+966 54 456 7890",
    email: "mohammed@example.com",
    date: "2023-05-10",
    status: "interested",
    notes: "Requested pricing for premium package",
  },
  {
    id: "4",
    name: "Aisha Abdullah",
    phone: "+966 56 234 5678",
    email: "aisha@example.com",
    date: "2023-05-08",
    status: "converted",
    notes: "Booked premium package for 2 people",
  },
  {
    id: "5",
    name: "Omar Khalid",
    phone: "+966 59 876 5432",
    email: "omar@example.com",
    date: "2023-05-05",
    status: "lost",
    notes: "Chose another provider due to dates",
  },
];

const LeadTrackingSystem = ({
  leads = defaultLeads,
  onLeadSelect = () => {},
}: LeadTrackingSystemProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<LeadStatus | "all">(
    "all",
  );
  const [showFilters, setShowFilters] = useState(false);

  // Calculate conversion metrics
  const totalLeads = leads.length;
  const convertedLeads = leads.filter(
    (lead) => lead.status === "converted",
  ).length;
  const conversionRate =
    totalLeads > 0 ? Math.round((convertedLeads / totalLeads) * 100) : 0;

  // Filter leads based on search and status
  const filteredLeads = leads.filter((lead) => {
    const matchesSearch =
      lead.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lead.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus =
      selectedStatus === "all" || lead.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  const renderStatusBadge = (status: LeadStatus) => {
    const colorClass = statusColors[status];
    const icon = statusIcons[status];

    return (
      <View
        className={`flex-row items-center px-2 py-1 rounded-full ${colorClass.split(" ")[0]}`}
      >
        {icon}
        <Text
          className={`ml-1 text-xs font-medium ${colorClass.split(" ")[1]}`}
        >
          {status.charAt(0).toUpperCase() + status.slice(1)}
        </Text>
      </View>
    );
  };

  return (
    <View className="flex-1 bg-white">
      {/* Header */}
      <View className="px-4 pt-6 pb-4 bg-indigo-600">
        <Text className="text-2xl font-bold text-white">Lead Tracking</Text>
        <Text className="text-indigo-100 mt-1">
          Monitor your referral pipeline
        </Text>

        {/* Metrics */}
        <View className="flex-row justify-between mt-4 bg-white/10 rounded-lg p-3">
          <View className="items-center">
            <Text className="text-xs text-indigo-100">Total Leads</Text>
            <Text className="text-xl font-bold text-white">{totalLeads}</Text>
          </View>
          <View className="items-center">
            <Text className="text-xs text-indigo-100">Converted</Text>
            <Text className="text-xl font-bold text-white">
              {convertedLeads}
            </Text>
          </View>
          <View className="items-center">
            <Text className="text-xs text-indigo-100">Conversion Rate</Text>
            <View className="flex-row items-center">
              <Text className="text-xl font-bold text-white">
                {conversionRate}%
              </Text>
              <TrendingUp size={16} color="#ffffff" className="ml-1" />
            </View>
          </View>
        </View>
      </View>

      {/* Search and Filter */}
      <View className="px-4 py-3 border-b border-gray-200">
        <View className="flex-row items-center bg-gray-100 rounded-lg px-3 py-2">
          <Search size={18} color="#6b7280" />
          <TextInput
            className="flex-1 ml-2 text-gray-800"
            placeholder="Search leads..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholderTextColor="#9ca3af"
          />
        </View>

        <View className="flex-row justify-between items-center mt-3">
          <TouchableOpacity
            className="flex-row items-center"
            onPress={() => setShowFilters(!showFilters)}
          >
            <Filter size={18} color="#4f46e5" />
            <Text className="ml-1 text-indigo-600 font-medium">Filter</Text>
            <ChevronDown size={16} color="#4f46e5" className="ml-1" />
          </TouchableOpacity>

          <View className="flex-row items-center">
            <Calendar size={18} color="#4f46e5" />
            <Text className="ml-1 text-indigo-600 font-medium">This Month</Text>
          </View>
        </View>

        {showFilters && (
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            className="mt-3 pb-2"
          >
            {["all", "new", "contacted", "interested", "converted", "lost"].map(
              (status) => (
                <TouchableOpacity
                  key={status}
                  className={`px-3 py-1 rounded-full mr-2 ${selectedStatus === status ? "bg-indigo-600" : "bg-gray-100"}`}
                  onPress={() =>
                    setSelectedStatus(status as LeadStatus | "all")
                  }
                >
                  <Text
                    className={`text-sm ${selectedStatus === status ? "text-white" : "text-gray-700"}`}
                  >
                    {status === "all"
                      ? "All"
                      : status.charAt(0).toUpperCase() + status.slice(1)}
                  </Text>
                </TouchableOpacity>
              ),
            )}
          </ScrollView>
        )}
      </View>

      {/* Lead List */}
      <ScrollView className="flex-1">
        {filteredLeads.length > 0 ? (
          filteredLeads.map((lead) => (
            <TouchableOpacity
              key={lead.id}
              className="p-4 border-b border-gray-200"
              onPress={() => onLeadSelect(lead)}
            >
              <View className="flex-row justify-between items-start">
                <View className="flex-1">
                  <Text className="text-lg font-semibold text-gray-800">
                    {lead.name}
                  </Text>
                  <Text className="text-gray-600 mt-1">{lead.phone}</Text>
                  <Text className="text-gray-600">{lead.email}</Text>
                  {lead.notes && (
                    <Text className="text-gray-500 mt-1 text-sm">
                      {lead.notes}
                    </Text>
                  )}
                </View>
                <View className="items-end">
                  {renderStatusBadge(lead.status)}
                  <Text className="text-xs text-gray-500 mt-2">
                    {lead.date}
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
          ))
        ) : (
          <View className="p-8 items-center justify-center">
            <Text className="text-gray-500 text-center">
              No leads match your search criteria
            </Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
};

export default LeadTrackingSystem;
