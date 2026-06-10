import type { Profile } from '../types';

// Seeded random helper to ensure deterministic results across app sessions
class SeededRandom {
  private seed: number;
  constructor(seed: number) {
    this.seed = seed;
  }
  next(): number {
    const x = Math.sin(this.seed++) * 10000;
    return x - Math.floor(x);
  }
  nextRange(min: number, max: number): number {
    return Math.floor(this.next() * (max - min + 1)) + min;
  }
  pick<T>(arr: T[]): T {
    const idx = Math.floor(this.next() * arr.length);
    return arr[idx];
  }
  pickMany<T>(arr: T[], count: number): T[] {
    const shuffled = [...arr].sort(() => this.next() - 0.5);
    return shuffled.slice(0, count);
  }
}

const FIRST_NAMES_MALE = [
  'Aarav', 'Kabir', 'Rohan', 'Devansh', 'Ishaan', 'Vivaan', 'Arjun', 'Aditya', 
  'Vihaan', 'Reyansh', 'Sai', 'Krishna', 'Atharva', 'Shaurya', 'Aaryan', 'Rudra', 
  'Veer', 'Dhruv', 'Siddharth', 'Kushal', 'Gaurav', 'Rohit', 'Amit', 'Vikas', 
  'Sameer', 'Alok', 'Pranav', 'Nikhil', 'Kunal', 'Manish', 'Sanjay', 'Vijay', 
  'Ramesh', 'Suresh', 'Dinesh', 'Anil', 'Sunil', 'Harish', 'Rajesh', 'Rakesh', 
  'Vikram', 'Yash', 'Akshay', 'Varun', 'Karan', 'Rahul', 'Abhishek', 'Vivek', 
  'Pratyush', 'Armaan', 'Rishi', 'Karthik', 'Sujit', 'Hardik', 'Madhav', 'Gautam'
];

const FIRST_NAMES_FEMALE = [
  'Ananya', 'Meera', 'Priya', 'Riya', 'Diya', 'Sneha', 'Aaradhya', 'Saanvi', 
  'Kiara', 'Myra', 'Anika', 'Ira', 'Amyra', 'Zara', 'Navya', 'Aanya', 
  'Aadhya', 'Ahana', 'Shruti', 'Pooja', 'Neha', 'Aarti', 'Swati', 'Kavita', 
  'Jyoti', 'Deepa', 'Rekha', 'Anita', 'Sunita', 'Divya', 'Shweta', 'Priyanka', 
  'Deepika', 'Alia', 'Katrina', 'Kareena', 'Shraddha', 'Kriti', 'Sonam', 
  'Anushka', 'Aishwarya', 'Sushmita', 'Raveena', 'Madhuri', 'Kajol', 'Karisma', 
  'Shilpa', 'Nandini', 'Prisha', 'Tanvi', 'Kavya', 'Aditi', 'Rithika', 'Gayatri'
];

const SURNAMES = [
  'Sharma', 'Verma', 'Mehta', 'Patel', 'Shah', 'Sen', 'Nair', 'Iyer', 'Iyengar', 
  'Deshmukh', 'Patil', 'Kulkarni', 'Joshi', 'Bhat', 'Rao', 'Reddy', 'Choudhury', 
  'Banerjee', 'Chatterjee', 'Mukherjee', 'Das', 'Gupta', 'Aggarwal', 'Kapoor', 
  'Malhotra', 'Khanna', 'Sethi', 'Gill', 'Singh', 'Prasad', 'Mishra', 'Pandey', 
  'Trivedi', 'Vyas', 'Naik', 'Hegde', 'Shetty', 'Menon', 'Pillai', 'Saxena', 'Dubey'
];

const CITIES = [
  { name: 'Mumbai', state: 'Maharashtra' },
  { name: 'Delhi', state: 'Delhi' },
  { name: 'Bangalore', state: 'Karnataka' },
  { name: 'Pune', state: 'Maharashtra' },
  { name: 'Ahmedabad', state: 'Gujarat' },
  { name: 'Chennai', state: 'Tamil Nadu' },
  { name: 'Hyderabad', state: 'Telangana' },
  { name: 'Kolkata', state: 'West Bengal' },
  { name: 'Jaipur', state: 'Rajasthan' },
  { name: 'Gurgaon', state: 'Haryana' },
  { name: 'Noida', state: 'Uttar Pradesh' }
];

const COLLEGES = [
  'IIT Bombay', 'IIT Delhi', 'BITS Pilani', 'IIM Ahmedabad', 'IIM Bangalore', 
  'Delhi University', 'SRCC', 'St. Stephen\'s', 'St. Xavier\'s College', 
  'NMIMS Mumbai', 'Symbiosis Pune', 'Manipal Institute of Technology', 
  'Anna University', 'RV College of Engineering', 'COEP Pune', 'HR College Mumbai'
];

const DEGREES = [
  'B.Tech in Computer Science', 'B.Tech in Electronics', 'M.Tech in Software Engineering', 
  'MBA in Marketing', 'MBA in Finance', 'MBA in HR', 'B.Com Honors', 'BBA', 
  'B.Des in Product Design', 'MBBS', 'MD in Pediatrics', 'MCA', 'LLB (Law)'
];

const COMPANIES = [
  'Google', 'Microsoft', 'Amazon', 'McKinsey & Co', 'Boston Consulting Group', 
  'Deloitte', 'PwC', 'Tata Consultancy Services', 'Infosys', 'Wipro', 'HDFC Bank', 
  'ICICI Bank', 'Flipkart', 'Swiggy', 'Zomato', 'Reliance Industries', 'Uber', 
  'Ola', 'Razorpay', 'Paytm', 'PhonePe', 'Self-Employed / Freelancer'
];

const DESIGNATIONS = [
  'Software Engineer', 'Senior Software Engineer', 'Tech Lead', 'Product Manager', 
  'Senior Product Manager', 'Management Consultant', 'Investment Analyst', 
  'Associate VP', 'Marketing Manager', 'UX Designer', 'Product Designer', 
  'Data Scientist', 'HR Specialist', 'Legal Advisor', 'Resident Doctor', 
  'Financial Controller', 'Creative Director', 'Operations Head', 'Business Analyst'
];

const RELIGIONS = [
  { religion: 'Hindu', castes: ['Brahmin', 'Khatri', 'Maratha', 'Patel', 'Kayastha', 'Iyer', 'Iyengar', 'Rajput', 'Agarwal', 'Bania'] },
  { religion: 'Jain', castes: ['Shah', 'Oswal', 'Digambar', 'Shwetambar'] },
  { religion: 'Sikh', castes: ['Jat Sikh', 'Khatri Sikh', 'Ramgarhia'] },
  { religion: 'Muslim', castes: ['Sunni', 'Shia', 'Pathan'] },
  { religion: 'Christian', castes: ['Catholic', 'Protestant', 'Syrian Christian'] },
  { religion: 'Parsi', castes: ['Zoroastrian'] },
  { religion: 'Buddhist', castes: ['Mahayana', 'Theravada'] }
] as const;

const LANGUAGES = ['English', 'Hindi', 'Gujarati', 'Marathi', 'Punjabi', 'Bengali', 'Tamil', 'Telugu', 'Kannada', 'Malayalam'];

const SIBLINGS_OPTIONS = [
  'None (Only child)', '1 elder brother', '1 younger brother', '1 elder sister', 
  '1 younger sister', '2 elder sisters', '1 brother & 1 sister', '2 younger brothers'
];

const BIOS_MALE = [
  'A down-to-earth person who loves road trips, listening to podcasts, and working out. Seeking an independent, warm partner.',
  'Work hard, play hard. Passionate about cooking, indie music, and hiking. Looking for someone with a quick wit and career goals.',
  'Software engineer by day, amateur chef by night. Love reading, board games, and movie nights. Let\'s build something beautiful together.',
  'Managing family interests and seeking a partner who can strike a good work-life balance. Family values are very important to me.',
  'An active marathoner and finance professional. Love weekend getaways and quiet evenings with books. Looking for a supportive life partner.',
  'Love classical music, photography, and volunteering. Value simple living and high thinking. Looking for a partner who shares this mindset.'
];

const BIOS_FEMALE = [
  'Independent and creative. Love designing, baking, and playing with dogs. Seeking a partner who is secure, progressive, and supportive.',
  'Academic with a passion for traveling, old movies, and filter coffee. Seeking an educated, well-spoken partner with moderate/liberal views.',
  'Always up for a trek or a new restaurant. Love reading non-fiction and writing code. Looking for someone who is communicative and fun-loving.',
  'Balanced individual who enjoys family gatherings as much as professional challenges. Love painting and gardening. Looking for a kind soul.',
  'Consultant who loves salsa dancing, trying new cuisines, and long walks. Seeks a secure, modern partner with whom I can share my travels.',
  'Simple and family-oriented. Love playing music, cooking south Indian delicacies, and studying. Seeking a partner with traditional values.'
];

// Instantiating seeded random with fixed seed (e.g. 2026) for deterministic profile pool
const rng = new SeededRandom(2026);

export function generateDummyPool(): Profile[] {
  const pool: Profile[] = [];

  for (let i = 1; i <= 200; i++) {
    const gender = i <= 100 ? 'Male' : 'Female';
    const firstName = gender === 'Male' ? rng.pick(FIRST_NAMES_MALE) : rng.pick(FIRST_NAMES_FEMALE);
    const lastName = rng.pick(SURNAMES);
    
    // Age distribution: 23 to 38
    const age = rng.nextRange(23, 38);
    const birthYear = 2026 - age;
    const birthMonth = rng.nextRange(1, 12).toString().padStart(2, '0');
    const birthDay = rng.nextRange(1, 28).toString().padStart(2, '0');
    const dob = `${birthYear}-${birthMonth}-${birthDay}`;

    const cityObj = rng.pick(CITIES);
    const heightFeet = rng.nextRange(5, 6);
    const heightInches = rng.nextRange(0, 11);
    const heightCm = Math.round((heightFeet * 12 + heightInches) * 2.54);
    const height = `${heightFeet}'${heightInches}"`;

    const college = rng.pick(COLLEGES);
    const degree = rng.pick(DEGREES);
    const income = rng.nextRange(8, 60); // In LPA
    const company = rng.pick(COMPANIES);
    const designation = rng.pick(DESIGNATIONS);

    // Marital Status weight (Never Married is dominant)
    const maritalChance = rng.next();
    const maritalStatus = maritalChance < 0.85 ? 'Never Married' : maritalChance < 0.95 ? 'Divorced' : 'Widowed';

    const religionObj: any = rng.pick(RELIGIONS as any);
    const religion = religionObj.religion as Profile['religion'];
    const caste = rng.pick(religionObj.castes as string[]);

    // Dietary preferences weights
    const dietChance = rng.next();
    const diet = dietChance < 0.5 ? 'Veg' : dietChance < 0.85 ? 'Non-Veg' : dietChance < 0.95 ? 'Eggetarian' : 'Jain';

    const wantKids = rng.pick(['Yes', 'No', 'Maybe']);
    const openToRelocate = rng.pick(['Yes', 'No', 'Maybe']);
    const openToPets = rng.pick(['Yes', 'No', 'Maybe']);

    const manglik = rng.pick(['Yes', 'No', 'Unknown']);
    const horoscopeRequired = rng.next() > 0.6; // 40% require horoscope matching
    
    const motherTongue = rng.pick(LANGUAGES.filter(lang => lang !== 'English'));
    const familyValues = rng.pick(['Liberal', 'Moderate', 'Traditional']);
    const drinking = rng.pick(['Never', 'Socially', 'Regularly']);
    const smoking = rng.pick(['Never', 'Socially', 'Regularly']);
    
    const knownLangs = Array.from(new Set(['English', motherTongue, rng.pick(LANGUAGES)]));
    const siblings = rng.pick(SIBLINGS_OPTIONS);

    const bio = gender === 'Male' ? rng.pick(BIOS_MALE) : rng.pick(BIOS_FEMALE);
    const avatarSeed = `${firstName.toLowerCase()}-${lastName.toLowerCase()}-${i}`;

    pool.push({
      id: `m${i}`,
      firstName,
      lastName,
      gender,
      dob,
      age,
      country: 'India',
      city: cityObj.name,
      height,
      heightCm,
      email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}@gmail.com`,
      phone: `+91 ${rng.nextRange(70000, 99999)} ${rng.nextRange(10000, 99999)}`,
      college,
      degree,
      income,
      company,
      designation,
      maritalStatus,
      languages: knownLangs,
      siblings,
      caste,
      religion,
      wantKids: wantKids as 'Yes' | 'No' | 'Maybe',
      openToRelocate: openToRelocate as 'Yes' | 'No' | 'Maybe',
      openToPets: openToPets as 'Yes' | 'No' | 'Maybe',
      manglik: manglik as 'Yes' | 'No' | 'Unknown',
      diet: diet as 'Veg' | 'Non-Veg' | 'Jain' | 'Eggetarian',
      horoscopeRequired,
      motherTongue,
      familyValues: familyValues as 'Liberal' | 'Moderate' | 'Traditional',
      drinking: drinking as 'Never' | 'Socially' | 'Regularly',
      smoking: smoking as 'Never' | 'Socially' | 'Regularly',
      avatarSeed,
      bio
    });
  }

  return pool;
}

export const dummyPool = generateDummyPool();
