import type { Profile, ClientProfile, CompatibilityScore } from '../types';

export function calculateCompatibility(client: ClientProfile, candidate: Profile): CompatibilityScore {
  // Hard Constraint: Must be opposite gender
  if (client.gender === candidate.gender) {
    return {
      score: 0,
      level: 'Low',
      breakdown: { age: 0, height: 0, income: 0, location: 0, diet: 0, religionCaste: 0, kidsPets: 0, valuesHabits: 0, careerEdu: 0 },
      highlights: [],
      conflicts: ['Same gender profile - match is not permitted']
    };
  }

  const highlights: string[] = [];
  const conflicts: string[] = [];

  let ageScore = 0;
  let heightScore = 0;
  let incomeScore = 0;
  let locationScore = 0;
  let dietScore = 0;
  let religionCasteScore = 0;
  let kidsPetsScore = 0;
  let valuesHabitsScore = 0;
  let careerEduScore = 0;

  // 1. AGE SCORING
  if (client.gender === 'Male') {
    // Male prefers younger female
    if (candidate.age < client.age) {
      const diff = client.age - candidate.age;
      if (diff <= 4) {
        ageScore = 15;
        highlights.push(`Age is ideal (candidate is ${diff} years younger)`);
      } else {
        ageScore = 12;
        highlights.push(`Candidate is younger by ${diff} years`);
      }
    } else if (candidate.age === client.age) {
      ageScore = 10;
      highlights.push('Same age');
    } else {
      const diff = candidate.age - client.age;
      if (diff <= 2) {
        ageScore = 5;
      } else {
        ageScore = 0;
        conflicts.push(`Age mismatch (candidate is ${diff} years older)`);
      }
    }
  } else {
    // Female prefers older/equal male
    if (candidate.age >= client.age) {
      const diff = candidate.age - client.age;
      if (diff <= 5) {
        ageScore = 15;
        highlights.push(`Age is ideal (candidate is ${diff} years older)`);
      } else {
        ageScore = 10;
        highlights.push(`Candidate is older by ${diff} years`);
      }
    } else {
      const diff = client.age - candidate.age;
      if (diff <= 2) {
        ageScore = 7;
      } else {
        ageScore = 2;
        conflicts.push(`Candidate is ${diff} years younger`);
      }
    }
  }

  // 2. HEIGHT SCORING
  if (client.gender === 'Male') {
    // Male prefers shorter female
    if (candidate.heightCm < client.heightCm) {
      heightScore = 15;
      highlights.push('Height matches preference (female is shorter)');
    } else if (candidate.heightCm === client.heightCm) {
      heightScore = 10;
    } else {
      const diffCm = candidate.heightCm - client.heightCm;
      if (diffCm <= 3) {
        heightScore = 5;
      } else {
        heightScore = 0;
        conflicts.push('Candidate is taller than client');
      }
    }
  } else {
    // Female prefers taller male
    if (candidate.heightCm > client.heightCm) {
      heightScore = 15;
      highlights.push('Height matches preference (male is taller)');
    } else if (candidate.heightCm === client.heightCm) {
      heightScore = 10;
    } else {
      heightScore = 2;
      conflicts.push('Candidate is shorter than client');
    }
  }

  // 3. INCOME SCORING
  if (client.gender === 'Male') {
    // Male prefers female earning less or equal (traditional)
    if (candidate.income <= client.income) {
      incomeScore = 15;
      highlights.push('Income alignment (female earns less or equal)');
    } else {
      const diff = candidate.income - client.income;
      if (diff <= 5) {
        incomeScore = 10;
      } else {
        incomeScore = 5;
        highlights.push('Candidate earns significantly more (modern dynamics)');
      }
    }
  } else {
    // Female prefers male earning equal or more
    if (candidate.income >= client.income) {
      incomeScore = 15;
      highlights.push('Income alignment (male earns equal or more)');
    } else {
      const diff = client.income - candidate.income;
      if (diff <= 5) {
        incomeScore = 10;
      } else {
        incomeScore = 4;
        conflicts.push('Candidate earns significantly less than client');
      }
    }
  }

  // 4. LOCATION & RELOCATION SCORING
  if (client.city === candidate.city) {
    locationScore = 15;
    highlights.push(`Both are based in ${client.city}`);
  } else {
    // Different cities
    if (client.openToRelocate === 'Yes' || candidate.openToRelocate === 'Yes') {
      locationScore = 10;
      highlights.push(`Relocation open (${client.city} to ${candidate.city})`);
    } else if (client.openToRelocate === 'Maybe' || candidate.openToRelocate === 'Maybe') {
      locationScore = 7;
      highlights.push('Open to discuss relocation');
    } else {
      locationScore = 0;
      conflicts.push(`Location gap: neither is open to relocate (${client.city} vs ${candidate.city})`);
    }
  }

  // 5. DIET COMPATIBILITY
  if (client.diet === candidate.diet) {
    dietScore = 15;
    highlights.push(`Shared diet preference (${client.diet})`);
  } else {
    const isClientStrictVeg = client.diet === 'Veg' || client.diet === 'Jain';
    const isCandStrictVeg = candidate.diet === 'Veg' || candidate.diet === 'Jain';

    if (isClientStrictVeg && candidate.diet === 'Non-Veg') {
      dietScore = 3;
      conflicts.push(`Dietary mismatch: client is ${client.diet}, candidate is Non-Veg`);
    } else if (isCandStrictVeg && client.diet === 'Non-Veg') {
      dietScore = 5;
      conflicts.push(`Dietary mismatch: candidate is ${candidate.diet}, client is Non-Veg`);
    } else {
      dietScore = 10; // Veg vs Jain vs Eggetarian
      highlights.push(`Compatible diets (${client.diet} and ${candidate.diet})`);
    }
  }

  // 6. RELIGION & CASTE COMPATIBILITY
  if (client.religion === candidate.religion) {
    if (client.caste === candidate.caste) {
      religionCasteScore = 15;
      highlights.push(`Same community: ${client.religion} (${client.caste})`);
    } else {
      religionCasteScore = 12;
      highlights.push(`Same religion: ${client.religion} (different castes: ${client.caste} / ${candidate.caste})`);
    }
  } else {
    religionCasteScore = 3;
    conflicts.push(`Different religions: ${client.religion} and ${candidate.religion}`);
  }

  // 7. KIDS & PETS SCORING
  // Kids
  let kidsMatch = false;
  if (client.wantKids === candidate.wantKids) {
    kidsMatch = true;
    kidsPetsScore += 8;
  } else if (client.wantKids === 'Maybe' || candidate.wantKids === 'Maybe') {
    kidsPetsScore += 5;
  } else {
    kidsPetsScore += 0;
    conflicts.push(`Conflicting views on children (${client.wantKids} vs ${candidate.wantKids})`);
  }

  // Pets
  if (client.openToPets === 'Yes' && candidate.openToPets === 'Yes') {
    kidsPetsScore += 7;
    highlights.push('Both are pet-friendly');
  } else if (client.openToPets === 'No' && candidate.openToPets === 'No') {
    kidsPetsScore += 5;
  } else if ((client.openToPets === 'Yes' && candidate.openToPets === 'No') || (client.openToPets === 'No' && candidate.openToPets === 'Yes')) {
    kidsPetsScore += 1;
    conflicts.push('Pet compatibility warning');
  } else {
    kidsPetsScore += 4;
  }

  if (kidsMatch && client.wantKids === 'Yes') {
    highlights.push('Aligned on wanting children');
  }

  // 8. VALUES, HABITS & HOSOSCOPE
  // Family Values
  if (client.familyValues === candidate.familyValues) {
    valuesHabitsScore += 6;
    highlights.push(`Shared ${client.familyValues} family values`);
  } else if (
    (client.familyValues === 'Liberal' && candidate.familyValues === 'Traditional') ||
    (client.familyValues === 'Traditional' && candidate.familyValues === 'Liberal')
  ) {
    valuesHabitsScore += 1;
    conflicts.push(`Values gap (${client.familyValues} vs ${candidate.familyValues})`);
  } else {
    valuesHabitsScore += 4;
  }

  // Horoscope/Manglik
  if (client.horoscopeRequired || candidate.horoscopeRequired) {
    if (client.manglik === candidate.manglik) {
      valuesHabitsScore += 4;
      highlights.push(`Manglik compatible (both are ${client.manglik === 'Yes' ? 'Manglik' : 'Non-Manglik'})`);
    } else if (client.manglik === 'Unknown' || candidate.manglik === 'Unknown') {
      valuesHabitsScore += 2;
    } else {
      valuesHabitsScore += 0;
      conflicts.push(`Manglik clash: client is ${client.manglik}, candidate is ${candidate.manglik}`);
    }
  } else {
    valuesHabitsScore += 4; // Not required, so full compatibility by default
  }

  // Habits match
  if (client.drinking === candidate.drinking) {
    valuesHabitsScore += 2;
  } else if (client.drinking === 'Never' && candidate.drinking === 'Regularly') {
    conflicts.push('Drinking habits mismatch');
  } else {
    valuesHabitsScore += 1;
  }

  if (client.smoking === candidate.smoking) {
    valuesHabitsScore += 3;
  } else if (client.smoking === 'Never' && candidate.smoking === 'Regularly') {
    conflicts.push('Smoking habits mismatch');
  } else {
    valuesHabitsScore += 1;
  }

  // 9. CAREER & EDUCATION COMPATIBILITY
  // If similar designations or degree categories
  const clientDegreeType = client.degree.toLowerCase();
  const candDegreeType = candidate.degree.toLowerCase();

  const isClientTech = clientDegreeType.includes('tech') || clientDegreeType.includes('computer');
  const isCandTech = candDegreeType.includes('tech') || candDegreeType.includes('computer');

  const isClientMBA = clientDegreeType.includes('mba') || clientDegreeType.includes('bba');
  const isCandMBA = candDegreeType.includes('mba') || candDegreeType.includes('bba');

  const isClientDoc = clientDegreeType.includes('mbbs') || clientDegreeType.includes('md');
  const isCandDoc = candDegreeType.includes('mbbs') || candDegreeType.includes('md');

  if ((isClientTech && isCandTech) || (isClientMBA && isCandMBA) || (isClientDoc && isCandDoc)) {
    careerEduScore = 15;
    highlights.push('Highly aligned educational paths');
  } else if (client.degree === candidate.degree) {
    careerEduScore = 15;
    highlights.push(`Both hold ${client.degree}`);
  } else {
    careerEduScore = 10;
  }

  // Check company / designation level compatibility
  const clientDesig = client.designation.toLowerCase();
  const candDesig = candidate.designation.toLowerCase();
  if (
    (clientDesig.includes('senior') || clientDesig.includes('lead') || clientDesig.includes('vp') || clientDesig.includes('director') || clientDesig.includes('manager')) &&
    (candDesig.includes('senior') || candDesig.includes('lead') || candDesig.includes('vp') || candDesig.includes('director') || candDesig.includes('manager'))
  ) {
    highlights.push('Both are in mid-to-senior leadership roles');
  }

  // Mother Tongue matching
  if (client.motherTongue === candidate.motherTongue) {
    religionCasteScore += 5; // Extra points
    highlights.push(`Shared mother tongue (${client.motherTongue})`);
  }

  // Summarize raw score
  // Each parameter counts out of 15. Total parameters = 6 * 15 (Age, Height, Income, Location, Diet, ReligionCaste) + 10 (Kids/Pets) + 15 (Values/Habits/Horo) + 15 (Career/Edu) = 130 max points
  const rawScore = ageScore + heightScore + incomeScore + locationScore + dietScore + religionCasteScore + kidsPetsScore + valuesHabitsScore + careerEduScore;
  const maxPossible = 125; // Normalizing denominator
  
  // Apply deductions for severe conflicts
  let penalty = conflicts.length * 5;
  if (conflicts.some(c => c.includes('gender') || c.includes('relocation gap') || c.includes('kids'))) {
    penalty += 15;
  }

  let finalPercentage = Math.round((rawScore / maxPossible) * 100) - penalty;
  finalPercentage = Math.max(0, Math.min(100, finalPercentage));

  let level: CompatibilityScore['level'] = 'Low';
  if (finalPercentage >= 85) level = 'Exceptional';
  else if (finalPercentage >= 72) level = 'Strong';
  else if (finalPercentage >= 55) level = 'Moderate';

  return {
    score: finalPercentage,
    level,
    breakdown: {
      age: Math.round((ageScore / 15) * 100),
      height: Math.round((heightScore / 15) * 100),
      income: Math.round((incomeScore / 15) * 100),
      location: Math.round((locationScore / 15) * 100),
      diet: Math.round((dietScore / 15) * 100),
      religionCaste: Math.round((religionCasteScore / 20) * 100), // religionCaste includes mother tongue bonus
      kidsPets: Math.round((kidsPetsScore / 15) * 100),
      valuesHabits: Math.round((valuesHabitsScore / 15) * 100),
      careerEdu: Math.round((careerEduScore / 15) * 100)
    },
    highlights,
    conflicts
  };
}
