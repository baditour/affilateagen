import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  ActivityIndicator,
  Animated,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Loader2 } from 'lucide-react-native';

interface LoadingScreenProps {
  message?: string;
  showLogo?: boolean;
  overlay?: boolean;
}

const LoadingScreen: React.FC<LoadingScreenProps> = ({
  message = 'Loading...',
  showLogo = true,
  overlay = false,
}) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Fade in animation
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 100,
        friction: 8,
        useNativeDriver: true,
      }),
    ]).start();

    // Continuous rotation for logo
    const rotateAnimation = Animated.loop(
      Animated.timing(rotateAnim, {
        toValue: 1,
        duration: 2000,
        useNativeDriver: true,
      })
    );
    rotateAnimation.start();

    return () => {
      rotateAnimation.stop();
    };
  }, []);

  const rotate = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  const containerStyle = overlay
    ? {
        position: 'absolute' as const,
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        zIndex: 9998,
      }
    : {
        flex: 1,
        backgroundColor: '#f9fafb',
      };

  return (
    <View style={containerStyle}>
      <SafeAreaView className="flex-1 justify-center items-center px-6">
        <Animated.View
          style={{
            opacity: fadeAnim,
            transform: [{ scale: scaleAnim }],
          }}
          className="items-center"
        >
          {showLogo && (
            <View className="mb-8">
              <Animated.View
                style={{
                  transform: [{ rotate }],
                }}
                className="bg-emerald-600 w-20 h-20 rounded-full items-center justify-center shadow-lg"
              >
                <Loader2 size={32} color="white" />
              </Animated.View>
            </View>
          )}

          <View className="items-center">
            <ActivityIndicator size="large" color="#059669" className="mb-4" />
            <Text className="text-gray-700 text-lg font-medium text-center">
              {message}
            </Text>
            <Text className="text-gray-500 text-sm text-center mt-2">
              Please wait a moment...
            </Text>
          </View>

          {/* Islamic accent */}
          <View className="items-center mt-8">
            <Text className="text-gray-400 text-sm">
              بسم الله الرحمن الرحيم
            </Text>
          </View>
        </Animated.View>
      </SafeAreaView>
    </View>
  );
};

// Skeleton loading components for better UX
export const SkeletonCard: React.FC<{ height?: number }> = ({ height = 100 }) => {
  const shimmerAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const shimmerAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(shimmerAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(shimmerAnim, {
          toValue: 0,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    );
    shimmerAnimation.start();

    return () => shimmerAnimation.stop();
  }, []);

  const opacity = shimmerAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.3, 0.7],
  });

  return (
    <Animated.View
      style={{
        opacity,
        height,
      }}
      className="bg-gray-200 rounded-lg mb-3"
    />
  );
};

export const SkeletonText: React.FC<{ width?: string; height?: number }> = ({
  width = '100%',
  height = 16,
}) => {
  const shimmerAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const shimmerAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(shimmerAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(shimmerAnim, {
          toValue: 0,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    );
    shimmerAnimation.start();

    return () => shimmerAnimation.stop();
  }, []);

  const opacity = shimmerAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.3, 0.7],
  });

  return (
    <Animated.View
      style={{
        opacity,
        width,
        height,
      }}
      className="bg-gray-200 rounded mb-2"
    />
  );
};

export const SkeletonList: React.FC<{ count?: number }> = ({ count = 5 }) => {
  return (
    <View className="px-4">
      {Array.from({ length: count }).map((_, index) => (
        <View key={index} className="bg-white rounded-lg p-4 mb-3 shadow-sm">
          <View className="flex-row items-start">
            <View className="w-12 h-12 bg-gray-200 rounded-full mr-3" />
            <View className="flex-1">
              <SkeletonText width="70%" height={18} />
              <SkeletonText width="100%" height={14} />
              <SkeletonText width="40%" height={12} />
            </View>
          </View>
        </View>
      ))}
    </View>
  );
};

export default LoadingScreen;
