"use client"

import type { AgentData } from "@/components/agent-launchpad"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"

interface AgentDescriptionProps {
  agentData: AgentData
  updateAgentData: (data: Partial<AgentData>) => void
}

const llmModels = [
  { value: "gpt-4o", label: "GPT-4o (Balanced)" },
  { value: "claude-3", label: "Claude 3 (Analytical)" },
  { value: "llama-3", label: "Llama 3 (Efficient)" },
  { value: "depin-specialist", label: "DePIN Specialist (Fine-tuned)" },
  { value: "device-expert", label: "Device Expert (Domain-specific)" },
]

export default function AgentDescription({ agentData, updateAgentData }: AgentDescriptionProps) {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h2 className="text-2xl font-semibold text-slate-800 dark:text-slate-100">Describe Your Agent</h2>
        <p className="text-slate-600 dark:text-slate-300">
          Define your agent's brain. You're not just deploying code — you're launching an autonomous manager.
        </p>
      </div>

      <div className="space-y-4 pt-4">
        <div className="space-y-2">
          <Label htmlFor="agent-name">Agent Name</Label>
          <Input
            id="agent-name"
            placeholder="e.g., SolarOptimizer or ChargeGuardian"
            value={agentData.agentName}
            onChange={(e) => updateAgentData({ agentName: e.target.value })}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="agent-description">Agent Description or Goal</Label>
          <Textarea
            id="agent-description"
            placeholder="e.g., Maximize solar panel efficiency and automate energy trading"
            value={agentData.agentDescription}
            onChange={(e) => updateAgentData({ agentDescription: e.target.value })}
            className="min-h-[100px]"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="llm-model">LLM Personality or Model</Label>
          <Select value={agentData.llmModel} onValueChange={(value) => updateAgentData({ llmModel: value })}>
            <SelectTrigger id="llm-model">
              <SelectValue placeholder="Select a model" />
            </SelectTrigger>
            <SelectContent>
              {llmModels.map((model) => (
                <SelectItem key={model.value} value={model.value}>
                  {model.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-4 pt-2">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="collaboration">Enable collaboration with other agents</Label>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Allow your agent to communicate and coordinate with other agents
              </p>
            </div>
            <Switch
              id="collaboration"
              checked={agentData.enableCollaboration}
              onCheckedChange={(checked) => updateAgentData({ enableCollaboration: checked })}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="self-optimize">Allow this agent to self-optimize</Label>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Let your agent learn and improve its strategies over time
              </p>
            </div>
            <Switch
              id="self-optimize"
              checked={agentData.allowSelfOptimize}
              onCheckedChange={(checked) => updateAgentData({ allowSelfOptimize: checked })}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
