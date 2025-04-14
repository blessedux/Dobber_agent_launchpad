"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { BarChart, Wallet, ArrowDownToLine, Clock } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { useDashboardLayout } from "../components/dashboard-context";
import {
  fetchUserPortfolio,
  updateWithdrawalFrequency,
  withdrawEarnings,
  Portfolio,
  formatCurrency,
  formatDate,
  getUnwithdrawnEarningsTotal,
  WithdrawalFrequency,
} from "./data";

export default function PortfolioPage() {
  const { setNavigation } = useDashboardLayout();
  const [portfolio, setPortfolio] = useState<Portfolio | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [withdrawalInProgress, setWithdrawalInProgress] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");

  useEffect(() => {
    setNavigation({ title: "Portfolio", icon: "Portfolio" });
    
    const loadPortfolio = async () => {
      try {
        const data = await fetchUserPortfolio();
        setPortfolio(data);
      } catch (error) {
        console.error("Failed to load portfolio data:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadPortfolio();
  }, [setNavigation]);

  const handleWithdrawEarnings = async () => {
    if (!portfolio) return;
    
    setWithdrawalInProgress(true);
    
    try {
      const result = await withdrawEarnings();
      if (result.success) {
        // Update portfolio with new withdrawal info
        setPortfolio({
          ...portfolio,
          lastWithdrawal: {
            amount: result.amount,
            date: result.timestamp,
          },
          earningsHistory: portfolio.earningsHistory.map(record => ({
            ...record,
            withdrawn: true,
          })),
        });
      }
    } catch (error) {
      console.error("Withdrawal failed:", error);
    } finally {
      setWithdrawalInProgress(false);
    }
  };

  const handleWithdrawalFrequencyChange = async (frequency: WithdrawalFrequency) => {
    if (!portfolio) return;
    
    try {
      const result = await updateWithdrawalFrequency(frequency);
      setPortfolio({
        ...portfolio,
        withdrawalFrequency: result,
      });
    } catch (error) {
      console.error("Failed to update withdrawal frequency:", error);
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col gap-4 p-6">
        <Skeleton className="h-8 w-64" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Skeleton className="h-32" />
          <Skeleton className="h-32" />
          <Skeleton className="h-32" />
        </div>
        <Skeleton className="h-64" />
      </div>
    );
  }

  if (!portfolio) {
    return <div className="p-6">Failed to load portfolio data</div>;
  }

  const unwithdrawnEarnings = getUnwithdrawnEarningsTotal(portfolio.earningsHistory);

  return (
    <div className="flex-1 space-y-4 p-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Token Portfolio</h2>
        <Button
          disabled={unwithdrawnEarnings <= 0 || withdrawalInProgress}
          onClick={handleWithdrawEarnings}
        >
          <ArrowDownToLine className="mr-2 h-4 w-4" /> 
          Withdraw Earnings {unwithdrawnEarnings > 0 && `(${formatCurrency(unwithdrawnEarnings)})`}
        </Button>
      </div>
      
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Value</CardTitle>
            <Wallet className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(portfolio.totalValue)}</div>
            <p className="text-xs text-muted-foreground">
              From {portfolio.holdings.length} agent tokens
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Earnings</CardTitle>
            <BarChart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(portfolio.totalEarnings)}</div>
            <p className="text-xs text-muted-foreground">
              {unwithdrawnEarnings > 0 ? `${formatCurrency(unwithdrawnEarnings)} available to withdraw` : "All earnings withdrawn"}
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Withdrawal Settings</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <Select
              value={portfolio.withdrawalFrequency}
              onValueChange={(value) => handleWithdrawalFrequencyChange(value as WithdrawalFrequency)}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select frequency" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="manual">Manual</SelectItem>
                <SelectItem value="daily">Daily</SelectItem>
                <SelectItem value="weekly">Weekly</SelectItem>
                <SelectItem value="monthly">Monthly</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground mt-2">
              {portfolio.lastWithdrawal 
                ? `Last withdrawal: ${formatCurrency(portfolio.lastWithdrawal.amount)} on ${formatDate(portfolio.lastWithdrawal.date)}`
                : "No previous withdrawals"}
            </p>
          </CardContent>
        </Card>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="overview">Holdings</TabsTrigger>
          <TabsTrigger value="earnings">Earnings History</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Token Holdings</CardTitle>
              <CardDescription>
                Your current agent token holdings and their performance
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Agent Name</TableHead>
                    <TableHead>Token</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Value</TableHead>
                    <TableHead>Purchase Date</TableHead>
                    <TableHead>Earnings</TableHead>
                    <TableHead>Last Earning</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {portfolio.holdings.map((holding) => (
                    <TableRow key={holding.id}>
                      <TableCell className="font-medium">{holding.agentName}</TableCell>
                      <TableCell>{holding.symbol}</TableCell>
                      <TableCell>{holding.amount}</TableCell>
                      <TableCell>{formatCurrency(holding.value)}</TableCell>
                      <TableCell>{formatDate(holding.purchaseDate)}</TableCell>
                      <TableCell>{formatCurrency(holding.earnings)}</TableCell>
                      <TableCell>{formatDate(holding.lastEarningDate)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="earnings" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Earnings History</CardTitle>
              <CardDescription>
                History of earnings from your agent tokens
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Agent</TableHead>
                    <TableHead>Token</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {portfolio.earningsHistory.sort((a, b) => b.date.getTime() - a.date.getTime()).map((record) => (
                    <TableRow key={record.id}>
                      <TableCell>{formatDate(record.date)}</TableCell>
                      <TableCell className="font-medium">{record.agentName}</TableCell>
                      <TableCell>{record.tokenSymbol}</TableCell>
                      <TableCell>{formatCurrency(record.amount)}</TableCell>
                      <TableCell>{record.withdrawn ? "Withdrawn" : "Pending"}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
} 