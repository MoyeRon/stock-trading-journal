// 腾讯股票接口
export interface StockQuote {
  code: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
  amount: number;
}

// 腾讯股票数据获取
export class TencentStockApi {
  // 腾讯股票接口基础URL
  private static readonly BASE_URL = 'https://qt.gtimg.cn/q=';

  /**
   * 获取股票实时数据
   * @param stockCodes 股票代码数组（支持多个代码）
   */
  static async getStockQuotes(stockCodes: string[]): Promise<StockQuote[]> {
    if (stockCodes.length === 0) return [];

    try {
      // 构建腾讯股票查询参数
      const queryCodes = stockCodes.map(code => {
        if (code.startsWith('6')) {
          return `sh${code}`;
        }
        return `sz${code}`;
      }).join(',');

      const url = `${this.BASE_URL}${queryCodes}`;
      
      const response = await fetch(url);
      const text = await response.text();
      
      return this.parseTencentResponse(text);
    } catch (error) {
      console.error('获取股票数据失败:', error);
      return this.getFallbackData(stockCodes);
    }
  }

  /**
   * 解析腾讯股票接口返回的数据
   */
  private static parseTencentResponse(text: string): StockQuote[] {
    const result: StockQuote[] = [];
    
    const lines = text.split('\n').filter(line => line.trim());
    
    for (const line of lines) {
      if (!line || !line.includes('~')) continue;
      
      // 腾讯股票数据格式：v_sh600519="1~贵州茅台~600519~1920.00~1915.00~1910.00~1930.00~1925.00..."
      const match = line.match(/v_(sh|sz)(\d+)="([^"]+)"/);
      if (!match) continue;
      
      const [, , code, data] = match;
      const fields = data.split('~');
      
      if (fields.length < 32) continue;

      const name = fields[1];
      const open = parseFloat(fields[5]) || 0;
      const close = parseFloat(fields[4]) || 0; // 昨收
      const current = parseFloat(fields[3]) || 0;
      const high = parseFloat(fields[33]) || current;
      const low = parseFloat(fields[34]) || current;
      const volume = parseFloat(fields[6]) || 0;
      const amount = parseFloat(fields[37]) || 0;
      
      const change = current - close;
      const changePercent = close !== 0 ? (change / close) * 100 : 0;

      result.push({
        code,
        name,
        price: current,
        change,
        changePercent,
        open,
        high,
        low,
        close,
        volume,
        amount
      });
    }
    
    return result;
  }

  /**
   * 备用数据（当接口失败时使用）
   */
  private static getFallbackData(stockCodes: string[]): StockQuote[] {
    const fallbackPrices: Record<string, { name: string; price: number }> = {
      '600519': { name: '贵州茅台', price: 1920.0 },
      '000001': { name: '平安银行', price: 13.2 },
      '000858': { name: '五粮液', price: 158.8 },
      '601318': { name: '中国平安', price: 45.2 },
      '601398': { name: '工商银行', price: 5.85 },
      '002594': { name: '比亚迪', price: 228.5 }
    };

    return stockCodes.map(code => {
      const fallback = fallbackPrices[code] || { name: code, price: 10.0 };
      return {
        code,
        name: fallback.name,
        price: fallback.price,
        change: 0,
        changePercent: 0,
        open: fallback.price,
        high: fallback.price,
        low: fallback.price,
        close: fallback.price,
        volume: 0,
        amount: 0
      };
    });
  }

  /**
   * 获取单只股票的实时价格
   */
  static async getStockPrice(stockCode: string): Promise<number> {
    const quotes = await this.getStockQuotes([stockCode]);
    return quotes.length > 0 ? quotes[0].price : 0;
  }
}
