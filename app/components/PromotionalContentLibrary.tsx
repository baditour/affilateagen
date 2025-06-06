import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Modal,
  Linking,
  Alert,
} from "react-native";
import { Image } from "expo-image";
import { Share } from "react-native";
import {
  Search,
  Filter,
  Heart,
  Share2,
  BookmarkPlus,
  BookmarkCheck,
  Eye,
  MessageCircle,
  X,
} from "lucide-react-native";

type ContentItem = {
  id: string;
  title: string;
  description: string;
  type: "image" | "text";
  category: string;
  imageUrl?: string;
  content?: string;
  isFavorite: boolean;
};

type PromotionalContentLibraryProps = {
  onBack?: () => void;
};

export default function PromotionalContentLibrary({
  onBack = () => {},
}: PromotionalContentLibraryProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [favorites, setFavorites] = useState<string[]>([]);
  const [previewItem, setPreviewItem] = useState<ContentItem | null>(null);
  const [showFilterModal, setShowFilterModal] = useState(false);

  // Campaign categories
  const categories = [
    "All",
    "Umrah Akhir Tahun",
    "Umrah Promo Keluarga",
    "Umrah Ramadan",
    "Umrah VIP",
    "Umrah Budget",
    "Hotel Promo",
    "Transport Deals",
  ];

  // Campaign promotional content
  const [promotionalContent, setPromotionalContent] = useState<ContentItem[]>([
    {
      id: "1",
      title: "Umrah Akhir Tahun 2024",
      description: "Paket spesial akhir tahun dengan harga terbaik!",
      type: "image",
      category: "Umrah Akhir Tahun",
      imageUrl:
        "https://images.unsplash.com/photo-1565019011521-254775dd7dff?w=800&q=80",
      content:
        "🕋 UMRAH AKHIR TAHUN 2024 🕋\n\n✨ Paket Spesial Desember\n💰 Harga mulai dari Rp 25.000.000\n🏨 Hotel bintang 5 dekat Haram\n🚌 Transport VIP AC\n📞 Hubungi kami sekarang!",
      isFavorite: false,
    },
    {
      id: "2",
      title: "Promo Keluarga Hemat",
      description: "Diskon khusus untuk keluarga 4 orang atau lebih",
      type: "image",
      category: "Umrah Promo Keluarga",
      imageUrl:
        "https://images.unsplash.com/photo-1566438480900-0609be27a4be?w=800&q=80",
      content:
        "👨‍👩‍👧‍👦 PROMO KELUARGA SPESIAL 👨‍👩‍👧‍👦\n\n🎯 Diskon hingga 15% untuk 4+ orang\n🏠 Kamar keluarga tersedia\n👶 Anak di bawah 2 tahun GRATIS\n🍽️ Makan 3x sehari included\n\nDaftar sekarang, kuota terbatas!",
      isFavorite: false,
    },
    {
      id: "3",
      title: "Umrah Ramadan 1446H",
      description: "Rasakan berkah Ramadan di tanah suci",
      type: "text",
      category: "Umrah Ramadan",
      content:
        "🌙 UMRAH RAMADAN 1446H 🌙\n\nMerasakan berkah bulan suci di Makkah dan Madinah\n\n✅ Paket 14 hari 13 malam\n✅ Sahur & Iftar di hotel\n✅ Ziarah lengkap\n✅ Bimbingan ibadah 24 jam\n✅ Visa & tiket pesawat included\n\nHubungi kami untuk info lebih lanjut!",
      isFavorite: false,
    },
    {
      id: "4",
      title: "Umrah VIP Eksklusif",
      description: "Pengalaman umrah mewah dengan layanan premium",
      type: "image",
      category: "Umrah VIP",
      imageUrl:
        "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&q=80",
      content:
        "👑 UMRAH VIP EKSKLUSIF 👑\n\n🏨 Hotel mewah view Haram\n🚁 City tour dengan helikopter\n🍽️ Fine dining experience\n👨‍⚕️ Dokter pendamping\n🛍️ Shopping tour eksklusif\n\nLimited seats available!",
      isFavorite: false,
    },
    {
      id: "5",
      title: "Umrah Budget Friendly",
      description: "Umrah berkualitas dengan harga terjangkau",
      type: "image",
      category: "Umrah Budget",
      imageUrl:
        "https://images.unsplash.com/photo-1570125909232-eb263c188f7e?w=800&q=80",
      content:
        "💰 UMRAH BUDGET FRIENDLY 💰\n\n🎯 Mulai dari Rp 18.000.000\n🏨 Hotel nyaman & bersih\n🚌 Transport sharing\n🍽️ Makan prasmanan\n📋 Manasik gratis\n\nDaftar sekarang, bayar bisa dicicil!",
      isFavorite: false,
    },
    {
      id: "6",
      title: "Promo Hotel Madinah",
      description: "Diskon khusus hotel di Madinah",
      type: "image",
      category: "Hotel Promo",
      imageUrl:
        "https://images.unsplash.com/photo-1591604129939-f1efa4d9f7fa?w=800&q=80",
      content:
        "🏨 PROMO HOTEL MADINAH 🏨\n\n🎊 Diskon 20% untuk booking sekarang\n🕌 Jarak 200m dari Masjid Nabawi\n🛏️ Kamar luas & nyaman\n🍳 Breakfast included\n📶 WiFi gratis\n\nPromo terbatas sampai akhir bulan!",
      isFavorite: false,
    },
  ]);

  // Filter content based on search and category
  const filteredContent = promotionalContent.filter((item) => {
    const matchesSearch =
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      selectedCategory === "All" || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Toggle favorite status
  const toggleFavorite = (id: string) => {
    setPromotionalContent((prevContent) =>
      prevContent.map((item) =>
        item.id === id ? { ...item, isFavorite: !item.isFavorite } : item,
      ),
    );
  };

  // Share content via WhatsApp
  const shareToWhatsApp = async (item: ContentItem) => {
    try {
      const message = item.content || `${item.title}\n${item.description}`;
      const encodedMessage = encodeURIComponent(message);
      const whatsappUrl = `whatsapp://send?text=${encodedMessage}`;

      const canOpen = await Linking.canOpenURL(whatsappUrl);
      if (canOpen) {
        await Linking.openURL(whatsappUrl);
      } else {
        // Fallback to web WhatsApp
        await Linking.openURL(`https://wa.me/?text=${encodedMessage}`);
      }
    } catch (error) {
      Alert.alert("Error", "Tidak dapat membuka WhatsApp");
    }
  };

  // General share content
  const shareContent = async (item: ContentItem) => {
    try {
      const message = item.content || `${item.title}\n${item.description}`;
      await Share.share({
        message,
        title: item.title,
      });
    } catch (error) {
      console.error("Error sharing content:", error);
    }
  };

  // Preview content
  const previewContent = (item: ContentItem) => {
    setPreviewItem(item);
  };

  return (
    <View className="flex-1 bg-white">
      {/* Header */}
      <View className="bg-blue-600 p-4 pt-12">
        <View className="flex-row justify-between items-center mb-4">
          <TouchableOpacity onPress={onBack} className="p-2">
            <Text className="text-white font-bold">← Back</Text>
          </TouchableOpacity>
          <Text className="text-white text-xl font-bold">
            Promotional Content
          </Text>
          <View style={{ width: 50 }} />
        </View>

        {/* Search Bar */}
        <View className="flex-row bg-white rounded-full px-4 py-2 items-center mb-4">
          <Search size={20} color="#4B5563" />
          <TextInput
            className="flex-1 ml-2 text-gray-800"
            placeholder="Search promotional content"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          <TouchableOpacity onPress={() => setShowFilterModal(true)}>
            <Filter size={20} color="#4B5563" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Categories */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        className="py-4 px-2 border-b border-gray-200"
      >
        {categories.map((category) => (
          <TouchableOpacity
            key={category}
            onPress={() => setSelectedCategory(category)}
            className={`px-4 py-2 mx-1 rounded-full ${selectedCategory === category ? "bg-blue-600" : "bg-gray-100"}`}
          >
            <Text
              className={`${selectedCategory === category ? "text-white" : "text-gray-800"} font-medium`}
            >
              {category}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Content List */}
      <ScrollView className="flex-1 p-4">
        {filteredContent.length > 0 ? (
          filteredContent.map((item) => (
            <View
              key={item.id}
              className="bg-white rounded-lg shadow-md mb-4 overflow-hidden border border-gray-200"
            >
              {item.type === "image" && item.imageUrl && (
                <Image
                  source={{ uri: item.imageUrl }}
                  style={{ width: "100%", height: 200 }}
                  contentFit="cover"
                />
              )}
              <View className="p-4">
                <Text className="text-lg font-bold text-gray-800">
                  {item.title}
                </Text>
                <Text className="text-gray-600 mb-2">{item.description}</Text>
                {item.type === "text" && item.content && (
                  <Text className="text-gray-700 mb-3">{item.content}</Text>
                )}
                <View className="flex-row justify-between items-center mt-2">
                  <View className="bg-emerald-100 px-3 py-1 rounded-full">
                    <Text className="text-emerald-800 text-xs font-medium">
                      {item.category}
                    </Text>
                  </View>
                  <View className="flex-row">
                    <TouchableOpacity
                      onPress={() => previewContent(item)}
                      className="p-2 mr-1"
                    >
                      <Eye size={18} color="#4B5563" />
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() => toggleFavorite(item.id)}
                      className="p-2 mr-1"
                    >
                      {item.isFavorite ? (
                        <BookmarkCheck size={18} color="#2563EB" />
                      ) : (
                        <BookmarkPlus size={18} color="#4B5563" />
                      )}
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() => shareToWhatsApp(item)}
                      className="bg-green-500 p-2 rounded-full mr-1"
                    >
                      <MessageCircle size={16} color="white" />
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() => shareContent(item)}
                      className="p-2"
                    >
                      <Share2 size={18} color="#4B5563" />
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </View>
          ))
        ) : (
          <View className="flex-1 items-center justify-center py-10">
            <Text className="text-gray-500 text-lg">No content found</Text>
          </View>
        )}
      </ScrollView>

      {/* Filter Modal */}
      <Modal
        visible={showFilterModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowFilterModal(false)}
      >
        <View className="flex-1 bg-black/50 justify-end">
          <View className="bg-white rounded-t-3xl p-6">
            <View className="flex-row justify-between items-center mb-4">
              <Text className="text-xl font-bold text-gray-800">
                Filter Kampanye
              </Text>
              <TouchableOpacity onPress={() => setShowFilterModal(false)}>
                <X size={24} color="#4B5563" />
              </TouchableOpacity>
            </View>
            <ScrollView className="max-h-80">
              {categories.map((category) => (
                <TouchableOpacity
                  key={category}
                  onPress={() => {
                    setSelectedCategory(category);
                    setShowFilterModal(false);
                  }}
                  className={`p-4 rounded-lg mb-2 ${selectedCategory === category ? "bg-emerald-100" : "bg-gray-50"}`}
                >
                  <Text
                    className={`${selectedCategory === category ? "text-emerald-800 font-semibold" : "text-gray-700"}`}
                  >
                    {category}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* Preview Modal */}
      <Modal
        visible={previewItem !== null}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setPreviewItem(null)}
      >
        <View className="flex-1 bg-black/80 justify-center p-4">
          <View className="bg-white rounded-2xl overflow-hidden max-h-4/5">
            <View className="flex-row justify-between items-center p-4 border-b border-gray-200">
              <Text className="text-lg font-bold text-gray-800">
                Preview Konten
              </Text>
              <TouchableOpacity onPress={() => setPreviewItem(null)}>
                <X size={24} color="#4B5563" />
              </TouchableOpacity>
            </View>

            {previewItem && (
              <ScrollView className="flex-1">
                {previewItem.type === "image" && previewItem.imageUrl && (
                  <Image
                    source={{ uri: previewItem.imageUrl }}
                    style={{ width: "100%", height: 250 }}
                    contentFit="cover"
                  />
                )}
                <View className="p-4">
                  <Text className="text-xl font-bold text-gray-800 mb-2">
                    {previewItem.title}
                  </Text>
                  <Text className="text-gray-600 mb-3">
                    {previewItem.description}
                  </Text>
                  {previewItem.content && (
                    <View className="bg-gray-50 p-4 rounded-lg mb-4">
                      <Text className="text-gray-800 leading-6">
                        {previewItem.content}
                      </Text>
                    </View>
                  )}
                  <View className="bg-emerald-100 px-3 py-2 rounded-full self-start">
                    <Text className="text-emerald-800 text-sm font-medium">
                      {previewItem.category}
                    </Text>
                  </View>
                </View>
              </ScrollView>
            )}

            <View className="p-4 border-t border-gray-200">
              <View className="flex-row space-x-3">
                <TouchableOpacity
                  onPress={() => {
                    if (previewItem) shareToWhatsApp(previewItem);
                    setPreviewItem(null);
                  }}
                  className="flex-1 bg-green-500 py-3 rounded-xl flex-row items-center justify-center"
                >
                  <MessageCircle size={20} color="white" />
                  <Text className="text-white font-semibold ml-2">
                    Share ke WhatsApp
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => {
                    if (previewItem) shareContent(previewItem);
                    setPreviewItem(null);
                  }}
                  className="flex-1 bg-blue-500 py-3 rounded-xl flex-row items-center justify-center"
                >
                  <Share2 size={20} color="white" />
                  <Text className="text-white font-semibold ml-2">
                    Share Lainnya
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}
