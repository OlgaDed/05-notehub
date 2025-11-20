import axios, { type AxiosResponse } from 'axios';
import type { Note, NoteTag } from '../types/note';

const token = import.meta.env.VITE_NOTEHUB_TOKEN;

if (!token) {
  console.warn('VITE_NOTEHUB_TOKEN is missing. Check your .env file.');
}

export const apiClient = axios.create({
  baseURL: 'https://notehub-public.goit.study/api',
  headers: {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  },
});

export interface FetchNotesParams {
  page?: number;
  perPage?: number;
  search?: string;
}

interface FetchNotesResponseApiBase {
  page: number;
  perPage: number;
  totalItems: number;
  totalPages: number;
}

interface FetchNotesResponseApiWithData extends FetchNotesResponseApiBase {
  data: Note[];
}

interface FetchNotesResponseApiWithItems extends FetchNotesResponseApiBase {
  items: Note[];
}

export type FetchNotesResponseApi =
  | FetchNotesResponseApiWithData
  | FetchNotesResponseApiWithItems;

export interface FetchNotesResponse {
  notes: Note[];
  page: number;
  perPage: number;
  totalItems: number;
  totalPages: number;
}

export interface CreateNotePayload {
  title: string;
  content: string;
  tag: NoteTag;
}

export const fetchNotes = async (
  params: FetchNotesParams = {}
): Promise<FetchNotesResponse> => {
  const { page = 1, perPage = 12, search = '' } = params;

  const response: AxiosResponse<FetchNotesResponseApi> = await apiClient.get(
    '/notes',
    {
      params: {
        page,
        perPage,
        ...(search ? { search } : {}),
      },
    }
  );

  const apiData = response.data;

  const notes =
    'data' in apiData ? apiData.data : 'items' in apiData ? apiData.items : [];

  return {
    notes,
    page: apiData.page,
    perPage: apiData.perPage,
    totalItems: apiData.totalItems,
    totalPages: apiData.totalPages,
  };
};

export const createNote = async (payload: CreateNotePayload): Promise<Note> => {
  const response: AxiosResponse<Note> = await apiClient.post('/notes', payload);
  return response.data;
};

export const deleteNote = async (id: string): Promise<Note> => {
  const response: AxiosResponse<Note> = await apiClient.delete(`/notes/${id}`);
  return response.data;
};
