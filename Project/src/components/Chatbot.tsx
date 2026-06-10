import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, User, Bot } from 'lucide-react';
import { mockClients } from '../data/mockClients';

type Message = {
  id: string;
  sender: 'bot' | 'user';
  text: string;
  options?: string[];
};

type UserData = {
  gender: string;
  age: string;
  qualification: string;
  salary: string;
};

const initialMessages: Message[] = [
  {
    id: '1',
    sender: 'bot',
    text: 'Hi there! I am your TDC Advisor. I can provide tailored matchmaking advice based on your profile.',
  },
  {
    id: '2',
    sender: 'bot',
    text: 'To start, please select your gender:',
    options: ['Male', 'Female', 'Other'],
  },
];

export function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [step, setStep] = useState(0);
  const [userData, setUserData] = useState<UserData>({ gender: '', age: '', qualification: '', salary: '' });
  
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  const handleOptionClick = (option: string) => {
    const userMsg: Message = { id: Date.now().toString(), sender: 'user', text: option };
    setMessages((prev) => [...prev, userMsg]);

    let nextData = { ...userData };
    let nextStep = step + 1;
    let nextBotMsgs: Message[] = [];

    if (step === 0) {
      nextData.gender = option;
      nextBotMsgs.push({
        id: (Date.now() + 1).toString(),
        sender: 'bot',
        text: 'Got it. Now, please select your age group:',
        options: ['18-24', '25-30', '31-40', '41-50', '50+'],
      });
    } else if (step === 1) {
      nextData.age = option;
      nextBotMsgs.push({
        id: (Date.now() + 1).toString(),
        sender: 'bot',
        text: 'Great. What is your highest qualification?',
        options: ['High School', "Bachelor's", "Master's", 'PhD'],
      });
    } else if (step === 2) {
      nextData.qualification = option;
      nextBotMsgs.push({
        id: (Date.now() + 1).toString(),
        sender: 'bot',
        text: 'Almost done! Finally, select your annual salary range:',
        options: ['< $50k', '$50k - $100k', '$100k - $200k', '$200k+'],
      });
    } else if (step === 3) {
      nextData.salary = option;
      const advice = generateAdvice(nextData);
      nextBotMsgs.push({
        id: (Date.now() + 1).toString(),
        sender: 'bot',
        text: 'Thanks! Here is your personalized advice:',
      });
      nextBotMsgs.push({
        id: (Date.now() + 2).toString(),
        sender: 'bot',
        text: advice,
      });
      nextBotMsgs.push({
        id: (Date.now() + 3).toString(),
        sender: 'bot',
        text: 'Would you like to start over?',
        options: ['Restart'],
      });
    } else if (step === 4 && option === 'Restart') {
      setMessages(initialMessages);
      setStep(0);
      setUserData({ gender: '', age: '', qualification: '', salary: '' });
      return;
    }

    setUserData(nextData);
    setStep(nextStep);
    
    setTimeout(() => {
      setMessages((prev) => [...prev, ...nextBotMsgs]);
    }, 600);
  };

  const generateAdvice = (data: UserData) => {
    let advice = "";
    if (data.age === '18-24') {
      advice = `At ${data.age}, your focus should typically be on building your foundation. With a ${data.qualification} and making ${data.salary}, you're in a phase of personal growth. We recommend focusing on expanding your social circle and gaining life experiences before jumping into serious matchmaking.`;
    } else if (data.salary === '$200k+' || data.salary === '$100k - $200k') {
      advice = `As a ${data.gender} in the ${data.age} age group making ${data.salary}, you are highly sought after in our premium tiers! Your ${data.qualification} adds great value to your profile. You are well-positioned to find a high-quality match who shares your ambition and lifestyle. We suggest looking at our "Elite Connections" program.`;
    } else if (data.age === '31-40' || data.age === '41-50') {
      advice = `Being in the ${data.age} range with a ${data.qualification}, stability is key. With your income of ${data.salary}, you have a solid foundation. Our matchmakers recommend prioritizing shared values and long-term compatibility over superficial traits. You're ready for a serious commitment.`;
    } else {
      advice = `Thank you for sharing. Based on your profile (${data.gender}, ${data.age}, ${data.qualification}, ${data.salary}), our matchmakers recommend focusing on maintaining a balanced lifestyle while exploring our curated matches. Confidence and clarity in what you want are your best assets right now.`;
    }

    const oppositeGender = data.gender === 'Male' ? 'Female' : (data.gender === 'Female' ? 'Male' : null);
    if (oppositeGender) {
       const targetAgeMapping: Record<string, number> = {
         '18-24': 25,
         '25-30': 28,
         '31-40': 32,
         '41-50': 40,
         '50+': 50
       };
       const targetAge = targetAgeMapping[data.age] || 30;
       const potentialMatches = mockClients.filter(c => c.gender === oppositeGender && c.journeyStage !== 'Success');
       if (potentialMatches.length > 0) {
         potentialMatches.sort((a, b) => Math.abs(a.age - targetAge) - Math.abs(b.age - targetAge));
         const bestMatch = potentialMatches[0];
         advice += `\n\nFurthermore, based on your demographics, we highly recommend you connect with ${bestMatch.firstName} ${bestMatch.lastName}. ${bestMatch.firstName} is a ${bestMatch.age}-year-old ${bestMatch.designation} who is looking for a match. ${bestMatch.bio}`;
       }
    }

    return advice;
  };

  return (
    <>
      <button 
        className={`chatbot-toggle-btn ${isOpen ? 'hidden' : ''}`}
        onClick={() => setIsOpen(true)}
        aria-label="Open Advisor Chat"
      >
        <MessageCircle size={24} />
      </button>

      {isOpen && (
        <div className="chatbot-window">
          <div className="chatbot-header">
            <div className="chatbot-title">
              <Bot size={20} className="chatbot-bot-icon" />
              <h3>TDC Advisor</h3>
            </div>
            <button className="icon-btn" onClick={() => setIsOpen(false)}>
              <X size={18} />
            </button>
          </div>
          
          <div className="chatbot-messages-container">
            <div className="chatbot-messages">
              {messages.map((msg) => (
                <div key={msg.id} className={`message-wrapper ${msg.sender}`}>
                  {msg.sender === 'bot' && <div className="message-avatar bot"><Bot size={14} /></div>}
                  <div className="message-content">
                    <div className={`message-bubble ${msg.sender}`}>
                      {msg.text}
                    </div>
                    {msg.options && msg.sender === 'bot' && msg.id === messages[messages.length - 1].id && (
                      <div className="message-options">
                        {msg.options.map(opt => (
                          <button 
                            key={opt} 
                            className="btn btn-secondary btn-sm option-btn"
                            onClick={() => handleOptionClick(opt)}
                          >
                            {opt}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                  {msg.sender === 'user' && <div className="message-avatar user"><User size={14} /></div>}
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
