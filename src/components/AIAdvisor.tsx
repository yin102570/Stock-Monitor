import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Chip,
  Avatar,
  Alert,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
} from '@mui/material';
import {
  AutoAwesome,
  Lightbulb,
  TrendingUp,
  TrendingDown,
  Security,
  AccountBalance,
} from '@mui/icons-material';
import { AIRecommendation, AIAnalysisRequest } from '../types/ai';

interface AIAdvisorProps {
  portfolioValue: number;
  totalProfit: number;
  profitPercent: number;
  assetCount: number;
}

const generateAIRecommendations = (
  request: AIAnalysisRequest
): AIRecommendation[] => {
  const recommendations: AIRecommendation[] = [];

  if (request.profitPercent > 10) {
    recommendations.push({
      id: '1',
      type: 'sell',
      title: '获利了结建议',
      content: `当前投资组合收益率 ${request.profitPercent.toFixed(2)}%，已达到理想收益水平。建议考虑适当减仓锁定收益，或调整投资组合配置，平衡风险收益比。重点关注盈利较多的个股，设置止盈点位。`,
      confidence: 85,
      riskLevel: 'low',
      timestamp: new Date(),
    });
  }

  if (request.profitPercent < -5) {
    recommendations.push({
      id: '2',
      type: 'buy',
      title: '低位补仓建议',
      content: `当前投资组合亏损 ${Math.abs(request.profitPercent).toFixed(2)}%，市场处于相对低位。建议：
      1. 分析持仓个股基本面，优质标的可考虑低位补仓降低成本
      2. 评估是否为系统性风险，如是则控制仓位
      3. 适当增加现金储备，等待反弹机会`,
      confidence: 78,
      riskLevel: 'medium',
      timestamp: new Date(),
    });
  }

  if (request.assetCount > 8) {
    recommendations.push({
      id: '3',
      type: 'sell',
      title: '仓位分散建议',
      content: `持仓数量达到 ${request.assetCount} 只，建议优化仓位配置：
      1. 集中资金于优质核心标的（前3-5只）
      2. 清理表现不佳的非核心持仓
      3. 保留10%现金作为机动资金`,
      confidence: 75,
      riskLevel: 'low',
      timestamp: new Date(),
    });
  }

  if (request.assetCount < 3) {
    recommendations.push({
      id: '4',
      type: 'buy',
      title: '分散投资建议',
      content: '当前持仓较为集中，建议通过配置多只不同行业的优质标的分散风险。重点关注：1. 行业分散（消费、科技、医药等） 2. 风格分散（成长型+价值型） 3. 考虑配置指数型基金降低选股风险',
      confidence: 82,
      riskLevel: 'low',
      timestamp: new Date(),
    });
  }

  recommendations.push({
    id: '5',
    type: 'hold',
    title: '持仓优化建议',
    content: `基于当前投资组合表现，AI 分析建议：
      1. 每周复盘持仓表现，动态调整
      2. 关注行业轮动机会，提前布局
      3. 控制单一股票仓位不超过总资金的20%
      4. 建立止盈止损机制，严格执行纪律`,
    confidence: 70,
    riskLevel: 'low',
    timestamp: new Date(),
  });

  if (request.recentPerformance > 15) {
    recommendations.push({
      id: '6',
      type: 'watch',
      title: '热点追踪建议',
      content: '市场近期表现活跃，建议关注热点板块和龙头个股，但需警惕追高风险。可考虑：1. 分批建仓，避免一次性投入 2. 设定严格止损位 3. 快进快出，不贪图最高收益',
      confidence: 68,
      riskLevel: 'high',
      timestamp: new Date(),
    });
  }

  return recommendations.sort((a, b) => b.confidence - a.confidence);
};

export const AIAdvisor: React.FC<AIAdvisorProps> = ({
  portfolioValue,
  totalProfit,
  profitPercent,
  assetCount,
}) => {
  const [openChat, setOpenChat] = useState(false);
  const [userQuery, setUserQuery] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [chatHistory, setChatHistory] = useState<Array<{ role: 'user' | 'ai', content: string }>>([]);
  const [recommendations, setRecommendations] = useState<AIRecommendation[]>([]);

  const handleAnalyze = () => {
    if (!userQuery.trim()) return;

    setIsAnalyzing(true);
    setUserQuery('');

    setTimeout(() => {
      const userQuestion = userQuery.trim().toLowerCase();
      let aiResponse = '';

      if (userQuestion.includes('买') || userQuestion.includes('买点')) {
        aiResponse = '根据当前市场数据分析，建议关注以下买点：1. 技术面：关注回踩支撑位的个股，成交量放大时入场 2. 基本面：优选低估值、高成长标的 3. 时机：市场回调时分批建仓，降低平均成本 4. 止损：设置-5%~8%的止损位控制风险';
      } else if (userQuestion.includes('卖') || userQuestion.includes('卖点')) {
        aiResponse = '关于卖出时机的建议：1. 止盈：达到目标收益20%~30%时减仓一半 2. 跌破：跌破重要均线或支撑位时及时止损 3. 换股：发现更优标的时，可考虑换仓 4. 情绪：市场过热、情绪高涨时适当获利了结';
      } else if (userQuestion.includes('风险') || userQuestion.includes('控制')) {
        aiResponse = '风险控制核心策略：1. 仓位管理：单只股票不超过总资金20% 2. 止损纪律：严格执行-8%止损，不存侥幸心理 3. 分散投资：持有5~10只不同行业标的 4. 现金储备：保留10%~15%现金应对机会 5. 定期复盘：每月评估投资组合，及时调整';
      } else if (userQuestion.includes('配置') || userQuestion.includes('组合')) {
        aiResponse = '投资组合配置建议：1. 核心仓位（60%）：消费、科技等优质龙头 2. 卫星仓位（20%）：成长性较好的中小盘 3. 现金储备（10%）：应对市场机会 4. 防御资产（10%）：债券、货币基金降低波动';
      } else {
        aiResponse = '根据您的投资组合分析，AI 智能建议：1. 坚持价值投资理念，关注企业基本面 2. 不追涨杀跌，保持理性投资心态 3. 长期持有优质标的，避免频繁交易 4. 定期学习提升，关注市场动态和政策导向 5. 建立完善的投资纪律和风控体系';
      }

      setChatHistory([...chatHistory, { role: 'user', content: userQuery }]);
      setTimeout(() => {
        setChatHistory([...chatHistory, { role: 'user', content: userQuery }, { role: 'ai', content: aiResponse }]);
        setIsAnalyzing(false);
      }, 1000);
    }, 2000);
  };

  const handleGenerateRecommendations = () => {
    const request: AIAnalysisRequest = {
      portfolioValue,
      totalProfit,
      profitPercent,
      assetCount,
      recentPerformance: profitPercent,
    };

    const recommendations = generateAIRecommendations(request);
    setRecommendations(recommendations);
  };

  const getRecommendationIcon = (type: string) => {
    switch (type) {
      case 'buy':
        return <TrendingUp />;
      case 'sell':
        return <TrendingDown />;
      case 'hold':
        return <AccountBalance />;
      case 'watch':
        return <AutoAwesome />;
      default:
        return <Lightbulb />;
    }
  };

  const getRecommendationColor = (type: string) => {
    switch (type) {
      case 'buy':
        return '#10b981';
      case 'sell':
        return '#ef4444';
      case 'hold':
        return '#3b82f6';
      case 'watch':
        return '#f59e0b';
      default:
        return '#6b7280';
    }
  };

  const getRiskColor = (level: string) => {
    switch (level) {
      case 'low':
        return '#10b981';
      case 'medium':
        return '#f59e0b';
      case 'high':
        return '#ef4444';
      default:
        return '#6b7280';
    }
  };

  return (
    <Box sx={{ mb: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h5" fontWeight="700">
          AI 智能投资助手
        </Typography>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button
            variant="outlined"
            startIcon={<Lightbulb />}
            onClick={handleGenerateRecommendations}
          >
            生成建议
          </Button>
          <Button
            variant="contained"
            startIcon={<AutoAwesome />}
            onClick={() => setOpenChat(true)}
            sx={{
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              '&:hover': {
                background: 'linear-gradient(135deg, #5568d3 0%, #6b4191 100%)',
              },
            }}
          >
            AI 对话
          </Button>
        </Box>
      </Box>

      <Alert severity="info" sx={{ mb: 3, borderRadius: 2 }}>
        <Typography variant="body2">
          AI 投资助手基于您的投资组合表现和市场数据，提供个性化投资建议。建议仅供参考，投资需谨慎。
        </Typography>
      </Alert>

      {recommendations.length > 0 && (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {recommendations.map((recommendation) => (
            <Card
              key={recommendation.id}
              sx={{
                borderRadius: 2,
                boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                borderLeft: `4px solid ${getRecommendationColor(recommendation.type)}`,
              }}
            >
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Avatar
                      sx={{
                        bgcolor: `${getRecommendationColor(recommendation.type)}15`,
                        color: getRecommendationColor(recommendation.type),
                      }}
                    >
                      {getRecommendationIcon(recommendation.type)}
                    </Avatar>
                    <Box>
                      <Typography variant="h6" fontWeight="700">
                        {recommendation.title}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {recommendation.timestamp.toLocaleString()}
                      </Typography>
                    </Box>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Chip
                      label={`置信度 ${recommendation.confidence}%`}
                      size="small"
                      sx={{
                        bgcolor: '#667eea15',
                        color: '#667eea',
                      }}
                    />
                    <Chip
                      label={recommendation.riskLevel === 'low' ? '低风险' : recommendation.riskLevel === 'medium' ? '中风险' : '高风险'}
                      size="small"
                      sx={{
                        bgcolor: `${getRiskColor(recommendation.riskLevel)}15`,
                        color: getRiskColor(recommendation.riskLevel),
                      }}
                    />
                  </Box>
                </Box>
                <Typography variant="body2" sx={{ whiteSpace: 'pre-line', lineHeight: 1.8 }}>
                  {recommendation.content}
                </Typography>
              </CardContent>
            </Card>
          ))}
        </Box>
      )}

      <Dialog open={openChat} onClose={() => setOpenChat(false)} maxWidth="md" fullWidth>
        <DialogTitle>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <AutoAwesome sx={{ color: '#667eea' }} />
            AI 投资咨询
          </Box>
        </DialogTitle>
        <DialogContent>
          <Box sx={{ height: 400, overflow: 'auto', mb: 2 }}>
            {chatHistory.map((msg, index) => (
              <Box
                key={index}
                sx={{
                  mb: 2,
                  p: 2,
                  borderRadius: 2,
                  bgcolor: msg.role === 'user' ? '#667eea' : '#f0f4f8',
                  maxWidth: '80%',
                  ml: msg.role === 'user' ? 'auto' : 0,
                }}
              >
                <Typography variant="body2" sx={{ color: msg.role === 'user' ? 'white' : '#1a1a2e' }}>
                  {msg.content}
                </Typography>
              </Box>
            ))}
            {isAnalyzing && (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, p: 2 }}>
                <CircularProgress size={20} />
                <Typography variant="body2" color="text.secondary">
                  AI 正在分析...
                </Typography>
              </Box>
            )}
          </Box>
          <TextField
            fullWidth
            multiline
            rows={2}
            placeholder="请输入您的问题，如：什么时候买？如何控制风险？..."
            value={userQuery}
            onChange={(e) => setUserQuery(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleAnalyze();
              }
            }}
            disabled={isAnalyzing}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenChat(false)}>关闭</Button>
          <Button
            variant="contained"
            onClick={handleAnalyze}
            disabled={!userQuery.trim() || isAnalyzing}
            sx={{
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              '&:hover': {
                background: 'linear-gradient(135deg, #5568d3 0%, #6b4191 100%)',
              },
            }}
          >
            发送咨询
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};
