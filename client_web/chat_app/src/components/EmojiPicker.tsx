import React from 'react';

interface EmojiPickerProps {
  onSelectEmoji: (emoji: string) => void;
  onClose: () => void;
}

export const EmojiPicker: React.FC<EmojiPickerProps> = ({ onSelectEmoji, onClose }) => {
  const commonEmojis = [
    "😊", "😂", "❤️", "👍", "🎉", "🔥", "🤔", "😢",
    "👋", "🙏", "👀", "💯", "⭐", "✅", "🎁", "🚀",
    "😍", "😎", "😴", "🤗", "😱", "👏", "💪", "✨"
  ];

  const handleEmojiClick = (emoji: string) => {
    onSelectEmoji(emoji);
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-2 border border-gray-200">
      <div className="flex justify-between items-center mb-2 pb-1 border-b border-gray-200">
        <h3 className="text-sm font-medium text-gray-700">Emoji Picker</h3>
        <button 
          onClick={onClose}
          className="text-gray-400 hover:text-gray-600"
        >
          ✕
        </button>
      </div>
      <div className="grid grid-cols-8 gap-1">
        {commonEmojis.map((emoji, index) => (
          <button
            key={index}
            onClick={() => handleEmojiClick(emoji)}
            className="hover:bg-gray-100 rounded p-1 text-lg transition"
          >
            {emoji}
          </button>
        ))}
      </div>
    </div>
  );
};
