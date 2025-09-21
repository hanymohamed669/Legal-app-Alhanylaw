
export enum UserRole {
  ADMIN = 'Admin', // App Owner
  PARTNER = 'Partner',
  SECRETARY = 'Secretary',
  CLIENT = 'Client'
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatarUrl: string;
  permissions?: 'read' | 'full'; // For Secretary
  linkedClientId?: string; // For Client role to link to a Client record
}

export interface Document {
  id: string;
  name:string;
  caseId: string;
  uploadDate: string;
  url: string;
  type: 'PDF' | 'Word' | 'Other';
}

export enum CaseType {
  CIVIL = 'مدني',
  CRIMINAL = 'جنائي',
  COMMERCIAL = 'تجاري',
  FAMILY = 'أحوال شخصية',
  ADMINISTRATIVE = 'إداري',
  OTHER = 'أخرى'
}

export enum CaseDegree {
  FIRST_DEGREE = 'درجة أولى',
  APPEAL = 'استئناف',
  CASSATION = 'نقض',
  OTHER = 'أخرى'
}

export interface Client {
  id: string;
  name: string;
  phoneNumber: string;
  documents: { name: string; url: string }[];
}

export interface CaseDocument {
  name: string;
  url: string;
}

export interface Session {
  id: string;
  caseId: string;
  caseNumber: string;
  caseYear: string;
  caseType: CaseType;
  caseDegree: CaseDegree;
  caseName?: string;
  courtName: string;
  courtDivision: string;
  dateTime: string;
  notes: string;
  courtLocationLink?: string;
  documents: CaseDocument[];
  plaintiffs: string[]; // Array of Client IDs
  defendants: string[]; // Array of Client IDs
}


export interface Task {
  id: string;
  title: string;
  description?: string;
  deadline: string;
  isDone: boolean;
  caseId: string;
}

export interface Case {
  id: string;
  caseNumber: string;
  courtName: string;
  clientName: string;
  clientId: string;
  details: string;
  documents: Document[];
  sessions: Session[];
  isArchived: boolean;
}

export type NotificationType = 'success' | 'error' | 'info';

export interface Notification {
  id: number;
  message: string;
  type: NotificationType;
}

export interface SessionNotification {
  id: string;
  message: string;
  session?: Session;
  task?: Task;
  timeUntil: string;
}
