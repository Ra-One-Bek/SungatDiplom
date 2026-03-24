import type { Club } from '../types/club';
import { apiGet } from './api';

export async function getClub(): Promise<Club> {
  return apiGet<Club>('/club');
}