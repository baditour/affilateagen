import React, { useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Animated,
  Dimensions,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  CheckCircle,
  XCircle,
  AlertTriangle,
  Info,
  X,
} from 'lucide-react-native';
import { useApp } from '../context/AppContext';

interface NotificationProps {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message: string;
  onDismiss: (id: string) => void;
}

const NotificationItem: React.FC<NotificationProps> = ({
  id,
  type,
  title,
  message,
  onDismiss,
}) => {
  const slideAnim = new Animated.Value(-100);
  const opacityAnim = new Animated.Value(0);

  useEffect(() => {
    // Slide in animation
    Animated.parallel([
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(opacityAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start();

    // Auto dismiss after 5 seconds
    const timer = setTimeout(() => {
      handleDismiss();
    }, 5000);

    return () => clearTimeout(timer);
  }, []);

  const handleDismiss = () => {
    Animated.parallel([
      Animated.timing(slideAnim, {
        toValue: -100,
        duration: 250,
        useNativeDriver: true,
      }),
      Animated.timing(opacityAnim, {
        toValue: 0,
        duration: 250,
        useNativeDriver: true,
      }),
    ]).start(() => {
      onDismiss(id);
    });
  };

  const getNotificationStyle = () => {
    switch (type) {
      case 'success':
        return {
          backgroundColor: '#10b981',
          borderColor: '#059669',
          iconColor: '#ffffff',
        };
      case 'error':
        return {
          backgroundColor: '#ef4444',
          borderColor: '#dc2626',
          iconColor: '#ffffff',
        };
      case 'warning':
        return {
          backgroundColor: '#f59e0b',
          borderColor: '#d97706',
          iconColor: '#ffffff',
        };
      case 'info':
        return {
          backgroundColor: '#3b82f6',
          borderColor: '#2563eb',
          iconColor: '#ffffff',
        };
      default:
        return {
          backgroundColor: '#6b7280',
          borderColor: '#4b5563',
          iconColor: '#ffffff',
        };
    }
  };

  const getIcon = () => {
    const { iconColor } = getNotificationStyle();
    const size = 20;

    switch (type) {
      case 'success':
        return <CheckCircle size={size} color={iconColor} />;
      case 'error':
        return <XCircle size={size} color={iconColor} />;
      case 'warning':
        return <AlertTriangle size={size} color={iconColor} />;
      case 'info':
        return <Info size={size} color={iconColor} />;
      default:
        return <Info size={size} color={iconColor} />;
    }
  };

  const { backgroundColor, borderColor } = getNotificationStyle();

  return (
    <Animated.View
      style={{
        transform: [{ translateY: slideAnim }],
        opacity: opacityAnim,
      }}
      className="mx-4 mb-2"
    >
      <View
        style={{
          backgroundColor,
          borderLeftWidth: 4,
          borderLeftColor: borderColor,
        }}
        className="rounded-lg shadow-lg overflow-hidden"
      >
        <View className="p-4">
          <View className="flex-row items-start justify-between">
            <View className="flex-row items-start flex-1">
              <View className="mr-3 mt-0.5">
                {getIcon()}
              </View>
              <View className="flex-1">
                <Text className="text-white font-semibold text-base mb-1">
                  {title}
                </Text>
                <Text className="text-white/90 text-sm leading-5">
                  {message}
                </Text>
              </View>
            </View>
            <TouchableOpacity
              onPress={handleDismiss}
              className="ml-2 p-1"
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <X size={18} color="rgba(255, 255, 255, 0.8)" />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Animated.View>
  );
};

const NotificationSystem: React.FC = () => {
  const { state, hideNotification } = useApp();
  const { notifications } = state;

  if (notifications.length === 0) {
    return null;
  }

  return (
    <View
      style={{
        position: 'absolute',
        top: Platform.OS === 'ios' ? 50 : 30,
        left: 0,
        right: 0,
        zIndex: 9999,
      }}
      pointerEvents="box-none"
    >
      <SafeAreaView edges={['top']} style={{ flex: 1 }} pointerEvents="box-none">
        {notifications.map((notification) => (
          <NotificationItem
            key={notification.id}
            id={notification.id}
            type={notification.type}
            title={notification.title}
            message={notification.message}
            onDismiss={hideNotification}
          />
        ))}
      </SafeAreaView>
    </View>
  );
};

export default NotificationSystem;
