import { useEffect, useState } from 'react';
import axios from 'axios';

export default function Contacts() {
  const [contacts, setContacts] = useState([]);

  useEffect(() => {
    const fetchContacts = async () => {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5000/api/contacts', {
        headers: { Authorization: token }
      });
      setContacts(response.data);
    };

    fetchContacts();
  }, []);

  return (
    <div>
      <h1>Contact List</h1>
      <ul>
        {contacts.map(contact => (
          <li key={contact.id}>{contact.name} - {contact.email}</li>
        ))}
      </ul>
    </div>
  );
}
