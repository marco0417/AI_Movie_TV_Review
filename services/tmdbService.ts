
import { MediaType } from '../types';

const BASE_URL = 'https://api.themoviedb.org/3';

export async function fetchTrending(apiKey: string, type: MediaType) {
  const url = `${BASE_URL}/trending/${type}/day?api_key=${apiKey}`;
  const response = await fetch(url);
  const data = await response.json();
  return data.results;
}

export async function fetchDetails(apiKey: string, type: MediaType, id: number, language: string = 'en-US') {
  const url = `${BASE_URL}/${type}/${id}?api_key=${apiKey}&append_to_response=credits,images,external_ids&language=${language}`;
  const response = await fetch(url);
  return await response.json();
}

export async function fetchDirectorWorks(apiKey: string, directorId: number) {
  const url = `${BASE_URL}/person/${directorId}/combined_credits?api_key=${apiKey}`;
  const response = await fetch(url);
  return await response.json();
}

export function getImageUrl(path: string, size: string = 'original') {
  if (!path) return 'https://picsum.photos/400/600';
  return `https://image.tmdb.org/t/p/${size}${path}`;
}
