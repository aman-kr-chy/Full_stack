export interface Profile {
  id: string;
  firstName: string;
  lastName: string;
  gender: 'Male' | 'Female';
  dob: string; // YYYY-MM-DD
  age: number;
  country: string;
  city: string;
  height: string; // e.g. "5'6\"" or "6'1\""
  heightCm: number; // for mathematical calculations
  email: string;
  phone: string;
  college: string;
  degree: string;
  income: number; // In LPA (Lakhs Per Annum)
  company: string;
  designation: string;
  maritalStatus: 'Never Married' | 'Divorced' | 'Widowed' | 'Awaiting Divorce';
  languages: string[];
  siblings: string;
  caste: string;
  religion: 'Hindu' | 'Muslim' | 'Christian' | 'Sikh' | 'Jain' | 'Parsi' | 'Buddhist';
  wantKids: 'Yes' | 'No' | 'Maybe';
  openToRelocate: 'Yes' | 'No' | 'Maybe';
  openToPets: 'Yes' | 'No' | 'Maybe';
  
  // Custom Indian Matchmaking Fields
  manglik: 'Yes' | 'No' | 'Unknown';
  diet: 'Veg' | 'Non-Veg' | 'Jain' | 'Eggetarian';
  horoscopeRequired: boolean;
  motherTongue: string;
  familyValues: 'Liberal' | 'Moderate' | 'Traditional';
  drinking: 'Never' | 'Socially' | 'Regularly';
  smoking: 'Never' | 'Socially' | 'Regularly';
  
  avatarSeed: string; // Used to generate colored profile icons
  bio: string;
}

export interface ClientProfile extends Profile {
  journeyStage: 'Onboarding' | 'Profile Verification' | 'Searching Matches' | 'Intro Sent' | 'First Date' | 'Success';
  notes: string; // Matchmaker notes
}

export interface Proposal {
  id: string;
  clientId: string;
  matchId: string;
  sentAt: string;
  status: 'Sent' | 'Accepted' | 'Rejected';
  introText: string;
}

export interface CompatibilityScore {
  score: number; // 0 to 100
  level: 'Exceptional' | 'Strong' | 'Moderate' | 'Low';
  breakdown: {
    age: number;
    height: number;
    income: number;
    location: number;
    diet: number;
    religionCaste: number;
    kidsPets: number;
    valuesHabits: number;
    careerEdu: number;
  };
  highlights: string[];
  conflicts: string[];
}
