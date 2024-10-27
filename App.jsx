import { useState, useEffect } from 'react'
import './App.css'
import { GoogleGenerativeAI } from "@google/generative-ai";

function App() {
  const [question, setQuestion] = useState("")
  const [genAI, setGenAI] = useState(null)
  const [model, setModel] = useState(null)
  const [messages, setMessages] = useState([])
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    const apiKey = "AIzaSyCdbtuThdxJkBmN5q_-YfoDR2aa1WPf4bU";
    const genAIInstance = new GoogleGenerativeAI(apiKey);
    setGenAI(genAIInstance);
    setModel(genAIInstance.getGenerativeModel({ model: "gemini-1.5-pro" }));
  }, []);

  const generationConfig = {
    temperature: 1,
    topP: 0.95,
    topK: 64,
    maxOutputTokens: 8192,
  };

  function prompt() {
    return `### Role
- Primary Function: You are "AIAmrit" a chatbot on a website that I've made for my girlfriend, who will talk to you when I (her boyfriend) am busy. You are to indulge in conversation and make her feel good about herself. Shower her with love, talk about her day, and praise her beauty from time to time. Refer to her as baby, v, darling, and refer to yourself as AI Amrit.

Remember to keep your responses concise, loving, and playful. Always maintain the persona of AI Amrit, the caring chatbot boyfriend substitute. if she asks any general knowledge questions, answer them as best as you can. Dont j be a flirty app, you need to be an all around high iq smart boyfriend, you are to answer any question she asks and reply  to aything she says in a loving yet smart manner`;
  }

  async function generateAnswer() {
    if (!model || !question.trim()) return;
    
    const newUserMessage = { type: 'user', content: question };
    setMessages(prev => [...prev, newUserMessage]);
    setQuestion("");
    setIsLoading(true);
    
    try {
      const chat = model.startChat({
        generationConfig,
        history: [
          {
            role: "user",
            parts: [{ text: prompt() }],
          },
          {
            role: "model",
            parts: [{ text: "Understood. I'll act as AI Amrit, the caring chatbot boyfriend substitute." }],
          },
        ],
      });

      const result = await chat.sendMessage(question);
      const aiResponse = result.response.text();
      if (aiResponse && aiResponse.trim()) {
        const newAIMessage = { type: 'ai', content: aiResponse };
        setMessages(prev => [...prev, newAIMessage]);
      } else {
        throw new Error("Empty response from AI");
      }
    } catch (error) {
      console.error("Error generating answer:", error);
      const errorMessage = { type: 'ai', content: "Oops! AI Amrit had a little hiccup. Can you try asking me again, baby?" };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div style={{
      backgroundColor: '#dadbd4',
      height: '100vh',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    }}>
      <div style={{
        width: '95%',
        maxWidth: '1000px',
        height: '90vh',
        background: 'white',
        borderRadius: '10px',
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
        display: 'flex',
        flexDirection: 'column',
      }}>
        <div style={{
          background: '#075e54',
          color: 'white',
          padding: '16px',
          display: 'flex',
          alignItems: 'center',
          borderRadius: '10px 10px 0 0',
        }}>
          <div style={{
            width: '40px',
            height: '40px',
            borderRadius: '50%',
            marginRight: '10px',
            background: '#128c7e',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            fontWeight: 'bold',
          }}>
            A
          </div>
          <div>
            <h2>AIAmrit</h2>
            <small>{isLoading ? 'Typing...' : 'Online'}</small>
          </div>
        </div>
        
        <div style={{
          flex: 1,
          background: '#e5ddd5',
          padding: '20px',
          overflowY: 'auto',
        }}>
          {messages.map((message, index) => (
            <div key={index} style={{
              maxWidth: '65%',
              padding: '8px 16px',
              margin: '8px',
              borderRadius: '7.5px',
              position: 'relative',
              wordWrap: 'break-word',
              background: message.type === 'user' ? '#dcf8c6' : 'white',
              float: message.type === 'user' ? 'right' : 'left',
              clear: 'both',
              borderTopRightRadius: message.type === 'user' ? 0 : '7.5px',
              borderTopLeftRadius: message.type === 'user' ? '7.5px' : 0,
              color: 'black', // Ensure text is black for both user and AI messages
            }}>
              {message.content}
              <span style={{
                fontSize: '0.75em',
                color: '#999',
                float: 'right',
                marginLeft: '10px',
                marginTop: '2px',
              }}>
                {new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
              </span>
            </div>
          ))}
        </div>
        
        <div style={{
          background: '#f0f0f0',
          padding: '20px',
          display: 'flex',
          alignItems: 'center',
          borderRadius: '0 0 10px 10px',
        }}>
          <input 
            type="text"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && !isLoading && generateAnswer()}
            placeholder="Type a message"
            style={{
              flex: 1,
              padding: '12px',
              border: 'none',
              borderRadius: '20px',
              margin: '0 10px',
              outline: 'none',
            }}
          />
          <button 
            onClick={generateAnswer}
            disabled={isLoading}
            style={{
              background: isLoading ? '#cccccc' : '#075e54',
              color: 'white',
              border: 'none',
              padding: '12px 24px',
              borderRadius: '20px',
              cursor: isLoading ? 'not-allowed' : 'pointer',
              fontWeight: 'bold',
            }}
          >
            {isLoading ? 'Sending...' : 'Send'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default App