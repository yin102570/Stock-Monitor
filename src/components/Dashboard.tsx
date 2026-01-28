import React from 'react';
import { Box, Container, Typography } from '@mui/material';
import { AccountBalance, PieChart, ShowChart, Star } from '@mui/icons-material';
import { StatsCard } from './StatsCard';

interface DashboardProps {
  totalValue: string;
  totalProfit: string;
  totalProfitPercent: number;
  assetCount: number;
  favoriteCount: number;
}

export const Dashboard: React.FC<DashboardProps> = ({
  totalValue,
  totalProfit,
  totalProfitPercent,
  assetCount,
  favoriteCount,
}) => {
  return (
    <Box sx={{ mb: 4 }}>
      <Box sx={{ mb: 3 }}>
        <Typography
          variant="h3"
          fontWeight="700"
          gutterBottom
          sx={{
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}
        >
          投资概览
        </Typography>
        <Typography variant="body1" color="text.secondary">
          实时监控您的投资组合和市场动态
        </Typography>
      </Box>

      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' }, gap: 3 }}>
        <StatsCard
          title="总资产"
          value={totalValue}
          icon={<AccountBalance sx={{ fontSize: 28 }} />}
          color="#667eea"
          gradient="linear-gradient(135deg, #667eea20 0%, #764ba220 100%)"
        />
        <StatsCard
          title="总收益"
          value={totalProfit}
          change={totalProfitPercent >= 0 ? `+${totalProfitPercent.toFixed(2)}%` : `${totalProfitPercent.toFixed(2)}%`}
          changePercent={totalProfitPercent}
          icon={<ShowChart sx={{ fontSize: 28 }} />}
          color={totalProfitPercent >= 0 ? '#10b981' : '#ef4444'}
          gradient={totalProfitPercent >= 0 ? 'linear-gradient(135deg, #10b98120 0%, #05966920 100%)' : 'linear-gradient(135deg, #ef444420 0%, #dc262620 100%)'}
        />
        <StatsCard
          title="持仓数量"
          value={assetCount.toString()}
          icon={<PieChart sx={{ fontSize: 28 }} />}
          color="#f59e0b"
        />
        <StatsCard
          title="自选数量"
          value={favoriteCount.toString()}
          icon={<Star sx={{ fontSize: 28 }} />}
          color="#3b82f6"
        />
      </Box>
    </Box>
  );
};
