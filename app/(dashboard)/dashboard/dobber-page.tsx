"use client"

import React from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import PerformancePanel from "@/components/PerformancePanel"
import { Card } from "@/components/ui/card"
import ActionHistoryPanel from "@/components/ActionHistoryPanel"

export default function DobberDashboard() {
  return (
    <div className="flex flex-col space-y-6">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">DOBBER Framework</h1>
          <p className="text-muted-foreground">
            Monitor your devices and agents in real-time
          </p>
        </div>
      </header>

      <Tabs defaultValue="performance" className="w-full">
        <TabsList className="grid w-full md:w-auto grid-cols-2 md:grid-cols-4">
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="devices">Devices</TabsTrigger>
          <TabsTrigger value="agents">Agents</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>
        <TabsContent value="performance" className="py-4">
          <PerformancePanel />
        </TabsContent>
        <TabsContent value="devices" className="py-4">
          <div className="rounded-lg border p-8 text-center">
            Device management interface coming soon
          </div>
        </TabsContent>
        <TabsContent value="agents" className="py-4">
          <div className="grid grid-cols-1 gap-6">
            <Card className="p-4">
              <h3 className="text-xl font-semibold mb-4">Agent Status</h3>
              <div className="flex flex-col gap-4">
                <PerformancePanel showAgentStatusOnly={true} />
              </div>
            </Card>
            
            <Card className="p-4">
              <h3 className="text-xl font-semibold mb-4">Agent Action History</h3>
              <ActionHistoryPanel />
            </Card>
          </div>
        </TabsContent>
        <TabsContent value="settings" className="py-4">
          <div className="rounded-lg border p-8 text-center">
            Settings interface coming soon
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
} 