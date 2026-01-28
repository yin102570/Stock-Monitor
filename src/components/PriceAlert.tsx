import React from 'react';
import {
  Box,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Switch,
  FormControlLabel,
  Chip,
} from '@mui/material';
import { NotificationAdd, Delete } from '@mui/icons-material';
import { AlertRule } from '../types';

interface PriceAlertProps {
  alerts: AlertRule[];
  onAddAlert: (alert: Omit<AlertRule, 'id' | 'createdAt'>) => void;
  onDeleteAlert: (id: string) => void;
  onToggleAlert: (id: string) => void;
}

export const PriceAlert: React.FC<PriceAlertProps> = ({
  alerts,
  onAddAlert,
  onDeleteAlert,
  onToggleAlert,
}) => {
  const [open, setOpen] = React.useState(false);
  const [assetId, setAssetId] = React.useState('');
  const [assetName, setAssetName] = React.useState('');
  const [alertType, setAlertType] = React.useState<'above' | 'below'>('above');
  const [targetPrice, setTargetPrice] = React.useState('');

  const handleAddAlert = () => {
    if (!assetId || !assetName || !targetPrice) return;

    onAddAlert({
      assetId,
      assetName,
      type: alertType,
      targetPrice: parseFloat(targetPrice),
      isActive: true,
    });

    setAssetId('');
    setAssetName('');
    setTargetPrice('');
    setOpen(false);
  };

  return (
    <Box sx={{ mb: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h5" fontWeight="700">
          价格预警
        </Typography>
        <Button
          variant="contained"
          startIcon={<NotificationAdd />}
          onClick={() => setOpen(true)}
          sx={{
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            '&:hover': {
              background: 'linear-gradient(135deg, #5568d3 0%, #6b4191 100%)',
            },
          }}
        >
          添加预警
        </Button>
      </Box>

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        {alerts.length === 0 ? (
          <Box sx={{ textAlign: 'center', py: 8, color: 'text.secondary' }}>
            <Typography variant="h6">暂无价格预警</Typography>
            <Typography variant="body2">添加预警规则，及时获取价格提醒</Typography>
          </Box>
        ) : (
          alerts.map((alert) => (
            <Box
              key={alert.id}
              sx={{
                p: 3,
                borderRadius: 2,
                boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                opacity: alert.isActive ? 1 : 0.5,
                transition: 'opacity 0.3s',
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Typography variant="h6" fontWeight="600">
                  {alert.assetName}
                </Typography>
                <Chip
                  label={alert.type === 'above' ? '高于' : '低于'}
                  size="small"
                  sx={{
                    bgcolor: alert.type === 'above' ? '#10b98115' : '#ef444415',
                    color: alert.type === 'above' ? '#10b981' : '#ef4444',
                  }}
                />
                <Typography variant="h5" fontWeight="700" sx={{ color: '#667eea' }}>
                  ¥{alert.targetPrice.toFixed(2)}
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', gap: 1 }}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={alert.isActive}
                      onChange={() => onToggleAlert(alert.id)}
                      color="primary"
                    />
                  }
                  label={alert.isActive ? '启用' : '禁用'}
                />
                <Button
                  size="small"
                  color="error"
                  startIcon={<Delete />}
                  onClick={() => onDeleteAlert(alert.id)}
                >
                  删除
                </Button>
              </Box>
            </Box>
          ))
        )}
      </Box>

      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>添加价格预警</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
            <TextField
              label="证券代码"
              value={assetId}
              onChange={(e) => setAssetId(e.target.value)}
              placeholder="如: 600519"
              fullWidth
            />
            <TextField
              label="证券名称"
              value={assetName}
              onChange={(e) => setAssetName(e.target.value)}
              placeholder="如: 贵州茅台"
              fullWidth
            />
            <TextField
              label="目标价格"
              type="number"
              value={targetPrice}
              onChange={(e) => setTargetPrice(e.target.value)}
              placeholder="输入目标价格"
              fullWidth
              InputProps={{
                startAdornment: <Box sx={{ mr: 1 }}>¥</Box>,
              }}
            />
            <Box sx={{ display: 'flex', gap: 2 }}>
              <Button
                variant={alertType === 'above' ? 'contained' : 'outlined'}
                onClick={() => setAlertType('above')}
                sx={{ flex: 1 }}
              >
                价格高于
              </Button>
              <Button
                variant={alertType === 'below' ? 'contained' : 'outlined'}
                onClick={() => setAlertType('below')}
                sx={{ flex: 1 }}
              >
                价格低于
              </Button>
            </Box>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>取消</Button>
          <Button
            onClick={handleAddAlert}
            variant="contained"
            disabled={!assetId || !assetName || !targetPrice}
          >
            添加
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};
