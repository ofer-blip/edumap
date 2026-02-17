
export enum SchoolType {
  ANTHRO = 'anthro',
  DEMO = 'demo',
  MONTESSORI = 'montessori',
  MIXED = 'mixed',
  BILINGUAL = 'bilingual',
  FOREST = 'forest',
  BIGPIC = 'bigpic',
  INCLUSIVE = 'inclusive'
}

export interface School {
  id: string;
  name: string;
  type: SchoolType;
  city: string;
  region: string;
  lat: number;
  lng: number;
  grades: string;
  estYear?: number;
  origStream?: string;
  convYear?: number;
  history?: string;
  phone?: string;
  email?: string;
  website?: string;
  address?: string;
}

export interface ChatMessage {
  role: 'user' | 'model';
  content: string;
}

export enum GradeCategory {
  ELEMENTARY = 'elementary',
  HIGH = 'high',
  MULTI = 'multi',
  OTHER = 'other'
}
