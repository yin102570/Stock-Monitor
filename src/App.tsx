import React, { useState, useEffect } from 'react';
import { Box, Container, Dialog, DialogTitle, DialogContent, DialogActions, Button, Fade, TextField, IconButton, Fab } from '@mui/material';
import { Add as AddIcon, Delete as DeleteIcon, Edit as EditIcon } from '@mui/icons-material';
import { Header } from './components/Header';
import { Dashboard as DashboardComponent } from './components/Dashboard';
import { MarketWatch } from './components/MarketWatch';
import { Portfolio } from './components/Portfolio';
import { PriceAlert } from './components/PriceAlert';
import { PriceChart } from './components/PriceChart';
import { AIAdvisor } from './components/AIAdvisor';
import { StockData, PortfolioItem, AlertRule } from './types';
import { mockStocks, generateMockPriceHistory } from './data/mockData';

function App() {
  const [activeTab, setActiveTab] = useState(0);
  const [stocks, setStocks] = useState<StockData[]>(mockStocks);
  const [alerts, setAlerts] = useState<AlertRule[]>([]);
  const [selectedStock, setSelectedStock] = useState<StockData | null>(null);
  const [openChartDialog, setOpenChartDialog] = useState(false);
  const [portfolio, setPortfolio] = useState<PortfolioItem[]>([]);
  const [openPortfolioDialog, setOpenPortfolioDialog] = useState(false);
  const [editingItem, setEditingItem] = useState<PortfolioItem | null>(null);
  const [portfolioForm, setPortfolioForm] = useState({
    stockId: '',
    shares: '',
    avgCost: '',
  });

  const portfolioValue = portfolio.reduce((sum, item) => sum + item.marketValue, 0);
  const totalCost = portfolio.reduce((sum, item) => sum + item.shares * item.avgCost, 0);
  const totalProfit = portfolioValue - totalCost;
  const profitPercent = totalCost > 0 ? (totalProfit / totalCost) * 100 : 0;

  useEffect(() => {
    const interval = setInterval(() => {
      setStocks((prevStocks) =>
        prevStocks.map((stock) => {
          const change = (Math.random() - 0.5) * stock.price * 0.002;
          const newPrice = Math.max(0.01, stock.price + change);
          const priceChange = newPrice - stock.price;
          const newChangePercent = (priceChange / stock.price) * 100;

          return {
            ...stock,
            price: newPrice,
            change: stock.change + priceChange,
            changePercent: newChangePercent,
            high: Math.max(stock.high, newPrice),
            low: Math.min(stock.low, newPrice),
          };
        })
      );

      setPortfolio((prevPortfolio) =>
        prevPortfolio.map((item) => {
          const currentStock = stocks.find((s) => s.id === item.stockId);
          if (!currentStock) return item;

          const marketValue = item.shares * currentStock.price;
          const profit = marketValue - item.shares * item.avgCost;
          const profitPercent = item.avgCost > 0 ? (profit / (item.shares * item.avgCost)) * 100 : 0;

          return {
            ...item,
            asset: currentStock,
            currentPrice: currentStock.price,
            marketValue,
            profit,
            profitPercent,
          };
        })
      );
    }, 3000);

    return () => clearInterval(interval);
  }, [stocks]);

  const handleFavoriteToggle = (id: string) => {
    setStocks((prevStocks) =>
      prevStocks.map((stock) =>
        stock.id === id ? { ...stock, isFavorite: !stock.isFavorite } : stock
      )
    );
  };

  const handleStockClick = (stock: StockData) => {
    setSelectedStock(stock);
    setOpenChartDialog(true);
  };

  const handleAddAlert = (alert: Omit<AlertRule, 'id' | 'createdAt'>) => {
    const newAlert: AlertRule = {
      ...alert,
      id: Date.now().toString(),
      createdAt: new Date(),
    };
    setAlerts([...alerts, newAlert]);
  };

  const handleDeleteAlert = (id: string) => {
    setAlerts(alerts.filter((alert) => alert.id !== id));
  };

  const handleToggleAlert = (id: string) => {
    setAlerts((prevAlerts) =>
      prevAlerts.map((alert) =>
        alert.id === id ? { ...alert, isActive: !alert.isActive } : alert
      )
    );
  };

  const handleOpenPortfolioDialog = (item?: PortfolioItem) => {
    if (item) {
      setEditingItem(item);
      setPortfolioForm({
        stockId: item.stockId,
        shares: item.shares.toString(),
        avgCost: item.avgCost.toString(),
      });
    } else {
      setEditingItem(null);
      setPortfolioForm({ stockId: '', shares: '', avgCost: '' });
    }
    setOpenPortfolioDialog(true);
  };

  const handleClosePortfolioDialog = () => {
    setOpenPortfolioDialog(false);
    setEditingItem(null);
    setPortfolioForm({ stockId: '', shares: '', avgCost: '' });
  };

  const handleSavePortfolio = () => {
    const stock = stocks.find((s) => s.id === portfolioForm.stockId);
    if (!stock) return;

    const shares = parseFloat(portfolioForm.shares);
    const avgCost = parseFloat(portfolioForm.avgCost);

    if (isNaN(shares) || shares <= 0 || isNaN(avgCost) || avgCost <= 0) {
      alert('请输入有效的数量和成本价');
      return;
    }

    const marketValue = shares * stock.price;
    const profit = marketValue - shares * avgCost;
    const profitPercent = avgCost > 0 ? (profit / (shares * avgCost)) * 100 : 0;

    const newItem: PortfolioItem = {
      id: editingItem ? editingItem.id : Date.now().toString(),
      stockId: stock.id,
      asset: stock,
      shares,
      avgCost,
      currentPrice: stock.price,
      marketValue,
      profit,
      profitPercent,
    };

    if (editingItem) {
      setPortfolio((prev) => prev.map((item) => (item.id === editingItem.id ? newItem : item)));
    } else {
      setPortfolio((prev) => [...prev, newItem]);
    }

    handleClosePortfolioDialog();
  };

  const handleDeletePortfolio = (id: string) => {
    if (confirm('确定要删除这个持仓吗?')) {
      setPortfolio((prev) => prev.filter((item) => item.id !== id));
    }
  };

  const favoriteCount = stocks.filter((stock) => stock.isFavorite).length;

  const renderTabContent = () => {
    switch (activeTab) {
      case 0:
        return (
          <>
            <DashboardComponent
              totalValue={`¥${portfolioValue.toFixed(2)}`}
              totalProfit={`¥${totalProfit.toFixed(2)}`}
              totalProfitPercent={profitPercent}
              assetCount={portfolio.length}
              favoriteCount={favoriteCount}
            />
            <Box sx={{ mt: 4 }}>
              <PriceChart
                data={generateMockPriceHistory(stocks[0].price)}
                symbol={stocks[0].code}
                name={stocks[0].name}
              />
            </Box>
          </>
        );
      case 1:
        return (
          <MarketWatch
            stocks={stocks}
            onFavoriteToggle={handleFavoriteToggle}
            onStockClick={handleStockClick}
          />
        );
      case 2:
        return (
          <Portfolio
            items={portfolio}
            onEdit={handleOpenPortfolioDialog}
            onDelete={handleDeletePortfolio}
          />
        );
      case 3:
        return (
          <AIAdvisor
            portfolioValue={portfolioValue}
            totalProfit={totalProfit}
            profitPercent={profitPercent}
            assetCount={portfolio.length}
          />
        );
      case 4:
        return (
          <PriceAlert
            alerts={alerts}
            onAddAlert={handleAddAlert}
            onDeleteAlert={handleDeleteAlert}
            onToggleAlert={handleToggleAlert}
          />
        );
      default:
        return null;
    }
  };

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#f0f4f8' }}>
      <Header activeTab={activeTab} onTabChange={setActiveTab} />
      <Box sx={{ pt: 14, pb: 4 }}>
        <Container maxWidth="xl">
          <Fade in={true} timeout={800}>
            <Box>
              {renderTabContent()}
            </Box>
          </Fade>
        </Container>
      </Box>

      <Dialog
        open={openChartDialog}
        onClose={() => setOpenChartDialog(false)}
        maxWidth="lg"
        fullWidth
      >
        {selectedStock && (
          <>
            <DialogTitle>
              {selectedStock.name} ({selectedStock.code}) 详细行情
            </DialogTitle>
            <DialogContent>
              <PriceChart
                data={generateMockPriceHistory(selectedStock.price)}
                symbol={selectedStock.code}
                name={selectedStock.name}
              />
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setOpenChartDialog(false)}>关闭</Button>
            </DialogActions>
          </>
        )}
      </Dialog>

      <Dialog
        open={openPortfolioDialog}
        onClose={handleClosePortfolioDialog}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>{editingItem ? '编辑持仓' : '添加持仓'}</DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField
              select
              fullWidth
              label="选择股票"
              value={portfolioForm.stockId}
              onChange={(e) => setPortfolioForm({ ...portfolioForm, stockId: e.target.value })}
              SelectProps={{ native: true }}
            >
              <option value="">请选择股票</option>
              {stocks.map((stock) => (
                <option key={stock.id} value={stock.id}>
                  {stock.name} ({stock.code})
                </option>
              ))}
            </TextField>
            <TextField
              fullWidth
              label="持有数量"
              type="number"
              value={portfolioForm.shares}
              onChange={(e) => setPortfolioForm({ ...portfolioForm, shares: e.target.value })}
              inputProps={{ min: 0 }}
            />
            <TextField
              fullWidth
              label="持仓成本价"
              type="number"
              value={portfolioForm.avgCost}
              onChange={(e) => setPortfolioForm({ ...portfolioForm, avgCost: e.target.value })}
              inputProps={{ min: 0, step: 0.01 }}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClosePortfolioDialog}>取消</Button>
          <Button onClick={handleSavePortfolio} variant="contained">
            {editingItem ? '保存' : '添加'}
          </Button>
        </DialogActions>
      </Dialog>

      <Fab
        color="primary"
        onClick={() => handleOpenPortfolioDialog()}
        sx={{
          position: 'fixed',
          bottom: 24,
          right: 24,
          display: activeTab === 2 ? 'flex' : 'none',
        }}
      >
        <AddIcon />
      </Fab>
    </Box>
  );
}

export default App;
