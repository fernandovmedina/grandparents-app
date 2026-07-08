import AsyncStorage from '@react-native-async-storage/async-storage';

export class Person {
    public _id: number;
    public src: string;
    public _phone: string;

    constructor(id: number, src: string, phone: string) {
        this._id = id;
        this.src = src;
        this._phone = phone;
    }

    public get id(): number {
        return this._id;
    }

    public set id(value: number) {
        this._id = value;
    }

    public get phone(): string {
        return this._phone;
    }

    public set phone(value: string) {
        this._phone = value;
    }
}

export const persons: Person[] = [];

const demoPersons = [
    new Person(1, 'https://images.unsplash.com/photo-1544723795-3fb6469f5b39?auto=format&fit=crop&w=480&q=80', '5558675301'),
    new Person(2, 'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?auto=format&fit=crop&w=480&q=80', '5552047712'),
    new Person(3, 'https://images.unsplash.com/photo-1552058544-f2b08422138a?auto=format&fit=crop&w=480&q=80', '5553154400'),
    new Person(4, 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=480&q=80', '5556429810'),
    new Person(5, 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=480&q=80', '5557751934'),
    new Person(6, 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=480&q=80', '5559182604'),
];

const loadDemoPersons = () => {
    persons.length = 0;
    persons.push(...demoPersons.map(person => new Person(person.id, person.src, person.phone)));
};

export const savePersonsToStorage = async () => {
    try {
        const jsonValue = JSON.stringify(persons);
        await AsyncStorage.setItem('persons', jsonValue);
    } catch (e) {
        console.error('Error saving persons to AsyncStorage:', e);
    }
};

export const loadPersonsFromStorage = async () => {
    try {
        const jsonValue = await AsyncStorage.getItem('persons');
        if (jsonValue != null) {
            const loadedPersons = JSON.parse(jsonValue);
            persons.length = 0;
            loadedPersons.forEach((p: Person) => {
                persons.push(new Person(p._id, p.src, p._phone));
            });
        } else {
            loadDemoPersons();
        }
    } catch (e) {
        console.error('Error loading persons from AsyncStorage:', e);
        loadDemoPersons();
    }
};
