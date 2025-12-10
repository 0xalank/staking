'use client';
import React, { useContext, useState, useRef, useEffect } from 'react';
import { StateContext } from '@/store';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChevronDown, ChevronUp, Coins } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useStaking } from '@/lib/hooks/useStaking';

// Token Logo Component
const TokenLogo = ({ token, size = 24 }: { token: string, size?: number }) => {
  return (
    <div className="flex items-center">
      <Image
        src="/images/quai-logo.png"
        alt={token}
        width={size}
        height={size}
        className="rounded-full"
      />
    </div>
  );
};

// QUAI staking pool config
const quaiStakingPool = {
  id: 'native-quai',
  name: 'QUAI',
  token: 'QUAI',
};

const PoolCard = ({ stakingData, isLoading }: {
  stakingData?: any,
  isLoading?: boolean
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const { account } = useContext(StateContext);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const canvasRef = useRef<HTMLDivElement>(null);
  const particlesRef = useRef<Array<{
    id: number;
    x: number;
    y: number;
    vx: number;
    vy: number;
    targetX: number;
    targetY: number;
    size: string;
    element: HTMLDivElement;
  }>>([]);
  const animationRef = useRef<number>();
  const isHovered = useRef(false);
  const mousePos = useRef({ x: 0, y: 0 });
  const prevMousePos = useRef({ x: 0, y: 0 });
  const isMouseMoving = useRef(false);
  const mouseTimeoutRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    const button = buttonRef.current;
    const canvas = canvasRef.current;
    if (!button || !canvas) return;

    const initializeParticles = () => {
      const rect = button.getBoundingClientRect();
      const particleCount = 16;

      for (let i = 0; i < particleCount; i++) {
        const sizes = ['size-small', 'size-medium', 'size-large'];
        const size = sizes[Math.floor(Math.random() * sizes.length)];

        const particle = document.createElement('div');
        particle.className = `particle ${size}`;
        particle.style.opacity = '0';

        const padding = 20;
        const x = padding + Math.random() * (rect.width - padding * 2);
        const y = padding + Math.random() * (rect.height - padding * 2);

        particle.style.left = `${x}px`;
        particle.style.top = `${y}px`;

        canvas.appendChild(particle);

        particlesRef.current.push({
          id: i,
          x,
          y,
          vx: 0,
          vy: 0,
          targetX: x,
          targetY: y,
          size,
          element: particle
        });
      }
    };

    const updateParticles = () => {
      const rect = button.getBoundingClientRect();

      particlesRef.current.forEach((particle, index) => {
        const isPreLoaded = particle.id < 25;

        if (isPreLoaded && isHovered.current) {
          const dx = mousePos.current.x - particle.x;
          const dy = mousePos.current.y - particle.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          const lag = 0.015 + (index * 0.008);
          const followDistance = 30 + (index * 8);

          if (isMouseMoving.current || distance > followDistance) {
            particle.vx += dx * lag;
            particle.vy += dy * lag;
            if (isMouseMoving.current) {
              particle.vx += (Math.random() - 0.5) * 0.8;
              particle.vy += (Math.random() - 0.5) * 0.8;
            }
          }

          const friction = isMouseMoving.current ? 0.90 : 0.85;
          particle.vx *= friction;
          particle.vy *= friction;
        } else {
          particle.vx *= 0.98;
          particle.vy *= 0.98;
          particle.vy += 0.1;
        }

        particle.x += particle.vx;
        particle.y += particle.vy;

        if (particle.x <= 0 || particle.x >= rect.width - 8) {
          particle.vx *= -0.8;
          particle.x = Math.max(0, Math.min(rect.width - 8, particle.x));
        }
        if (particle.y <= 0 || particle.y >= rect.height - 8) {
          particle.vy *= -0.8;
          particle.y = Math.max(0, Math.min(rect.height - 8, particle.y));
        }

        particle.element.style.left = `${particle.x}px`;
        particle.element.style.top = `${particle.y}px`;
      });

      if (isHovered.current) {
        animationRef.current = requestAnimationFrame(updateParticles);
      }
    };

    const handleMouseMove = (e: MouseEvent) => {
      const rect = button.getBoundingClientRect();
      prevMousePos.current = { ...mousePos.current };
      mousePos.current.x = e.clientX - rect.left;
      mousePos.current.y = e.clientY - rect.top;

      const dx = mousePos.current.x - prevMousePos.current.x;
      const dy = mousePos.current.y - prevMousePos.current.y;
      isMouseMoving.current = Math.sqrt(dx * dx + dy * dy) > 1;

      if (mouseTimeoutRef.current) clearTimeout(mouseTimeoutRef.current);
      mouseTimeoutRef.current = setTimeout(() => { isMouseMoving.current = false; }, 100);
    };

    const handleMouseEnter = () => {
      isHovered.current = true;
      particlesRef.current.forEach(p => { if (p.id < 25) p.element.style.opacity = '1'; });
      updateParticles();
    };

    const handleMouseLeave = () => {
      isHovered.current = false;
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
      particlesRef.current.forEach(p => { if (p.id < 25) p.element.style.opacity = '0'; });
    };

    initializeParticles();
    button.addEventListener('mousemove', handleMouseMove);
    button.addEventListener('mouseenter', handleMouseEnter);
    button.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      button.removeEventListener('mousemove', handleMouseMove);
      button.removeEventListener('mouseenter', handleMouseEnter);
      button.removeEventListener('mouseleave', handleMouseLeave);
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, []);

  const formatNumber = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(0)}K`;
    return num.toLocaleString();
  };

  // Get user stake info from real data
  const userStake = stakingData?.userInfo ? {
    staked: Number(stakingData.userInfo.stakedAmountFormatted || 0),
    earned: Number(stakingData.userInfo.claimableRewardsFormatted || 0),
  } : { staked: 0, earned: 0 };

  const hasStake = userStake.staked > 0;

  return (
    <Card className="modern-card h-full group flex flex-col">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <TokenLogo token="QUAI" size={36} />
            <div>
              <CardTitle className="text-lg text-white">{quaiStakingPool.name}</CardTitle>
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4 flex-grow flex flex-col">
        {/* APR Display */}
        <div>
          <div className="flex items-baseline gap-1 mb-1">
            <span className="text-sm text-[#999999]">APR:</span>
            {isLoading ? (
              <div className="flex items-center gap-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-red-600"></div>
                <span className="text-sm text-[#666666]">Loading...</span>
              </div>
            ) : stakingData?.contractInfo ? (
              (() => {
                const totalStakedNum = Number((stakingData.contractInfo.activeStakedFormatted ?? stakingData.contractInfo.totalStakedFormatted) || 0);
                const rewardsNum = Number(stakingData.contractInfo.rewardBalanceFormatted || 0);
                if (totalStakedNum <= 0 && rewardsNum > 0) {
                  return <span className="text-sm text-[#999999]">APR appears after first stake</span>;
                }
                return (
                  <span className="text-xl font-bold text-white">
                    {stakingData.contractInfo.apy.toLocaleString('en-US', { maximumFractionDigits: 1 })}%
                  </span>
                );
              })()
            ) : (
              <div className="flex items-center gap-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-red-600"></div>
                <span className="text-sm text-[#666666]">Loading...</span>
              </div>
            )}
          </div>
        </div>

        {/* Key Info */}
        <div className="text-xs sm:text-sm font-semibold text-white underline underline-offset-2 decoration-red-600">
          Instant rewards • 30 day withdrawal lock
        </div>

        {/* Active Staked */}
        <div>
          <div className="text-sm font-semibold text-white">
            Active Staked:{' '}
            {stakingData?.contractInfo ? (
              <>
                {(() => {
                  const v = stakingData.contractInfo.activeStakedFormatted ?? stakingData.contractInfo.totalStakedFormatted;
                  const n = Number(v || '0');
                  return n.toLocaleString('en-US', { maximumFractionDigits: 3 });
                })()} QUAI
              </>
            ) : (
              <span className="inline-flex items-center gap-2">
                <div className="animate-spin rounded-full h-3 w-3 border-b border-red-600"></div>
                <span className="text-xs text-[#666666]">Loading...</span>
              </span>
            )}
          </div>
        </div>

        {/* User Position (if staked) */}
        {hasStake && account?.addr && (
          <div className="bg-gradient-to-r from-white/5 to-red-900/10 border border-red-900/30 rounded-lg p-4 mt-3">
            <div className="flex items-center gap-2 mb-3">
              <Coins className="h-4 w-4 text-red-400" />
              <span className="text-sm text-red-400 font-medium">Your Position</span>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <span className="text-xs text-[#999999]">Staked:</span>
                <div className="text-white font-semibold text-sm">
                  {formatNumber(userStake.staked)} QUAI
                </div>
              </div>
              <div className="space-y-1">
                <span className="text-xs text-[#999999]">Claimable:</span>
                <div className="text-orange-400 font-semibold text-sm">
                  {Number(userStake.earned || 0).toLocaleString('en-US', { maximumFractionDigits: 3 })} QUAI
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Spacer to push button to bottom */}
        <div className="flex-grow"></div>

        {/* Stake Button */}
        <div className="pt-4">
          <div className="rotating-border-wrapper">
            <Link href={`/stake/${quaiStakingPool.id}${hasStake ? '?mode=manage' : ''}`} className="block">
              <Button
                ref={buttonRef}
                className="w-full h-16 bg-transparent hover:bg-black/30 text-white font-medium rounded border-0 particle-button"
              >
                <div ref={canvasRef} className="particle-canvas"></div>
                {hasStake ? 'Manage' : 'Stake'}
              </Button>
            </Link>
          </div>
        </div>

        {/* Info Expandable */}
        <Button
          variant="ghost"
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-full text-red-400 hover:bg-red-400/10 flex items-center justify-center gap-2 text-sm"
        >
          Info
          {isExpanded ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
        </Button>

        {/* Expanded Information */}
        {isExpanded && (
          <div className="space-y-3 pt-2 border-t border-[#333333]">
            <div className="space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-[#999999]">Rewards:</span>
                <span className="text-green-400">Instant (no vesting)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#999999]">Withdrawal Lock:</span>
                <span className="text-white">30 days after request</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#999999]">During Lock:</span>
                <span className="text-green-400">Rewards continue</span>
              </div>
            </div>

            <div className="bg-[#0a0a0a] border border-[#333333] rounded-lg p-2">
              <p className="text-xs text-[#999999]">
                Stake your QUAI to earn rewards powered by the SOAP protocol. Rewards are claimable instantly with no vesting period.
              </p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default function Home() {
  const staking = useStaking();

  return (
    <main className="flex min-h-screen flex-col items-center pt-32 pb-8 px-4">
      <div className="w-full max-w-5xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-3">Real Proof-of-Work Powered Yield.</h1>
          <p className="text-lg text-[#999999]">
            Stake your $QUAI and receive rewards powered by{' '}
            <Link href="/what-is-soap" className="text-red-400 hover:text-red-300 underline">
              SOAP
            </Link>
            .
          </p>
        </div>

        {/* Single QUAI Staking Pool */}
        <div className="flex justify-center">
          <div className="w-full max-w-lg">
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
