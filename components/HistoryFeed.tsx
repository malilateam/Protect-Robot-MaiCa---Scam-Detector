import React, { useState } from 'react';
import { HistoryEntry, RiskLevel } from '../types';

const riskLevelConfig = {
  [RiskLevel.SAFE]: { label: 'ปลอดภัย', icon: '✅', color: 'green', },
  [RiskLevel.LOW]: { label: 'ความเสี่ยงต่ำ', icon: '🤔', color: 'lime', },
  [RiskLevel.MEDIUM]: { label: 'ความเสี่ยงปานกลาง', icon: '⚠️', color: 'yellow', },
  [RiskLevel.HIGH]: { label: 'ความเสี่ยงสูง', icon: '🚨', color: 'orange', },
  [RiskLevel.CRITICAL]: { label: 'ความเสี่ยงร้ายแรง', icon: '🚫', color: 'red', },
};

const colorClasses = {
  border: { green: 'border-green-500', lime: 'border-lime-500', yellow: 'border-yellow-500', orange: 'border-orange-500', red: 'border-red-500', },
  text: { green: 'text-green-700', lime: 'text-lime-700', yellow: 'text-yellow-700', orange: 'text-orange-700', red: 'text-red-700', },
  bg: { green: 'bg-green-50', lime: 'bg-lime-50', yellow: 'bg-yellow-50', orange: 'bg-orange-50', red: 'bg-red-50', },
};

const HistoryItem: React.FC<{ item: HistoryEntry }> = ({ item }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const config = riskLevelConfig[item.riskLevel] || riskLevelConfig[RiskLevel.MEDIUM];
  const color = config.color as keyof typeof colorClasses.border;
  const formattedDate = new Date(item.date).toLocaleString('th-TH', {
    dateStyle: 'medium',
    timeStyle: 'short',
  });

  return (
    <div className={`w-full p-4 border-l-4 rounded-lg shadow-sm ${colorClasses.border[color]} ${colorClasses.bg[color]}`}>
      <div className="flex justify-between items-start cursor-pointer" onClick={() => setIsExpanded(!isExpanded)} role="button" tabIndex={0} onKeyDown={(e) => e.key === 'Enter' && setIsExpanded(!isExpanded)}>
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-lg">{config.icon}</span>
            <span className={`font-bold ${colorClasses.text[color]}`}>{config.label}</span>
          </div>
          <p className="text-sm text-gray-500">{item.user} • {formattedDate}</p>
        </div>
        <div
          className="text-sm text-blue-600 hover:text-blue-800 font-medium flex items-center"
          aria-expanded={isExpanded}
        >
          {isExpanded ? 'ซ่อน' : 'ดูรายละเอียด'}
          <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 inline-block ml-1 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`} viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </div>
      </div>
      
      <div className={`grid transition-all duration-500 ease-in-out ${isExpanded ? 'grid-rows-[1fr] mt-4 pt-4 border-t' : 'grid-rows-[0fr]'} border-gray-300/50`}>
        <div className="overflow-hidden">
          <h4 className="text-sm text-gray-800 font-semibold mb-1">ข้อความที่ตรวจสอบ:</h4>
          <blockquote className="text-sm text-gray-600 bg-white/70 p-3 rounded border border-gray-200 whitespace-pre-wrap italic pl-4 border-l-2 border-gray-400">
            {item.inputText}
          </blockquote>
          <h4 className="text-sm text-gray-800 font-semibold mt-3 mb-1">สรุปผล:</h4>
          <p className="text-sm text-gray-600">{item.summary}</p>
        </div>
      </div>
    </div>
  );
};


interface HistoryFeedProps {
  history: HistoryEntry[];
}

const HistoryFeed: React.FC<HistoryFeedProps> = ({ history }) => {
  if (history.length === 0) {
    return null;
  }

  return (
    <div className="w-full mt-12">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">ฟีดการตรวจสอบล่าสุด</h2>
      <div className="space-y-4">
        {history.map(item => (
          <HistoryItem key={item.id} item={item} />
        ))}
      </div>
    </div>
  );
};

export default HistoryFeed;
