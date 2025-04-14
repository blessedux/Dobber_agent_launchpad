'use client';

import React, { useEffect, useState } from 'react';
import IsometricGrid from '@/components/isometric/IsometricGrid';
import { DeviceNetwork } from '@/data/mockDeviceNetwork';
import LoadingSpinner from "@/components/loading-spinner";

export default function DeviceNetworkPage() {
  const [networkData, setNetworkData] = useState<DeviceNetwork | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    const fetchNetworkData = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/device-network');
        
        if (!response.ok) {
          throw new Error('Failed to fetch device network data');
        }
        
        const data = await response.json();
        setNetworkData(data);
      } catch (err: any) {
        console.error('Error fetching device network:', err);
        setError(err.message || 'Failed to fetch device network');
      } finally {
        setLoading(false);
      }
    };
    
    fetchNetworkData();
  }, []);
  
  return (
    <div className="h-full w-full bg-gradient-to-b from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900 overflow-hidden">
      <div className="py-4 px-6">
        <h1 className="text-3xl font-bold mb-1">Device Network</h1>
        <p className="text-slate-600 dark:text-slate-400 mb-6">
          View and manage your devices, agents, and token holdings in an interactive network map
        </p>
        
        {loading ? (
          <div className="flex justify-center items-center py-24">
            <LoadingSpinner />
          </div>
        ) : error ? (
          <div className="bg-red-100 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-4 rounded-lg">
            Error: {error}
          </div>
        ) : networkData ? (
          <div className="h-[calc(100vh-150px)] w-full">
            <IsometricGrid networkData={networkData} />
          </div>
        ) : (
          <div className="bg-amber-100 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400 p-4 rounded-lg">
            No network data available
          </div>
        )}
        
        <div className="mt-4 text-sm text-center text-slate-500 dark:text-slate-400">
          <p>Interact with devices and agents by clicking on them. Use the filter to customize your view.</p>
        </div>
      </div>
    </div>
  );
} 