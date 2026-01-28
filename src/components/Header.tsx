import React from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Box,
  Tabs,
  Tab,
  Menu,
  MenuItem,
} from '@mui/material';
import { ShowChart, Dashboard, Notifications, AccountBalance, Menu as MenuIcon } from '@mui/icons-material';

interface HeaderProps {
  activeTab: number;
  onTabChange: (value: number) => void;
}

export const Header: React.FC<HeaderProps> = ({ activeTab, onTabChange }) => {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  return (
    <AppBar
      position="fixed"
      sx={{
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
        backdropFilter: 'blur(10px)',
      }}
    >
      <Toolbar>
        <ShowChart sx={{ mr: 2, fontSize: 32 }} />
        <Typography
          variant="h6"
          component="div"
          sx={{ flexGrow: 1, fontWeight: 700, fontSize: '1.5rem' }}
        >
          股票基金监控
        </Typography>
        <Tabs
          value={activeTab}
          onChange={(_, newValue) => onTabChange(newValue)}
          sx={{
            '& .MuiTab-root': {
              color: 'rgba(255,255,255,0.7)',
              '&.Mui-selected': {
                color: 'white',
              },
            },
            '& .MuiTabs-indicator': {
              backgroundColor: 'white',
            },
          }}
        >
          <Tab label="仪表板" />
          <Tab label="市场行情" />
          <Tab label="投资组合" />
          <Tab label="AI助手" />
          <Tab label="预警设置" />
        </Tabs>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <IconButton
            sx={{ color: 'white' }}
            onClick={handleMenuOpen}
          >
            <MenuIcon />
          </IconButton>
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'right',
            }}
            transformOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
          >
            <MenuItem onClick={handleMenuClose}>关于我们</MenuItem>
            <MenuItem onClick={handleMenuClose}>使用说明</MenuItem>
            <MenuItem onClick={handleMenuClose}>设置</MenuItem>
          </Menu>
        </Box>
      </Toolbar>
    </AppBar>
  );
};
