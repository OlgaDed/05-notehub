import axios from 'axios';
import type { Note, NoteTag } from '../types/note';

const API_BASE_URL = 'https://notehub-public.goit.study/api';
const TOKEN = import.meta.env.VITE_NOTEHUB_TOKEN;

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    ...(TOKEN ? { Authorization: `Bearer ${TOKEN}` } : {}),
  },
});

export interface FetchNotesResponse {
  notes: Note[];
  page: number;
  perPage: number;
  totalItems: number;
  totalPages: number;
}

export interface FetchNotesParams {
  page?: number;
  perPage?: number;
  search?: string;
}

export interface CreateNotePayload {
  title: string;
  content: string;
  tag: NoteTag;
}

export interface DeleteNoteResponse {
  id: string;
  message: string;
}

export const fetchNotes = async (
  params: FetchNotesParams = {}
): Promise<FetchNotesResponse> => {
  const { page = 1, perPage = 12, search = '' } = params;

  const response = await axiosInstance.get('/notes', {
    params: {
      page,
      perPage,
      ...(search && { search }),
    },
  });

  const raw: any = response.data;
  console.log('RAW /notes response:', raw);

  let notes: Note[] = [];

  if (Array.isArray(raw.notes)) {
    notes = raw.notes;
  } else if (Array.isArray(raw.data)) {
    notes = raw.data;
  } else if (raw.data?.items && Array.isArray(raw.data.items)) {
    notes = raw.data.items;
  } else if (Array.isArray(raw.items)) {
    notes = raw.items;
  } else {
    notes = [];
  }

  const meta = raw.meta ?? raw;

  return {
    notes,
    page: meta.page ?? page,
    perPage: meta.perPage ?? perPage,
    totalItems:
      meta.totalItems ??
      meta.total ??
      (Array.isArray(notes) ? notes.length : 0),
    totalPages: meta.totalPages ?? 1,
  };
};

export const createNote = async (
  noteData: CreateNotePayload
): Promise<Note> => {
  const { data } = await axiosInstance.post<Note>('/notes', noteData);
  return data;
};

export const deleteNote = async (id: string): Promise<DeleteNoteResponse> => {
  const { data } = await axiosInstance.delete<DeleteNoteResponse>(
    `/notes/${id}`
  );
  return data;
};
