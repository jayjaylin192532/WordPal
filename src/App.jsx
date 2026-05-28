import React, { useState, useEffect } from 'react';
import { Plus, Search, Tag, Sparkles, BookOpen, GraduationCap, X } from 'lucide-react';
import confetti from 'canvas-confetti';

// Hooks
import { useLocalStorage } from './hooks/useLocalStorage';

// Components
import Mascot from './components/Mascot';
import Stats from './components/Stats';
import WordCard from './components/WordCard';
import WordModal from './components/WordModal';
import TagManager from './components/TagManager';

const DEFAULT_TAGS = ['動物 🐶', '食物 🍔', '學科 📚', '日常 🎒', '運動 ⚽️'];

export default function App() {
  const [words, setWords] = useLocalStorage('wordpal_words', []);
  const [tags, setTags] = useLocalStorage('wordpal_tags', DEFAULT_TAGS);

  // Warm up SpeechSynthesis voices on mount to prevent the first-time silent/broken voice issue
  useEffect(() => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.getVoices();
      const handleVoicesChanged = () => {
        window.speechSynthesis.getVoices();
      };
      window.speechSynthesis.addEventListener('voiceschanged', handleVoicesChanged);
      return () => {
        window.speechSynthesis.removeEventListener('voiceschanged', handleVoicesChanged);
      };
    }
  }, []);
  
  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTag, setSelectedTag] = useState('');
  const [filterType, setFilterType] = useState('all'); // 'all' | 'word' | 'sentence'
  
  // Modal States
  const [isWordModalOpen, setIsWordModalOpen] = useState(false);
  const [isTagModalOpen, setIsTagModalOpen] = useState(false);
  const [wordToEdit, setWordToEdit] = useState(null);
  const [defaultModalType, setDefaultModalType] = useState('word'); // 'word' | 'sentence'
  const [openFabMenu, setOpenFabMenu] = useState(false);

  // Trigger celebration confetti
  const triggerConfetti = () => {
    confetti({
      particleCount: 80,
      spread: 60,
      colors: ['#2E86DE', '#AED6F1', '#E84393', '#FDCB6E', '#00B894'],
      origin: { y: 0.7 }
    });
  };

  // Add or Update Word
  const handleSaveWord = (wordData) => {
    const now = new Date().toISOString();
    
    if (wordToEdit) {
      // Edit mode
      setWords((prevWords) => 
        prevWords.map((w) => 
          w.id === wordToEdit.id 
            ? { ...w, ...wordData, updatedAt: now } 
            : w
        )
      );
    } else {
      // Add mode
      const newWord = {
        id: crypto.randomUUID(),
        ...wordData,
        createdAt: now,
        updatedAt: now
      };
      setWords((prevWords) => [newWord, ...prevWords]);
      
      // Celebrate
      triggerConfetti();
    }
    
    setIsWordModalOpen(false);
    setWordToEdit(null);
  };

  // Delete Word
  const handleDeleteWord = (id) => {
    setWords((prevWords) => prevWords.filter((w) => w.id !== id));
  };

  // Start Edit Word flow
  const handleStartEdit = (word) => {
    setWordToEdit(word);
    setDefaultModalType(word.type || 'word');
    setIsWordModalOpen(true);
  };

  // Start Add Word flow
  const handleStartAdd = (type = 'word') => {
    setDefaultModalType(type);
    setWordToEdit(null);
    setIsWordModalOpen(true);
  };

  // Tag Management
  const handleAddTag = (newTag) => {
    setTags((prevTags) => [...prevTags, newTag]);
  };

  const handleDeleteTag = (tagToDelete) => {
    // 1. Remove from tags list
    setTags((prevTags) => prevTags.filter((t) => t !== tagToDelete));
    // 2. Remove tag association from all words
    setWords((prevWords) => 
      prevWords.map((w) => ({
        ...w,
        tags: w.tags ? w.tags.filter((t) => t !== tagToDelete) : []
      }))
    );
    // 3. Clear selected tag filter if it was the deleted one
    if (selectedTag === tagToDelete) {
      setSelectedTag('');
    }
  };

  // Filtering Logic
  const filteredWords = words.filter((word) => {
    const matchesType = 
      filterType === 'all' || 
      (filterType === 'word' && (word.type || 'word') === 'word') || 
      (filterType === 'sentence' && word.type === 'sentence');

    const matchesSearch = 
      word.english.toLowerCase().includes(searchQuery.toLowerCase()) ||
      word.chinese.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (word.sentence && word.sentence.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (word.sentenceChinese && word.sentenceChinese.toLowerCase().includes(searchQuery.toLowerCase()));
      
    const matchesTag = selectedTag === '' || (word.tags && word.tags.includes(selectedTag));
    
    return matchesType && matchesSearch && matchesTag;
  });

  // Decide Mascot mood for the home dashboard
  const getHomeMascotMood = () => {
    if (words.length === 0) return 'empty';
    if (searchQuery !== '' && filteredWords.length === 0) return 'thinking';
    if (searchQuery !== '') return 'thinking';
    if (filteredWords.length > 0) return 'wave';
    return 'happy';
  };

  return (
    <div className="min-h-screen pb-20 flex flex-col font-sans">
      
      {/* Header Area */}
      <header className="bg-white/90 backdrop-blur-sm border-b border-[#E5D4C0]/50 sticky top-0 z-40 shadow-[0_2px_8px_rgba(78,54,41,0.02)]">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          {/* Logo & Name */}
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => { setSearchQuery(''); setSelectedTag(''); }}>
            <Mascot mood={getHomeMascotMood()} size={55} className="shrink-0" />
            <div>
              <h1 className="text-2xl font-black tracking-tight text-stitch-blue m-0 flex items-center">
                WordPal
                <Sparkles className="w-5 h-5 ml-1 text-stitch-blue fill-stitch-blue/20 animate-bounce-subtle" />
              </h1>
              <p className="text-[10px] font-extrabold text-stitch-blue/80 uppercase tracking-widest hidden sm:block">
                我的英語學習小夥伴
              </p>
            </div>
          </div>

          {/* Tag & App actions */}
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setIsTagModalOpen(true)}
              className="px-3 py-2 sm:px-3.5 sm:py-2.5 rounded-xl border border-[#E5D4C0] hover:border-accent text-primary-dark font-bold text-xs hover:scale-103 active:scale-97 spring-transition flex items-center bg-white/50"
              title="分類管理"
            >
              <Tag className="w-3.5 h-3.5 mr-1 text-accent" />
              <span className="hidden md:inline">分類管理</span>
              <span className="md:hidden">分類</span>
            </button>
            
            <button
              onClick={() => handleStartAdd('word')}
              className="px-3 py-2 sm:px-4 sm:py-2.5 rounded-xl bg-accent text-white font-bold text-xs shadow-sm hover:brightness-105 hover:scale-103 active:scale-97 spring-transition flex items-center"
            >
              <Plus className="w-3 h-3 mr-1" />
              新增單字
            </button>

            <button
              onClick={() => handleStartAdd('sentence')}
              className="px-3 py-2 sm:px-4 sm:py-2.5 rounded-xl bg-success text-white font-bold text-xs shadow-sm hover:brightness-105 hover:scale-103 active:scale-97 spring-transition flex items-center border border-success/20"
            >
              <Plus className="w-3 h-3 mr-1" />
              新增句子
            </button>
          </div>
        </div>
      </header>

      {/* Main Section */}
      <main className="max-w-6xl mx-auto px-4 pt-6 space-y-6 w-full">
        
        {/* Stats Dashboard */}
        <Stats 
          words={words} 
          tags={tags} 
          selectedTag={selectedTag} 
          onSelectTag={setSelectedTag} 
        />

        {/* Search & Tags Filter Block */}
        <section className="bg-white/80 rounded-3xl p-5 border border-[#E5D4C0] shadow-[0_4px_15px_rgba(78,54,41,0.02)] space-y-4">
          {/* Search bar */}
          <div className="relative w-full">
            <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-primary-dark/40" />
            <input 
              type="text"
              placeholder="搜尋你收集過的英文單字、句子或中文翻譯... 🔍"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-10 py-3 rounded-2xl border border-[#E5D4C0] focus:border-accent focus:outline-none font-bold text-sm bg-bg-alice/40 spring-transition"
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-primary-dark/40 hover:text-primary-dark hover:scale-105"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>

          {/* Type Filter Tabs */}
          <div className="flex flex-col space-y-2 border-b border-[#E5D4C0]/40 pb-3">
            <span className="text-[11px] font-bold text-primary-dark/50 flex items-center">
              <BookOpen className="w-3.5 h-3.5 mr-1 text-accent" /> 顯示類型：
            </span>
            <div className="flex bg-[#E5D4C0]/25 p-1 rounded-xl w-fit">
              <button
                type="button"
                onClick={() => setFilterType('all')}
                className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all duration-200 ${filterType === 'all' ? 'bg-white shadow-sm font-black text-primary-dark' : 'text-primary-dark/60 hover:text-primary-dark'}`}
              >
                🎒 全部 ({words.length})
              </button>
              <button
                type="button"
                onClick={() => setFilterType('word')}
                className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all duration-200 ${filterType === 'word' ? 'bg-white shadow-sm font-black text-primary-dark' : 'text-primary-dark/60 hover:text-primary-dark'}`}
              >
                📝 英文單字 ({words.filter(w => (w.type || 'word') === 'word').length})
              </button>
              <button
                type="button"
                onClick={() => setFilterType('sentence')}
                className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all duration-200 ${filterType === 'sentence' ? 'bg-white shadow-sm font-black text-primary-dark' : 'text-primary-dark/60 hover:text-primary-dark'}`}
              >
                💬 英文句子 ({words.filter(w => w.type === 'sentence').length})
              </button>
            </div>
          </div>

          {/* Tags Chips list */}
          <div className="flex flex-col space-y-2">
            <span className="text-[11px] font-bold text-primary-dark/50 flex items-center">
              <Tag className="w-3.5 h-3.5 mr-1 text-accent" /> 按分類篩選：
            </span>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setSelectedTag('')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold spring-transition border ${
                  selectedTag === ''
                    ? 'bg-accent border-accent text-white scale-103'
                    : 'bg-bg-alice/60 border-[#E5D4C0] text-primary-dark hover:border-accent'
                }`}
              >
                全部內容 ({words.length})
              </button>
              {tags.map((tag) => {
                const count = words.filter(w => w.tags && w.tags.includes(tag)).length;
                return (
                  <button
                    key={tag}
                    onClick={() => setSelectedTag(selectedTag === tag ? '' : tag)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold spring-transition border ${
                      selectedTag === tag
                        ? 'bg-accent border-accent text-white scale-103'
                        : 'bg-bg-alice/60 border-[#E5D4C0] text-primary-dark hover:border-accent'
                    }`}
                  >
                    {tag} ({count})
                  </button>
                );
              })}
            </div>
          </div>
        </section>

        {/* Word Cards Grid */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-black text-primary-dark flex items-center">
              <GraduationCap className="w-5 h-5 mr-1.5 text-accent" />
              {selectedTag 
                ? (filterType === 'word' ? `「${selectedTag}」分類的單字` : filterType === 'sentence' ? `「${selectedTag}」分類的句子` : `「${selectedTag}」分類的內容`)
                : (filterType === 'word' ? '我的單字寶庫' : filterType === 'sentence' ? '我的精選句子' : '我的學習寶庫')}
              <span className="ml-2 text-[10px] font-bold text-[#E58F8F] bg-primary-light/50 px-2 py-0.5 rounded">
                {filteredWords.length} 個
              </span>
            </h2>
          </div>

          {/* Check empty state */}
          {filteredWords.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 px-4 bg-white/60 rounded-3xl border border-dashed border-[#E5D4C0] text-center space-y-4 animate-pop-in">
              <Mascot mood={words.length === 0 ? 'empty' : 'thinking'} size={130} className="animate-float" />
              <div>
                <h3 className="text-lg font-black text-primary-dark">
                  {words.length === 0 ? '學習寶箱空空如也！✨' : '找不到對應的內容呢… 🔍'}
                </h3>
                <p className="text-xs font-bold text-primary-dark/50 mt-1 max-w-xs mx-auto">
                  {words.length === 0 
                    ? '快點擊按鈕，把學到的新單字或句子放進你的專屬寶箱吧！' 
                    : '要不要更換搜尋關鍵字，或者清除篩選條件？'}
                </p>
              </div>
              {words.length === 0 ? (
                <div className="flex flex-col sm:flex-row gap-3">
                  <button
                    onClick={() => handleStartAdd('word')}
                    className="px-5 py-2.5 rounded-xl bg-accent text-white font-bold text-xs shadow-sm hover:scale-103 active:scale-97 spring-transition flex items-center justify-center"
                  >
                    <Plus className="w-4 h-4 mr-1" />
                    收集第一個單字
                  </button>
                  <button
                    onClick={() => handleStartAdd('sentence')}
                    className="px-5 py-2.5 rounded-xl bg-success text-white font-bold text-xs shadow-sm hover:scale-103 active:scale-97 spring-transition flex items-center justify-center border border-success/20"
                  >
                    <Plus className="w-4 h-4 mr-1" />
                    收集第一個句子
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => { setSearchQuery(''); setSelectedTag(''); setFilterType('all'); }}
                  className="px-4 py-2 rounded-xl border border-[#E5D4C0] hover:border-accent text-primary-dark font-bold text-[10px] hover:scale-103 spring-transition"
                >
                  清除所有篩選條件
                </button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredWords.map((word) => (
                <WordCard 
                  key={word.id} 
                  word={word} 
                  tagsList={tags}
                  onEdit={handleStartEdit} 
                  onDelete={handleDeleteWord} 
                />
              ))}
            </div>
          )}
        </section>

      </main>

      {/* Floating Action Button (FAB) Speed Dial */}
      {words.length > 0 && (
        <div className="fixed bottom-6 right-6 flex flex-col items-center space-y-2.5 z-30">
          {/* Add Word FAB */}
          <button
            onClick={() => { handleStartAdd('word'); setOpenFabMenu(false); }}
            className={`w-10 h-10 rounded-full bg-accent text-white shadow-md hover:scale-110 active:scale-90 spring-transition flex items-center justify-center font-bold text-xs ${openFabMenu ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-10 scale-0 pointer-events-none'}`}
            title="新增單字"
          >
            📝
          </button>
          
          {/* Add Sentence FAB */}
          <button
            onClick={() => { handleStartAdd('sentence'); setOpenFabMenu(false); }}
            className={`w-10 h-10 rounded-full bg-success text-white shadow-md hover:scale-110 active:scale-90 spring-transition flex items-center justify-center font-bold text-xs ${openFabMenu ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-10 scale-0 pointer-events-none'}`}
            title="新增句子"
          >
            💬
          </button>
          
          {/* Main Toggle FAB */}
          <button
            onClick={() => setOpenFabMenu(!openFabMenu)}
            className={`w-12 h-12 rounded-full shadow-lg hover:scale-105 active:scale-95 spring-transition flex items-center justify-center text-white ${openFabMenu ? 'bg-primary-dark rotate-45' : 'bg-accent hover:brightness-105'}`}
            title="新增項目"
          >
            <Plus className="w-6 h-6 spring-transition" />
          </button>
        </div>
      )}

      {/* Word Add/Edit Modal */}
      <WordModal 
        isOpen={isWordModalOpen}
        onClose={() => { setIsWordModalOpen(false); setWordToEdit(null); }}
        wordToEdit={wordToEdit}
        existingWords={words}
        availableTags={tags}
        onSave={handleSaveWord}
        defaultType={defaultModalType}
      />

      {/* Tag Manager Modal */}
      <TagManager 
        isOpen={isTagModalOpen}
        onClose={() => setIsTagModalOpen(false)}
        tags={tags}
        onAddTag={handleAddTag}
        onDeleteTag={handleDeleteTag}
      />

    </div>
  );
}
