export type CampusZoneId =
  // Central Landmark
  | 'shivaji_statue'
  // Arrival
  | 'entrance'
  | 'reception'
  // Early Years Sector
  | 'bldg_nursery'
  | 'bldg_jkg'
  | 'bldg_skg'
  // Primary Sector (Grades 1 to 5)
  | 'bldg_g1'
  | 'bldg_g2'
  | 'bldg_g3'
  | 'bldg_g4'
  | 'bldg_g5'
  // Middle & Secondary Sector (Grades 6 to 10)
  | 'bldg_g6'
  | 'bldg_g7'
  | 'bldg_g8'
  | 'bldg_g9'
  | 'bldg_g10'
  // Senior Secondary Sector (Grades 11 & 12)
  | 'bldg_g11'
  | 'bldg_g12'
  // Common Academic Facilities
  | 'library'
  | 'science_complex'
  | 'tech_hub'
  | 'arts_center'
  | 'auditorium'
  // Sports & Student Life
  | 'sports_complex'
  | 'cafeteria_commons'
  | 'administration_health';

export type SectorCategory =
  | 'landmark'
  | 'early_years'
  | 'primary'
  | 'secondary'
  | 'senior_secondary'
  | 'facility'
  | 'social';

export interface CampusFloor {
  floorNumber: number;
  name: string;
  rooms: string[];
}

export interface CampusZone {
  id: CampusZoneId;
  name: string;
  category: SectorCategory;
  subtitle: string;
  description: string;
  gradeLevel: string;
  floorsCount: number;
  floorsDetail?: CampusFloor[];
  capacity: string;
  activities: string[];
  features: string[];
  position: [number, number, number];
  color: string;
  accentColor?: string;
  iconName: string;
  isInterior?: boolean;
}

export interface Classmate {
  id: string;
  name: string;
  avatarColor: string;
  hairColor: string;
  currentZone: CampusZoneId;
  position: [number, number, number];
  activity: string;
  targetPosition?: [number, number, number];
  isRaisingHand?: boolean;
}

export type LessonType = 'counting' | 'animals_safari' | 'shapes_colors';

export interface LessonStep {
  stepIndex: number;
  teacherSpeech: string;
  boardTitle: string;
  boardContent: string;
  boardItems?: { label: string; icon: string; count?: number }[];
  arObject?: 'none' | 'elephant' | 'counting_orbs' | 'star_cluster' | 'lion';
  interactionPrompt?: string;
  interactiveChoices?: string[];
  correctChoiceIndex?: number;
  rewardStars?: number;
}

export interface NurseryLesson {
  id: LessonType;
  title: string;
  subject: string;
  theme: string;
  durationMinutes: number;
  steps: LessonStep[];
}

export interface StudentProfile {
  name: string;
  standard: string;
  digiStars: number;
  badges: { id: string; name: string; icon: string; description: string; unlockedAt: string }[];
  currentZone: CampusZoneId;
}

export type SchoolPeriodId = 'morning_arrival' | 'period_1' | 'recess' | 'period_2';

export type TeacherState = 'in_lounge' | 'entering' | 'teaching' | 'dismissed';

export interface SchoolPeriod {
  id: SchoolPeriodId;
  name: string;
  timeRange: string;
  status: 'free_campus' | 'class_in_session';
  subject?: string;
  teacherName?: string;
  classroomZone: CampusZoneId;
  description: string;
}
