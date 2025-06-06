import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Image,
  Alert,
} from "react-native";
import { Plus, Upload, Edit3, Archive, Eye, EyeOff } from "lucide-react-native";

interface PromotionalMaterial {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  campaignTag: string;
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
}

const CAMPAIGN_TAGS = [
  "Umrah Packages",
  "Early Bird Offers",
  "Group Discounts",
  "Premium Services",
  "Seasonal Promotions",
  "Last Minute Deals",
];

const AdminPanel = () => {
  const [materials, setMaterials] = useState<PromotionalMaterial[]>([
    {
      id: "1",
      title: "Premium Umrah Package 2024",
      description:
        "Experience the spiritual journey with our premium Umrah package including 5-star accommodation and guided tours.",
      imageUrl:
        "https://images.unsplash.com/photo-1591604129939-f1efa4d9f7fa?w=400&q=80",
      campaignTag: "Umrah Packages",
      isPublished: true,
      createdAt: "2024-01-15",
      updatedAt: "2024-01-15",
    },
    {
      id: "2",
      title: "Early Bird Special - 30% Off",
      description:
        "Book your Umrah journey early and save 30% on all packages. Limited time offer for the blessed month.",
      imageUrl:
        "https://images.unsplash.com/photo-1564769625392-651b2c0e7b8a?w=400&q=80",
      campaignTag: "Early Bird Offers",
      isPublished: false,
      createdAt: "2024-01-10",
      updatedAt: "2024-01-12",
    },
  ]);

  const [isCreating, setIsCreating] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    imageUrl: "",
    campaignTag: CAMPAIGN_TAGS[0],
  });

  const handleCreate = () => {
    setIsCreating(true);
    setEditingId(null);
    setFormData({
      title: "",
      description: "",
      imageUrl: "",
      campaignTag: CAMPAIGN_TAGS[0],
    });
  };

  const handleEdit = (material: PromotionalMaterial) => {
    setIsCreating(false);
    setEditingId(material.id);
    setFormData({
      title: material.title,
      description: material.description,
      imageUrl: material.imageUrl,
      campaignTag: material.campaignTag,
    });
  };

  const handleSave = () => {
    if (!formData.title.trim() || !formData.description.trim()) {
      Alert.alert("Error", "Please fill in all required fields");
      return;
    }

    const now = new Date().toISOString().split("T")[0];

    if (isCreating) {
      const newMaterial: PromotionalMaterial = {
        id: Date.now().toString(),
        ...formData,
        isPublished: false,
        createdAt: now,
        updatedAt: now,
      };
      setMaterials([newMaterial, ...materials]);
    } else if (editingId) {
      setMaterials(
        materials.map((material) =>
          material.id === editingId
            ? { ...material, ...formData, updatedAt: now }
            : material,
        ),
      );
    }

    setIsCreating(false);
    setEditingId(null);
    setFormData({
      title: "",
      description: "",
      imageUrl: "",
      campaignTag: CAMPAIGN_TAGS[0],
    });
  };

  const handleCancel = () => {
    setIsCreating(false);
    setEditingId(null);
    setFormData({
      title: "",
      description: "",
      imageUrl: "",
      campaignTag: CAMPAIGN_TAGS[0],
    });
  };

  const togglePublish = (id: string) => {
    setMaterials(
      materials.map((material) =>
        material.id === id
          ? {
              ...material,
              isPublished: !material.isPublished,
              updatedAt: new Date().toISOString().split("T")[0],
            }
          : material,
      ),
    );
  };

  const handleArchive = (id: string) => {
    Alert.alert(
      "Archive Material",
      "Are you sure you want to archive this promotional material?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Archive",
          style: "destructive",
          onPress: () =>
            setMaterials(materials.filter((material) => material.id !== id)),
        },
      ],
    );
  };

  const isEditing = isCreating || editingId !== null;

  return (
    <View className="flex-1 bg-gray-50">
      {/* Header */}
      <View className="bg-white border-b border-gray-200 px-6 py-4">
        <Text className="text-2xl font-bold text-gray-900">Admin Panel</Text>
        <Text className="text-gray-600 mt-1">
          Manage promotional materials for affiliate agents
        </Text>
      </View>

      <ScrollView className="flex-1">
        {/* Create/Edit Form */}
        {isEditing && (
          <View className="bg-white mx-4 mt-4 rounded-lg border border-gray-200 p-4">
            <Text className="text-lg font-semibold text-gray-900 mb-4">
              {isCreating ? "Create New Material" : "Edit Material"}
            </Text>

            <View className="space-y-4">
              <View>
                <Text className="text-sm font-medium text-gray-700 mb-2">
                  Title *
                </Text>
                <TextInput
                  className="border border-gray-300 rounded-lg px-3 py-2 text-gray-900"
                  placeholder="Enter material title"
                  value={formData.title}
                  onChangeText={(text) =>
                    setFormData({ ...formData, title: text })
                  }
                />
              </View>

              <View>
                <Text className="text-sm font-medium text-gray-700 mb-2">
                  Description *
                </Text>
                <TextInput
                  className="border border-gray-300 rounded-lg px-3 py-2 text-gray-900 h-20"
                  placeholder="Enter material description"
                  value={formData.description}
                  onChangeText={(text) =>
                    setFormData({ ...formData, description: text })
                  }
                  multiline
                  textAlignVertical="top"
                />
              </View>

              <View>
                <Text className="text-sm font-medium text-gray-700 mb-2">
                  Image URL
                </Text>
                <TextInput
                  className="border border-gray-300 rounded-lg px-3 py-2 text-gray-900"
                  placeholder="Enter image URL or upload image"
                  value={formData.imageUrl}
                  onChangeText={(text) =>
                    setFormData({ ...formData, imageUrl: text })
                  }
                />
                {formData.imageUrl && (
                  <Image
                    source={{ uri: formData.imageUrl }}
                    className="w-full h-32 rounded-lg mt-2"
                    resizeMode="cover"
                  />
                )}
              </View>

              <View>
                <Text className="text-sm font-medium text-gray-700 mb-2">
                  Campaign Tag
                </Text>
                <View className="border border-gray-300 rounded-lg">
                  {CAMPAIGN_TAGS.map((tag) => (
                    <TouchableOpacity
                      key={tag}
                      className={`px-3 py-2 border-b border-gray-200 last:border-b-0 ${
                        formData.campaignTag === tag
                          ? "bg-green-50"
                          : "bg-white"
                      }`}
                      onPress={() =>
                        setFormData({ ...formData, campaignTag: tag })
                      }
                    >
                      <Text
                        className={`${
                          formData.campaignTag === tag
                            ? "text-green-700 font-medium"
                            : "text-gray-700"
                        }`}
                      >
                        {tag}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            </View>

            <View className="flex-row space-x-3 mt-6">
              <TouchableOpacity
                className="flex-1 bg-green-600 rounded-lg py-3 items-center"
                onPress={handleSave}
              >
                <Text className="text-white font-semibold">Save Material</Text>
              </TouchableOpacity>
              <TouchableOpacity
                className="flex-1 bg-gray-500 rounded-lg py-3 items-center"
                onPress={handleCancel}
              >
                <Text className="text-white font-semibold">Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* Materials List */}
        <View className="px-4 py-4">
          <View className="flex-row justify-between items-center mb-4">
            <Text className="text-lg font-semibold text-gray-900">
              Promotional Materials ({materials.length})
            </Text>
            {!isEditing && (
              <TouchableOpacity
                className="bg-green-600 rounded-lg px-4 py-2 flex-row items-center"
                onPress={handleCreate}
              >
                <Plus size={16} color="white" />
                <Text className="text-white font-medium ml-2">Add New</Text>
              </TouchableOpacity>
            )}
          </View>

          {materials.map((material) => (
            <View
              key={material.id}
              className="bg-white rounded-lg border border-gray-200 mb-3 overflow-hidden"
            >
              {material.imageUrl && (
                <Image
                  source={{ uri: material.imageUrl }}
                  className="w-full h-40"
                  resizeMode="cover"
                />
              )}

              <View className="p-4">
                <View className="flex-row justify-between items-start mb-2">
                  <Text className="text-lg font-semibold text-gray-900 flex-1">
                    {material.title}
                  </Text>
                  <View className="flex-row items-center ml-2">
                    {material.isPublished ? (
                      <Eye size={16} color="#10b981" />
                    ) : (
                      <EyeOff size={16} color="#6b7280" />
                    )}
                    <Text
                      className={`text-xs font-medium ml-1 ${
                        material.isPublished
                          ? "text-green-600"
                          : "text-gray-500"
                      }`}
                    >
                      {material.isPublished ? "Published" : "Draft"}
                    </Text>
                  </View>
                </View>

                <Text className="text-gray-600 mb-2">
                  {material.description}
                </Text>

                <View className="flex-row items-center justify-between">
                  <View>
                    <Text className="text-xs text-green-600 font-medium bg-green-100 px-2 py-1 rounded">
                      {material.campaignTag}
                    </Text>
                    <Text className="text-xs text-gray-500 mt-1">
                      Updated: {material.updatedAt}
                    </Text>
                  </View>

                  <View className="flex-row space-x-2">
                    <TouchableOpacity
                      className="bg-blue-100 p-2 rounded-lg"
                      onPress={() => handleEdit(material)}
                      disabled={isEditing}
                    >
                      <Edit3 size={16} color="#3b82f6" />
                    </TouchableOpacity>

                    <TouchableOpacity
                      className={`p-2 rounded-lg ${
                        material.isPublished ? "bg-orange-100" : "bg-green-100"
                      }`}
                      onPress={() => togglePublish(material.id)}
                      disabled={isEditing}
                    >
                      {material.isPublished ? (
                        <EyeOff size={16} color="#f97316" />
                      ) : (
                        <Eye size={16} color="#10b981" />
                      )}
                    </TouchableOpacity>

                    <TouchableOpacity
                      className="bg-red-100 p-2 rounded-lg"
                      onPress={() => handleArchive(material.id)}
                      disabled={isEditing}
                    >
                      <Archive size={16} color="#ef4444" />
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </View>
          ))}

          {materials.length === 0 && (
            <View className="bg-white rounded-lg border border-gray-200 p-8 items-center">
              <Upload size={48} color="#9ca3af" />
              <Text className="text-gray-500 text-center mt-4 text-lg">
                No promotional materials yet
              </Text>
              <Text className="text-gray-400 text-center mt-2">
                Create your first material to get started
              </Text>
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
};

export default AdminPanel;
