import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { router } from 'expo-router';
import { Icon } from '@/components/Icon';

type TopBarAction = {
  icon: 'add' | 'delete' | 'edit' | 'save';
  label: string;
  onPress: () => void;
  active?: boolean;
  tone?: 'danger' | 'primary';
};

type TopBarProps = {
  title: string;
  subtitle?: string;
  back?: boolean;
  actions?: TopBarAction[];
};

export function TopBar({ title, subtitle, back = false, actions = [] }: TopBarProps) {
  return (
    <View style={styles.bar}>
      <View style={styles.leading}>
        {back ? (
          <TouchableOpacity accessibilityLabel="Go back" style={styles.navButton} onPress={() => router.back()}>
            <Icon name="back" size={24} color="#1d2a2e" />
          </TouchableOpacity>
        ) : (
          <View style={styles.brandMark}>
            <Icon name="home" size={21} color="#f7efe3" />
          </View>
        )}
        <View>
          <Text style={styles.title}>{title}</Text>
          {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
        </View>
      </View>
      {actions.length > 0 && (
        <View style={styles.actions}>
          {actions.map(action => (
            <TouchableOpacity
              key={action.label}
              accessibilityLabel={action.label}
              style={[
                styles.actionButton,
                action.active && styles.actionButtonActive,
                action.tone === 'danger' && action.active && styles.actionButtonDanger,
              ]}
              onPress={action.onPress}>
              <Icon
                name={action.icon}
                size={21}
                color={action.tone === 'danger' && action.active ? '#fff7ef' : action.active ? '#fff7ef' : '#1d2a2e'}
              />
            </TouchableOpacity>
          ))}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    paddingHorizontal: 20,
    paddingBottom: 18,
    paddingTop: 8,
    backgroundColor: '#f7efe3',
    borderBottomColor: '#ded2c0',
    borderBottomWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 16,
  },
  leading: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  brandMark: {
    width: 42,
    height: 42,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#1d2a2e',
  },
  navButton: {
    width: 42,
    height: 42,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#eadfce',
  },
  title: {
    color: '#1d2a2e',
    fontSize: 22,
    fontWeight: '800',
  },
  subtitle: {
    color: '#687477',
    fontSize: 13,
    marginTop: 2,
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  actionButton: {
    width: 42,
    height: 42,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fffaf3',
    borderColor: '#ded2c0',
    borderWidth: 1,
  },
  actionButtonActive: {
    backgroundColor: '#287271',
    borderColor: '#287271',
  },
  actionButtonDanger: {
    backgroundColor: '#a23e48',
    borderColor: '#a23e48',
  },
});
