import { useState } from 'react';
import { Image, View, StyleSheet, TextInput, Text, TouchableOpacity } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Person, persons, savePersonsToStorage } from "@/constants/Person";
import { router } from 'expo-router';
import { Icon } from '@/components/Icon';
import { TopBar } from '@/components/TopBar';

export default function Add() {
  const [image, setImage] = useState<any>(null);
  const [phone, setPhone] = useState<string>('');

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const removeImage = () => {
    setImage(null);
  };

  const savePerson = () => {
    if (image && phone) {
      const nextId = persons.reduce((maxId, person) => Math.max(maxId, person.id), 0) + 1;
      const person: Person = new Person(nextId, image, phone);
      persons.push(person);
      savePersonsToStorage();
      setImage(null);
      setPhone('');
      router.back();
    }
  };

  return (
    <SafeAreaView style={styles.screen} edges={['top', 'left', 'right']}>
      <TopBar title="Add Contact" subtitle="Create a quick-call tile" back />
      <View style={styles.content}>
        <View style={styles.form}>
          <TouchableOpacity onPress={pickImage} style={styles.photoPicker}>
            {image ? (
              <Image source={{ uri: image }} style={styles.image} />
            ) : (
              <View style={styles.emptyPhoto}>
                <Icon name="camera" size={40} color="#287271" />
                <Text style={styles.emptyText}>Choose Photo</Text>
              </View>
            )}
          </TouchableOpacity>
          {image && (
            <TouchableOpacity onPress={removeImage} style={styles.secondaryButton}>
              <Icon name="delete" size={18} color="#a23e48" />
              <Text style={styles.secondaryButtonText}>Remove photo</Text>
            </TouchableOpacity>
          )}
          <Text style={styles.label}>Phone number</Text>
          <TextInput
            style={styles.textInput}
            placeholder="5551234567"
            placeholderTextColor="#9a8f82"
            value={phone}
            keyboardType="phone-pad"
            onChangeText={setPhone}
          />
          <TouchableOpacity onPress={savePerson} style={[styles.primaryButton, (!image || !phone) && styles.disabledButton]} disabled={!image || !phone}>
            <Icon name="save" size={19} color="#fff7ef" />
            <Text style={styles.primaryButtonText}>Save contact</Text>
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
  photoPicker: {
    aspectRatio: 1,
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: '#fffaf3',
    borderColor: '#ded2c0',
    borderWidth: 1,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  emptyPhoto: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  emptyText: {
    color: '#287271',
    fontSize: 17,
    fontWeight: '800',
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
    fontSize: 18,
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
  disabledButton: {
    opacity: 0.45,
  },
  primaryButtonText: {
    color: '#fff7ef',
    fontSize: 16,
    fontWeight: '800',
  },
  secondaryButton: {
    height: 44,
    borderRadius: 8,
    backgroundColor: '#fffaf3',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    borderColor: '#ded2c0',
    borderWidth: 1,
  },
  secondaryButtonText: {
    color: '#a23e48',
    fontSize: 15,
    fontWeight: '800',
  },
});
