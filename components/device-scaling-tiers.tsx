"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { 
  Check, 
  Server, 
  Zap, 
  Building2, 
  Cpu, 
  Radio, 
  Laptop,
  Sun,
  Plug,
  Wifi,
  BarChart3,
  PieChart,
  NetworkIcon,
  Edit
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Slider
} from "@/components/ui/slider";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

export interface ScalingTier {
  id: string;
  name: string;
  description: string;
  price: number; // Price in $DOB tokens
  dobPrice: number; // Calculated $DOB price
  devices: number;
  deviceTypes: string[];
  features: string[];
  yieldIncrease: number;
  icon: React.ReactNode;
}

interface DeviceScalingTiersProps {
  currentDevices: number;
  onSelectTier: (tier: ScalingTier) => void;
  className?: string;
  defaultDeviceType?: string;
}

// Device type multipliers for pricing (base price × multiplier)
const devicePriceMultipliers: Record<string, number> = {
  "Compute Node": 1,
  "Solar Panel": 1.2,
  "Helium Miner": 1.5,
  "EV Charger": 1.8,
  "IoT Gateway": 1.3,
  "Energy Monitor": 0.8,
  "Server Tower": 2.0
};

// DOB token price in USD
const DOB_TOKEN_PRICE = 0.85; // $0.85 per DOB token

export function DeviceScalingTiers({ 
  currentDevices, 
  onSelectTier,
  className = "",
  defaultDeviceType = "Compute Node"
}: DeviceScalingTiersProps) {
  const [selectedTier, setSelectedTier] = useState<string | null>(null);
  const [selectedDeviceType, setSelectedDeviceType] = useState<string>(defaultDeviceType);
  const [customizationOpen, setCustomizationOpen] = useState<string | null>(null);
  const [deviceCounts, setDeviceCounts] = useState<Record<string, number>>({
    "starter": 5,
    "growth": 15,
    "enterprise": 50
  });
  
  // Base tiers - these will be modified based on device type and customization
  const baseTiers: Omit<ScalingTier, "dobPrice">[] = [
    {
      id: "starter",
      name: "Starter",
      description: "Perfect for beginners",
      price: 399,
      devices: deviceCounts.starter,
      deviceTypes: ["Compute Node", "Solar Panel"],
      features: [
        `${deviceCounts.starter} additional devices`,
        "Basic device monitoring",
        "Automated maintenance",
      ],
      yieldIncrease: 25,
      icon: <Server className="h-5 w-5" />
    },
    {
      id: "growth",
      name: "Growth",
      description: "For expanding operations",
      price: 999,
      devices: deviceCounts.growth,
      deviceTypes: ["Compute Node", "Solar Panel", "Helium Miner"],
      features: [
        `${deviceCounts.growth} additional devices`,
        "Advanced device monitoring",
        "Predictive maintenance",
        "Performance analytics",
      ],
      yieldIncrease: 50,
      icon: <Zap className="h-5 w-5" />
    },
    {
      id: "enterprise",
      name: "Enterprise",
      description: "For serious operators",
      price: 2499,
      devices: deviceCounts.enterprise,
      deviceTypes: ["Compute Node", "Solar Panel", "Helium Miner", "EV Charger", "Server Tower"],
      features: [
        `${deviceCounts.enterprise} additional devices`,
        "Full-spectrum monitoring",
        "Priority network access",
        "Custom device configurations",
        "Dedicated support channel",
      ],
      yieldIncrease: 120,
      icon: <Building2 className="h-5 w-5" />
    }
  ];
  
  // Calculate tiers with adjusted prices based on device type
  const tiers: ScalingTier[] = baseTiers.map(tier => {
    const multiplier = devicePriceMultipliers[selectedDeviceType] || 1;
    const adjustedUsdPrice = tier.price * multiplier;
    const dobPrice = Math.ceil(adjustedUsdPrice / DOB_TOKEN_PRICE);
    
    return {
      ...tier,
      price: adjustedUsdPrice,
      dobPrice: dobPrice,
      devices: deviceCounts[tier.id] || tier.devices
    };
  });

  const handleSelectTier = (tier: ScalingTier) => {
    setSelectedTier(tier.id);
    onSelectTier(tier);
  };

  const handleDeviceTypeChange = (value: string) => {
    setSelectedDeviceType(value);
  };

  const handleCustomizeTier = (tierId: string) => {
    setCustomizationOpen(tierId);
  };

  const handleSaveCustomization = (tierId: string, deviceCount: number) => {
    setDeviceCounts(prev => ({
      ...prev,
      [tierId]: deviceCount
    }));
    setCustomizationOpen(null);
  };

  const getDeviceIcon = (deviceType: string) => {
    switch (deviceType) {
      case "Compute Node":
        return <Cpu className="w-4 h-4 text-violet-500 mr-1" />;
      case "Solar Panel":
        return <Sun className="w-4 h-4 text-amber-500 mr-1" />;
      case "Helium Miner":
        return <Radio className="w-4 h-4 text-blue-500 mr-1" />;
      case "EV Charger":
        return <Plug className="w-4 h-4 text-emerald-500 mr-1" />;
      case "IoT Gateway":
        return <Wifi className="w-4 h-4 text-indigo-500 mr-1" />;
      case "Energy Monitor":
        return <Zap className="w-4 h-4 text-orange-500 mr-1" />;
      case "Server Tower":
        return <Server className="w-4 h-4 text-slate-500 mr-1" />;
      default:
        return <Laptop className="w-4 h-4 text-slate-500 mr-1" />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-medium">Scale Your Device Farm</h3>
        <div className="w-48">
          <Select
            value={selectedDeviceType}
            onValueChange={handleDeviceTypeChange}
          >
            <SelectTrigger id="device-type">
              <SelectValue placeholder="Select device type" />
            </SelectTrigger>
            <SelectContent>
              {Object.keys(devicePriceMultipliers).map((type) => (
                <SelectItem key={type} value={type} className="flex items-center">
                  <div className="flex items-center">
                    {getDeviceIcon(type)}
                    {type}
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className={`grid gap-6 md:grid-cols-3 ${className}`}>
        {tiers.map((tier) => (
          <Card
            key={tier.id}
            className={`p-5 border ${
              selectedTier === tier.id
                ? "border-violet-400 dark:border-violet-600 ring-2 ring-violet-400 dark:ring-violet-600"
                : "border-slate-200 dark:border-slate-700"
            }`}
          >
            <div className="mb-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-full bg-violet-100 dark:bg-violet-900/40">
                  {tier.icon}
                </div>
                <div>
                  <h3 className="font-bold">{tier.name}</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    {tier.description}
                  </p>
                </div>
              </div>
              <Badge 
                variant="outline" 
                className="bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-900/20 dark:text-emerald-400 dark:border-emerald-800"
              >
                +{tier.yieldIncrease}% Yield
              </Badge>
            </div>

            <div className="mb-4">
              <p className="text-3xl font-bold flex items-baseline">
                {tier.dobPrice} <span className="text-lg ml-1 font-semibold text-violet-600 dark:text-violet-400">$DOB</span>
                <span className="text-sm font-normal text-slate-500 dark:text-slate-400 ml-2">
                  (~${tier.price.toFixed(0)})
                </span>
              </p>
              <div className="flex justify-between items-center mt-1">
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  Add {tier.devices} devices to your farm
                </p>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="text-violet-600 hover:text-violet-700 dark:text-violet-400 p-1 h-auto" 
                      onClick={() => handleCustomizeTier(tier.id)}
                    >
                      <Edit className="h-3.5 w-3.5" />
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Customize {tier.name} Tier</DialogTitle>
                      <DialogDescription>
                        Adjust the number of devices for this tier.
                      </DialogDescription>
                    </DialogHeader>
                    
                    <div className="py-4">
                      <Label htmlFor="device-count" className="mb-2 block">
                        Number of devices: <span className="font-medium">{customizationOpen === tier.id ? deviceCounts[tier.id] : tier.devices}</span>
                      </Label>
                      <Slider
                        defaultValue={[tier.devices]}
                        max={100}
                        min={1}
                        step={1}
                        className="mb-6"
                        onValueChange={(values) => {
                          if (customizationOpen === tier.id) {
                            setDeviceCounts(prev => ({
                              ...prev,
                              [tier.id]: values[0]
                            }));
                          }
                        }}
                      />
                      
                      <div className="flex justify-between items-center text-sm text-slate-500 dark:text-slate-400">
                        <span>Price per device:</span>
                        <span>{Math.round(tier.dobPrice / tier.devices)} $DOB</span>
                      </div>
                    </div>
                    
                    <DialogFooter>
                      <Button 
                        variant="outline"
                        onClick={() => setCustomizationOpen(null)}
                      >
                        Cancel
                      </Button>
                      <Button 
                        onClick={() => handleSaveCustomization(tier.id, deviceCounts[tier.id])}
                      >
                        Save Changes
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            </div>

            <div className="border-t border-slate-200 dark:border-slate-700 pt-4 mb-4">
              <p className="text-sm font-medium mb-2">Device Types:</p>
              <div className="flex flex-wrap gap-2 mb-4">
                {tier.deviceTypes.map((deviceType) => (
                  <div
                    key={deviceType}
                    className={`flex items-center text-xs py-1 px-2 rounded-full ${
                      deviceType === selectedDeviceType 
                        ? "bg-violet-100 dark:bg-violet-900/40 text-violet-700 dark:text-violet-300" 
                        : "bg-slate-100 dark:bg-slate-800"
                    }`}
                  >
                    {getDeviceIcon(deviceType)}
                    {deviceType}
                  </div>
                ))}
              </div>

              <p className="text-sm font-medium mb-2">Features:</p>
              <ul className="space-y-1 mb-6">
                {tier.features.map((feature) => (
                  <li key={feature} className="flex items-start">
                    <Check className="h-4 w-4 text-emerald-500 mr-2 mt-0.5" />
                    <span className="text-sm">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>

            <Button
              className={`w-full ${
                selectedTier === tier.id
                  ? "bg-violet-600 hover:bg-violet-700"
                  : "bg-slate-800 hover:bg-slate-900 dark:bg-slate-700 dark:hover:bg-slate-600"
              }`}
              onClick={() => handleSelectTier(tier)}
            >
              Scale to {currentDevices + tier.devices} Devices
            </Button>
          </Card>
        ))}
      </div>
    </div>
  );
} 