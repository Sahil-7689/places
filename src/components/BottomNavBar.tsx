import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { theme } from '../theme';
import { AppTab } from '../types';
import { Icon } from './Icon';

interface BottomNavBarProps {
  activeTab: AppTab;
  onTabChange: (tab: AppTab) => void;
}

interface TabItem {
  key: AppTab;
  label: string;
  icon: string;
}

const TABS: TabItem[] = [
  { key: 'explore', label: 'Explore', icon: 'explore' },
  { key: 'saved', label: 'Saved', icon: 'favorite' },
  { key: 'trips', label: 'Trips', icon: 'map' },
  { key: 'profile', label: 'Profile', icon: 'person' },
];

export const BottomNavBar: React.FC<BottomNavBarProps> = ({
  activeTab,
  onTabChange,
}) => {
  return (
    <View style={[styles.container, theme.shadows.elevation2]}>
      <View style={styles.navContent}>
        {TABS.map((tab) => {
          const isActive = activeTab === tab.key;
          return (
            <TouchableOpacity
              key={tab.key}
              activeOpacity={0.8}
              onPress={() => onTabChange(tab.key)}
              style={[
                styles.tabButton,
                isActive && styles.activeTabButton,
              ]}
            >
              <Icon
                name={tab.icon}
                size={22}
                color={
                  isActive
                    ? theme.colors.onSecondaryContainer
                    : theme.colors.onSurfaceVariant
                }
                filled={isActive}
              />
              <Text
                style={[
                  styles.tabLabel,
                  isActive ? styles.activeTabLabel : styles.inactiveTabLabel,
                ]}
              >
                {tab.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: theme.colors.surfaceContainer,
    borderTopLeftRadius: theme.borderRadius.xl,
    borderTopRightRadius: theme.borderRadius.xl,
    paddingTop: 8,
    paddingBottom: Platform.OS === 'ios' ? 24 : 12,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: theme.colors.outlineVariant,
  },
  navContent: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingHorizontal: 12,
  },
  tabButton: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 6,
    paddingHorizontal: 16,
    borderRadius: theme.borderRadius.full,
    minWidth: 72,
  },
  activeTabButton: {
    backgroundColor: theme.colors.secondaryContainer,
  },
  tabLabel: {
    ...theme.typography.labelSm,
    marginTop: 4,
  },
  activeTabLabel: {
    color: theme.colors.onSecondaryContainer,
    fontWeight: '700',
  },
  inactiveTabLabel: {
    color: theme.colors.onSurfaceVariant,
    fontWeight: '500',
  },
});
