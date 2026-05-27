import React, { useState } from 'react';
import { Volume2, Edit3, Trash2, Check, X, Calendar } from 'lucide-react';

/**
 * WordCard Component for rendering an individual English word card.
 * @param {Object} word - The word object containing english, chinese, tags, createdAt
 * @param {Array} tagsList - List of all tags to determine chip color index
 * @param {Function} onEdit - Callback when editing the word
 * @param {Function} onDelete - Callback when deleting the word
 */
export default function WordCard({ word, tagsList = [], onEdit, onDelete }) {
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isSpeakingSentence, setIsSpeakingSentence] = useState(false);

  // Play pronunciation using Web Speech API
  const handleSpeak = (e) => {
    e.stopPropagation();
    if ('speechSynthesis' in window) {
      // Cancel previous speech if any
      window.speechSynthesis.cancel();
      
      // Delay speech activation by 50ms to ensure the browser's speech engine clears its queue
      setTimeout(() => {
        const utterance = new SpeechSynthesisUtterance(word.english);
        
        // Get all available system voices
        const voices = window.speechSynthesis.getVoices();
        
        // Filter out only US English voices
        const usVoices = voices.filter(v => v.lang.toLowerCase().replace('_', '-').includes('en-us'));
        
        // Prioritize high-quality standard American voices (Google, Samantha, premium voices)
        const preferredUSKeywords = ['google', 'samantha', 'natural', 'david', 'zira', 'karen', 'premium'];
        let bestVoice = null;
        
        for (const keyword of preferredUSKeywords) {
          bestVoice = usVoices.find(v => v.name.toLowerCase().includes(keyword));
          if (bestVoice) break;
        }
        
        // Fallback to any en-US voice
        if (!bestVoice && usVoices.length > 0) {
          bestVoice = usVoices[0];
        }
        
        // If we found a specific US English voice, apply it
        if (bestVoice) {
          utterance.voice = bestVoice;
        }
        
        utterance.lang = 'en-US';
        utterance.rate = 0.82; // Slightly slower for kids to hear clearly
        
        utterance.onstart = () => setIsSpeaking(true);
        utterance.onend = () => setIsSpeaking(false);
        utterance.onerror = () => setIsSpeaking(false);
        
        window.speechSynthesis.speak(utterance);
      }, 50);
    } else {
      alert('抱歉，您的瀏覽器不支援語音播放功能！');
    }
  };

  // Play sentence pronunciation
  const handleSpeakSentence = (e) => {
    e.stopPropagation();
    if ('speechSynthesis' in window && word.sentence) {
      window.speechSynthesis.cancel();
      
      // Delay speech activation by 50ms to ensure the browser's speech engine clears its queue
      setTimeout(() => {
        const utterance = new SpeechSynthesisUtterance(word.sentence);
        
        const voices = window.speechSynthesis.getVoices();
        const usVoices = voices.filter(v => v.lang.toLowerCase().replace('_', '-').includes('en-us'));
        
        const preferredUSKeywords = ['google', 'samantha', 'natural', 'david', 'zira', 'karen', 'premium'];
        let bestVoice = null;
        for (const keyword of preferredUSKeywords) {
          bestVoice = usVoices.find(v => v.name.toLowerCase().includes(keyword));
          if (bestVoice) break;
        }
        
        if (!bestVoice && usVoices.length > 0) {
          bestVoice = usVoices[0];
        }
        
        if (bestVoice) {
          utterance.voice = bestVoice;
        }
        
        utterance.lang = 'en-US';
        utterance.rate = 0.85; // Normal US rate, slightly slower
        
        utterance.onstart = () => setIsSpeakingSentence(true);
        utterance.onend = () => setIsSpeakingSentence(false);
        utterance.onerror = () => setIsSpeakingSentence(false);
        
        window.speechSynthesis.speak(utterance);
      }, 50);
    }
  };

  // Helper to map tags to specific Stitch-inspired styles
  const getTagStyle = (tag) => {
    // 5 cute colors from PRD
    const colors = [
      { bg: 'bg-[#FAF0D7] text-[#8C6D23] border-[#EAD2AC]' },
      { bg: 'bg-[#FFD3D3] text-[#A64B4B] border-[#FFB3B3]' },
      { bg: 'bg-[#D6E6F2] text-[#3D5B75] border-[#B9D7EA]' },
      { bg: 'bg-[#E4ECE4] text-[#4E684E] border-[#C2D4C2]' },
      { bg: 'bg-[#E8DDF2] text-[#684E85] border-[#D4C2E4]' }
    ];
    
    // Find index or use string hashing
    const index = tagsList.indexOf(tag);
    const color = index !== -1 
      ? colors[index % colors.length] 
      : colors[Math.abs(tag.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)) % colors.length];
      
    return `${color.bg} border`;
  };

  // Format Date
  const formatDate = (isoString) => {
    if (!isoString) return '';
    const date = new Date(isoString);
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
  };

  return (
    <div className="relative bg-white/80 rounded-2xl p-5 border border-[#E5D4C0] shadow-[0_4px_12px_rgba(78,54,41,0.02)] hover:-translate-y-1 hover:shadow-[0_8px_20px_rgba(78,54,41,0.06)] hover:border-primary spring-transition group overflow-hidden animate-pop-in">
      
      {/* Top Section: Action Buttons */}
      <div className="absolute top-3 right-3 flex items-center space-x-1.5 opacity-0 group-hover:opacity-100 focus-within:opacity-100 transition-opacity duration-300">
        <button 
          onClick={(e) => { e.stopPropagation(); onEdit(word); }}
          className="p-1.5 rounded-lg bg-primary-light/50 text-primary-dark hover:bg-primary hover:text-white hover:scale-105 spring-transition"
          title={word.type === 'sentence' ? '編輯句子' : '編輯單字'}
        >
          <Edit3 className="w-3.5 h-3.5" />
        </button>
        <button 
          onClick={(e) => { e.stopPropagation(); setShowConfirmDelete(true); }}
          className="p-1.5 rounded-lg bg-red-50 text-red-500 hover:bg-red-500 hover:text-white hover:scale-105 spring-transition"
          title={word.type === 'sentence' ? '刪除句子' : '刪除單字'}
        >
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Delete Confirmation Overlay (Cute and Inline) */}
      {showConfirmDelete && (
        <div className="absolute inset-0 bg-[#FAF6F0]/98 z-10 flex flex-col items-center justify-center p-4 text-center animate-pop-in">
          <p className="text-xs font-bold text-primary-dark mb-3">要跟這個{word.type === 'sentence' ? '句子' : '單字'}說拜拜嗎？🧹</p>
          <div className="flex space-x-3">
            <button 
              onClick={(e) => { e.stopPropagation(); onDelete(word.id); setShowConfirmDelete(false); }}
              className="px-3.5 py-1.5 rounded-xl bg-red-500 text-white font-bold text-[10px] hover:bg-red-600 hover:scale-105 spring-transition flex items-center"
            >
              <Check className="w-3 h-3 mr-1" /> 刪除
            </button>
            <button 
              onClick={(e) => { e.stopPropagation(); setShowConfirmDelete(false); }}
              className="px-3.5 py-1.5 rounded-xl bg-gray-200 text-primary-dark font-bold text-[10px] hover:bg-gray-300 hover:scale-105 spring-transition flex items-center"
            >
              <X className="w-3 h-3 mr-1" /> 取消
            </button>
          </div>
        </div>
      )}

      {/* Content Section */}
      <div className="flex flex-col h-full justify-between space-y-4">
        
        {word.type === 'sentence' ? (
          /* Standalone Sentence Render */
          <div className="flex flex-col space-y-2 pr-14">
            <div className="bg-primary-light/45 rounded-xl p-3 border border-[#E5D4C0]/50 text-xs flex flex-col space-y-1 my-0.5">
              <div className="flex items-start justify-between space-x-2">
                <span className="font-extrabold text-primary-dark tracking-tight italic leading-relaxed break-words flex-1 text-sm">
                  "{word.english}"
                </span>
                <button 
                  onClick={handleSpeak}
                  className={`p-1.5 rounded-full border border-primary-dark/10 bg-white text-primary-dark hover:bg-accent hover:text-white hover:scale-105 active:scale-95 spring-transition shrink-0 ${isSpeaking ? 'animate-bounce-subtle bg-accent text-white border-accent' : ''}`}
                  title="播放句子發音"
                >
                  <Volume2 className="w-3.5 h-3.5" />
                </button>
              </div>
              <p className="text-xs font-bold text-primary-dark/60 break-all leading-snug">
                {word.chinese}
              </p>
            </div>
          </div>
        ) : (
          /* Standard Word Render */
          <>
            <div className="flex flex-col space-y-1 pr-14">
              <div className="flex items-center space-x-2">
                <h3 className="text-xl font-extrabold text-primary-dark tracking-tight break-all">
                  {word.english}
                </h3>
                <button 
                  onClick={handleSpeak}
                  className={`p-1.5 rounded-full border border-primary-dark/10 bg-primary-light/45 text-primary-dark hover:bg-accent hover:text-white hover:scale-105 active:scale-95 spring-transition shrink-0 ${isSpeaking ? 'animate-bounce-subtle bg-accent text-white border-accent' : ''}`}
                  title="點擊發音"
                >
                  <Volume2 className="w-3.5 h-3.5" />
                </button>
              </div>
              <p className="text-sm font-bold text-primary-dark/60 break-all leading-snug">
                {word.chinese}
              </p>
            </div>

            {/* Example Sentence Section */}
            {word.sentence && (
              <div className="bg-[#FAF6F0]/65 rounded-xl p-3 border border-[#E5D4C0]/40 text-xs flex flex-col space-y-1 my-0.5 animate-pop-in">
                <div className="flex items-start justify-between space-x-2">
                  <span className="font-bold text-primary-dark/80 italic leading-relaxed break-words flex-1">
                    "{word.sentence}"
                  </span>
                  <button
                    onClick={(e) => handleSpeakSentence(e)}
                    className={`p-1 rounded-full border border-primary-dark/10 bg-white text-primary-dark hover:bg-accent hover:text-white spring-transition shrink-0 ${isSpeakingSentence ? 'animate-bounce-subtle bg-accent text-white border-accent' : ''}`}
                    title="播放例句發音"
                  >
                    <Volume2 className="w-3 h-3" />
                  </button>
                </div>
                {word.sentenceChinese && (
                  <span className="font-bold text-primary-dark/50 text-[10px] leading-relaxed break-all">
                    {word.sentenceChinese}
                  </span>
                )}
              </div>
            )}
          </>
        )}

        {/* Bottom Section: Tags & Date */}
        <div className="flex flex-col space-y-2 mt-auto">
          {/* Tags list */}
          <div className="flex flex-wrap gap-1.5">
            {word.tags && word.tags.length > 0 ? (
              word.tags.map((tag) => (
                <span 
                  key={tag} 
                  className={`px-2 py-0.5 rounded-md text-[10px] font-bold transition-all duration-300 ${getTagStyle(tag)}`}
                >
                  {tag}
                </span>
              ))
            ) : (
              <span className="text-[10px] text-primary-dark/30 italic">未分類</span>
            )}
          </div>

          {/* Date info */}
          <div className="flex items-center text-[9px] font-bold text-primary-dark/40 border-t border-[#E5D4C0]/50 pt-2">
            <Calendar className="w-3 h-3 mr-1" />
            <span>記錄於 {formatDate(word.createdAt)}</span>
          </div>
        </div>

      </div>
    </div>
  );
}
