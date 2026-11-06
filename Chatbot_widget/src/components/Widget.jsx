import React, { useState, useRef, useEffect } from 'react';
import { 
  MessageSquare, X, Menu, Mic, Send, ChevronLeft, ChevronRight, 
  ArrowLeft, Trash2, Volume2, Copy, Check, Sparkles 
} from 'lucide-react';
import collegeList from './collegelist';
import newsItems from './News';

const ChatbotWidget = () => {
  const [isOpen, setIsOpen] = useState(true);
  const [showChat, setShowChat] = useState(false);
  const [inputText, setInputText] = useState('');
  const [score, setScore] = useState('');
  const [predictedColleges, setPredictedColleges] = useState([
    { name: "GPC, Ajmer", minScore: 82 },
    { name: "GPC, Jaipur", minScore: 86 },
    { name: "GPC, Kota", minScore: 80 }
  ]);
  const [currentNewsIndex, setCurrentNewsIndex] = useState(0);
  const [chatHistory, setChatHistory] = useState([
    {
      type: 'response',
      text: "नमस्ते! Hello! I am **Pragya**, your AI Assistant for Rajasthan Technical Education. How may I assist you with admissions, fees, colleges, hostels, or scholarships today?",
      isMarkdown: true
    }
  ]);
  const [selectedCollege, setSelectedCollege] = useState('gpcajmer');
  const [selectedLanguage, setSelectedLanguage] = useState('English');
  const [isTyping, setIsTyping] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState(null);
  const [showInfoDrawer, setShowInfoDrawer] = useState(false);

  const chatEndRef = useRef(null);

  useEffect(() => {
    if (showChat && chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [chatHistory, isTyping, showChat]);

  const toggleWidget = () => {
    setIsOpen(!isOpen);
    setShowInfoDrawer(false);
  };

  const predictColleges = (userScore = score) => {
    const scoreNum = parseFloat(userScore);
    if (!isNaN(scoreNum) && scoreNum > 0) {
      const predicted = collegeList
        .filter(c => c.value !== "general_rajasthan_dte")
        .map(college => ({
          ...college,
          diff: Math.abs(scoreNum - college.minScore),
          eligible: scoreNum >= (college.minScore - 4)
        }))
        .sort((a, b) => {
          if (a.eligible && !b.eligible) return -1;
          if (!a.eligible && b.eligible) return 1;
          return a.diff - b.diff;
        })
        .slice(0, 3);
      setPredictedColleges(predicted);
    }
  };

  const nextNews = () => {
    setCurrentNewsIndex((prevIndex) => (prevIndex + 1) % newsItems.length);
  };

  const prevNews = () => {
    setCurrentNewsIndex((prevIndex) => (prevIndex - 1 + newsItems.length) % newsItems.length);
  };

  const handleScoreChange = (e) => {
    setScore(e.target.value);
  };

  const handleScoreKeyPress = (e) => {
    if (e.key === 'Enter') {
      predictColleges();
    }
  };

  const handleSendQuery = (textToSend = inputText) => {
    const query = textToSend.trim();
    if (!query) return;

    setShowChat(true);
    setInputText('');

    const newHistory = [
      ...chatHistory,
      { type: 'query', text: query }
    ];
    setChatHistory(newHistory);
    setIsTyping(true);

    fetch("http://localhost:8000/ask_query", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        query: query,
        college_name: selectedCollege || "gpcajmer",
        lang: selectedLanguage || "English"
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        setIsTyping(false);
        setChatHistory([
          ...newHistory,
          { type: 'response', text: data.answer, isMarkdown: true }
        ]);
      })
      .catch((err) => {
        setIsTyping(false);
        console.error("Query error:", err);
        setChatHistory([
          ...newHistory,
          { 
            type: 'response', 
            text: "⚠️ Could not connect to local server (http://localhost:8000). Please start the backend with `python api.py`. For immediate help, call the Rajasthan DTE Helpline: **1800-180-6127**.",
            isMarkdown: true
          }
        ]);
      });
  };

  const handleInputKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendQuery();
    }
  };

  const clearChat = () => {
    setChatHistory([
      {
        type: 'response',
        text: "Chat cleared. What else would you like to know about Rajasthan technical colleges?",
        isMarkdown: true
      }
    ]);
  };

  const toggleMic = () => {
    if (!('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) {
      alert("Voice recognition is not supported in this browser.");
      return;
    }
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.lang = selectedLanguage.toLowerCase().includes('hindi') ? 'hi-IN' : 'en-IN';

    recognition.onstart = () => setIsListening(true);
    recognition.onend = () => setIsListening(false);
    recognition.onerror = () => setIsListening(false);
    recognition.onresult = (e) => {
      const transcript = e.results[0][0].transcript;
      setInputText(transcript);
      handleSendQuery(transcript);
    };

    if (isListening) {
      recognition.stop();
      setIsListening(false);
    } else {
      recognition.start();
    }
  };

  const speakText = (text) => {
    if (!('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    const cleanText = text.replace(/<[^>]*>/g, '').replace(/[#*`_]/g, '');
    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.lang = selectedLanguage.toLowerCase().includes('hindi') ? 'hi-IN' : 'en-IN';
    window.speechSynthesis.speak(utterance);
  };

  const copyToClipboard = (text, idx) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(idx);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const formatSimpleMarkdown = (text) => {
    if (!text) return "";
    let html = text
      .replace(/^### (.*$)/gim, '<h3 style="color:#0f4c81;margin-bottom:6px;font-size:0.95rem;">$1</h3>')
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noreferrer" style="color:#0077cc;text-decoration:underline;">$1</a>')
      .replace(/^\s*-\s+(.*)/gim, '<li style="margin-left:16px;margin-bottom:3px;">$1</li>')
      .replace(/\n\n/g, '<br><br>')
      .replace(/\n/g, '<br>');
    return { __html: html };
  };

  const currentCollegeName = collegeList.find(c => c.value === selectedCollege)?.name || "GPC, Ajmer";

  return (
    <div style={{ position: 'fixed', bottom: '24px', right: '24px', zIndex: 99999, fontFamily: "'Segoe UI', Roboto, sans-serif" }}>
      {!isOpen ? (
        <button
          onClick={toggleWidget}
          style={{
            background: 'linear-gradient(135deg, #0d47a1, #1e88e5)',
            color: '#fff',
            borderRadius: '50%',
            width: '60px',
            height: '60px',
            border: 'none',
            boxShadow: '0 8px 24px rgba(13, 71, 161, 0.4)',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'transform 0.2s',
          }}
          onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.08)'}
          onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
          title="Open Pragya Assistant"
        >
          <MessageSquare size={28} />
        </button>
      ) : (
        <div style={{
          backgroundColor: '#fff',
          borderRadius: '22px',
          boxShadow: '0 16px 48px -12px rgba(13, 71, 161, 0.3), 0 4px 16px rgba(0,0,0,0.1)',
          width: '420px',
          height: '680px',
          maxHeight: 'calc(100vh - 100px)',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          border: '1px solid #e2e8f0'
        }}>
          {/* Header matching Expected Outcome */}
          <div style={{
            background: 'linear-gradient(135deg, #0d47a1 0%, #1565c0 100%)',
            color: '#fff',
            padding: '12px 16px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            boxShadow: '0 2px 10px rgba(0, 0, 0, 0.12)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <button 
                onClick={() => setShowInfoDrawer(!showInfoDrawer)}
                style={{ background: 'transparent', border: 'none', color: '#fff', cursor: 'pointer', display: 'flex' }}
                title="Menu"
              >
                <Menu size={22} />
              </button>
              
              {/* Pragya Emblem Circle */}
              <div style={{
                width: '38px',
                height: '38px',
                borderRadius: '50%',
                background: '#fff',
                padding: '2px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <svg viewBox="0 0 100 100" style={{ width: '100%', height: '100%' }}>
                  <circle cx="50" cy="50" r="48" fill="#fff" stroke="#c62828" strokeWidth="4"/>
                  <path d="M50 25 L75 38 L50 50 L25 38 Z" fill="#c62828"/>
                  <path d="M72 41 L72 58 C72 58 64 68 50 68 C36 68 28 58 28 58 L28 41 L50 52 Z" fill="#1565c0"/>
                  <text x="50" y="85" fontSize="12" fontWeight="bold" fill="#c62828" textAnchor="middle">PRAGYA</text>
                </svg>
              </div>

              <div>
                <h2 style={{ margin: 0, fontSize: '1.28rem', fontWeight: 700, letterSpacing: '0.3px' }}>Pragya</h2>
                <span style={{ fontSize: '0.68rem', opacity: 0.9, display: 'block' }}>DTE Rajasthan • AI Assistant</span>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              {/* Ashoka/Rajasthan Emblem */}
              <div style={{
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                background: '#fff',
                padding: '2px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }} title="Government of Rajasthan">
                <svg viewBox="0 0 100 100" style={{ width: '100%', height: '100%' }}>
                  <circle cx="50" cy="50" r="48" fill="#fff" stroke="#2e7d32" strokeWidth="3"/>
                  <circle cx="50" cy="50" r="14" fill="none" stroke="#0d47a1" strokeWidth="3"/>
                  <line x1="50" y1="36" x2="50" y2="64" stroke="#0d47a1" strokeWidth="2"/>
                  <line x1="36" y1="50" x2="64" y2="50" stroke="#0d47a1" strokeWidth="2"/>
                  <text x="50" y="85" fontSize="10" fontWeight="bold" fill="#1b5e20" textAnchor="middle">सत्यमेव जयते</text>
                </svg>
              </div>

              <button 
                onClick={toggleWidget} 
                style={{ background: 'transparent', border: 'none', color: '#fff', cursor: 'pointer', display: 'flex' }}
                title="Close"
              >
                <X size={22} />
              </button>
            </div>
          </div>

          {/* Info Drawer */}
          {showInfoDrawer && (
            <div style={{
              background: '#f8fafc',
              borderBottom: '2px solid #2196f3',
              padding: '14px',
              fontSize: '0.85rem',
              color: '#334155',
              lineHeight: 1.4
            }}>
              <strong>Department of Technical Education, Rajasthan</strong>
              <p style={{ margin: '4px 0 8px' }}>Official student helpline and AI admission advisor.</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', fontSize: '0.8rem' }}>
                <a href="https://hte.rajasthan.gov.in" target="_blank" rel="noreferrer" style={{ color: '#0d47a1', textDecoration: 'none', fontWeight: 600 }}>🌐 hte.rajasthan.gov.in</a>
                <span>📞 Student Helpline: 1800-180-6127</span>
              </div>
            </div>
          )}

          {/* Main Body */}
          <div style={{ flex: 1, overflowY: 'auto', padding: '14px', display: 'flex', flexDirection: 'column' }}>
            {!showChat ? (
              <>
                {/* Predictor Card matching Expected Outcome */}
                <div style={{
                  background: 'linear-gradient(135deg, #0e4c92 0%, #1565c0 100%)',
                  borderRadius: '16px',
                  padding: '14px',
                  display: 'flex',
                  gap: '12px',
                  color: '#fff',
                  boxShadow: '0 4px 12px rgba(14, 76, 146, 0.2)'
                }}>
                  <div style={{ flex: 1.2, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                    <h3 style={{ margin: '0 0 8px', fontSize: '1.05rem', fontWeight: 700, color: '#e2f1ff' }}>
                      Predict your College
                    </h3>
                    <div style={{
                      display: 'flex',
                      background: 'rgba(255, 255, 255, 0.95)',
                      borderRadius: '9999px',
                      padding: '2px 4px 2px 10px',
                      alignItems: 'center'
                    }}>
                      <input
                        type="number"
                        value={score}
                        onChange={handleScoreChange}
                        onKeyPress={handleScoreKeyPress}
                        placeholder="Enter Your Score.."
                        style={{
                          width: '100%',
                          border: 'none',
                          outline: 'none',
                          background: 'transparent',
                          fontSize: '0.85rem',
                          color: '#0f172a',
                          fontWeight: 500
                        }}
                      />
                      <button 
                        onClick={() => predictColleges()}
                        style={{
                          background: '#0d47a1',
                          color: '#fff',
                          border: 'none',
                          borderRadius: '50%',
                          width: '26px',
                          height: '26px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          cursor: 'pointer'
                        }}
                      >
                        <ChevronRight size={16} />
                      </button>
                    </div>
                    <span style={{ fontSize: '0.65rem', color: '#cbd5e1', marginTop: '6px' }}>
                      10th/12th % or REAP cutoff
                    </span>
                  </div>

                  <div style={{
                    flex: 1.1,
                    backgroundColor: '#e3f2fd',
                    borderRadius: '12px',
                    padding: '8px 10px',
                    color: '#0f172a',
                    display: 'flex',
                    flexDirection: 'column'
                  }}>
                    <h4 style={{ margin: '0 0 6px', fontSize: '0.85rem', fontWeight: 700, color: '#0d47a1', textAlign: 'center' }}>
                      Top Colleges
                    </h4>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                      {predictedColleges.map((college, index) => (
                        <div key={index} style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          background: '#fff',
                          padding: '4px 6px',
                          borderRadius: '6px',
                          fontSize: '0.72rem'
                        }}>
                          <span style={{ fontWeight: 600, color: '#1e293b', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '100px' }}>
                            {college.name.replace("Government Polytechnic College", "GPC")}
                          </span>
                          <span style={{ background: '#dbeafe', color: '#1d4ed8', fontSize: '0.65rem', padding: '1px 4px', borderRadius: '4px', fontWeight: 700 }}>
                            {college.minScore}%
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* News Card matching Expected Outcome */}
                <div style={{
                  backgroundColor: '#e0f2fe',
                  borderRadius: '16px',
                  padding: '12px 14px',
                  marginTop: '14px',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.04)'
                }}>
                  <h3 style={{ margin: '0 0 10px', fontSize: '1rem', fontWeight: 700, color: '#0c4a6e', textAlign: 'center' }}>
                    Top News For You
                  </h3>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <button 
                      onClick={prevNews}
                      style={{
                        backgroundColor: '#38bdf8',
                        color: 'white',
                        border: 'none',
                        borderRadius: '50%',
                        width: '32px',
                        height: '32px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer',
                        flexShrink: 0
                      }}
                    >
                      <ChevronLeft size={20} />
                    </button>

                    <div style={{
                      flex: 1,
                      backgroundColor: 'white',
                      borderRadius: '12px',
                      padding: '10px 12px',
                      minHeight: '100px',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between'
                    }}>
                      <span style={{
                        alignSelf: 'flex-start',
                        background: '#dcfce7',
                        color: '#15803d',
                        fontSize: '0.65rem',
                        fontWeight: 700,
                        padding: '2px 6px',
                        borderRadius: '4px'
                      }}>
                        {newsItems[currentNewsIndex].category || "Update"}
                      </span>
                      <h4 style={{ margin: '4px 0', fontSize: '0.8rem', fontWeight: 700, color: '#0f172a', lineHeight: 1.25 }}>
                        {newsItems[currentNewsIndex].title}
                      </h4>
                      <p style={{ margin: 0, fontSize: '0.72rem', color: '#475569', lineHeight: 1.3 }}>
                        {newsItems[currentNewsIndex].description}
                      </p>
                      <div style={{ display: 'flex', justifyContent: 'center', gap: '4px', marginTop: '6px' }}>
                        {newsItems.map((_, idx) => (
                          <span key={idx} style={{
                            width: idx === currentNewsIndex ? '14px' : '6px',
                            height: '6px',
                            borderRadius: '4px',
                            backgroundColor: idx === currentNewsIndex ? '#0d47a1' : '#cbd5e1',
                            transition: 'all 0.2s'
                          }} />
                        ))}
                      </div>
                    </div>

                    <button 
                      onClick={nextNews}
                      style={{
                        backgroundColor: '#38bdf8',
                        color: 'white',
                        border: 'none',
                        borderRadius: '50%',
                        width: '32px',
                        height: '32px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer',
                        flexShrink: 0
                      }}
                    >
                      <ChevronRight size={20} />
                    </button>
                  </div>
                </div>

                {/* Quick Query Suggestion Chips */}
                <div style={{ marginTop: '14px' }}>
                  <span style={{ fontSize: '0.72rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.5px', display: 'block', marginBottom: '6px' }}>
                    Popular Questions:
                  </span>
                  <div style={{ display: 'flex', gap: '6px', overflowX: 'auto', paddingBottom: '4px' }}>
                    {[
                      { label: "💰 Fee & Girls Concession", query: "What is the fee structure and concession for female students?" },
                      { label: "📝 Admission Eligibility", query: "What is the admission eligibility for polytechnic diploma?" },
                      { label: "🏠 Hostel & Mess", query: "What hostel and mess facilities are available?" },
                      { label: "💼 Placements & Packages", query: "What are the top placement companies and packages?" },
                      { label: "🎓 Available Branches", query: "What engineering branches are offered?" }
                    ].map((chip, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleSendQuery(chip.query)}
                        style={{
                          background: '#f1f5f9',
                          border: '1px solid #e2e8f0',
                          borderRadius: '9999px',
                          padding: '5px 10px',
                          fontSize: '0.75rem',
                          fontWeight: 500,
                          color: '#334155',
                          cursor: 'pointer',
                          whiteSpace: 'nowrap',
                          transition: 'all 0.2s'
                        }}
                      >
                        {chip.label}
                      </button>
                    ))}
                  </div>
                </div>
              </>
            ) : (
              /* Chat Mode View */
              <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                {/* Chat Sub-header with Back Button */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '6px 0 10px',
                  borderBottom: '1px solid #e2e8f0',
                  marginBottom: '10px'
                }}>
                  <button
                    onClick={() => setShowChat(false)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                      background: 'transparent',
                      border: 'none',
                      color: '#0d47a1',
                      fontSize: '0.8rem',
                      fontWeight: 600,
                      cursor: 'pointer'
                    }}
                  >
                    <ArrowLeft size={16} /> Dashboard
                  </button>
                  <span style={{
                    background: '#dbeafe',
                    color: '#1e40af',
                    fontSize: '0.7rem',
                    fontWeight: 600,
                    padding: '2px 8px',
                    borderRadius: '9999px'
                  }}>
                    {currentCollegeName}
                  </span>
                  <button
                    onClick={clearChat}
                    style={{ background: 'transparent', border: 'none', color: '#94a3b8', cursor: 'pointer' }}
                    title="Clear Chat"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>

                {/* Messages List */}
                <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {chatHistory.map((msg, idx) => (
                    <div
                      key={idx}
                      style={{
                        alignSelf: msg.type === 'query' ? 'flex-end' : 'flex-start',
                        maxWidth: '85%',
                        display: 'flex',
                        flexDirection: 'column'
                      }}
                    >
                      <div
                        style={{
                          background: msg.type === 'query' ? 'linear-gradient(135deg, #0d47a1, #1976d2)' : '#f1f5f9',
                          color: msg.type === 'query' ? '#fff' : '#1e293b',
                          padding: '10px 14px',
                          borderRadius: msg.type === 'query' ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
                          fontSize: '0.85rem',
                          lineHeight: '1.45',
                          boxShadow: '0 1px 3px rgba(0,0,0,0.06)'
                        }}
                      >
                        {msg.isMarkdown ? (
                          <div dangerouslySetInnerHTML={formatSimpleMarkdown(msg.text)} />
                        ) : (
                          <p style={{ margin: 0 }}>{msg.text}</p>
                        )}
                      </div>

                      {/* Bot Message Actions: Speak & Copy */}
                      {msg.type === 'response' && (
                        <div style={{ display: 'flex', gap: '8px', marginTop: '4px', paddingLeft: '4px' }}>
                          <button
                            onClick={() => speakText(msg.text)}
                            style={{ background: 'transparent', border: 'none', color: '#64748b', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '3px', fontSize: '0.7rem' }}
                            title="Listen"
                          >
                            <Volume2 size={13} /> Listen
                          </button>
                          <button
                            onClick={() => copyToClipboard(msg.text, idx)}
                            style={{ background: 'transparent', border: 'none', color: '#64748b', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '3px', fontSize: '0.7rem' }}
                            title="Copy"
                          >
                            {copiedIndex === idx ? <Check size={13} color="#22c55e" /> : <Copy size={13} />} {copiedIndex === idx ? "Copied" : "Copy"}
                          </button>
                        </div>
                      )}
                    </div>
                  ))}

                  {/* Typing Indicator */}
                  {isTyping && (
                    <div style={{
                      alignSelf: 'flex-start',
                      background: '#f1f5f9',
                      padding: '8px 14px',
                      borderRadius: '16px 16px 16px 4px',
                      fontSize: '0.78rem',
                      color: '#64748b',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px'
                    }}>
                      <Sparkles size={14} color="#0d47a1" /> Pragya is searching verified DTE records...
                    </div>
                  )}
                  <div ref={chatEndRef} />
                </div>
              </div>
            )}
          </div>

          {/* Bottom Controls Area matching Expected Outcome */}
          <div style={{
            backgroundColor: '#ffffff',
            padding: '8px 14px 14px',
            borderTop: '1px solid #f1f5f9',
            display: 'flex',
            flexDirection: 'column',
            gap: '8px'
          }}>
            {/* Two Pills: Select College & Select Language */}
            <div style={{ display: 'flex', gap: '10px' }}>
              <div style={{
                flex: 1,
                backgroundColor: '#e1f5fe',
                borderRadius: '9999px',
                padding: '0 12px',
                border: '1px solid #b9e6fe',
                display: 'flex',
                alignItems: 'center'
              }}>
                <select
                  value={selectedCollege}
                  onChange={(e) => setSelectedCollege(e.target.value)}
                  style={{
                    width: '100%',
                    border: 'none',
                    background: 'transparent',
                    outline: 'none',
                    fontSize: '0.8rem',
                    fontWeight: 600,
                    color: '#0369a1',
                    padding: '7px 0',
                    cursor: 'pointer'
                  }}
                >
                  {collegeList.map((college, idx) => (
                    <option key={idx} value={college.value}>{college.name}</option>
                  ))}
                </select>
              </div>

              <div style={{
                flex: 1,
                backgroundColor: '#e1f5fe',
                borderRadius: '9999px',
                padding: '0 12px',
                border: '1px solid #b9e6fe',
                display: 'flex',
                alignItems: 'center'
              }}>
                <select
                  value={selectedLanguage}
                  onChange={(e) => setSelectedLanguage(e.target.value)}
                  style={{
                    width: '100%',
                    border: 'none',
                    background: 'transparent',
                    outline: 'none',
                    fontSize: '0.8rem',
                    fontWeight: 600,
                    color: '#0369a1',
                    padding: '7px 0',
                    cursor: 'pointer'
                  }}
                >
                  <option value="English">English</option>
                  <option value="Hindi">हिन्दी (Hindi)</option>
                  <option value="Rajasthani">राजस्थानी (Rajasthani)</option>
                </select>
              </div>
            </div>

            {/* Chat Input Bar */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              backgroundColor: '#e0f2fe',
              borderRadius: '9999px',
              padding: '4px 6px 4px 16px',
              border: '1px solid #bae6fd'
            }}>
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyDown={handleInputKeyDown}
                placeholder="Enter your Text...."
                style={{
                  flex: 1,
                  border: 'none',
                  outline: 'none',
                  background: 'transparent',
                  fontSize: '0.88rem',
                  color: '#0f172a',
                  padding: '7px 0'
                }}
              />
              <button
                onClick={toggleMic}
                style={{
                  background: isListening ? '#fee2e2' : 'transparent',
                  border: 'none',
                  borderRadius: '50%',
                  width: '36px',
                  height: '36px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: isListening ? '#ef4444' : '#0284c7',
                  cursor: 'pointer',
                  marginRight: '2px'
                }}
                title={isListening ? "Listening..." : "Voice Input"}
              >
                <Mic size={19} />
              </button>
              <button
                onClick={() => handleSendQuery()}
                style={{
                  background: '#38bdf8',
                  border: 'none',
                  borderRadius: '50%',
                  width: '36px',
                  height: '36px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#fff',
                  cursor: 'pointer',
                  boxShadow: '0 2px 6px rgba(56, 189, 248, 0.4)'
                }}
                title="Send"
              >
                <Send size={18} style={{ transform: 'rotate(-30deg) translate(1px, -1px)' }} />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatbotWidget;
