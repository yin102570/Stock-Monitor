import React from 'react';
import {
  Card,
  CardContent,
  Box,
  Typography,
  Avatar,
  useTheme,
} from '@mui/material';
import { TrendingUp, TrendingDown, AccountBalance, PieChart } from '@mui/icons-material';

interface StatsCardProps {
  title: string;
  value: string;
  change?: string;
  changePercent?: number;
  icon: React.ReactNode;
  color: string;
  gradient?: string;
}

export const StatsCard: React.FC<StatsCardProps> = ({
  title,
  value,
  change,
  changePercent,
  icon,
  color,
  gradient,
}) => {
  const theme = useTheme();

  return (
    <Card
      sx={{
        height: '100%',
        borderRadius: 3,
        transition: 'all 0.3s ease',
        boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
        },
      }}
    >
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <Box>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              {title}
            </Typography>
            <Typography variant="h4" fontWeight="700" sx={{ color, mb: 1 }}>
              {value}
            </Typography>
            {change && changePercent !== undefined && (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                {changePercent >= 0 ? (
                  <TrendingUp sx={{ fontSize: 18, color: '#10b981' }} />
                ) : (
                  <TrendingDown sx={{ fontSize: 18, color: '#ef4444' }} />
                )}
                <Typography
                  variant="body2"
                  sx={{ color: changePercent >= 0 ? '#10b981' : '#ef4444', fontWeight: 500 }}
                >
                  {change}
                </Typography>
              </Box>
            )}
          </Box>
          <Avatar
            sx={{
              bgcolor: gradient || `${color}15`,
              color,
              width: 56,
              height: 56,
            }}
          >
            {icon}
          </Avatar>
        </Box>
      </CardContent>
    </Card>
  );
};
