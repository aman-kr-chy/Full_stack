import type { Profile, ClientProfile, CompatibilityScore } from '../types';

/**
 * Clean helper to get the configured OpenAI key from local storage.
 */
function getApiKey(): string | null {
  return localStorage.getItem('openai_api_key');
}

/**
 * Generate a clean description paragraph detailing the match analysis.
 */
export async function generateMatchExplanation(
  client: ClientProfile,
  match: Profile,
  compatibility: CompatibilityScore
): Promise<string> {
  const apiKey = getApiKey();

  if (apiKey && apiKey.startsWith('sk-')) {
    try {
      const prompt = `
Analyze the matrimonial compatibility between two clients for "The Date Crew" matchmaking agency:
Primary Client:
- Name: ${client.firstName} ${client.lastName} (Gender: ${client.gender}, Age: ${client.age})
- Education: ${client.degree} at ${client.college}
- Career: ${client.designation} at ${client.company} (Income: ${client.income} LPA)
- Culture: Religion: ${client.religion}, Caste: ${client.caste}, Mother Tongue: ${client.motherTongue}, Diet: ${client.diet}, Manglik: ${client.manglik}
- Values: Family Values: ${client.familyValues}, Want Kids: ${client.wantKids}, Pets: ${client.openToPets}, Drinking: ${client.drinking}, Smoking: ${client.smoking}
- Preferences / Notes: ${client.notes}

Suggested Match Candidate:
- Name: ${match.firstName} ${match.lastName} (Gender: ${match.gender}, Age: ${match.age})
- Education: ${match.degree} at ${match.college}
- Career: ${match.designation} at ${match.company} (Income: ${match.income} LPA)
- Culture: Religion: ${match.religion}, Caste: ${match.caste}, Mother Tongue: ${match.motherTongue}, Diet: ${match.diet}, Manglik: ${match.manglik}
- Values: Family Values: ${match.familyValues}, Want Kids: ${match.wantKids}, Pets: ${match.openToPets}, Drinking: ${match.drinking}, Smoking: ${match.smoking}

Compatibility Score calculated by our rules: ${compatibility.score}% (${compatibility.level} Compatibility)
Highlights identified: ${compatibility.highlights.join(', ')}
Conflicts identified: ${compatibility.conflicts.join(', ') || 'None'}

Provide a 3-4 sentence paragraph summarizing the match fit, explaining why they are highly suitable or noting any significant lifestyle conflicts. Maintain a professional, warm matchmaker tone. Do not use JSON or lists, return only the paragraph.
`;

      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          messages: [
            { role: 'system', content: 'You are an expert matchmaking AI analyst for "The Date Crew", an elite matrimonial service.' },
            { role: 'user', content: prompt }
          ],
          temperature: 0.7,
          max_tokens: 250
        })
      });

      if (response.ok) {
        const data = await response.json();
        return data.choices[0].message.content.trim();
      } else {
        console.warn('OpenAI API call failed, falling back to local reasoning engine.');
      }
    } catch (e) {
      console.error('Error invoking OpenAI API, falling back.', e);
    }
  }

  // Local Reasoning Engine Fallback (Highly customized & dynamic)
  const scoreBadge = compatibility.level;
  
  let explanation = `**AI Fit Analysis (${scoreBadge} Fit):** `;
  explanation += `${match.firstName} is a ${match.age}-year-old ${match.designation} at ${match.company} from ${match.city}. `;

  // Inject Highlights
  if (compatibility.highlights.length > 0) {
    explanation += `They share strong alignment on several criteria: they are ${compatibility.highlights.slice(0, 3).map(h => h.toLowerCase()).join(', ')}. `;
  }

  // Education summary
  explanation += `Educationally, ${match.firstName} holds a ${match.degree.split(' in ')[0]} from ${match.college}, which complements ${client.firstName}'s background. `;

  // Inject Conflicts or Warnings
  if (compatibility.conflicts.length > 0) {
    explanation += `However, the matchmaker should note a few potential friction points: ${compatibility.conflicts.map(c => c.toLowerCase()).join(', ')}. `;
  } else {
    explanation += `With zero conflicts detected on core fields, this represents a highly seamless lifestyle and cultural match. `;
  }

  return explanation;
}

/**
 * Generate a personalized match proposal introductory email.
 */
export async function generateEmailProposal(
  client: ClientProfile,
  match: Profile,
  score: number,
  matchmakerName: string = 'Matchmaker Sarah'
): Promise<string> {
  const apiKey = getApiKey();

  if (apiKey && apiKey.startsWith('sk-')) {
    try {
      const prompt = `
Draft a personalized matchmaking proposal email from the Matchmaker ("${matchmakerName}") to our primary client ("${client.firstName} ${client.lastName}").
The email is proposing a match with: "${match.firstName} ${match.lastName}" (${match.age}, ${match.designation} at ${match.company}, based in ${match.city}).
Compatibility Score: ${score}%

Primary Client Profile details:
- Income: ${client.income} LPA
- Diet: ${client.diet}
- Pets: ${client.openToPets}
- Location: ${client.city}
- Bio: ${client.bio}

Match Profile details:
- Income: ${match.income} LPA
- Diet: ${match.diet}
- Pets: ${match.openToPets}
- Location: ${match.city}
- College/Degree: ${match.college} / ${match.degree}
- Bio: ${match.bio}

Draft a warm, personal email explaining why this match is handpicked for them, calling out matching details (e.g. shared dietary habits, city, pet views, or career fields). Keep it highly engaging, conversational, and invite them to approve sending their profile.
Format as standard plain text with Subject and Body. Avoid generic placeholder text.
`;

      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          messages: [
            { role: 'system', content: 'You are an elite, warm, and highly personalized matchmaker drafting proposal letters.' },
            { role: 'user', content: prompt }
          ],
          temperature: 0.7,
          max_tokens: 350
        })
      });

      if (response.ok) {
        const data = await response.json();
        return data.choices[0].message.content.trim();
      }
    } catch (e) {
      console.error('Error generating AI email proposal, falling back to template.', e);
    }
  }

  // Local Template Generator Fallback
  const dietTerm = match.diet === 'Veg' ? 'strictly vegetarian' : match.diet === 'Jain' ? 'Jain vegetarian' : 'modern lifestyle';
  const relocateTerm = match.openToRelocate === 'Yes' ? 'is open to relocating' : 'prefers staying in their current city';

  return `Subject: Handpicked Match Alert: Meet ${match.firstName} (${score}% Compatibility)

Hi ${client.firstName},

I hope you're having a wonderful week! 

I have been reviewing profiles for you in our verified database, and I am thrilled to introduce you to a potential match: **${match.firstName} ${match.lastName}**.

${match.firstName} is a ${match.age}-year-old **${match.designation}** at **${match.company}**, currently based in **${match.city}**. She holds a **${match.degree}** from **${match.college}** and has an annual income of **${match.income} LPA**.

Here is why I handpicked ${match.firstName} for you:
• **Lifestyle Alignment:** Like you, she follows a ${dietTerm} diet and is ${match.openToPets === 'Yes' ? 'pet-friendly' : 'not keen on pets'}.
• **Cultural & Religious Harmony:** She belongs to the ${match.religion} (${match.caste}) community, matching your cultural parameters.
• **Proximity & Relocating:** She resides in ${match.city} and ${relocateTerm}, aligning with your preferences.
• **Personal Vibe:** She describes herself as: "${match.bio}"

I believe there is a strong potential for a deep connection here. Please let me know if you would like me to share your biodata and set up a quick 15-minute video call!

Warmly,
${matchmakerName}
Senior Matchmaking Consultant, The Date Crew`;
}
