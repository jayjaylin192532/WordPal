import React, { useState } from 'react';
import { X, Plus, Trash2, AlertTriangle, Tag } from 'lucide-react';

/**
 * TagManager Component for editing the list of custom tags.
 * @param {boolean} isOpen - Whether open
 * @param {Function} onClose - Close callback
 * @param {Array} tags - Current list of tags (strings)
 * @param {Function} onAddTag - Callback when adding a tag: onAddTag(newTag)
 * @param {Function} onDeleteTag - Callback when deleting a tag: onDeleteTag(tagToDelete)
 */
export default function TagManager({ 
  isOpen, 
  onClose, 
  tags = [], 
  onAddTag, 
  onDeleteTag 
}) {
  const [newTag, setNewTag] = useState('');
  const [error, setError] = useState('');
  const [tagToDelete, setTagToDelete] = useState(null); // Track tag awaiting deletion confirmation

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    
    const trimmed = newTag.trim();
    if (!trimmed) {
      setError('標籤名稱不能是空的喔！🏷️');
      return;
    }
    
    if (tags.includes(trimmed)) {
      setError('這個標籤已經存在囉！⭐');
      return;
    }
    
    if (trimmed.length > 15) {
      setError('標籤名稱太長了，請控制在 15 個字以內喔！✍️');
      return;
    }

    onAddTag(trimmed);
    setNewTag('');
  };

  const confirmDelete = (tag) => {
    setTagToDelete(tag);
  };

  const executeDelete = () => {
    if (tagToDelete) {
      onDeleteTag(tagToDelete);
      setTagToDelete(null);
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
      <div className="bg-white rounded-3xl w-full max-w-sm border border-[#E5D4C0] shadow-[0_12px_40px_rgba(78,54,41,0.1)] relative overflow-hidden animate-pop-in z-10 flex flex-col max-h-[80vh]">
        
        {/* Top border decor */}
        <div className="bg-gradient-to-r from-accent to-primary h-2 w-full" />

        {/* Close button */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-primary-light/50 text-primary-dark/60 hover:text-primary-dark hover:scale-105 spring-transition"
          type="button"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="p-6 flex flex-col space-y-4 overflow-y-auto scroller">
          {/* Header */}
          <div className="flex items-center space-x-2.5 pb-2 border-b border-[#E5D4C0]/40">
            <div className="p-2 bg-accent/20 text-accent rounded-xl">
              <Tag className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-black text-primary-dark">自訂標籤管理</h2>
              <p className="text-[10px] font-bold text-primary-dark/50">替你的英文單字分類包裝！</p>
            </div>
          </div>

          {/* Add Tag Form */}
          <form onSubmit={handleSubmit} className="flex flex-col space-y-1.5">
            <div className="flex space-x-2">
              <input 
                type="text" 
                placeholder="例如: 動物 🐶 或 天氣 ☀️"
                value={newTag}
                onChange={(e) => { setNewTag(e.target.value); setError(''); }}
                className="flex-1 px-3 py-2 rounded-xl border border-[#E5D4C0] focus:border-accent focus:outline-none font-bold text-xs spring-transition bg-bg-alice/40"
                autoFocus
              />
              <button 
                type="submit"
                className="px-4 rounded-xl bg-accent text-white font-black text-xs hover:bg-accent/90 hover:scale-105 active:scale-95 spring-transition flex items-center justify-center shrink-0"
              >
                <Plus className="w-4 h-4 mr-1" /> 新增
              </button>
            </div>
            {error && (
              <p className="text-xs text-red-500 font-bold px-1 animate-bounce-subtle">{error}</p>
            )}
          </form>

          {/* Tags List */}
          <div className="flex flex-col space-y-2 max-h-[40vh] overflow-y-auto scroller pr-1">
            <p className="text-xs font-bold text-primary-dark/60">所有標籤清單：</p>
            {tags.length > 0 ? (
              tags.map((tag) => (
                <div 
                  key={tag} 
                  className="flex items-center justify-between p-2.5 rounded-xl bg-white border border-[#E5D4C0] hover:border-accent/40 transition-colors duration-200"
                >
                  <span className="text-xs font-bold text-primary-dark">{tag}</span>
                  <button 
                    type="button"
                    onClick={() => confirmDelete(tag)}
                    className="p-1.5 rounded-lg text-red-500 hover:bg-red-50 hover:scale-105 spring-transition"
                    title="刪除標籤"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))
            ) : (
              <p className="text-xs text-primary-dark/40 text-center py-6 italic">目前沒有任何標籤，快來新增一個吧！</p>
            )}
          </div>
        </div>

        {/* Delete Confirmation Alert Overlay */}
        {tagToDelete && (
          <div className="absolute inset-0 bg-[#FAF6F0]/98 z-20 flex flex-col items-center justify-center p-6 text-center animate-pop-in">
            <div className="p-3 bg-red-100 text-red-500 rounded-full mb-3">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <h3 className="text-sm font-black text-primary-dark mb-1">確定要刪除標籤「{tagToDelete}」嗎？</h3>
            <p className="text-[10px] text-primary-dark/60 mb-4 px-2 leading-relaxed">
              這會把所有單字卡片中的這個標籤移除喔！但不會刪除單字本身。
            </p>
            <div className="flex space-x-3 w-full max-w-[200px]">
              <button 
                onClick={executeDelete}
                className="flex-1 py-2 rounded-xl bg-red-500 text-white font-black text-xs hover:bg-red-600 hover:scale-105 spring-transition"
              >
                刪除
              </button>
              <button 
                onClick={() => setTagToDelete(null)}
                className="flex-1 py-2 rounded-xl bg-gray-200 text-primary-dark font-black text-xs hover:bg-gray-300 hover:scale-105 spring-transition"
              >
                取消
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
