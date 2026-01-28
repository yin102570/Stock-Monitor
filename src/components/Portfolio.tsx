import React from 'react';
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Avatar,
  IconButton,
} from '@mui/material';
import { Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { PortfolioItem } from '../types';
import { formatCurrency, formatPercent } from '../data/mockData';

interface PortfolioProps {
  items: PortfolioItem[];
  onEdit?: (item: PortfolioItem) => void;
  onDelete?: (id: string) => void;
}

export const Portfolio: React.FC<PortfolioProps> = ({ items, onEdit, onDelete }) => {
  const totalValue = items.reduce((sum, item) => sum + item.marketValue, 0);
  const totalCost = items.reduce((sum, item) => sum + item.shares * item.avgCost, 0);
  const totalProfit = items.reduce((sum, item) => sum + item.profit, 0);
  const totalProfitPercent = totalCost > 0 ? (totalProfit / totalCost) * 100 : 0;

  if (items.length === 0) {
    return (
      <Box sx={{ mb: 4, textAlign: 'center', py: 8 }}>
        <Typography variant="h6" color="text.secondary" gutterBottom>
          还没有持仓记录
        </Typography>
        <Typography variant="body2" color="text.secondary">
          点击右下角的 + 按钮添加你的第一只股票
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ mb: 4 }}>
      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
        <Typography variant="h5" fontWeight="700">
          投资组合
        </Typography>
        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
          <Chip
            label={`总成本: ¥${totalCost.toFixed(2)}`}
            variant="outlined"
          />
          <Chip
            label={`总市值: ¥${totalValue.toFixed(2)}`}
            variant="outlined"
          />
          <Chip
            label={`总收益: ¥${totalProfit.toFixed(2)} (${formatPercent(totalProfitPercent)})`}
            sx={{
              bgcolor: totalProfit >= 0 ? '#10b98115' : '#ef444415',
              color: totalProfit >= 0 ? '#10b981' : '#ef4444',
            }}
          />
        </Box>
      </Box>

      <TableContainer
        component={Box}
        sx={{
          borderRadius: 2,
          boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
          '& .MuiTableCell-root': {
            borderBottom: '1px solid #f0f0f0',
          },
        }}
      >
        <Table>
          <TableHead sx={{ bgcolor: '#f8fafc' }}>
            <TableRow>
              <TableCell>名称</TableCell>
              <TableCell align="right">持有数量</TableCell>
              <TableCell align="right">持仓成本</TableCell>
              <TableCell align="right">当前价格</TableCell>
              <TableCell align="right">市值</TableCell>
              <TableCell align="right">收益</TableCell>
              <TableCell align="right">收益率</TableCell>
              {(onEdit || onDelete) && <TableCell align="right">操作</TableCell>}
            </TableRow>
          </TableHead>
          <TableBody>
            {items.map((item) => (
              <TableRow
                key={item.id}
                sx={{
                  '&:hover': {
                    bgcolor: '#f8fafc',
                  },
                  transition: 'background-color 0.2s',
                }}
              >
                <TableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Avatar
                      sx={{
                        bgcolor: item.asset.type === 'stock' ? '#667eea' : '#f59e0b',
                        width: 36,
                        height: 36,
                      }}
                    >
                      {item.asset.code.slice(0, 2)}
                    </Avatar>
                    <Box>
                      <Typography variant="body2" fontWeight="600">
                        {item.asset.name}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {item.asset.code}
                      </Typography>
                    </Box>
                  </Box>
                </TableCell>
                <TableCell align="right">{item.shares.toFixed(0)}</TableCell>
                <TableCell align="right">¥{item.avgCost.toFixed(2)}</TableCell>
                <TableCell align="right">¥{item.currentPrice.toFixed(2)}</TableCell>
                <TableCell align="right">¥{item.marketValue.toFixed(2)}</TableCell>
                <TableCell align="right">
                  <Typography
                    sx={{
                      color: item.profit >= 0 ? '#10b981' : '#ef4444',
                      fontWeight: 600,
                    }}
                  >
                    {item.profit >= 0 ? '+' : ''}¥{item.profit.toFixed(2)}
                  </Typography>
                </TableCell>
                <TableCell align="right">
                  <Chip
                    label={formatPercent(item.profitPercent)}
                    size="small"
                    sx={{
                      bgcolor: item.profitPercent >= 0 ? '#10b98115' : '#ef444415',
                      color: item.profitPercent >= 0 ? '#10b981' : '#ef4444',
                    }}
                  />
                </TableCell>
                {(onEdit || onDelete) && (
                  <TableCell align="right">
                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
                      {onEdit && (
                        <IconButton
                          size="small"
                          onClick={() => onEdit(item)}
                          sx={{ color: '#667eea' }}
                        >
                          <EditIcon fontSize="small" />
                        </IconButton>
                      )}
                      {onDelete && (
                        <IconButton
                          size="small"
                          onClick={() => onDelete(item.id)}
                          sx={{ color: '#ef4444' }}
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      )}
                    </Box>
                  </TableCell>
                )}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};
