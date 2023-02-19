import { useState } from 'react';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import { nanoid } from 'nanoid';
import { Filter } from './Filter/Filter';
import { ContactList } from './ContactList/ContactList';
import { ContactFormik } from './ContatctForm/ContactFormik';
import { useLocalStorage } from './hooks/hooks';

export const App = () => {
  const [contacts, setContacts] = useLocalStorage('myContacts');
  const [filter, setFilter] = useState('');

  const trackInputFilter = event => {
    const { currentTarget: input } = event;
    setFilter(input.value);
  };

  const filterListName = () => {
    const normalizeName = filter.toLocaleLowerCase();
    return contacts.filter(el => el.name.toLowerCase().includes(normalizeName));
  };

  const addContact = ({ name, number }) => {
    const isContact = contacts.some(
      el => el.name.toLocaleLowerCase() === name.toLocaleLowerCase()
    );
    if (isContact) {
      return Notify.failure(`${name} is already in contacts`);
    }
    const contact = {
      id: nanoid(),
      name,
      number,
    };
    setContacts(prevState => [contact, ...prevState]);
  };

  const handlDelete = event => {
    const { id } = event.target;
    setContacts(contacts.filter((el, i) => i !== Number(id)));
  };

  return (
    <div
      style={{
        // height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        fontSize: 40,
        color: '#010101',
      }}
    >
      <h1 style={{ fontSize: 36 }}>Phonebook</h1>
      <ContactFormik onSubmit={addContact} />

      <h2 style={{ fontSize: 36, marginTop: 50, marginBottom: 20 }}>
        Contacts
      </h2>
      <Filter filterName={trackInputFilter} />

      <ContactList filterList={filterListName} handlDelete={handlDelete} />
    </div>
  );
};
