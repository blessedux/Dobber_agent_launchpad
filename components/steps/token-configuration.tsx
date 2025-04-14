"use client"

import type { AgentData } from "@/components/agent-launchpad"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { Slider } from "@/components/ui/slider"
import { Coins, Info, Percent, Wallet, Tag, Gem } from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

interface TokenConfigurationProps {
  agentData: AgentData
  updateAgentData: (data: Partial<AgentData>) => void
}

export default function TokenConfiguration({ agentData, updateAgentData }: TokenConfigurationProps) {
  const { tokenSettings } = agentData;

  const updateTokenSettings = (settings: Partial<typeof tokenSettings>) => {
    updateAgentData({
      tokenSettings: {
        ...tokenSettings,
        ...settings
      }
    });
  };

  // Auto-generate symbol from name
  const handleNameChange = (name: string) => {
    updateTokenSettings({ name });
    
    // Only auto-generate symbol if it's empty or was auto-generated before
    if (!tokenSettings.symbol || tokenSettings.symbol === tokenSettings.name.split(' ').map(word => word[0]).join('').toUpperCase()) {
      const symbol = name.split(' ').map(word => word[0]).join('').toUpperCase();
      updateTokenSettings({ symbol });
    }
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h2 className="text-2xl font-semibold text-slate-800 dark:text-slate-100">Agent Token Configuration</h2>
        <p className="text-slate-600 dark:text-slate-300">
          Create a token for your agent to enable shared ownership and reward distribution.
        </p>
      </div>

      <div className="space-y-6 pt-4">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <div className="flex items-center gap-2">
              <Label htmlFor="token-enabled" className="text-base font-medium">Enable Agent Token</Label>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <Info className="h-4 w-4 text-slate-400" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="max-w-xs">Enabling token creation allows others to invest in your agent and share its rewards</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <p className="text-sm text-slate-500 dark:text-slate-400">Allow others to invest in your agent's success</p>
          </div>
          <Switch
            id="token-enabled"
            checked={tokenSettings.enabled}
            onCheckedChange={(checked) => updateTokenSettings({ enabled: checked })}
          />
        </div>

        {tokenSettings.enabled && (
          <div className="space-y-6 pt-2 border-t border-slate-200 dark:border-slate-700">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Tag className="h-4 w-4 text-violet-500" />
                  <Label htmlFor="token-name">Token Name</Label>
                </div>
                <Input
                  id="token-name"
                  placeholder="Solar Energy Token"
                  value={tokenSettings.name}
                  onChange={(e) => handleNameChange(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Gem className="h-4 w-4 text-violet-500" />
                  <Label htmlFor="token-symbol">Token Symbol</Label>
                </div>
                <Input
                  id="token-symbol"
                  placeholder="SET"
                  value={tokenSettings.symbol}
                  onChange={(e) => updateTokenSettings({ symbol: e.target.value.toUpperCase() })}
                  className="uppercase"
                  maxLength={5}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Coins className="h-4 w-4 text-violet-500" />
                  <Label htmlFor="token-supply">Total Supply</Label>
                </div>
                <Input
                  id="token-supply"
                  type="number"
                  placeholder="10000"
                  value={tokenSettings.supply}
                  onChange={(e) => updateTokenSettings({ supply: parseInt(e.target.value) || 0 })}
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Wallet className="h-4 w-4 text-violet-500" />
                  <Label htmlFor="token-price">Initial Price (USDC)</Label>
                </div>
                <Input
                  id="token-price"
                  type="number"
                  step="0.01"
                  placeholder="0.1"
                  value={tokenSettings.initialPrice}
                  onChange={(e) => updateTokenSettings({ initialPrice: parseFloat(e.target.value) || 0 })}
                />
              </div>
            </div>

            <div className="space-y-6 pt-4">
              <h3 className="text-lg font-medium text-slate-800 dark:text-slate-100">Reward Distribution</h3>
              
              <div className="space-y-6">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Percent className="h-4 w-4 text-violet-500" />
                      <Label>Creator Royalty: {tokenSettings.creatorRoyalty}%</Label>
                    </div>
                    <span className="text-sm text-slate-500">{tokenSettings.creatorRoyalty}%</span>
                  </div>
                  <Slider
                    value={[tokenSettings.creatorRoyalty]}
                    min={0}
                    max={30}
                    step={1}
                    onValueChange={([value]) => {
                      // Adjust holder rewards to maintain total of 100% with protocol fee
                      const protocolFee = 20; // 20% fixed protocol fee
                      const holderRewards = 100 - value - protocolFee;
                      updateTokenSettings({ 
                        creatorRoyalty: value,
                        holderRewards: holderRewards
                      });
                    }}
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Wallet className="h-4 w-4 text-violet-500" />
                      <Label>Token Holder Rewards: {tokenSettings.holderRewards}%</Label>
                    </div>
                    <span className="text-sm text-slate-500">{tokenSettings.holderRewards}%</span>
                  </div>
                  <Slider
                    value={[tokenSettings.holderRewards]}
                    min={50}
                    max={80}
                    step={1}
                    onValueChange={([value]) => {
                      // Adjust creator royalty to maintain total of 100% with protocol fee
                      const protocolFee = 20; // 20% fixed protocol fee
                      const creatorRoyalty = 100 - value - protocolFee;
                      updateTokenSettings({ 
                        holderRewards: value,
                        creatorRoyalty: creatorRoyalty
                      });
                    }}
                  />
                </div>

                <div className="flex items-center justify-between px-2 py-3 bg-slate-100 dark:bg-slate-800 rounded-lg">
                  <span className="text-sm font-medium text-slate-600 dark:text-slate-300">Protocol Fee</span>
                  <span className="text-sm font-medium text-slate-800 dark:text-slate-200">20%</span>
                </div>

                <div className="flex items-center justify-between px-2 py-3 bg-violet-50 dark:bg-violet-900/20 rounded-lg">
                  <span className="text-sm font-medium text-violet-700 dark:text-violet-300">Total</span>
                  <span className="text-sm font-medium text-violet-800 dark:text-violet-200">100%</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
} 