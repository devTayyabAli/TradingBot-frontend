import React, { useEffect, useRef } from 'react';
import { createChart, ColorType, CandlestickSeries } from 'lightweight-charts';
import type { ISeriesApi } from 'lightweight-charts';

interface ChartProps {
  data: any[];
  asset: string;
}

const Chart: React.FC<ChartProps> = ({ data, asset }) => {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const candlestickSeriesRef = useRef<ISeriesApi<"Candlestick"> | null>(null);

  useEffect(() => {
    if (!chartContainerRef.current) return;

    const chart = createChart(chartContainerRef.current, {
      layout: {
        background: { type: ColorType.Solid, color: 'transparent' },
        textColor: '#d1d4dc',
      },
      grid: {
        vertLines: { color: 'rgba(42, 46, 57, 0.2)' },
        horzLines: { color: 'rgba(42, 46, 57, 0.2)' },
      },
      width: chartContainerRef.current.clientWidth,
      height: 400,
    });

    // Use addSeries with CandlestickSeries for v5+
    const candlestickSeries = chart.addSeries(CandlestickSeries, {
      upColor: '#00b894',
      downColor: '#d63031',
      borderVisible: false,
      wickUpColor: '#00b894',
      wickDownColor: '#d63031',
    });

    candlestickSeriesRef.current = candlestickSeries;

    const handleResize = () => {
      chart.applyOptions({ width: chartContainerRef.current?.clientWidth });
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      chart.remove();
    };
  }, []);

  useEffect(() => {
    if (candlestickSeriesRef.current && data.length > 0) {
      candlestickSeriesRef.current.setData(data);
    }
  }, [data]);

  return (
    <div className="glass rounded-3xl p-4 w-full">
      <div className="flex justify-between items-center mb-4 px-4">
        <h3 className="text-lg font-bold text-white/80">{asset} Chart</h3>
        <div className="flex gap-2">
          {['1m', '5m', '15m', '1h', '4h'].map(tf => (
            <button key={tf} className="px-3 py-1 text-xs rounded-lg bg-white/5 hover:bg-white/10 transition-colors">
              {tf}
            </button>
          ))}
        </div>
      </div>
      <div ref={chartContainerRef} className="w-full" />
    </div>
  );
};

export default Chart;
