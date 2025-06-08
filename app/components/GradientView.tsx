import React from 'react';
import { View, ViewStyle } from 'react-native';

interface GradientViewProps {
  colors?: string[];
  direction?: 'horizontal' | 'vertical' | 'diagonal';
  children?: React.ReactNode;
  style?: ViewStyle;
  className?: string;
}

// Simple gradient simulation using solid colors for React Native
// In a real app, you would use react-native-linear-gradient
const GradientView: React.FC<GradientViewProps> = ({
  colors = ['#10b981', '#059669'],
  direction = 'vertical',
  children,
  style,
  className,
}) => {
  // For now, we'll use the first color as the background
  // In production, you should install and use react-native-linear-gradient
  const backgroundColor = colors[0];

  return (
    <View
      style={[
        {
          backgroundColor,
        },
        style,
      ]}
      className={className}
    >
      {children}
    </View>
  );
};

export default GradientView;
