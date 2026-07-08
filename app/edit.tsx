import { useEffect, useState } from 'react';
import { View, StyleSheet, TextInput, Text, TouchableOpacity, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useLocalSearchParams } from 'expo-router';
import { Person, loadPersonsFromStorage, persons, savePersonsToStorage } from '@/constants/Person';
import { Icon } from '@/components/Icon';
import { TopBar } from '@/components/TopBar';

export default function Edit() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [person, setPerson] = useState<Person | null>(null);
  const [image, setImage] = useState('');
  const [phone, setPhone] = useState('');

  useEffect(() => {
    const hydrate = async () => {
      if (persons.length === 0) {
        await loadPersonsFromStorage();
      }

      const selectedPerson = persons.find(item => item.id === Number(id)) ?? null;
      setPerson(selectedPerson);
      setImage(selectedPerson?.src ?? '');
      setPhone(selectedPerson?.phone ?? '');
    };

    hydrate();
  }, [id]);

  const updatePerson = () => {
    if (!person) {
      router.back();
      return;
    }

    const index = persons.findIndex(p => p.id === person.id);
    if (index !== -1) {
      persons[index].src = image;
      persons[index].phone = phone;
      savePersonsToStorage();
    }
    router.back();
  };

  return (
    <SafeAreaView style={styles.screen} edges={['top', 'left', 'right']}>
      <TopBar title="Edit Contact" subtitle="Update photo and phone" back />
      <View style={styles.content}>
        <View style={styles.form}>
        {image ? <Image source={{ uri: image }} style={styles.image} /> : <View style={styles.imagePlaceholder} />}
        <Text style={styles.label}>Photo URL</Text>
        <TextInput
          style={styles.textInput}
          placeholder="Image URL"
          placeholderTextColor="#9a8f82"
          value={image}
          onChangeText={setImage}
        />
        <Text style={styles.label}>Phone number</Text>
        <TextInput
          style={styles.textInput}
          placeholder="5551234567"
          placeholderTextColor="#9a8f82"
          value={phone}
          keyboardType="phone-pad"
          onChangeText={setPhone}
        />
        <TouchableOpacity onPress={updatePerson} style={styles.primaryButton}>
          <Icon name="save" size={19} color="#fff7ef" />
          <Text style={styles.primaryButtonText}>Update contact</Text>
        </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#f3eadc',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  form: {
    gap: 14,
  },
  image: {
    width: '100%',
    aspectRatio: 1,
    borderRadius: 8,
    backgroundColor: '#ded2c0',
  },
  imagePlaceholder: {
    width: '100%',
    aspectRatio: 1,
    borderRadius: 8,
    backgroundColor: '#ded2c0',
  },
  label: {
    color: '#1d2a2e',
    fontSize: 13,
    fontWeight: '800',
    textTransform: 'uppercase',
  },
  textInput: {
    height: 54,
    borderColor: '#ded2c0',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 14,
    color: '#1d2a2e',
    backgroundColor: '#fffaf3',
    fontSize: 16,
  },
  primaryButton: {
    height: 52,
    borderRadius: 8,
    backgroundColor: '#287271',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  primaryButtonText: {
    color: '#fff7ef',
    fontSize: 16,
    fontWeight: '800',
  },
});
