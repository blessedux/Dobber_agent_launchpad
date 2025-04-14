import React, { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Shield, Clock, Database, CheckCircle2 } from 'lucide-react';

interface VerificationSummaryProps {
  className?: string;
}

interface VerificationSummaryData {
  validProofsLast24h: number;
  avgVerificationTime: number;
  verifiedFields: string[];
  totalAgents: number;
}

const VerificationSummary: React.FC<VerificationSummaryProps> = ({ 
  className = '' 
}) => {
  const [summaryData, setSummaryData] = useState<VerificationSummaryData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    const fetchSummaryData = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/agent-tokens?summary=verification');
        
        if (!response.ok) {
          throw new Error('Failed to fetch verification summary');
        }
        
        const data = await response.json();
        setSummaryData(data);
      } catch (err: any) {
        console.error('Error fetching verification summary:', err);
        setError(err.message || 'Failed to fetch verification summary');
      } finally {
        setLoading(false);
      }
    };
    
    fetchSummaryData();
  }, []);
  
  if (loading) {
    return (
      <Card className={`p-4 ${className}`}>
        <div className="text-center py-4 text-gray-500">Loading verification data...</div>
      </Card>
    );
  }
  
  if (error || !summaryData) {
    return (
      <Card className={`p-4 ${className}`}>
        <div className="text-center py-4 text-red-500">
          {error || 'Failed to load verification summary'}
        </div>
      </Card>
    );
  }
  
  return (
    <Card className={`p-4 ${className}`}>
      <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
        <Shield className="w-5 h-5 text-violet-500" />
        <span>Verification Summary</span>
      </h2>
      
      <div className="space-y-4">
        <div className="bg-slate-50 dark:bg-slate-800/50 p-3 rounded-lg">
          <div className="flex items-center gap-2 mb-1">
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
            <span className="text-sm font-medium">Valid Proofs (24h)</span>
          </div>
          <div className="flex items-center justify-between">
            <p className="text-2xl font-bold">{summaryData.validProofsLast24h}</p>
            <span className="text-sm text-slate-500">
              of {summaryData.totalAgents} agents
            </span>
          </div>
        </div>
        
        <div className="bg-slate-50 dark:bg-slate-800/50 p-3 rounded-lg">
          <div className="flex items-center gap-2 mb-1">
            <Clock className="w-4 h-4 text-violet-500" />
            <span className="text-sm font-medium">Avg Verification Time</span>
          </div>
          <p className="text-2xl font-bold">
            {summaryData.avgVerificationTime.toFixed(0)} ms
          </p>
        </div>
        
        <div className="bg-slate-50 dark:bg-slate-800/50 p-3 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <Database className="w-4 h-4 text-blue-500" />
            <span className="text-sm font-medium">Verified Data Fields</span>
          </div>
          <div className="flex flex-wrap gap-1">
            {summaryData.verifiedFields.map((field, index) => (
              <span 
                key={index}
                className="px-2 py-0.5 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 rounded text-xs"
              >
                {field}
              </span>
            ))}
          </div>
        </div>
        
        <div className="text-xs text-center text-slate-500 mt-2">
          <p>Data integrity verified by zk-SNARK and zk-STARK proofs</p>
          <a href="#" className="text-violet-600 dark:text-violet-400 hover:underline mt-1 inline-block">
            Learn more about our verification process
          </a>
        </div>
      </div>
    </Card>
  );
};

export default VerificationSummary; 