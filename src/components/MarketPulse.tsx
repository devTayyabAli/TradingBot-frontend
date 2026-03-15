import React, { useEffect, useRef, useState } from 'react';
import { createChart, ColorType, BaselineSeries } from 'lightweight-charts';
import type { ISeriesApi } from 'lightweight-charts';
import axios from 'axios';

interface MarketPulseProps {
    asset: string;
    timeframe: string;
}

export const MarketPulse: React.FC<MarketPulseProps> = ({ asset, timeframe }) => {
    const chartContainerRef = useRef<HTMLDivElement>(null);
    const seriesRef = useRef<ISeriesApi<"Baseline"> | null>(null);
    const chartRef = useRef<any>(null);
    const [lastPrice, setLastPrice] = useState<number>(0);
    const [change, setChange] = useState<number>(0);

    const fetchData = async () => {
        try {
            const res = await axios.get(`http://127.0.0.1:8000/api/chart?asset=${asset}&timeframe=${timeframe}`);
            if (seriesRef.current && res.data.length > 0) {
                const data = res.data;
                seriesRef.current.setData(data);
                
                const current = data[data.length - 1].value;
                const previous = data[0].value;
                const diff = ((current - previous) / previous) * 100;
                
                setLastPrice(current);
                setChange(Number(diff.toFixed(2)));
                
                // Adjust base value to the start of the visible range for visual effect
                seriesRef.current.applyOptions({
                    baseValue: { type: 'price', price: previous }
                });

                if (chartRef.current) {
                    chartRef.current.timeScale().fitContent();
                }
            }
        } catch (err) {
            console.error("Chart fetch error:", err);
        }
    };

    useEffect(() => {
        if (!chartContainerRef.current) return;

        const chart = createChart(chartContainerRef.current, {
            layout: {
                background: { type: ColorType.Solid, color: 'transparent' },
                textColor: 'rgba(255, 255, 255, 0.4)',
                fontFamily: 'Inter',
            },
            grid: {
                vertLines: { visible: false },
                horzLines: { visible: false },
            },
            width: chartContainerRef.current.clientWidth,
            height: 160,
            handleScale: { mouseWheel: false, pinch: false },
            handleScroll: { mouseWheel: false, pressedMouseMove: false },
            timeScale: { visible: false },
            rightPriceScale: { visible: false },
        });

        const series = chart.addSeries(BaselineSeries, {
            baseValue: { type: 'price', price: 0 },
            topLineColor: '#38bdf8',
            topFillColor1: 'rgba(56, 189, 248, 0.2)',
            topFillColor2: 'rgba(56, 189, 248, 0.0)',
            bottomLineColor: '#d63031',
            bottomFillColor1: 'rgba(214, 48, 49, 0.0)',
            bottomFillColor2: 'rgba(214, 48, 49, 0.2)',
            lineWidth: 2,
            priceLineVisible: false,
        });

        seriesRef.current = series;
        chartRef.current = chart;

        fetchData();
        const interval = setInterval(fetchData, 30000);

        const handleResize = () => {
            chart.applyOptions({ width: chartContainerRef.current?.clientWidth });
        };
        window.addEventListener('resize', handleResize);

        return () => {
            clearInterval(interval);
            window.removeEventListener('resize', handleResize);
            chart.remove();
        };
    }, [asset, timeframe]);

    return (
        <div className="glass rounded-[32px] p-8 relative overflow-hidden border border-white/5">
            <div className="flex justify-between items-start mb-6">
                <div className="flex items-center gap-4">
                    <div className="flex gap-1.5">
                        <div className="w-1.5 h-4 bg-accent rounded-full animate-bounce"></div>
                        <div className="w-1.5 h-4 bg-accent/40 rounded-full animate-bounce [animation-delay:0.2s]"></div>
                        <div className="w-1.5 h-4 bg-accent/20 rounded-full animate-bounce [animation-delay:0.4s]"></div>
                    </div>
                    <div>
                        <span className="text-[10px] font-black tracking-[0.3em] text-white/40 uppercase block mb-1">Market Pulse</span>
                        <h3 className="text-sm font-black text-white/90">{asset}/USD Market Analysis</h3>
                    </div>
                </div>
                <div className="flex items-center gap-2.5 px-3 py-1.5 rounded-full bg-accent/10 border border-accent/20">
                    <div className="w-2 h-2 rounded-full bg-accent animate-pulse shadow-[0_0_8px_#38bdf8]"></div>
                    <span className="text-[10px] font-black text-accent uppercase tracking-widest leading-none">Live Stream</span>
                </div>
            </div>

            <div ref={chartContainerRef} className="w-full" />

            <div className="absolute top-24 right-10 text-right pointer-events-none">
                <p className="text-4xl font-black tracking-tighter text-white font-mono leading-none mb-2">
                    {lastPrice.toFixed(5)}
                </p>
                <div className={`p-1 px-3 inline-block rounded-lg text-xs font-black ${change >= 0 ? 'bg-up/10 text-up border border-up/20' : 'bg-down/10 text-down border border-down/20'}`}>
                    {change >= 0 ? '+' : ''}{change}%
                </div>
            </div>
            
            <div className="mt-6 flex gap-8 border-t border-white/5 pt-6">
                <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-up"></div>
                    <span className="text-[10px] font-black text-white/40 uppercase tracking-tighter">Bullish Bias</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-down"></div>
                    <span className="text-[10px] font-black text-white/40 uppercase tracking-tighter">Bearish Pressure</span>
                </div>
            </div>
        </div>
    );
};
