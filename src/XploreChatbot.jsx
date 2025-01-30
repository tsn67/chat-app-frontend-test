import React, { useState, useRef } from 'react';

const XploreChatbot = () => {
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  // Event data remains the same
  const eventData = {
    "Technical Events": {
      "Robotics": [
        {
          "name": "BattleBots Arena",
          "venue": "Robotics Lab",
          "date": "Feb 8, 2025",
          "time": "9 AM - 5 PM",
          "fee": 699,
          "prizes": "35K"
        },
        {
          "name": "Robotrack Challenge",
          "venue": "Robotics Lab",
          "date": "Feb 7, 2025",
          "time": "9 AM - 5 PM",
          "fee": 499,
          "prizes": "25K"
        }
      ],
      "Workshops": [
        {
          "name": "LLM Fine-Tuning and Edge AI",
          "venue": "System Lab DB02",
          "date": "Feb 7, 2025",
          "time": "9 AM - 5 PM",
          "fee": 399
        },
        {
          "name": "Drone Workshop",
          "venue": "Outdoor Arena",
          "date": "Feb 8, 2025",
          "time": "10 AM - 2:30 PM",
          "fee": 499
        }
      ]
    },
    "Cultural Events": {
      "Dance": [
        {
          "name": "Oppana",
          "venue": "Main Stage",
          "date": "Feb 7, 2025",
          "time": "10 AM - 12 PM",
          "fee": 100,
          "prizes": "15K"
        }
      ]
    }
  };

  const additionalEvents = {
    "The Psychic Mind": {
      "date": "February 7, 2025",
      "performer": "Mentalist Adhil",
      "achievements": "Magician, hypnotist, 9-time world record holder, Founder & COO of Kerala School of Mentalism (KSM)",
      "entry": "Free"
    }
  };

  // Response generation logic remains the same
  const generateResponse = (input) => {
    input = input.toLowerCase();
    
    if (input.includes('contact') || input.includes('email')) {
      return "You can contact us at xplore24.gcek@gmail.com or call +91 6238 055 808 for general inquiries and +91 80756 83613 for technical support.";
    }

    if (input.includes('magic') || input.includes('mentalist') || input.includes('psychic')) {
      const psychicEvent = additionalEvents["The Psychic Mind"];
      if (input.includes('when') || input.includes('date')) {
        return `The Psychic Mind event is scheduled for ${psychicEvent.date}.`;
      }
      if (input.includes('performer') || input.includes('who')) {
        return `The main performer is ${psychicEvent.performer}.`;
      }
      if (input.includes('achievement')) {
        return `Mentalist Adhil is ${psychicEvent.achievements}.`;
      }
      if (input.includes('fee') || input.includes('cost') || input.includes('price')) {
        return "The entry for The Psychic Mind event is free.";
      }
      return "Yes, we have 'The Psychic Mind' event featuring Mentalist Adhil.";
    }

    for (const category in eventData) {
      for (const subcategory in eventData[category]) {
        const events = eventData[category][subcategory];
        for (const event of events) {
          if (input.includes(event.name.toLowerCase())) {
            return `${event.name} is scheduled for ${event.date} from ${event.time} at ${event.venue}. Registration fee: ₹${event.fee}${event.prizes ? `. Prize pool: ₹${event.prizes}` : ''}.`;
          }
        }
      }
    }

    return "I can help you with information about our events including BattleBots Arena, Robotrack Challenge, LLM Workshop, Drone Workshop, Oppana, and The Psychic Mind. What would you like to know?";
  };

  const generateImage = async (prompt) => {
    const options = {
      method: 'POST',
      headers: {
        'x-rapidapi-key': '941c4ae924msh38f7827da41851dp1c30e3jsn1cbef3be8a42',
        'x-rapidapi-host': 'chatgpt-42.p.rapidapi.com',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        text: prompt,
        width: 512,
        height: 512,
        steps: 1
      })
    };

    try {
      const response = await fetch('https://chatgpt-42.p.rapidapi.com/texttoimage3', options);
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Image generation error:', error);
      return null;
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSend = async () => {
    if (!inputText.trim()) return;

    const userMessage = {
      type: 'user',
      content: inputText
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsLoading(true);

    const responseText = generateResponse(inputText);
    
    const shouldGenerateImage = inputText.toLowerCase().includes('show me') || 
                               inputText.toLowerCase().includes('generate image');
    
    let imageUrl = null;
    if (shouldGenerateImage) {
      const imageData = await generateImage(inputText);
      if (imageData) {
        imageUrl = imageData.url;
      }
    }

    const botMessage = {
      type: 'bot',
      content: responseText,
      image: imageUrl
    };

    setMessages(prev => [...prev, botMessage]);
    setIsLoading(false);
    scrollToBottom();
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div style={{
      width: '100%',
      maxWidth: '600px',
      margin: '0 auto',
      height: '600px',
      border: '1px solid #e2e8f0',
      borderRadius: '8px',
      display: 'flex',
      flexDirection: 'column',
      backgroundColor: 'white'
    }}>
      <div style={{
        flex: 1,
        overflow: 'auto',
        padding: '1rem',
      }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {messages.map((message, index) => (
            <div
              key={index}
              style={{
                display: 'flex',
                justifyContent: message.type === 'user' ? 'flex-end' : 'flex-start',
              }}
            >
              <div style={{
                maxWidth: '80%',
                padding: '0.75rem',
                borderRadius: '0.5rem',
                backgroundColor: message.type === 'user' ? '#3b82f6' : '#f3f4f6',
                color: message.type === 'user' ? 'white' : 'black',
              }}>
                <p style={{ margin: 0 }}>{message.content}</p>
                {message.image && (
                  <img
                    src={message.image}
                    alt="Generated"
                    style={{
                      marginTop: '0.5rem',
                      borderRadius: '0.375rem',
                      maxWidth: '100%'
                    }}
                  />
                )}
              </div>
            </div>
          ))}
          {isLoading && (
            <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
              <div style={{
                backgroundColor: '#f3f4f6',
                padding: '0.75rem',
                borderRadius: '0.5rem'
              }}>
                <p style={{ margin: 0 }}>Typing...</p>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>
      <div style={{
        borderTop: '1px solid #e2e8f0',
        padding: '1rem',
        backgroundColor: 'white'
      }}>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <input
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ask about Xplore '24 events..."
            style={{
              flex: 1,
              padding: '0.5rem',
              borderRadius: '0.375rem',
              border: '1px solid #e2e8f0',
              outline: 'none',
            }}
          />
          <button
            onClick={handleSend}
            disabled={isLoading}
            style={{
              padding: '0.5rem 1rem',
              borderRadius: '0.375rem',
              backgroundColor: isLoading ? '#94a3b8' : '#3b82f6',
              color: 'white',
              border: 'none',
              cursor: isLoading ? 'not-allowed' : 'pointer',
            }}
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default XploreChatbot;