import axios from 'axios';
import type { AxiosResponse } from 'axios';
import type { Note, NoteTag } from '../types/note';

const API_BASE_URL = 'https://notehub-public.goit.study/api';
const TOKEN = import.meta.env.VITE_NOTEHUB_TOKEN;

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    Authorization: `Bearer ${TOKEN}`,
  },
});

// Інтерфейси для відповідей API
export interface FetchNotesResponse {
  data: Note[];
  total: number;
  page: number;
  perPage: number;
  totalPages: number;
}

export interface CreateNoteData {
  title: string;
  content: string;
  tag: NoteTag;
}

export interface DeleteNoteResponse {
  id: string;
  message: string;
}

export interface FetchNotesParams {
  page?: number;
  perPage?: number;
  search?: string;
}

export const fetchNotes = async (
  params: FetchNotesParams = {}
): Promise<AxiosResponse<FetchNotesResponse>> => {
  const { page = 1, perPage = 12, search = '' } = params;

  return axiosInstance.get<FetchNotesResponse>('/notes', {
    params: {
      page,
      perPage,
      ...(search && { search }),
    },
  });
};

export const createNote = async (
  noteData: CreateNoteData
): Promise<AxiosResponse<Note>> => {
  return axiosInstance.post<Note>('/notes', noteData);
};

export const deleteNote = async (
  id: string
): Promise<AxiosResponse<DeleteNoteResponse>> => {
  return axiosInstance.delete<DeleteNoteResponse>(`/notes/${id}`);
};
