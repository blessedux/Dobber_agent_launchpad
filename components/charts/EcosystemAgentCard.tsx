"use client"

import React, { useState } from 'react';
import { Card, Typography, Box, Button, Chip, Avatar, Tooltip, Dialog, DialogTitle, DialogContent, DialogActions, TextField } from '@mui/material';
import { Star, Clipboard, ArrowUpRight, TrendingUp, LineChart, User, Percent } from 'lucide-react';

// Define types for agent data
interface EcosystemAgent {
  id: string;
  name: string;
  ticker: string;
  category: string;
  marketCap: string;
  change24h: number;
  volume24h: string;
  tokenPrice: string;
  holders: number;
  level?: number;
  mindshare?: string;
  deviceType: string;
}

interface EcosystemAgentCardProps {
  agents: EcosystemAgent[];
}

export default function EcosystemAgentCard({ agents }: EcosystemAgentCardProps) {
  const [openDialog, setOpenDialog] = useState(false);
  const [openDetailsDialog, setOpenDetailsDialog] = useState(false);
  const [selectedAgent, setSelectedAgent] = useState<EcosystemAgent | null>(null);
  const [purchaseAmount, setPurchaseAmount] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const handleOpenDialog = (agent: EcosystemAgent) => {
    setSelectedAgent(agent);
    setOpenDialog(true);
  };
  
  const handleCloseDialog = () => {
    setOpenDialog(false);
    setPurchaseAmount('');
  };
  
  const handleOpenDetailsDialog = (agent: EcosystemAgent) => {
    setSelectedAgent(agent);
    setOpenDetailsDialog(true);
  };
  
  const handleCloseDetailsDialog = () => {
    setOpenDetailsDialog(false);
  };
  
  const handlePurchase = () => {
    // Here you would implement token purchase logic
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      console.log(`Purchasing ${purchaseAmount} tokens of ${selectedAgent?.ticker} at ${selectedAgent?.tokenPrice} each`);
      setIsLoading(false);
      handleCloseDialog();
      
      // Show success notification or handle next steps
    }, 1500);
  };
  
  const getCategoryColor = (category: string) => {
    switch (category.toLowerCase()) {
      case 'productivity':
        return '#10b981'; // emerald
      case 'entertainment':
        return '#8b5cf6'; // violet
      case 'on-chain':
        return '#3b82f6'; // blue
      default:
        return '#6b7280'; // gray
    }
  };
  
  const getDeviceTypeIcon = (deviceType: string) => {
    switch (deviceType) {
      case 'solar-node':
        return '☀️';
      case 'ev-charger':
        return '🔌';
      case 'helium-miner':
        return '📡';
      case 'compute-node':
        return '💻';
      default:
        return '🤖';
    }
  };
  
  const getAvatarBgColor = (name: string) => {
    const colors = ['#f59e0b', '#10b981', '#8b5cf6', '#ec4899', '#ef4444', '#3b82f6'];
    // Simple hash function to get consistent color for the same name
    const hash = name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return colors[hash % colors.length];
  };
  
  const formatChange = (change: number) => {
    return (
      <Typography
        variant="body2"
        sx={{
          color: change >= 0 ? '#10b981' : '#ef4444',
          fontWeight: 'medium',
          whiteSpace: 'nowrap'
        }}
      >
        {change >= 0 ? '+' : ''}{change.toFixed(2)}%
      </Typography>
    );
  };

  return (
    <Card sx={{ 
      bgcolor: 'background.paper',
      borderRadius: 2,
      boxShadow: 'rgba(0, 0, 0, 0.05) 0px 20px 27px 0px',
      overflow: 'hidden'
    }}>
      <Box sx={{ p: 3, borderBottom: '1px solid', borderColor: 'divider' }}>
        <Typography variant="h6" sx={{ mb: 1 }}>Agent Marketplace</Typography>
        <Typography variant="body2" color="text.secondary">
          Invest in powerful agents to earn rewards and level them up to optimize your network
        </Typography>
      </Box>
      
      {agents.length === 0 ? (
        <Box sx={{ 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'center', 
          justifyContent: 'center',
          py: 8,
          px: 4, 
          textAlign: 'center' 
        }}>
          <Box 
            sx={{ 
              width: 80, 
              height: 80, 
              borderRadius: '50%', 
              display: 'flex', 
              alignItems: 'center',
              justifyContent: 'center',
              bgcolor: 'rgba(107, 70, 254, 0.1)',
              mb: 3
            }}
          >
            <span style={{ fontSize: '2rem' }}>🤖</span>
          </Box>
          <Typography variant="h6" sx={{ mb: 1 }}>No Agents Available</Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3, maxWidth: 400 }}>
            The marketplace is empty. Be the first to deploy an agent and share it with the network!
          </Typography>
          <Button 
            variant="contained"
            sx={{ 
              bgcolor: '#6b46fe',
              '&:hover': {
                bgcolor: '#5a35e8'
              },
              textTransform: 'none'
            }}
          >
            Deploy New Agent
          </Button>
        </Box>
      ) : (
        <Box sx={{ 
          overflowX: 'auto',
          '&::-webkit-scrollbar': {
            height: '8px'
          },
          '&::-webkit-scrollbar-track': {
            background: 'rgba(0,0,0,0.05)'
          },
          '&::-webkit-scrollbar-thumb': {
            background: 'rgba(0,0,0,0.15)',
            borderRadius: '4px'
          }
        }}>
          <Box sx={{ 
            minWidth: 800, 
            display: 'table', 
            width: '100%',
            borderCollapse: 'collapse'
          }}>
            {/* Table Header */}
            <Box sx={{ display: 'table-header-group' }}>
              <Box sx={{ display: 'table-row', bgcolor: 'background.default' }}>
                <Box sx={{ display: 'table-cell', py: 2, px: 3, fontWeight: 'medium', color: 'text.secondary', fontSize: '0.875rem' }}></Box>
                <Box sx={{ display: 'table-cell', py: 2, px: 3, fontWeight: 'medium', color: 'text.secondary', fontSize: '0.875rem' }}>AI Agent</Box>
                <Box sx={{ display: 'table-cell', py: 2, px: 2, fontWeight: 'medium', color: 'text.secondary', fontSize: '0.875rem' }}>Market Cap</Box>
                <Box sx={{ display: 'table-cell', py: 2, px: 2, fontWeight: 'medium', color: 'text.secondary', fontSize: '0.875rem' }}>24h Chg</Box>
                <Box sx={{ display: 'table-cell', py: 2, px: 2, fontWeight: 'medium', color: 'text.secondary', fontSize: '0.875rem' }}>24h Vol</Box>
                <Box sx={{ display: 'table-cell', py: 2, px: 2, fontWeight: 'medium', color: 'text.secondary', fontSize: '0.875rem' }}>Token Price</Box>
                <Box sx={{ display: 'table-cell', py: 2, px: 2, fontWeight: 'medium', color: 'text.secondary', fontSize: '0.875rem' }}>Holders</Box>
                <Box sx={{ display: 'table-cell', py: 2, px: 2, fontWeight: 'medium', color: 'text.secondary', fontSize: '0.875rem' }}>Agent Level</Box>
                <Box sx={{ display: 'table-cell', py: 2, px: 2, fontWeight: 'medium', color: 'text.secondary', fontSize: '0.875rem' }}>Action</Box>
              </Box>
            </Box>
            
            {/* Table Body */}
            <Box sx={{ display: 'table-row-group' }}>
              {agents.map((agent, index) => (
                <Box 
                  key={agent.id}
                  sx={{ 
                    display: 'table-row',
                    bgcolor: index % 2 === 0 ? 'background.paper' : 'background.default',
                    '&:hover': {
                      bgcolor: 'action.hover'
                    },
                    transition: 'background-color 0.2s'
                  }}
                >
                  <Box sx={{ display: 'table-cell', py: 2, px: 3, verticalAlign: 'middle' }}>
                    <Star size={16} color="#94a3b8" />
                  </Box>
                  
                  <Box sx={{ display: 'table-cell', py: 2, px: 3, verticalAlign: 'middle' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Avatar 
                        sx={{ 
                          bgcolor: getAvatarBgColor(agent.name),
                          width: 40,
                          height: 40,
                          fontSize: '0.9rem',
                          fontWeight: 'bold'
                        }}
                      >
                        {getDeviceTypeIcon(agent.deviceType)}
                      </Avatar>
                      <Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                          <Typography variant="body1" fontWeight="medium">{agent.name}</Typography>
                          <Typography variant="caption" color="text.secondary" sx={{ bgcolor: 'background.default', px: 1, borderRadius: 1 }}>
                            ${agent.ticker}
                          </Typography>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                          <Chip 
                            label={agent.category} 
                            size="small"
                            sx={{ 
                              bgcolor: `${getCategoryColor(agent.category)}20`,
                              color: getCategoryColor(agent.category),
                              fontSize: '0.65rem',
                              height: 18
                            }}
                          />
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                            <Clipboard size={12} color="#94a3b8" />
                            <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.65rem' }}>
                              {agent.id.substring(0, 6)}...{agent.id.substring(agent.id.length - 4)}
                            </Typography>
                          </Box>
                        </Box>
                      </Box>
                    </Box>
                  </Box>
                  
                  <Box sx={{ display: 'table-cell', py: 2, px: 2, verticalAlign: 'middle' }}>
                    <Typography variant="body2">${agent.marketCap}</Typography>
                  </Box>
                  
                  <Box sx={{ display: 'table-cell', py: 2, px: 2, verticalAlign: 'middle' }}>
                    {formatChange(agent.change24h)}
                  </Box>
                  
                  <Box sx={{ display: 'table-cell', py: 2, px: 2, verticalAlign: 'middle' }}>
                    <Typography variant="body2">${agent.volume24h}</Typography>
                  </Box>
                  
                  <Box sx={{ display: 'table-cell', py: 2, px: 2, verticalAlign: 'middle' }}>
                    <Typography variant="body2">${agent.tokenPrice}</Typography>
                  </Box>
                  
                  <Box sx={{ display: 'table-cell', py: 2, px: 2, verticalAlign: 'middle' }}>
                    <Typography variant="body2">{agent.holders.toLocaleString()}</Typography>
                  </Box>
                  
                  <Box sx={{ display: 'table-cell', py: 2, px: 2, verticalAlign: 'middle' }}>
                    {agent.level ? (
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Typography variant="body2">Lvl {agent.level}</Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          {[...Array(3)].map((_, i) => (
                            <Box 
                              key={i}
                              sx={{ 
                                width: 8, 
                                height: 8, 
                                borderRadius: '50%', 
                                bgcolor: i < (agent.level || 0) ? '#6b46fe' : 'rgba(107, 70, 254, 0.2)',
                                mx: 0.2
                              }} 
                            />
                          ))}
                        </Box>
                      </Box>
                    ) : (
                      <Typography variant="body2">-</Typography>
                    )}
                  </Box>
                  
                  <Box sx={{ display: 'table-cell', py: 2, px: 2, verticalAlign: 'middle' }}>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <Button 
                        variant="outlined"
                        size="small"
                        sx={{ 
                          borderColor: '#6b46fe',
                          color: '#6b46fe',
                          '&:hover': {
                            borderColor: '#5a35e8',
                            backgroundColor: 'rgba(106, 70, 254, 0.04)'
                          },
                          textTransform: 'none',
                          boxShadow: 'none',
                          borderRadius: 1.5,
                          fontSize: '0.75rem',
                          px: 1.5,
                          py: 0.5
                        }}
                        onClick={() => handleOpenDetailsDialog(agent)}
                      >
                        Stats
                      </Button>
                      <Button 
                        variant="contained"
                        size="small"
                        sx={{ 
                          bgcolor: '#6b46fe',
                          '&:hover': {
                            bgcolor: '#5a35e8'
                          },
                          textTransform: 'none',
                          boxShadow: 'none',
                          borderRadius: 1.5,
                          fontSize: '0.75rem',
                          px: 1.5,
                          py: 0.5
                        }}
                        onClick={() => handleOpenDialog(agent)}
                      >
                        Invest
                      </Button>
                    </Box>
                  </Box>
                </Box>
              ))}
            </Box>
          </Box>
        </Box>
      )}
      
      {/* Token Purchase Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ borderBottom: '1px solid', borderColor: 'divider', pb: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Avatar sx={{ bgcolor: selectedAgent ? getAvatarBgColor(selectedAgent.name) : '#6b46fe' }}>
              {selectedAgent ? getDeviceTypeIcon(selectedAgent.deviceType) : '🤖'}
            </Avatar>
            <Box>
              <Typography variant="h6">Power Up {selectedAgent?.name}</Typography>
              <Typography variant="body2" color="text.secondary">
                Current token price: ${selectedAgent?.tokenPrice}
              </Typography>
            </Box>
          </Box>
        </DialogTitle>
        <DialogContent sx={{ mt: 2 }}>
          <Box sx={{ mb: 3 }}>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              By investing in this agent, you'll power it up and receive tokens that entitle you to a share of its revenue.
              The more powerful the agent becomes, the more efficiently it will manage devices and generate income.
            </Typography>
          </Box>
          
          <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 'medium' }}>Agent Stats</Typography>
          
          <Box sx={{ 
            display: 'grid', 
            gridTemplateColumns: '1fr 1fr', 
            gap: 2,
            mb: 3,
            mt: 2
          }}>
            <Box sx={{ bgcolor: 'background.default', p: 2, borderRadius: 1 }}>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Market Cap
              </Typography>
              <Typography variant="body1" fontWeight="medium">
                ${selectedAgent?.marketCap}
              </Typography>
            </Box>
            
            <Box sx={{ bgcolor: 'background.default', p: 2, borderRadius: 1 }}>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                24h Performance
              </Typography>
              <Typography 
                variant="body1" 
                fontWeight="medium"
                color={(selectedAgent?.change24h !== undefined && selectedAgent.change24h >= 0) ? 'success.main' : 'error.main'}
              >
                {selectedAgent?.change24h !== undefined ? (selectedAgent.change24h >= 0 ? '+' : '') + selectedAgent.change24h.toFixed(2) + '%' : '0.00%'}
              </Typography>
            </Box>
            
            <Box sx={{ bgcolor: 'background.default', p: 2, borderRadius: 1 }}>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Believers
              </Typography>
              <Typography variant="body1" fontWeight="medium">
                {selectedAgent?.holders.toLocaleString()}
              </Typography>
            </Box>
            
            <Box sx={{ bgcolor: 'background.default', p: 2, borderRadius: 1 }}>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Specialization
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Chip 
                  label={selectedAgent?.category} 
                  size="small"
                  sx={{ 
                    bgcolor: selectedAgent ? `${getCategoryColor(selectedAgent.category)}20` : '#e2e8f0',
                    color: selectedAgent ? getCategoryColor(selectedAgent.category) : '#64748b',
                    fontWeight: 'medium'
                  }}
                />
              </Box>
            </Box>
          </Box>
          
          <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 'medium' }}>Your Investment</Typography>
          
          <TextField
            label="Amount (USD)"
            fullWidth
            variant="outlined"
            value={purchaseAmount}
            onChange={(e) => setPurchaseAmount(e.target.value)}
            sx={{ mb: 2 }}
            type="number"
            InputProps={{
              startAdornment: <Box component="span" sx={{ mr: 1 }}>$</Box>,
            }}
          />
          
          {purchaseAmount && (
            <Box sx={{ bgcolor: 'background.default', p: 2, borderRadius: 1, mb: 1 }}>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                You will receive:
              </Typography>
              <Typography variant="body1" fontWeight="bold" color="primary.main">
                {parseFloat(purchaseAmount) && selectedAgent?.tokenPrice ? 
                  (parseFloat(purchaseAmount) / parseFloat(selectedAgent.tokenPrice)).toFixed(2) : '0'} ${selectedAgent?.ticker} tokens
              </Typography>
            </Box>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 3, pt: 2 }}>
          <Button onClick={handleCloseDialog} variant="outlined" color="inherit">
            Cancel
          </Button>
          <Button 
            onClick={handlePurchase} 
            variant="contained"
            disabled={!purchaseAmount || parseFloat(purchaseAmount) <= 0 || isLoading}
            sx={{ 
              bgcolor: '#6b46fe',
              '&:hover': {
                bgcolor: '#5a35e8'
              }
            }}
          >
            {isLoading ? 'Processing...' : 'Power Up Agent'}
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* Agent Performance Details Dialog */}
      <Dialog open={openDetailsDialog} onClose={handleCloseDetailsDialog} maxWidth="md" fullWidth>
        <DialogTitle sx={{ borderBottom: '1px solid', borderColor: 'divider', pb: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Avatar sx={{ bgcolor: selectedAgent ? getAvatarBgColor(selectedAgent.name) : '#6b46fe', width: 48, height: 48 }}>
              {selectedAgent ? getDeviceTypeIcon(selectedAgent.deviceType) : '🤖'}
            </Avatar>
            <Box>
              <Typography variant="h6">{selectedAgent?.name} Performance Stats</Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Chip 
                  label={selectedAgent?.category} 
                  size="small"
                  sx={{ 
                    bgcolor: selectedAgent ? `${getCategoryColor(selectedAgent.category)}20` : '#e2e8f0',
                    color: selectedAgent ? getCategoryColor(selectedAgent.category) : '#64748b'
                  }}
                />
                <Typography variant="body2" color="text.secondary">
                  ${selectedAgent?.ticker}
                </Typography>
              </Box>
            </Box>
          </Box>
        </DialogTitle>
        <DialogContent sx={{ pt: 3 }}>
          {/* Key Metrics */}
          <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 'medium' }}>Performance Metrics</Typography>
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: '1fr 1fr 1fr 1fr' }, gap: 2, mb: 4 }}>
            <Box sx={{ bgcolor: 'background.default', p: 2, borderRadius: 1 }}>
              <Typography variant="body2" color="text.secondary" gutterBottom>Token Price</Typography>
              <Typography variant="h6" fontWeight="bold">${selectedAgent?.tokenPrice}</Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5, display: 'flex', alignItems: 'center', gap: 0.5 }}>
                {(selectedAgent?.change24h || 0) >= 0 ? (
                  <>
                    <Box component="span" sx={{ color: 'success.main', display: 'flex', alignItems: 'center' }}>
                      <TrendingUp size={14} />
                      +{selectedAgent?.change24h?.toFixed(2)}%
                    </Box>
                    <Box component="span">24h</Box>
                  </>
                ) : (
                  <>
                    <Box component="span" sx={{ color: 'error.main', display: 'flex', alignItems: 'center' }}>
                      <TrendingUp size={14} style={{ transform: 'rotate(180deg)' }} />
                      {selectedAgent?.change24h?.toFixed(2)}%
                    </Box>
                    <Box component="span">24h</Box>
                  </>
                )}
              </Typography>
            </Box>
            
            <Box sx={{ bgcolor: 'background.default', p: 2, borderRadius: 1 }}>
              <Typography variant="body2" color="text.secondary" gutterBottom>Market Cap</Typography>
              <Typography variant="h6" fontWeight="bold">${selectedAgent?.marketCap}</Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                Rank #12 by market cap
              </Typography>
            </Box>
            
            <Box sx={{ bgcolor: 'background.default', p: 2, borderRadius: 1 }}>
              <Typography variant="body2" color="text.secondary" gutterBottom>Believers</Typography>
              <Typography variant="h6" fontWeight="bold">{selectedAgent?.holders.toLocaleString()}</Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                +5.7% past 30 days
              </Typography>
            </Box>
            
            <Box sx={{ bgcolor: 'background.default', p: 2, borderRadius: 1 }}>
              <Typography variant="body2" color="text.secondary" gutterBottom>Agent Level</Typography>
              <Typography variant="h6" fontWeight="bold">
                {selectedAgent?.level ? `Level ${selectedAgent.level}` : 'Level 1'}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                87% to next level
              </Typography>
            </Box>
          </Box>
          
          {/* Profitability Section */}
          <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 'medium' }}>Profitability</Typography>
          <Box sx={{ 
            bgcolor: 'background.default', 
            p: 2, 
            borderRadius: 1, 
            mb: 3,
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr 1fr' },
            gap: 3
          }}>
            <Box>
              <Typography variant="body2" color="text.secondary" gutterBottom>Monthly Revenue</Typography>
              <Typography variant="h6" fontWeight="bold" color="success.main">$1,754.26</Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                From {selectedAgent?.deviceType === 'solar-node' ? 'Solar Panels' : 
                  selectedAgent?.deviceType === 'ev-charger' ? 'EV Chargers' : 'Network Devices'}
              </Typography>
            </Box>
            
            <Box>
              <Typography variant="body2" color="text.secondary" gutterBottom>Token Holder Yield</Typography>
              <Typography variant="h6" fontWeight="bold" color="success.main">12.3% APY</Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                Average over last 90 days
              </Typography>
            </Box>
            
            <Box>
              <Typography variant="body2" color="text.secondary" gutterBottom>Revenue Growth</Typography>
              <Typography variant="h6" fontWeight="bold" color="success.main">+7.8%</Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                Month over month
              </Typography>
            </Box>
          </Box>
          
          {/* Devices Managed Section */}
          <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 'medium' }}>Devices Managed</Typography>
          <Box sx={{ 
            bgcolor: 'background.default', 
            p: 2, 
            borderRadius: 1, 
            mb: 3,
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' },
            gap: 2
          }}>
            <Box>
              <Typography variant="body2" color="text.secondary" gutterBottom>Devices Under Management</Typography>
              <Typography variant="h6" fontWeight="bold">237</Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                +12 in past 30 days
              </Typography>
            </Box>
            
            <Box>
              <Typography variant="body2" color="text.secondary" gutterBottom>Network Uptime</Typography>
              <Typography variant="h6" fontWeight="bold" color="success.main">99.7%</Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                Past 30 days
              </Typography>
            </Box>
          </Box>
          
          {/* Verification Section */}
          <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 'medium' }}>Verified Performance</Typography>
          <Box sx={{ 
            p: 2, 
            borderRadius: 1, 
            mb: 3,
            border: '1px solid',
            borderColor: 'success.main',
            bgcolor: 'success.main',
            backgroundOpacity: 0.05
          }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
              <Box sx={{ 
                width: 20, 
                height: 20, 
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                bgcolor: 'success.main'
              }}>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M20 6L9 17L4 12" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </Box>
              <Typography variant="subtitle2" fontWeight="bold" color="success.main">Performance Verified On-Chain</Typography>
            </Box>
            <Typography variant="body2" color="text.secondary">
              All performance metrics are verified on-chain and publicly auditable. View the verification contract at 
              <Box component="span" sx={{ color: 'primary.main', cursor: 'pointer', ml: 0.5 }}>
                0x7a23...45df
              </Box>
            </Typography>
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 3, pt: 2 }}>
          <Button onClick={handleCloseDetailsDialog} variant="outlined" color="inherit">
            Close
          </Button>
          <Button 
            variant="contained"
            sx={{ 
              bgcolor: '#6b46fe',
              '&:hover': {
                bgcolor: '#5a35e8'
              }
            }}
            onClick={() => {
              handleCloseDetailsDialog();
              handleOpenDialog(selectedAgent!);
            }}
          >
            Invest Now
          </Button>
        </DialogActions>
      </Dialog>
    </Card>
  );
} 