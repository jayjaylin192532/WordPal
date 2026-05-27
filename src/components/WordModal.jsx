import React, { useState, useEffect } from 'react';
import { X, Sparkles, AlertCircle } from 'lucide-react';
import Mascot from './Mascot';

/**
 * WordModal Component for adding or editing words.
 * @param {boolean} isOpen - Whether the modal is open
 * @param {Function} onClose - Close callback
 * @param {Object} wordToEdit - Word object if editing, null if adding
 * @param {Array} existingWords - Array of all current words (for duplicate check)
 * @param {Array} availableTags - Array of all tags
 * @param {Function} onSave - Callback when saving the word: onSave(wordData)
 */
export default function WordModal({ 
  isOpen, 
  onClose, 
  wordToEdit = null, 
  existingWords = [], 
  availableTags = [], 
  onSave,
  defaultType = 'word'
}) {
  const [type, setType] = useState(defaultType); // 'word' | 'sentence'
  const [english, setEnglish] = useState('');
  const [chinese, setChinese] = useState('');
  const [sentence, setSentence] = useState('');
  const [sentenceChinese, setSentenceChinese] = useState('');
  const [selectedTags, setSelectedTags] = useState([]);
  const [error, setError] = useState('');
  const [mascotMood, setMascotMood] = useState('thinking');

  // Reset or fill form when modal opens or wordToEdit changes
  useEffect(() => {
    if (isOpen) {
      if (wordToEdit) {
        setType(wordToEdit.type || 'word');
        setEnglish(wordToEdit.english);
        setChinese(wordToEdit.chinese);
        setSentence(wordToEdit.sentence || '');
        setSentenceChinese(wordToEdit.sentenceChinese || '');
        setSelectedTags(wordToEdit.tags || []);
        setMascotMood('happy');
      } else {
        setType(defaultType);
        setEnglish('');
        setChinese('');
        setSentence('');
        setSentenceChinese('');
        setSelectedTags([]);
        setMascotMood('thinking');
      }
      setError('');
    }
  }, [isOpen, wordToEdit, defaultType]);

  // Dynamic mascot reaction based on inputs
  useEffect(() => {
    if (!isOpen) return;
    if (error) {
      setMascotMood('empty');
    } else if (english && chinese) {
      setMascotMood('celebrate');
    } else if (english || chinese) {
      setMascotMood('happy');
    } else {
      setMascotMood('thinking');
    }
  }, [english, chinese, error, isOpen]);

  if (!isOpen) return null;

  // Toggle tag selection
  const handleTagToggle = (tag) => {
    setSelectedTags(prev => 
      prev.includes(tag) 
        ? prev.filter(t => t !== tag) 
        : [...prev, tag]
    );
  };

  // Submit Handler
  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    const trimmedEnglish = english.trim();
    const trimmedChinese = chinese.trim();

    if (type === 'word') {
      if (!trimmedEnglish || !trimmedChinese) {
        setError('英文單字與中文翻譯都要填寫喔！✍️');
        return;
      }

      // Check for English characters only (allowing spaces/hyphens for phrases)
      const isEnglishOnly = /^[a-zA-Z\s\-]+$/.test(trimmedEnglish);
      if (!isEnglishOnly) {
        setError('英文單字只能輸入英文字母或空白喔！🔤');
        return;
      }

      // Duplicate Check
      const isDuplicate = existingWords.some(
        (w) => 
          (w.type || 'word') === 'word' &&
          w.english.toLowerCase() === trimmedEnglish.toLowerCase() && 
          (!wordToEdit || w.id !== wordToEdit.id)
      );

      if (isDuplicate) {
        setError('這個單字已經在你的單字本寶庫裡囉！🎒');
        return;
      }

      onSave({
        type: 'word',
        english: trimmedEnglish,
        chinese: trimmedChinese,
        sentence: sentence.trim(),
        sentenceChinese: sentenceChinese.trim(),
        tags: selectedTags,
      });
    } else {
      // Sentence type
      if (!trimmedEnglish || !trimmedChinese) {
        setError('英文句子與中文翻譯都要填寫喔！✍️');
        return;
      }

      // Duplicate Check for sentences
      const isDuplicate = existingWords.some(
        (w) => 
          w.type === 'sentence' &&
          w.english.toLowerCase() === trimmedEnglish.toLowerCase() && 
          (!wordToEdit || w.id !== wordToEdit.id)
      );

      if (isDuplicate) {
        setError('這個句子已經在你的單字本寶庫裡囉！🎒');
        return;
      }

      onSave({
        type: 'sentence',
        english: trimmedEnglish,
        chinese: trimmedChinese,
        sentence: '',
        sentenceChinese: '',
        tags: selectedTags,
      });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-[#4E3629]/30 backdrop-blur-[2px]"
        onClick={onClose}
      />
      
      {/* Modal Box */}
      <div className="bg-white rounded-3xl w-full max-w-md border border-[#E5D4C0] shadow-[0_12px_40px_rgba(78,54,41,0.1)] relative overflow-hidden animate-pop-in z-10 flex flex-col max-h-[90vh]">
        
        {/* Decorative Top Accent */}
        <div className="bg-gradient-to-r from-primary to-accent h-2 w-full" />
        
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-primary-light/50 text-primary-dark/60 hover:text-primary-dark hover:scale-105 spring-transition"
          type="button"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Scroll Content */}
        <form onSubmit={handleSubmit} className="p-6 flex flex-col space-y-5 overflow-y-auto scroller">
          
          {/* Header with Mascot */}
          <div className="flex items-center space-x-3.5 pb-2 border-b border-[#E5D4C0]/40">
            <Mascot mood={mascotMood} size={70} className="shrink-0" />
            <div>
              <h2 className="text-lg font-black text-primary-dark flex items-center">
                {wordToEdit 
                  ? (type === 'word' ? '修改單字寶藏' : '修改句子寶藏') 
                  : (type === 'word' ? '收集新單字！' : '收集新句子！')}
                <Sparkles className="w-4 h-4 ml-1 text-accent fill-accent animate-bounce-subtle" />
              </h2>
              <p className="text-xs font-bold text-primary-dark/50">
                {wordToEdit 
                  ? '幫你的學習紀錄重新整理一下吧！' 
                  : (type === 'word' ? '把學到的新字記下來，別忘記它囉！' : '把優美的英文句子記下來，多讀幾遍吧！')}
              </p>
            </div>
          </div>

          {/* Type Selector Tabs */}
          <div className="flex bg-[#E5D4C0]/35 p-1 rounded-xl">
            <button 
              type="button" 
              onClick={() => { setType('word'); setError(''); }}
              className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all duration-200 ${type === 'word' ? 'bg-white shadow-sm font-black text-primary-dark' : 'text-primary-dark/60'}`}
            >
              📝 英文單字
            </button>
            <button 
              type="button" 
              onClick={() => { setType('sentence'); setError(''); }}
              className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all duration-200 ${type === 'sentence' ? 'bg-white shadow-sm font-black text-primary-dark' : 'text-primary-dark/60'}`}
            >
              💬 英文句子
            </button>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 rounded-xl p-3 text-xs font-bold flex items-start space-x-2 animate-bounce-subtle">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-500 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {/* Form Fields */}
          <div className="space-y-4">
            {/* English Input */}
            <div className="flex flex-col space-y-1">
              <label htmlFor="english" className="text-xs font-black text-primary-dark">
                {type === 'word' ? '英文單字 (English)' : '英文句子 (English Sentence)'}
              </label>
              <input 
                id="english"
                type="text" 
                placeholder={type === 'word' ? '例如: apple' : '例如: An apple a day keeps the doctor away.'}
                value={english}
                onChange={(e) => { setEnglish(e.target.value); setError(''); }}
                className="px-4 py-2 rounded-xl border border-[#E5D4C0] focus:border-accent focus:outline-none font-bold text-base bg-bg-alice/40 spring-transition"
                autoComplete="off"
                autoFocus
              />
            </div>

            {/* Chinese Input */}
            <div className="flex flex-col space-y-1">
              <label htmlFor="chinese" className="text-xs font-black text-primary-dark">
                {type === 'word' ? '中文意思 (Chinese)' : '中文翻譯 (Chinese Translation)'}
              </label>
              <input 
                id="chinese"
                type="text" 
                placeholder={type === 'word' ? '例如: 蘋果' : '例如: 一天一蘋果，醫生遠離我。'}
                value={chinese}
                onChange={(e) => { setChinese(e.target.value); setError(''); }}
                className="px-4 py-2 rounded-xl border border-[#E5D4C0] focus:border-accent focus:outline-none font-bold text-base bg-bg-alice/40 spring-transition"
                autoComplete="off"
              />
            </div>

            {/* Example Sentence Inputs (Only show for type === 'word') */}
            {type === 'word' && (
              <>
                {/* Example Sentence Input */}
                <div className="flex flex-col space-y-1">
                  <label htmlFor="sentence" className="text-xs font-black text-primary-dark">
                    英文例句 (Example Sentence - 選填)
                  </label>
                  <textarea 
                    id="sentence"
                    rows="2"
                    placeholder="例如: An apple a day keeps the doctor away."
                    value={sentence}
                    onChange={(e) => { setSentence(e.target.value); setError(''); }}
                    className="px-4 py-2 rounded-xl border border-[#E5D4C0] focus:border-accent focus:outline-none font-bold text-xs bg-bg-alice/40 spring-transition resize-none scroller"
                    autoComplete="off"
                  />
                </div>

                {/* Sentence Chinese Input */}
                <div className="flex flex-col space-y-1">
                  <label htmlFor="sentenceChinese" className="text-xs font-black text-primary-dark">
                    例句中文翻譯 (選填)
                  </label>
                  <input 
                    id="sentenceChinese"
                    type="text" 
                    placeholder="例如: 一天一蘋果，醫生遠離我。"
                    value={sentenceChinese}
                    onChange={(e) => { setSentenceChinese(e.target.value); setError(''); }}
                    className="px-4 py-2 rounded-xl border border-[#E5D4C0] focus:border-accent focus:outline-none font-bold text-xs bg-bg-alice/40 spring-transition"
                    autoComplete="off"
                  />
                </div>
              </>
            )}

            {/* Tags Selection */}
            <div className="flex flex-col space-y-2">
              <label className="text-xs font-black text-primary-dark flex justify-between items-center">
                <span>選擇分類標籤 (可複選)</span>
                {availableTags.length === 0 && (
                  <span className="text-[10px] text-primary-dark/40 italic">可以在分類管理新增自訂標籤喔！</span>
                )}
              </label>
              <div className="flex flex-wrap gap-2 max-h-[140px] overflow-y-auto p-1.5 border border-[#E5D4C0] rounded-xl bg-bg-alice/20 scroller">
                {availableTags.map((tag) => {
                  const isSelected = selectedTags.includes(tag);
                  return (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => handleTagToggle(tag)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold spring-transition border ${
                        isSelected 
                          ? 'bg-accent border-accent text-white scale-105' 
                          : 'bg-primary-light/35 border-[#E5D4C0] text-primary-dark hover:border-accent'
                      }`}
                    >
                      {tag}
                    </button>
                  );
                })}
                {availableTags.length === 0 && (
                  <p className="text-xs text-primary-dark/40 text-center w-full py-3">目前沒有可用標籤</p>
                )}
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-3 pt-3 border-t border-[#E5D4C0]/40 mt-auto">
            <button 
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 rounded-xl bg-primary-light/50 hover:bg-primary-light text-primary-dark font-black text-xs hover:scale-103 active:scale-97 spring-transition"
            >
              取消
            </button>
            <button 
              type="submit"
              className={`flex-1 py-2.5 rounded-xl text-white font-black text-xs shadow-sm hover:scale-103 active:scale-97 spring-transition ${type === 'word' ? 'bg-accent hover:brightness-105' : 'bg-success hover:brightness-105'}`}
            >
              {wordToEdit ? '儲存修改' : (type === 'word' ? '儲存單字' : '儲存句子')}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}
