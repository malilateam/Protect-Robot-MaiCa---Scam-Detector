
import React from 'react';
import { AnalysisResult, RiskLevel } from '../types';

const riskLevelConfig = {
  [RiskLevel.SAFE]: {
    label: 'ปลอดภัย',
    icon: '✅',
    color: 'green',
  },
  [RiskLevel.LOW]: {
    label: 'ความเสี่ยงต่ำ',
    icon: '🤔',
    color: 'lime',
  },
  [RiskLevel.MEDIUM]: {
    label: 'ความเสี่ยงปานกลาง',
    icon: '⚠️',
    color: 'yellow',
  },
  [RiskLevel.HIGH]: {
    label: 'ความเสี่ยงสูง',
    icon: '🚨',
    color: 'orange',
  },
  [RiskLevel.CRITICAL]: {
    label: 'ความเสี่ยงร้ายแรง',
    icon: '🚫',
    color: 'red',
  },
};

const colorClasses = {
  border: {
    green: 'border-green-500',
    lime: 'border-lime-500',
    yellow: 'border-yellow-500',
    orange: 'border-orange-500',
    red: 'border-red-500',
  },
  text: {
    green: 'text-green-700',
    lime: 'text-lime-700',
    yellow: 'text-yellow-700',
    orange: 'text-orange-700',
    red: 'text-red-700',
  },
  bg: {
    green: 'bg-green-100',
    lime: 'bg-lime-100',
    yellow: 'bg-yellow-100',
    orange: 'bg-orange-100',
    red: 'bg-red-100',
  },
};

interface ResultCardProps {
  result: AnalysisResult;
}

const ResultCard: React.FC<ResultCardProps> = ({ result }) => {
  const config = riskLevelConfig[result.riskLevel] || riskLevelConfig[RiskLevel.MEDIUM];
  const color = config.color as keyof typeof colorClasses.border;

  return (
    <div className={`w-full p-6 mt-6 border-l-4 rounded-lg shadow-md ${colorClasses.border[color]} ${colorClasses.bg[color]}`}>
      <div className="flex items-center mb-4">
        <span className="text-2xl mr-3">{config.icon}</span>
        <h2 className={`text-2xl font-bold ${colorClasses.text[color]}`}>{config.label}</h2>
      </div>
      
      <div className="space-y-4">
        <div>
          <h3 className="font-semibold text-gray-800">สรุปผล:</h3>
          <p className="text-gray-700">{result.summary}</p>
        </div>

        <div>
          <h3 className="font-semibold text-gray-800">การวิเคราะห์:</h3>
          <p className="text-gray-700 whitespace-pre-wrap">{result.analysis}</p>
        </div>
        
        <div>
          <h3 className="font-semibold text-gray-800">ข้อแนะนำ:</h3>
          <ul className="list-disc list-inside text-gray-700 space-y-1">
            {result.recommendations.map((rec, index) => (
              <li key={index}>{rec}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ResultCard;
