import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Linking,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  scrollView: {
    flex: 1,
  },
  header: {
    backgroundColor: '#059669',
    paddingHorizontal: 24,
    paddingVertical: 40,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  headerTitle: {
    color: 'white',
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8,
  },
  headerSubtitle: {
    color: '#a7f3d0',
    fontSize: 16,
    textAlign: 'center',
  },
  statsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 24,
    marginTop: -24,
    marginBottom: 32,
  },
  statCard: {
    flex: 1,
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    marginHorizontal: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 14,
    color: '#6b7280',
  },
  section: {
    paddingHorizontal: 24,
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 16,
  },
  actionCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  actionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 8,
  },
  actionDescription: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 16,
  },
  button: {
    backgroundColor: '#059669',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 24,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  inviteSection: {
    backgroundColor: '#1e40af',
    borderRadius: 16,
    padding: 24,
    marginHorizontal: 24,
    marginBottom: 32,
  },
  inviteTitle: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  inviteSubtitle: {
    color: '#bfdbfe',
    fontSize: 14,
    marginBottom: 16,
  },
  inviteButton: {
    backgroundColor: 'white',
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 24,
    alignItems: 'center',
  },
  inviteButtonText: {
    color: '#1e40af',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default function SimpleHomeScreen() {
  const [activeSection, setActiveSection] = useState('home');

  const handleWhatsAppInvite = () => {
    const message = "Join me as an Umrah travel agent and earn great commissions! 🕋✈️";
    const url = `whatsapp://send?text=${encodeURIComponent(message)}`;
    Linking.openURL(url).catch(() => {
      Linking.openURL(`https://wa.me/?text=${encodeURIComponent(message)}`);
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>🕋 Umrah Agent Hub</Text>
          <Text style={styles.headerSubtitle}>
            Welcome back! Ready to grow your network?
          </Text>
        </View>

        {/* Stats Cards */}
        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>$2,450</Text>
            <Text style={styles.statLabel}>Total Commission</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>47</Text>
            <Text style={styles.statLabel}>Active Leads</Text>
          </View>
        </View>

        {/* Quick Actions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          
          <View style={styles.actionCard}>
            <Text style={styles.actionTitle}>📢 Promotional Tools</Text>
            <Text style={styles.actionDescription}>
              Access marketing materials and share content with potential clients
            </Text>
            <TouchableOpacity style={styles.button}>
              <Text style={styles.buttonText}>Open Tools</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.actionCard}>
            <Text style={styles.actionTitle}>📊 Lead Tracking</Text>
            <Text style={styles.actionDescription}>
              Monitor your referral pipeline and conversion rates
            </Text>
            <TouchableOpacity style={styles.button}>
              <Text style={styles.buttonText}>View Leads</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.actionCard}>
            <Text style={styles.actionTitle}>💰 Commission Reports</Text>
            <Text style={styles.actionDescription}>
              View your earnings, payments, and financial summaries
            </Text>
            <TouchableOpacity style={styles.button}>
              <Text style={styles.buttonText}>View Reports</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* WhatsApp Invite */}
        <View style={styles.inviteSection}>
          <Text style={styles.inviteTitle}>📱 Invite & Earn More</Text>
          <Text style={styles.inviteSubtitle}>
            Share the opportunity with fellow agents and earn referral bonuses
          </Text>
          <TouchableOpacity style={styles.inviteButton} onPress={handleWhatsAppInvite}>
            <Text style={styles.inviteButtonText}>Invite via WhatsApp</Text>
          </TouchableOpacity>
        </View>

        {/* Bottom Spacing */}
        <View style={{ height: 32 }} />
      </ScrollView>
    </SafeAreaView>
  );
}
