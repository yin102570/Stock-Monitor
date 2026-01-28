import React from 'react';
import {
  Card,
  CardContent,
  Box,
  Typography,
  IconButton,
  Chip,
  Avatar,
} from '@mui/material';
import { Star, StarBorder, TrendingUp, TrendingDown } from '@mui/icons-material';
import { StockData } from '../types';
import { formatPercent } from '../data/mockData';

interface StockCardProps {
  stock: StockData;
  onFavoriteToggle: (id: string) => void;
  onClick: (stock: StockData) => void;
}

export const StockCard: React.FC<StockCardProps> = ({
  stock,
  onFavoriteToggle,
  onClick,
}) => {
  const isUp = stock.change >= 0;
  const isStock = stock.type === 'stock';

  return (
    <Card
      sx={{
        height: '100%',
        borderRadius: 3,
        cursor: 'pointer',
        transition: 'all 0.3s ease',
        boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
        },
      }}
      onClick={() => onClick(stock)}
    >
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Avatar
              sx={{
                bgcolor: isStock ? '#667eea' : '#f59e0b',
                color: 'white',
                fontWeight: 700,
                width: 48,
                height: 48,
              }}
            >
              {stock.code.slice(0, 2)}
            </Avatar>
            <Box>
              <Typography variant="body2" color="text.secondary">
                {stock.code}
              </Typography>
              <Typography variant="subtitle1" fontWeight="600">
                {stock.name}
              </Typography>
            </Box>
          </Box>
          <IconButton
            size="small"
            onClick={(e) => {
              e.stopPropagation();
              onFavoriteToggle(stock.id);
            }}
            sx={{ color: stock.isFavorite ? '#f59e0b' : 'text.secondary' }}
          >
            {stock.isFavorite ? <Star /> : <StarBorder />}
          </IconButton>
        </Box>

        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', mb: 2 }}>
          <Box>
            <Typography variant="h4" fontWeight="700" sx={{ color: isUp ? '#10b981' : '#ef4444' }}>
              ¥{stock.price.toFixed(2)}
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              {isUp ? (
                <TrendingUp sx={{ fontSize: 18, color: '#10b981' }} />
              ) : (
                <TrendingDown sx={{ fontSize: 18, color: '#ef4444' }} />
              )}
              <Typography
                variant="body2"
                sx={{ color: isUp ? '#10b981' : '#ef4444', fontWeight: 600 }}
              >
                {formatPercent(stock.changePercent)}
              </Typography>
              <Typography
                variant="caption"
                color="text.secondary"
                sx={{ ml: 0.5 }}
              >
                {stock.change >= 0 ? '+' : ''}{stock.change.toFixed(2)}
              </Typography>
            </Box>
          </Box>
        </Box>

        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
          <Chip
            label={isStock ? '股票' : '基金'}
            size="small"
            sx={{
              backgroundColor: isStock ? '#667eea15' : '#f59e0b15',
              color: isStock ? '#667eea' : '#f59e0b',
              border: isStock ? '1px solid #667eea30' : '1px solid #f59e0b30',
            }}
          />
          <Chip
            label={`成交量 ${(stock.volume / 10000).toFixed(0)}万`}
            size="small"
            variant="outlined"
          />
          <Chip
            label={`PE ${stock.pe.toFixed(1)}`}
            size="small"
            variant="outlined"
          />
        </Box>

        <Box sx={{ mt: 2, pt: 2, borderTop: '1px solid #f0f0f0' }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Typography variant="caption" color="text.secondary">
              最高: ¥{stock.high.toFixed(2)}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              最低: ¥{stock.low.toFixed(2)}
            </Typography>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};
