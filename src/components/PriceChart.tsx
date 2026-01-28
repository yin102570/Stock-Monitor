import React from 'react';
import { Box, Typography } from '@mui/material';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
  AreaChart,
} from 'recharts';

interface PriceHistoryPoint {
  date: string;
  price: number;
}

interface PriceChartProps {
  data: PriceHistoryPoint[];
  symbol: string;
  name: string;
}

export const PriceChart: React.FC<PriceChartProps> = ({ data, symbol, name }) => {
  const minPrice = Math.min(...data.map((d) => d.price));
  const maxPrice = Math.max(...data.map((d) => d.price));
  const latestPrice = data[data.length - 1].price;
  const startPrice = data[0].price;
  const change = latestPrice - startPrice;
  const changePercent = (change / startPrice) * 100;

  return (
    <Box
      sx={{
        p: 3,
        borderRadius: 3,
        boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
        bgcolor: 'white',
      }}
    >
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box>
          <Typography variant="h6" fontWeight="700">
            {name} ({symbol})
          </Typography>
          <Typography variant="body2" color="text.secondary">
            价格走势
          </Typography>
        </Box>
        <Box sx={{ textAlign: 'right' }}>
          <Typography variant="h4" fontWeight="700" sx={{ color: change >= 0 ? '#10b981' : '#ef4444' }}>
            ¥{latestPrice.toFixed(2)}
          </Typography>
          <Typography
            variant="body2"
            sx={{ color: change >= 0 ? '#10b981' : '#ef4444', fontWeight: 600 }}
          >
            {change >= 0 ? '+' : ''}{change.toFixed(2)} ({change >= 0 ? '+' : ''}{changePercent.toFixed(2)}%)
          </Typography>
        </Box>
      </Box>

      <ResponsiveContainer width="100%" height={300}>
        <AreaChart data={data}>
          <defs>
            <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={change >= 0 ? '#10b981' : '#ef4444'} stopOpacity={0.3} />
              <stop offset="95%" stopColor={change >= 0 ? '#10b981' : '#ef4444'} stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
          <XAxis
            dataKey="date"
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 12, fill: '#9ca3af' }}
            tickFormatter={(value) => {
              const date = new Date(value);
              return `${date.getMonth() + 1}/${date.getDate()}`;
            }}
          />
          <YAxis
            domain={[minPrice * 0.95, maxPrice * 1.05]}
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 12, fill: '#9ca3af' }}
            tickFormatter={(value) => `¥${value.toFixed(0)}`}
          />
          <Tooltip
            contentStyle={{
              borderRadius: 8,
              boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
              border: 'none',
            }}
            formatter={(value: number | undefined) => value !== undefined ? [`¥${value.toFixed(2)}`, ''] : ['', '']}
          />
          <Area
            type="monotone"
            dataKey="price"
            stroke={change >= 0 ? '#10b981' : '#ef4444'}
            strokeWidth={2}
            fillOpacity={1}
            fill="url(#colorPrice)"
          />
        </AreaChart>
      </ResponsiveContainer>

      <Box sx={{ display: 'flex', gap: 3, mt: 3, justifyContent: 'space-around' }}>
        <Box>
          <Typography variant="caption" color="text.secondary">
            最高
          </Typography>
          <Typography variant="h6" fontWeight="600" sx={{ color: '#10b981' }}>
            ¥{maxPrice.toFixed(2)}
          </Typography>
        </Box>
        <Box>
          <Typography variant="caption" color="text.secondary">
            最低
          </Typography>
          <Typography variant="h6" fontWeight="600" sx={{ color: '#ef4444' }}>
            ¥{minPrice.toFixed(2)}
          </Typography>
        </Box>
        <Box>
          <Typography variant="caption" color="text.secondary">
            振幅
          </Typography>
          <Typography variant="h6" fontWeight="600" color="text.secondary">
            {((maxPrice - minPrice) / startPrice * 100).toFixed(2)}%
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};
