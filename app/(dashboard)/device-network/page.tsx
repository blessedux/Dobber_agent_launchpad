'use client';

import React, { useEffect, useState } from 'react';
import IsometricGrid from '@/components/isometric/IsometricGrid';
import { DeviceNetwork, getUserDailyRevenueFromHoldings } from '@/data/mockDeviceNetwork';
import LoadingSpinner from "@/components/loading-spinner";
import { Button } from "@/components/ui/button";
import { TrendingUp, Zap } from "lucide-react";
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useToast } from "@/components/ui/use-toast";
import { Confetti } from "@/components/confetti";
import { DeviceScalingTiers, ScalingTier } from "@/components/device-scaling-tiers";

export default function DeviceNetworkPage() {
  const [networkData, setNetworkData] = useState<DeviceNetwork | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isScaled, setIsScaled] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [dailyRevenue, setDailyRevenue] = useState(0);
  const [isScaleDialogOpen, setIsScaleDialogOpen] = useState(false);
  const [selectedTier, setSelectedTier] = useState<ScalingTier | null>(null);
  const [deviceType, setDeviceType] = useState("Compute Node");
  const { toast } = useToast();
  
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
        
        // Determine most common device type to set as default
        if (data.devices && data.devices.length > 0) {
          const deviceCounts: Record<string, number> = {};
          data.devices.forEach((device: any) => {
            if (deviceCounts[device.type]) {
              deviceCounts[device.type]++;
            } else {
              deviceCounts[device.type] = 1;
            }
          });
          
          // Find device type with highest count
          let maxCount = 0;
          let mostCommonType = "Compute Node";
          Object.entries(deviceCounts).forEach(([type, count]) => {
            if (count > maxCount) {
              maxCount = count;
              mostCommonType = type;
            }
          });
          
          setDeviceType(mostCommonType);
        }
        
        setDailyRevenue(getUserDailyRevenueFromHoldings(data));
      } catch (err: any) {
        console.error('Error fetching device network:', err);
        setError(err.message || 'Failed to fetch device network');
      } finally {
        setLoading(false);
      }
    };
    
    fetchNetworkData();
  }, []);
  
  const handleScaleOperation = () => {
    if (!networkData || !selectedTier) return;
    
    // Simulate wallet opening for transaction
    try {
      // In a real implementation, this would trigger wallet connection
      console.log("Opening wallet for device purchase transaction");
      
      // Simulate transaction signing delay
      setTimeout(() => {
        // Update the revenue based on tier's yield increase
        const newRevenue = dailyRevenue * (1 + (selectedTier.yieldIncrease / 100));
        setDailyRevenue(newRevenue);
        
        // Close dialog
        setIsScaleDialogOpen(false);
        
        // Show success message with confetti
        toast({
          title: "Device Farm Expanded!",
          description: `You've added ${selectedTier.devices} ${deviceType} devices! Your projected daily yield has increased to $${newRevenue.toFixed(2)} (+${selectedTier.yieldIncrease}%)`,
          duration: 5000,
        });
        
        // Show confetti animation
        setShowConfetti(true);
        setTimeout(() => setShowConfetti(false), 5000);
        
        // Update the scaled state
        setIsScaled(true);
      }, 1500);
    } catch (error) {
      console.error("Transaction error:", error);
      toast({
        title: "Transaction Failed",
        description: "There was an error processing your device purchase. Please try again.",
        duration: 5000,
      });
    }
  };

  const handleSelectTier = (tier: ScalingTier) => {
    setSelectedTier(tier);
  };
  
  // Calculate current number of devices
  const currentDeviceCount = networkData?.devices?.filter(device => 
    device.ownerAddress === networkData.userAddress
  ).length || 0;
  
  return (
    <>
      {showConfetti && <Confetti />}
      
      <div className="h-full w-full bg-gradient-to-b from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900 overflow-hidden">
        <div className="py-4 px-6">
          <div className="flex items-center justify-between mb-1">
            <h1 className="text-3xl font-bold">Device Network</h1>
            
            <Dialog open={isScaleDialogOpen} onOpenChange={setIsScaleDialogOpen}>
              <DialogTrigger asChild>
                <Button 
                  className="bg-violet-600 hover:bg-violet-700"
                  disabled={isScaled || loading}
                >
                  <TrendingUp className="mr-2 h-4 w-4" />
                  Scale Your Device Farm
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-4xl">
                <DialogHeader>
                  <DialogTitle>Scale Your Device Farm</DialogTitle>
                  <DialogDescription>
                    Add more devices to your network and increase your daily yield.
                  </DialogDescription>
                </DialogHeader>
                
                <div>
                  <div className="flex items-center mb-4 p-3 bg-violet-50 dark:bg-violet-900/20 rounded-lg">
                    <div className="mr-3 p-2 bg-violet-100 dark:bg-violet-800/40 rounded-full">
                      <Zap className="h-5 w-5 text-violet-600 dark:text-violet-400" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-violet-800 dark:text-violet-200">
                        Your current farm has {currentDeviceCount} devices
                      </p>
                      <p className="text-xs text-violet-600 dark:text-violet-300">
                        Current daily yield: ${dailyRevenue.toFixed(2)}
                      </p>
                    </div>
                  </div>

                  <DeviceScalingTiers 
                    currentDevices={currentDeviceCount}
                    onSelectTier={handleSelectTier}
                    defaultDeviceType={deviceType}
                    className="mb-4"
                  />
                  
                  <div className="text-xs text-slate-500 dark:text-slate-400 mb-4">
                    <p>
                      By adding more devices to your farm, you'll increase your network's capacity and generate more daily yield.
                      Your wallet will open to complete the purchase transaction.
                    </p>
                  </div>
                </div>
                
                <DialogFooter>
                  <Button 
                    variant="outline" 
                    onClick={() => setIsScaleDialogOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button 
                    className="bg-violet-600 hover:bg-violet-700"
                    onClick={handleScaleOperation}
                    disabled={!selectedTier}
                  >
                    {selectedTier 
                      ? `Purchase ${selectedTier.devices} Devices (${selectedTier.dobPrice} $DOB)` 
                      : 'Select a Plan'}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
          
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
    </>
  );
} 