import { useEffect, useState } from 'react';
import { FlatList, Image, Linking, StyleSheet, Text, TouchableOpacity, useWindowDimensions, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Person, loadPersonsFromStorage, persons, savePersonsToStorage } from '@/constants/Person';
import { Icon } from '@/components/Icon';
import { TopBar } from '@/components/TopBar';

export default function HomeScreen() {
  const [directory, setDirectory] = useState<Person[]>([]);
  const [editingMode, setEditingMode] = useState(false);
  const [deletingMode, setDeletingMode] = useState(false);
  const { width } = useWindowDimensions();
  const numColumns = width >= 560 ? 3 : 2;

  useEffect(() => {
    loadPersonsFromStorage().then(() => setDirectory([...persons]));
  }, []);

  const makeCall = (phone: string) => {
    Linking.openURL(`tel:${phone}`);
  };

  const toggleEditingMode = () => {
    setEditingMode(prev => !prev);
    setDeletingMode(false);
  };

  const toggleDeletingMode = () => {
    setDeletingMode(prev => !prev);
    setEditingMode(false);
  };

  const deletePerson = (item: Person) => {
    const updatedPersons = persons.filter(person => person.id !== item.id);
    persons.length = 0;
    persons.push(...updatedPersons);
    setDirectory([...persons]);
    savePersonsToStorage();
  };

  const editPerson = (item: Person) => {
    router.push({ pathname: '/edit', params: { id: String(item.id) } });
  };

  const renderItem = ({ item }: { item: Person }) => (
    <View style={[styles.card, { width: `${100 / numColumns}%` }]}>
      <View style={styles.photoFrame}>
        <Image source={{ uri: item.src }} style={styles.photo} />
        <TouchableOpacity accessibilityLabel={`Call ${item.phone}`} style={styles.callButton} onPress={() => makeCall(item.phone)}>
          <Icon name="call" size={20} color="#fff7ef" />
        </TouchableOpacity>
      </View>
      <Text style={styles.phone}>{item.phone}</Text>
      <Text style={styles.cardMeta}>Tap photo to call</Text>
      {(editingMode || deletingMode) && (
        <View style={styles.cardActions}>
          {editingMode && (
            <TouchableOpacity accessibilityLabel="Edit contact" style={styles.miniButton} onPress={() => editPerson(item)}>
              <Icon name="edit" size={18} color="#1d2a2e" />
            </TouchableOpacity>
          )}
          {deletingMode && (
            <TouchableOpacity accessibilityLabel="Delete contact" style={[styles.miniButton, styles.deleteMiniButton]} onPress={() => deletePerson(item)}>
              <Icon name="delete" size={18} color="#fff7ef" />
            </TouchableOpacity>
          )}
        </View>
      )}
    </View>
  );

  return (
    <SafeAreaView style={styles.screen} edges={['top', 'left', 'right']}>
      <TopBar
        title="Family Line"
        subtitle={`${directory.length} quick-call contacts`}
        actions={[
          { icon: 'add', label: 'Add contact', onPress: () => router.push('/add') },
          { icon: 'edit', label: 'Edit contacts', onPress: toggleEditingMode, active: editingMode },
          { icon: 'delete', label: 'Delete contacts', onPress: toggleDeletingMode, active: deletingMode, tone: 'danger' },
        ]}
      />
      <FlatList
        data={directory}
        renderItem={renderItem}
        keyExtractor={item => item.id.toString()}
        numColumns={numColumns}
        key={numColumns}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#f3eadc',
  },
  list: {
    padding: 12,
    paddingBottom: 28,
  },
  card: {
    padding: 8,
  },
  photoFrame: {
    aspectRatio: 1,
    overflow: 'hidden',
    borderRadius: 8,
    backgroundColor: '#ded2c0',
    borderColor: '#fffaf3',
    borderWidth: 3,
    shadowColor: '#1d2a2e',
    shadowOpacity: 0.12,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 6 },
    elevation: 3,
  },
  photo: {
    width: '100%',
    height: '100%',
  },
  callButton: {
    position: 'absolute',
    right: 10,
    bottom: 10,
    width: 42,
    height: 42,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#287271',
  },
  phone: {
    color: '#1d2a2e',
    fontSize: 18,
    fontWeight: '800',
    marginTop: 10,
  },
  cardMeta: {
    color: '#687477',
    fontSize: 12,
    marginTop: 2,
  },
  cardActions: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 10,
  },
  miniButton: {
    width: 38,
    height: 38,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fffaf3',
    borderColor: '#ded2c0',
    borderWidth: 1,
  },
  deleteMiniButton: {
    backgroundColor: '#a23e48',
    borderColor: '#a23e48',
  },
});
