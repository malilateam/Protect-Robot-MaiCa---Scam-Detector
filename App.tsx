import React, { useState, useCallback, useEffect } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import Loader from './components/Loader';
import ResultCard from './components/ResultCard';
import HistoryFeed from './components/HistoryFeed';
import { analyzeTextForScam } from './services/geminiService';
import { AnalysisResult, HistoryEntry } from './types';
import { getHistory, addHistoryEntry } from './utils';

const App: React.FC = () => {
  const [inputText, setInputText] = useState<string>('');
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [history, setHistory] = useState<HistoryEntry[]>([]);

  useEffect(() => {
    setHistory(getHistory());
  }, []);

  const handleAnalysis = useCallback(async () => {
    if (!inputText.trim()) {
      setError('กรุณาป้อนข้อความที่ต้องการตรวจสอบ');
      return;
    }
    setIsLoading(true);
    setError(null);
    setAnalysisResult(null);
    try {
      const result = await analyzeTextForScam(inputText, history);
      setAnalysisResult(result);
      const newHistory = addHistoryEntry({ ...result, inputText });
      setHistory(newHistory);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'เกิดข้อผิดพลาดที่ไม่ทราบสาเหตุ');
    } finally {
      setIsLoading(false);
    }
  }, [inputText, history]);

  const handleReset = useCallback(() => {
    setInputText('');
    setAnalysisResult(null);
    setError(null);
    setIsLoading(false);
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-between font-sans p-4">
      <Header />
      
      <main className="w-full max-w-3xl mx-auto flex-grow flex flex-col items-center">
        <div className="w-full bg-white p-8 rounded-xl shadow-2xl transition-all">
          <label htmlFor="scam-input" className="block text-lg font-medium text-gray-700 mb-2">
            ป้อนข้อความ, อีเมล, หรือลิงก์ที่น่าสงสัย:
          </label>
          <textarea
            id="scam-input"
            rows={8}
            className="w-full p-4 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-shadow duration-200"
            placeholder="วางข้อความที่นี่เพื่อทำการตรวจสอบ..."
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            disabled={isLoading}
            aria-label="Scam input text area"
          ></textarea>
          
          <div className="mt-6 flex flex-col sm:flex-row gap-4">
            <button
              onClick={handleAnalysis}
              disabled={isLoading || !inputText}
              className="w-full sm:w-auto flex-1 px-6 py-3 bg-blue-600 text-white font-semibold rounded-md shadow-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-all duration-200"
            >
              {isLoading ? 'กำลังประมวลผล...' : 'ตรวจสอบ'}
            </button>
            <button
              onClick={handleReset}
              disabled={isLoading}
              className="w-full sm:w-auto px-6 py-3 bg-white border border-gray-300 text-gray-700 font-semibold rounded-md shadow-sm hover:bg-gray-100 disabled:bg-gray-200 transition-all duration-200"
            >
              ตรวจสอบใหม่
            </button>
          </div>
          
          {error && <div className="mt-4 text-red-600 bg-red-100 p-3 rounded-md" role="alert">{error}</div>}
        </div>

        {isLoading && <Loader />}
        {analysisResult && <ResultCard result={analysisResult} />}
        
        <HistoryFeed history={history} />
      </main>

      <Footer />
    </div>
  );
};

export default App;
