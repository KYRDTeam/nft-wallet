import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { uniqBy } from "lodash";
import { Contact } from "../config/types";
import type { RootState } from "../store";

interface ContactState {
  contacts: Contact[];
}

const initialState: ContactState = {
  contacts: [],
};

export const contactSlice = createSlice({
  name: "contacts",
  initialState,
  reducers: {
    getContacts: (state, action: PayloadAction<any[]>) => {
      state.contacts = [...action.payload];
    },
    addNewContact: (state, action: PayloadAction<any>) => {
      state.contacts = uniqBy([...state.contacts, action.payload], "id");
    },
    updateContact: (state, action: PayloadAction<any>) => {
      const contactUpdate = action.payload;
      const formatNewContacts = [...state.contacts].map((contact: any) => {
        if (contact.id === contactUpdate.id) {
          return { ...contactUpdate };
        }
        return contact;
      });
      state.contacts = formatNewContacts;
    },
    removeContact: (state, action: PayloadAction<any>) => {
      const idDel = action.payload;
      const newContacts = [...state.contacts].filter((contact: any) => contact.id !== idDel);
      state.contacts = newContacts;
    },
  },
});

export const { getContacts, addNewContact, updateContact, removeContact } = contactSlice.actions;

export const contactSelector = (state: RootState) => state.contacts;

export default contactSlice.reducer;
