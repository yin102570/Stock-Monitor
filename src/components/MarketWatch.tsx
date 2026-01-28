import React, { useState } from 'react';
import {
  Box,
  TextField,
  Tabs,
  Tab,
  Typography,
  Chip,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from '@mui/material';
import { Search } from '@mui/icons-material';
import { StockCard } from './StockCard';
import { StockData } from '../types';

interface MarketWatchProps {
  stocks: StockData[];
  onFavoriteToggle: (id: string) => void;
  onStockClick: (stock: StockData) => void;
}

export const MarketWatch: React.FC<MarketWatchProps> = ({
  stocks,
  onFavoriteToggle,
  onStockClick,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState(0);
  const [filterType, setFilterType] = useState<'all' | 'stock' | 'fund'>('all');
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
  const [sortBy, setSortBy] = useState<'name' | 'change' | 'volume'>('change');

  const filteredStocks = stocks
    .filter((stock) => {
      const matchesSearch = stock.name.includes(searchQuery) || stock.code.includes(searchQuery);
      const matchesType =
        filterType === 'all' || stock.type === filterType;
      const matchesFavorite = !showFavoritesOnly || stock.isFavorite;
      return matchesSearch && matchesType && matchesFavorite;
    })
    .sort((a, b) => {
      if (sortBy === 'name') return a.name.localeCompare(b.name);
      if (sortBy === 'change') return Math.abs(b.changePercent) - Math.abs(a.changePercent);
      if (sortBy === 'volume') return b.volume - a.volume;
      return 0;
    });

  const tabs = [
    { label: '全部', count: stocks.length },
    { label: '股票', count: stocks.filter((s) => s.type === 'stock').length },
    { label: '基金', count: stocks.filter((s) => s.type === 'fund').length },
    { label: '自选', count: stocks.filter((s) => s.isFavorite).length },
  ];

  return (
    <Box sx={{ mb: 4 }}>
      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
        <Typography variant="h5" fontWeight="700">
          市场行情
        </Typography>
        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
          <TextField
            placeholder="搜索股票/基金..."
            size="small"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            InputProps={{
              startAdornment: <Search sx={{ mr: 1, color: '#9ca3af', fontSize: 20 }} />,
            }}
            sx={{ width: 280 }}
          />
          <FormControl size="small" sx={{ minWidth: 120 }}>
            <InputLabel>排序</InputLabel>
            <Select
              value={sortBy}
              label="排序"
              onChange={(e) => setSortBy(e.target.value as 'name' | 'change' | 'volume')}
            >
              <MenuItem value="change">涨跌幅</MenuItem>
              <MenuItem value="volume">成交量</MenuItem>
              <MenuItem value="name">名称</MenuItem>
            </Select>
          </FormControl>
        </Box>
      </Box>

      <Tabs
        value={activeTab}
        onChange={(_, newValue) => {
          setActiveTab(newValue);
          const types = ['all', 'stock', 'fund'] as const;
          if (newValue === 3) {
            setShowFavoritesOnly(true);
            setFilterType('all');
          } else {
            setShowFavoritesOnly(false);
            setFilterType(types[newValue]);
          }
        }}
        sx={{ mb: 3, borderBottom: '2px solid #f0f0f0' }}
      >
        {tabs.map((tab) => (
          <Tab
            key={tab.label}
            label={
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                {tab.label}
                <Chip
                  label={tab.count}
                  size="small"
                  sx={{
                    bgcolor: '#f0f4f8',
                    color: '#667eea',
                    ml: 0.5,
                    height: 20,
                    fontSize: '0.75rem',
                  }}
                />
              </Box>
            }
          />
        ))}
      </Tabs>

      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)', lg: 'repeat(4, 1fr)' }, gap: 3 }}>
        {filteredStocks.length > 0 ? (
          filteredStocks.map((stock) => (
            <StockCard
              key={stock.id}
              stock={stock}
              onFavoriteToggle={onFavoriteToggle}
              onClick={onStockClick}
            />
          ))
        ) : (
          <Box sx={{ gridColumn: '1 / -1', textAlign: 'center', py: 12, color: 'text.secondary' }}>
            <Typography variant="h6">未找到匹配的结果</Typography>
          </Box>
        )}
      </Box>
    </Box>
  );
};
