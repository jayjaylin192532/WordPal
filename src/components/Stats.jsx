import React from 'react';
import { BookOpen, Calendar, Award, Tag } from 'lucide-react';

/**
 * Stats Dashboard Component
 * @param {Array} words - Array of word objects
 * @param {Array} tags - Array of all tags
 * @param {string} selectedTag - Currently filtered tag
 * @param {Function} onSelectTag - Function to change tag filter
 */
export default function Stats({ words = [], tags = [], selectedTag = '', onSelectTag }) {
  const totalCount = words.length;
  const wordCount = words.filter(w => (w.type || 'word') === 'word').length;
  const sentenceCount = words.filter(w => w.type === 'sentence').length;

  // Calculate new words this week
  const oneWeekAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
  const newThisWeekList = words.filter(
    (w) => new Date(w.createdAt).getTime() > oneWeekAgo
  );
  const newThisWeek = newThisWeekList.length;
  const newWordsThisWeek = newThisWeekList.filter(w => (w.type || 'word') === 'word').length;
  const newSentencesThisWeek = newThisWeekList.filter(w => w.type === 'sentence').length;

  // Calculate tag distribution
  const tagCounts = {};
  // Initialize all tags with 0
  tags.forEach(t => { tagCounts[t] = 0; });
  // Count
  words.forEach((w) => {
    if (w.tags && Array.isArray(w.tags)) {
      w.tags.forEach((tag) => {
        tagCounts[tag] = (tagCounts[tag] || 0) + 1;
      });
    }
  });

  // Sort tags by usage count
  const sortedTags = Object.entries(tagCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3); // Get top 3 tags

  // Most active tag
  const topTag = sortedTags.length > 0 && sortedTags[0][1] > 0 ? sortedTags[0][0] : '無';

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 w-full animate-pop-in">
      {/* Total Words Card */}
      <div 
        className="bg-white/80 rounded-2xl p-4 flex items-center space-x-4 border border-[#E5D4C0] shadow-[0_4px_12px_rgba(78,54,41,0.03)] hover:shadow-[0_6px_16px_rgba(78,54,41,0.06)] hover:border-primary spring-transition cursor-pointer group"
        onClick={() => onSelectTag('')}
      >
        <div className="p-3 rounded-xl bg-primary/20 text-accent group-hover:scale-105 spring-transition">
          <BookOpen className="w-5 h-5" />
        </div>
        <div>
          <p className="text-xs font-bold text-primary-dark/60">寶藏庫總量</p>
          <div className="flex items-baseline space-x-1">
            <span className="text-2xl font-black text-primary-dark">{totalCount}</span>
            <span className="text-[10px] font-bold text-primary-dark/50">個</span>
          </div>
          <p className="text-[10px] font-bold text-primary-dark/40 mt-0.5">
            📝 單字 {wordCount} / 💬 句子 {sentenceCount}
          </p>
        </div>
      </div>

      {/* New This Week Card */}
      <div className="bg-white/80 rounded-2xl p-4 flex items-center space-x-4 border border-[#E5D4C0] shadow-[0_4px_12px_rgba(78,54,41,0.03)] hover:shadow-[0_6px_16px_rgba(78,54,41,0.06)] hover:border-primary spring-transition group">
        <div className="p-3 rounded-xl bg-accent/20 text-accent group-hover:scale-105 spring-transition">
          <Calendar className="w-5 h-5" />
        </div>
        <div>
          <p className="text-xs font-bold text-primary-dark/60">本週新收集</p>
          <div className="flex items-baseline space-x-1">
            <span className="text-2xl font-black text-accent">{newThisWeek}</span>
            <span className="text-[10px] font-bold text-primary-dark/50">個</span>
          </div>
          <p className="text-[10px] font-bold text-accent/70 mt-0.5">
            📝 單字 {newWordsThisWeek} / 💬 句子 {newSentencesThisWeek}
          </p>
        </div>
      </div>

      {/* Top Category Card */}
      <div className="bg-white/80 rounded-2xl p-4 flex items-center space-x-4 border border-[#E5D4C0] shadow-[0_4px_12px_rgba(78,54,41,0.03)] hover:shadow-[0_6px_16px_rgba(78,54,41,0.06)] hover:border-primary spring-transition group">
        <div className="p-3 rounded-xl bg-success/20 text-success group-hover:scale-105 spring-transition">
          <Award className="w-5 h-5" />
        </div>
        <div>
          <p className="text-xs font-bold text-primary-dark/60">最愛類別</p>
          <span className="text-lg font-black text-primary-dark block truncate max-w-[140px]" title={topTag}>
            {topTag}
          </span>
        </div>
      </div>

      {/* Tags Progress Card */}
      <div className="bg-white/80 rounded-2xl p-4 border border-[#E5D4C0] shadow-[0_4px_12px_rgba(78,54,41,0.03)] hover:shadow-[0_6px_16px_rgba(78,54,41,0.06)] spring-transition flex flex-col justify-center">
        <p className="text-[11px] font-bold text-primary-dark/60 mb-2 flex items-center">
          <Tag className="w-3.5 h-3.5 mr-1 text-accent" />
          熱門分類排行
        </p>
        <div className="space-y-1">
          {sortedTags.length > 0 && sortedTags.some(([_, count]) => count > 0) ? (
            sortedTags.map(([tag, count]) => {
              const percentage = totalCount > 0 ? (count / totalCount) * 100 : 0;
              const isSelected = selectedTag === tag;
              return (
                <div 
                  key={tag} 
                  className={`flex flex-col text-[11px] cursor-pointer hover:opacity-80 p-0.5 rounded ${isSelected ? 'bg-primary-light/50 font-bold' : ''}`}
                  onClick={() => onSelectTag(isSelected ? '' : tag)}
                >
                  <div className="flex justify-between items-center mb-0.5">
                    <span className="text-primary-dark font-semibold truncate max-w-[100px]">{tag}</span>
                    <span className="text-primary-dark/60 font-bold">{count} 個</span>
                  </div>
                  <div className="w-full bg-[#E5D4C0]/40 h-1 rounded-full overflow-hidden">
                    <div 
                      className="bg-accent h-full rounded-full spring-transition" 
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              );
            })
          ) : (
            <p className="text-[11px] text-primary-dark/40 text-center py-1">尚未分類任何單字</p>
          )}
        </div>
      </div>
    </div>
  );
}
