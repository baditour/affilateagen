import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import AgentDashboard from '../../app/components/AgentDashboard';

// Mock the context
jest.mock('../../app/context/AppContext', () => ({
  useApp: () => ({
    state: {
      user: {
        id: '1',
        name: 'Test Agent',
        email: 'test@example.com',
        role: 'agent',
      },
      leads: [],
      commissions: [],
      isLoading: false,
    },
    showNotification: jest.fn(),
  }),
}));

// Mock react-native-safe-area-context
jest.mock('react-native-safe-area-context', () => ({
  SafeAreaView: ({ children }: any) => children,
}));

// Mock lucide-react-native
jest.mock('lucide-react-native', () => ({
  TrendingUp: () => 'TrendingUp',
  Users: () => 'Users',
  DollarSign: () => 'DollarSign',
  Target: () => 'Target',
  Calendar: () => 'Calendar',
  Award: () => 'Award',
  ArrowUp: () => 'ArrowUp',
  ArrowDown: () => 'ArrowDown',
  Eye: () => 'Eye',
  MessageCircle: () => 'MessageCircle',
  Share2: () => 'Share2',
  Bell: () => 'Bell',
}));

describe('AgentDashboard', () => {
  const mockOnNavigate = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders correctly', () => {
    const { getByText } = render(
      <AgentDashboard onNavigate={mockOnNavigate} />
    );

    expect(getByText('Agent Dashboard')).toBeTruthy();
    expect(getByText('Good morning')).toBeTruthy();
  });

  it('displays performance metrics', () => {
    const { getByText } = render(
      <AgentDashboard onNavigate={mockOnNavigate} />
    );

    expect(getByText('Total Commission')).toBeTruthy();
    expect(getByText('Conversion Rate')).toBeTruthy();
    expect(getByText('Performance Overview')).toBeTruthy();
  });

  it('displays quick action buttons', () => {
    const { getByText } = render(
      <AgentDashboard onNavigate={mockOnNavigate} />
    );

    expect(getByText('Share Content')).toBeTruthy();
    expect(getByText('Manage Leads')).toBeTruthy();
    expect(getByText('Commission')).toBeTruthy();
    expect(getByText('Invite Agents')).toBeTruthy();
  });

  it('calls onNavigate when quick action buttons are pressed', () => {
    const { getByText } = render(
      <AgentDashboard onNavigate={mockOnNavigate} />
    );

    fireEvent.press(getByText('Share Content'));
    expect(mockOnNavigate).toHaveBeenCalledWith('promotional');

    fireEvent.press(getByText('Manage Leads'));
    expect(mockOnNavigate).toHaveBeenCalledWith('leads');

    fireEvent.press(getByText('Commission'));
    expect(mockOnNavigate).toHaveBeenCalledWith('commission');

    fireEvent.press(getByText('Invite Agents'));
    expect(mockOnNavigate).toHaveBeenCalledWith('invite');
  });

  it('displays recent activities', () => {
    const { getByText } = render(
      <AgentDashboard onNavigate={mockOnNavigate} />
    );

    expect(getByText('Recent Activities')).toBeTruthy();
    expect(getByText('Commission Earned')).toBeTruthy();
    expect(getByText('New Lead')).toBeTruthy();
  });

  it('displays achievement badge', () => {
    const { getByText } = render(
      <AgentDashboard onNavigate={mockOnNavigate} />
    );

    expect(getByText('Top Performer')).toBeTruthy();
    expect(getByText("You're in the top 10% of agents this month!")).toBeTruthy();
  });

  it('handles navigation to leads section', () => {
    const { getByText } = render(
      <AgentDashboard onNavigate={mockOnNavigate} />
    );

    const viewAllButton = getByText('View All');
    fireEvent.press(viewAllButton);
    
    expect(mockOnNavigate).toHaveBeenCalledWith('leads');
  });
});
