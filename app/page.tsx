'use client';
import React, { useContext, useState, useRef, useEffect } from 'react';
import { StateContext } from '@/store';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Coins, Activity, Lock, Zap } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useStaking } from '@/lib/hooks/useStaking';
import { cn } from '@/lib/utils';

// --- Components ---

const TokenLogo = ({ token, size = 24 }: { token: string, size?: number }) => {
  return (
    <div className="relative flex items-center justify-center">
      <div className="absolute inset-0 bg-red-9/20 rounded-full blur-md" />
      <Image
        src="/images/quai-logo.png"
        alt={token}
        width={size}
        height={size}
        className="rounded-full relative z-10"
      />
    </div>
  );
};

export const GridTraffic = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let particles: Array<{
      x: number;
      y: number;
      vx: number;
      vy: number;
      size: number;
      color: string;
      trail: Array<{x: number, y: number}>;
    }> = [];

    const gridSize = 50; // Match global grid size

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', resize);
    resize();

    const createParticle = () => {
      // Spawn on a grid line
      const axis = Math.random() > 0.5 ? 'x' : 'y';
      const x = axis === 'x' 
        ? Math.random() * canvas.width 
        : Math.floor(Math.random() * (canvas.width / gridSize)) * gridSize;
      const y = axis === 'y' 
        ? Math.random() * canvas.height 
        : Math.floor(Math.random() * (canvas.height / gridSize)) * gridSize;
      
      const speed = 2 + Math.random() * 2;
      const vx = axis === 'x' ? (Math.random() > 0.5 ? speed : -speed) : 0;
      const vy = axis === 'y' ? (Math.random() > 0.5 ? speed : -speed) : 0;

      return {
        x,
        y,
        vx,
        vy,
        size: 2 + Math.random() * 2,
        color: '#E22901',
        trail: []
      };
    };

    // Initial population
    for(let i=0; i<20; i++) particles.push(createParticle());

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Update and draw particles
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        
        // Move
        p.x += p.vx;
        p.y += p.vy;

        // Trail logic
        p.trail.push({x: p.x, y: p.y});
        if(p.trail.length > 10) p.trail.shift();

        // Randomly turn at intersections
        if (Math.abs(p.x % gridSize) < Math.abs(p.vx) && Math.abs(p.y % gridSize) < Math.abs(p.vy)) {
          if (Math.random() < 0.1) {
            // 90 degree turn
            if (p.vx !== 0) {
              p.vy = Math.random() > 0.5 ? Math.abs(p.vx) : -Math.abs(p.vx);
              p.vx = 0;
            } else {
              p.vx = Math.random() > 0.5 ? Math.abs(p.vy) : -Math.abs(p.vy);
              p.vy = 0;
            }
            // Snap to grid exactly to prevent drift
            p.x = Math.round(p.x / gridSize) * gridSize;
            p.y = Math.round(p.y / gridSize) * gridSize;
          }
        }

        // Draw Trail
        ctx.beginPath();
        for(let j=0; j<p.trail.length; j++) {
          const point = p.trail[j];
          if(j===0) ctx.moveTo(point.x, point.y);
          else ctx.lineTo(point.x, point.y);
        }
        ctx.strokeStyle = `rgba(226, 41, 1, ${0.1 + (i/particles.length)*0.3})`;
        ctx.lineWidth = p.size;
        ctx.stroke();

        // Draw Head
        ctx.fillStyle = p.color;
        ctx.fillRect(p.x - p.size/2, p.y - p.size/2, p.size, p.size);

        // Reset if out of bounds
        if (p.x < -50 || p.x > canvas.width + 50 || p.y < -50 || p.y > canvas.height + 50) {
          particles[i] = createParticle();
        }
      }

      animationFrameId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none z-0 opacity-60" />;
};

const quaiStakingPool = {
  id: 'native-quai',
  name: 'QUAI',
  token: 'QUAI',
};

const PoolCard = ({ stakingData, isLoading }: {
  stakingData?: any,
  isLoading?: boolean
}) => {
  const { account } = useContext(StateContext);
  
  // Format helpers
  const formatNumber = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(0)}K`;
    return num.toLocaleString();
  };

  const userStake = stakingData?.userInfo ? {
    staked: Number(stakingData.userInfo.stakedAmountFormatted || 0),
    earned: Number(stakingData.userInfo.claimableRewardsFormatted || 0),
  } : { staked: 0, earned: 0 };

  const hasStake = userStake.staked > 0;

  return (
    <Card className="relative overflow-hidden bg-black/80 border-red-9/30 backdrop-blur-sm group transition-all duration-300 hover:border-red-9/60 hover:shadow-[0_0_30px_-5px_rgba(226,41,1,0.3)]">
      {/* Decorative corner accents */}
      <div className="absolute top-0 left-0 w-2 h-2 border-l-2 border-t-2 border-red-9" />
      <div className="absolute top-0 right-0 w-2 h-2 border-r-2 border-t-2 border-red-9" />
      <div className="absolute bottom-0 left-0 w-2 h-2 border-l-2 border-b-2 border-red-9" />
      <div className="absolute bottom-0 right-0 w-2 h-2 border-r-2 border-b-2 border-red-9" />

      <CardHeader className="pb-4 relative z-10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <TokenLogo token="QUAI" size={42} />
            <div>
              <CardTitle className="text-2xl font-monorama tracking-wider text-white">
                {quaiStakingPool.name}
              </CardTitle>

            </div>
          </div>
          <div className="text-right">
             <div className="text-xs text-red-9/80 font-mono uppercase mb-1">APY Rate</div>
             {isLoading ? (
               <div className="h-6 w-16 bg-red-9/10 animate-pulse rounded" />
             ) : (
               <div className="text-xl font-bold font-monorama text-white">
                 {stakingData?.contractInfo?.apy?.toLocaleString('en-US', { maximumFractionDigits: 1 })}%
               </div>
             )}
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-6 relative z-10">
        
        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-4">
            <div className="bg-zinc-900/50 border border-zinc-800 p-3 rounded hover:border-red-9/30 transition-colors">
                <div className="flex items-center gap-2 text-xs text-zinc-500 mb-1 font-mono uppercase">
                    <Activity className="w-3 h-3" /> Total Staked
                </div>
                <div className="text-lg font-semibold text-white">
                     {stakingData?.contractInfo ? (
                        Number(stakingData.contractInfo.activeStakedFormatted || 0).toLocaleString(undefined, { maximumFractionDigits: 0 })
                     ) : "-"} QUAI
                </div>
            </div>
             <div className="bg-zinc-900/50 border border-zinc-800 p-3 rounded hover:border-red-9/30 transition-colors">
                <div className="flex items-center gap-2 text-xs text-zinc-500 mb-1 font-mono uppercase">
                    <Zap className="w-3 h-3" /> Rewards
                </div>
                <div className="text-lg font-semibold text-white">
                     Instant
                </div>
            </div>
        </div>

        <p className="text-xs text-zinc-500 text-center uppercase tracking-wide font-mono mt-2">
            Withdrawal locked for 30 days after request.
        </p>

        {/* User Position */}
        {hasStake && account?.addr && (
          <div className="bg-gradient-to-r from-red-950/30 to-black border border-red-9/20 rounded p-4 relative overflow-hidden">
             <div className="absolute inset-0 bg-[url('/images/grid-pattern.png')] opacity-10" />
            <div className="flex items-center gap-2 mb-3 relative z-10">
              <Coins className="h-4 w-4 text-red-9" />
              <span className="text-sm text-red-9 font-bold font-mono uppercase tracking-wider">My Position</span>
            </div>
            <div className="grid grid-cols-2 gap-4 relative z-10">
              <div>
                <span className="text-xs text-zinc-500 block mb-1">Staked Amount</span>
                <div className="text-white font-mono text-lg">{formatNumber(userStake.staked)} QUAI</div>
              </div>
              <div>
                <span className="text-xs text-zinc-500 block mb-1">Claimable</span>
                <div className="text-red-400 font-mono text-lg">{Number(userStake.earned).toFixed(3)} QUAI</div>
              </div>
            </div>
          </div>
        )}

        {/* Action Button */}
        <div className="pt-2">
           <Link href={`/stake/${quaiStakingPool.id}${hasStake ? '?mode=manage' : ''}`} className="block group/btn">
              <Button
                className="w-full h-14 bg-red-9 hover:bg-red-8 text-white font-bold tracking-widest uppercase rounded-none relative overflow-hidden transition-all clip-button"
                style={{
                    clipPath: 'polygon(10px 0, 100% 0, 100% calc(100% - 10px), calc(100% - 10px) 100%, 0 100%, 0 10px)'
                }}
              >
                <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(255,255,255,0.2)_50%,transparent_75%)] -translate-x-[100%] group-hover/btn:animate-[shine_1s_infinite]" />
                {hasStake ? 'Manage Stake' : 'Initialize Stake'}
              </Button>
            </Link>
        </div>



      </CardContent>
    </Card>
  );
};

export default function Home() {
  const staking = useStaking();

  return (
    <main className="relative min-h-screen flex flex-col items-center justify-center p-4 overflow-hidden selection:bg-red-9/30">
      
      {/* Background Systems */}
      <div className="fixed inset-0 bg-[#050505] -z-20" />
      <GridTraffic />
      
      {/* Glow Center */}
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-red-9/5 blur-[120px] rounded-full -z-10 pointer-events-none" />

      <div className="w-full max-w-5xl mx-auto relative z-10 flex flex-col items-center gap-12">
        
                {/* Hero Section */}
        
                <div className="text-center space-y-6">
        
                   <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-red-9/50 bg-red-9/20 backdrop-blur-md mb-4 animate-fade-in-down">
        
                      <span className="relative flex h-3 w-3">
        
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-9 opacity-75"></span>
        
                        <span className="relative inline-flex rounded-full h-3 w-3 bg-red-9"></span>
        
                      </span>
        
                      <span className="text-sm font-monorama text-red-9 font-bold tracking-widest uppercase">Now Live</span>
        
                   </div>
        
                   
        
                              <h1 className="text-6xl md:text-8xl font-monorama font-bold text-white tracking-tight uppercase leading-none animate-in fade-in-up duration-700 delay-100">
        
                   
        
                                 <span className="text-transparent bg-clip-text bg-gradient-to-b from-white to-zinc-500">Proof-of-Work Powered</span><br />
        
                   
        
                                 <span className="text-red-9 drop-shadow-[0_0_15px_rgba(226,41,1,0.5)]">Yield</span>
        
                   
        
                              </h1>
        
                   
        
                   
        
                   
        
                                         <p className="text-zinc-400 max-w-lg mx-auto text-lg md:text-xl font-light animate-in fade-in-up duration-700 delay-200">
        
                   
        
                   
        
                   
        
                                            Real, sustainable yield distributed from $QUAI buybacks as part of the Subsidized Open-market Acquisition Protocol (SOAP). Learn more at <Link href="/what-is-soap" className="text-red-9 hover:text-red-7 underline">"What is SOAP?"</Link>
        
                   
        
                   
        
                   
        
                                         </p>
        
                </div>

        {/* Interactive Staking Module */}
        <div className="w-full max-w-md">
          <div className="transform transition-transform duration-500 hover:-translate-y-2">
             <PoolCard
              stakingData={staking}
              isLoading={staking.isLoading}
            />
          </div>
        </div>
      </div>
    </main>
  );
}