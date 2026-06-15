export enum ModuleStatus {
  NOT_STARTED = "not_started",
  IN_PROGRESS = "in_progress",
  COMPLETED = "completed"
}

export interface LearningModule {
  id: string;
  name: string;
  order: number;
}

export interface Subject {
  id: string;
  name: string;
  weight: string; // e.g. "8-12%"
  color: string;  // Tailwind color class
  modules: LearningModule[];
}

export interface UserProfile {
  email: string;
  createdAt: string;
  targetExamDate: string;
  studyStartDate: string;
  dailyTargetHours: number;
}

export interface ModuleProgress {
  status: ModuleStatus;
  studyTimeMinutes: number; // study time logged explicitly
  quizScore: number | null;  // percentage (0-100) or null if not taken
  notes: string;
  lastStudiedAt: string | null;
  revisionCycle: number; // 0, 1, 2, 3 (for spaced repetition updates)
}

export interface ActivityLog {
  id: string;
  moduleId: string;
  subjectId: string;
  moduleName: string;
  subjectName: string;
  type: "study" | "quiz" | "revision";
  durationMinutes: number;
  score?: number;
  timestamp: string;
}

export interface Flashcard {
  id: string;
  moduleId: string;
  front: string;
  back: string;
  box: number; // SuperMemo-like box index
  nextReview: string;
}

export interface AppNotification {
  id: string;
  type: "reminder" | "achievement" | "completed";
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  moduleId?: string;
}
