import React from 'react';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import { nanoid } from 'nanoid';
// import { ContactForm } from './ContatctForm/ContatctForm';
import { Filter } from './Filter/Filter';
import { ContactList } from './ContactList/ContactList';
import { ContactFormik } from './ContatctForm/ContactFormik';

export class App extends React.Component {
  state = {
    contacts: [],
    filter: '',
  };

  trackInputFilter = event => {
    const { currentTarget: input } = event;
    this.setState({ [input.name]: input.value });
  };

  filterListName = () => {
    const normalizeName = this.state.filter.toLocaleLowerCase();
    return this.state.contacts.filter(el =>
      el.name.toLowerCase().includes(normalizeName)
    );
  };

  addContact = ({ name, number }) => {
    if (
      this.state.contacts.some(
        el => el.name.toLocaleLowerCase() === name.toLocaleLowerCase()
      )
    ) {
      return Notify.failure(`${name} is already in contacts`);
    }
    const contact = {
      id: nanoid(),
      name,
      number,
    };
    this.setState(({ contacts }) => ({
      contacts: [contact, ...contacts],
    }));
  };

  handlDelete = event => {
    const { id } = event.target;
    this.setState(({ contacts }) => ({
      contacts: contacts.filter((el, i) => i !== Number(id)),
    }));
  };

  componentDidMount() {
    const localStorageContacts = JSON.parse(localStorage.getItem('contacts'));
    if (localStorageContacts) {
      this.setState({ contacts: localStorageContacts });
    }
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.state.contacts !== prevState.contacts) {
      localStorage.setItem('contacts', JSON.stringify(this.state.contacts));
    }
  }

  render() {
    const { trackInputFilter, filterListName, addContact, handlDelete } = this;

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
  }
}
