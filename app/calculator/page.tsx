"use client";
import React, { useMemo, useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';

const SOAPDistributionModel = () => {
  // Input mode toggle
  const [inputMode, setInputMode] = useState<'lockedPct' | 'quaiPrice'>('lockedPct');

  // Inputs
  const [inputs, setInputs] = useState({
    dailyBuybackUSD: 50000,     // USD per day
    lockedQuaiPct: 20,          // % of total supply locked/staked
    quaiPrice: 0.04,            // Price of QUAI in USD
    targetAPR: 20,              // Target APR percentage
  });

  const [currentSupply, setCurrentSupply] = useState(617_797_478); // Default fallback
  const [isLoadingSupply, setIsLoadingSupply] = useState(true);
  const [isCalculationOpen, setIsCalculationOpen] = useState(false); // Collapsible calculation

  // Fetch QUAI supply
  useEffect(() => {
    const fetchSupply = async () => {
      try {
        const response = await fetch('https://rpc.quai.network/supply');
        const data = await response.json();
        if (data && typeof data.circulatingSupply === 'number') {
          setCurrentSupply(data.circulatingSupply);
        }
      } catch (error) {
        console.error('Failed to fetch QUAI supply:', error);
        // Keep default value on error
      } finally {
        setIsLoadingSupply(false);
      }
    };

    fetchSupply();
  }, []);

  const metrics = useMemo(() => {
    const annualBuybackUSD = inputs.dailyBuybackUSD * 365;

    let lockedQuaiAmount, impliedQuaiPrice, calculatedAPR, tvlUSD;

    if (inputMode === 'lockedPct') {
      // Mode 1: Set APR - input target APR and locked %, calculate price
      lockedQuaiAmount = currentSupply * (inputs.lockedQuaiPct / 100);
      const effectiveAPY = inputs.targetAPR / 100; // Target APR as decimal
      const participationRate = inputs.lockedQuaiPct / 100; // Convert % to decimal

      impliedQuaiPrice = (participationRate > 0 && effectiveAPY > 0)
        ? annualBuybackUSD / (currentSupply * participationRate * effectiveAPY)
        : 0;

      tvlUSD = lockedQuaiAmount * impliedQuaiPrice;
      calculatedAPR = inputs.targetAPR; // Use the input target APR
    } else {
      // Mode 2: QUAI Price AND Locked % are inputs, calculate floating APR
      impliedQuaiPrice = inputs.quaiPrice;
      lockedQuaiAmount = currentSupply * (inputs.lockedQuaiPct / 100);
      tvlUSD = lockedQuaiAmount * impliedQuaiPrice;

      // Calculate actual APR based on total buyback and TVL
      calculatedAPR = tvlUSD > 0 ? (annualBuybackUSD / tvlUSD) * 100 : 0;
    }

    return {
      lockedQuaiAmount,
      impliedQuaiPrice,
      tvlUSD,
      calculatedAPR,
      annualBuybackUSD,
      lockedQuaiPct: (lockedQuaiAmount / currentSupply) * 100,
    };
  }, [inputs, currentSupply, inputMode]);

  // For display only (not during active editing)
  const formatNumberDisplay = (n: number) => {
    return Number.isFinite(n) ? n.toLocaleString() : '';
  };

  // Parse input string to number, preserving ability to type decimals
  const parseNumber = (s: string) => {
    const cleaned = s.replace(/,/g, '').trim();
    if (cleaned === '' || cleaned === '.') return 0;
    const n = Number(cleaned);
    return Number.isFinite(n) ? n : 0;
  };

  // Track which field is being edited to avoid reformatting during typing
  const [editingField, setEditingField] = useState<string | null>(null);
  const [editingValue, setEditingValue] = useState<string>('');

  return (
    <main className="flex min-h-screen flex-col items-center pt-20 sm:pt-32 pb-8 px-2 sm:px-4">
      <div className="w-full max-w-7xl mx-auto space-y-4 sm:space-y-6">
        {/* SOAP Protocol Header */}
        <div className="text-center mb-4 sm:mb-6 px-2">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-2 leading-tight">
            Subsidized Open-market Acquisition Protocol (SOAP) Upgrade
          </h1>
          <p className="text-sm sm:text-base text-[#999999] max-w-4xl mx-auto">
            SOAP transforms merge-mining into a protocol subsidy mechanism that creates continuous buying pressure for QUAI.
          </p>
        </div>

        {/* Calculator Section */}
        <div className="bg-gradient-to-br from-[#0a0a0a] to-[#1a1a1a] border border-[#333333] rounded-xl p-3 sm:p-6 space-y-4 sm:space-y-6">
          {/* Calculator Header */}
          <div className="text-center">
            <h2 className="text-xl sm:text-2xl font-bold text-white mb-2">SOAP Buyback Calculator</h2>
            <p className="text-sm sm:text-base text-[#999999]">
              Estimate staking APR from daily QUAI buybacks and locked TVL
            </p>
          </div>

          {/* Main Calculator Layout - Left Inputs, Right Results */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
            {/* Left Side - Input Controls */}
            <div className="space-y-6">
              {/* Global Parameters */}
              <Card className="modern-card">
                <CardHeader>
                  <CardTitle className="text-xl font-bold text-white">Global Parameters</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-[#999999] mb-2">
                      Daily USD Buyback Budget
                    </label>
                    <div className="space-y-2">
                      <Input
                        type="text"
                        value={editingField === 'dailyBuybackUSD' ? editingValue : formatNumberDisplay(inputs.dailyBuybackUSD)}
                        onFocus={() => {
                          setEditingField('dailyBuybackUSD');
                          setEditingValue(String(inputs.dailyBuybackUSD));
                        }}
                        onChange={(e) => {
                          setEditingValue(e.target.value);
                          const parsed = parseNumber(e.target.value);
                          setInputs({ ...inputs, dailyBuybackUSD: parsed });
                        }}
                        onBlur={() => setEditingField(null)}
                        className="bg-[#222222] border-[#333333] text-white"
                      />
                      <div className="space-y-2">
                        <div className="text-xs text-[#999999]">% of Global SHA Hash</div>
                        <div className="flex flex-wrap gap-2">
                          <button
                            onClick={() => setInputs({ ...inputs, dailyBuybackUSD: 50000 })} // 0.1% of $50M
                            className="px-2 sm:px-3 py-1 text-xs bg-red-600 text-white rounded hover:bg-red-700 transition-colors cursor-pointer flex-1 sm:flex-none min-w-[60px]"
                          >
                            0.1%
                          </button>
                          <button
                            onClick={() => setInputs({ ...inputs, dailyBuybackUSD: 500000 })} // 1% of $50M
                            className="px-2 sm:px-3 py-1 text-xs bg-red-600 text-white rounded hover:bg-red-700 transition-colors cursor-pointer flex-1 sm:flex-none min-w-[60px]"
                          >
                            1%
                          </button>
                          <button
                            onClick={() => setInputs({ ...inputs, dailyBuybackUSD: 5000000 })} // 10% of $50M
                            className="px-2 sm:px-3 py-1 text-xs bg-red-600 text-white rounded hover:bg-red-700 transition-colors cursor-pointer flex-1 sm:flex-none min-w-[60px]"
                          >
                            10%
                          </button>
                        </div>
                      </div>
                    </div>
                    <div className="text-xs text-[#666666] mt-1">
                      Annual: ${(inputs.dailyBuybackUSD * 365).toLocaleString()} USD
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[#999999] mb-2">
                      Current Circulating Supply
                    </label>
                    <Input
                      type="text"
                      value={isLoadingSupply ? "Loading..." : `${currentSupply.toLocaleString()} QUAI`}
                      readOnly
                      className="bg-[#1a1a1a] border-[#333333] text-[#999999] cursor-not-allowed"
                    />
                    <div className="text-xs text-[#666666] mt-1">
                      Fetched from https://rpc.quai.network/supply
                    </div>
                  </div>


                  {/* Shared Locked QUAI % Field */}
                  <div>
                    <label className="block text-sm font-medium text-[#999999] mb-2">
                      Locked QUAI %
                    </label>
                    <Input
                      type="text"
                      value={editingField === 'lockedQuaiPct' ? editingValue : formatNumberDisplay(inputs.lockedQuaiPct)}
                      onFocus={() => {
                        setEditingField('lockedQuaiPct');
                        setEditingValue(String(inputs.lockedQuaiPct));
                      }}
                      onChange={(e) => {
                        setEditingValue(e.target.value);
                        const v = Math.max(0, Math.min(100, parseNumber(e.target.value)));
                        setInputs({ ...inputs, lockedQuaiPct: v });
                      }}
                      onBlur={() => setEditingField(null)}
                      className="bg-[#222222] border-[#333333] text-white"
                    />
                    <div className="text-xs text-[#666666] mt-1">
                      {metrics.lockedQuaiAmount.toLocaleString()} QUAI locked ({inputs.lockedQuaiPct}% of supply)
                    </div>
                  </div>

                  {/* Input Mode Toggle */}
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-[#999999] mb-2">
                      Input Mode
                    </label>
                    <div className="flex bg-[#1a1a1a] border border-[#333333] rounded-lg p-1">
                      <button
                        onClick={() => setInputMode('lockedPct')}
                        className={`flex-1 px-3 py-2 text-sm rounded-md transition-colors ${
                          inputMode === 'lockedPct'
                            ? 'bg-red-600 text-white font-medium'
                            : 'text-[#999999] hover:text-white'
                        }`}
                      >
                        Set APR
                      </button>
                      <button
                        onClick={() => setInputMode('quaiPrice')}
                        className={`flex-1 px-3 py-2 text-sm rounded-md transition-colors ${
                          inputMode === 'quaiPrice'
                            ? 'bg-red-600 text-white font-medium'
                            : 'text-[#999999] hover:text-white'
                        }`}
                      >
                        Set Price
                      </button>
                    </div>
                  </div>

                  {/* Mode-Specific Input */}
                  {inputMode === 'lockedPct' ? (
                    <div>
                      <label className="block text-sm font-medium text-[#999999] mb-2">
                        Target APR (%)
                      </label>
                      <Input
                        type="text"
                        value={editingField === 'targetAPR' ? editingValue : formatNumberDisplay(inputs.targetAPR)}
                        onFocus={() => {
                          setEditingField('targetAPR');
                          setEditingValue(String(inputs.targetAPR));
                        }}
                        onChange={(e) => {
                          setEditingValue(e.target.value);
                          const v = Math.max(0, parseNumber(e.target.value));
                          setInputs({ ...inputs, targetAPR: v });
                        }}
                        onBlur={() => setEditingField(null)}
                        className="bg-[#222222] border-[#333333] text-white"
                      />
                      <div className="text-xs text-[#666666] mt-1">
                        Target annual percentage return for stakers
                      </div>
                    </div>
                  ) : (
                    <div>
                      <label className="block text-sm font-medium text-[#999999] mb-2">
                        QUAI Price (USD)
                      </label>
                      <Input
                        type="text"
                        value={editingField === 'quaiPrice' ? editingValue : inputs.quaiPrice.toString()}
                        onFocus={() => {
                          setEditingField('quaiPrice');
                          setEditingValue(String(inputs.quaiPrice));
                        }}
                        onChange={(e) => {
                          setEditingValue(e.target.value);
                          const v = Math.max(0, parseNumber(e.target.value));
                          setInputs({ ...inputs, quaiPrice: v });
                        }}
                        onBlur={() => setEditingField(null)}
                        className="bg-[#222222] border-[#333333] text-white"
                      />
                      <div className="text-xs text-[#666666] mt-1">
                        Input price for QUAI token
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Right Side - Results and Breakdown */}
            <Card className="modern-card">
              <CardHeader>
                <CardTitle className="text-xl font-bold text-white">Results & Analysis</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Main Results */}
                <div className="bg-green-900/20 border border-green-700/50 rounded-lg p-3 sm:p-4">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="text-center">
                      <div className="text-sm text-white font-medium">
                        {inputMode === 'lockedPct' ? 'Implied QUAI Price' : 'QUAI Price'}
                      </div>
                      <div className={`text-xl sm:text-2xl font-bold ${inputMode === 'lockedPct' ? 'text-green-400' : 'text-white'}`}>
                        {metrics.impliedQuaiPrice > 0 ? `${metrics.impliedQuaiPrice.toFixed(4)}` : '—'}
                      </div>
                      <div className="text-sm text-[#999999] mt-1">
                        {inputMode === 'lockedPct' ? `To achieve ${inputs.targetAPR}% APR` : 'Input price'}
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-sm text-white font-medium">TVL in USD</div>
                      <div className="text-xl sm:text-2xl font-bold text-white">${metrics.tvlUSD.toLocaleString()}</div>
                      <div className="text-sm text-[#999999] mt-1">{metrics.lockedQuaiAmount.toLocaleString()} QUAI locked</div>
                    </div>
                    <div className="text-center">
                      <div className="text-sm text-white font-medium">
                        {inputMode === 'lockedPct' ? 'Target APR' : 'Calculated APR'}
                      </div>
                      <div className={`text-xl sm:text-2xl font-bold ${inputMode === 'quaiPrice' ? 'text-green-400' : 'text-white'}`}>
                        {metrics.calculatedAPR.toFixed(1)}%
                      </div>
                      <div className="text-sm text-[#999999] mt-1">
                        {inputMode === 'lockedPct' ? 'Input target rate' : 'Based on price and TVL'}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Detailed Breakdown Table */}
                <div>
                  <h3 className="text-lg font-semibold text-white mb-3">Detailed Breakdown</h3>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b-2 border-[#333333]">
                          <th className="text-left py-2 sm:py-3 px-2 sm:px-4 font-semibold text-[#999999]">Category</th>
                          <th className="text-right py-2 sm:py-3 px-2 sm:px-4 font-semibold text-[#999999]">Value</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr className="border-b border-[#333333]">
                          <td className="py-2 sm:py-3 px-2 sm:px-4 text-white text-xs sm:text-sm">Current Circulating Supply</td>
                          <td className="py-2 sm:py-3 px-2 sm:px-4 text-right text-[#999999] text-xs sm:text-sm">{currentSupply.toLocaleString()} QUAI</td>
                        </tr>
                        <tr className="border-b border-[#333333]">
                          <td className="py-2 sm:py-3 px-2 sm:px-4 text-white text-xs sm:text-sm">Daily USD Buyback Budget</td>
                          <td className="py-2 sm:py-3 px-2 sm:px-4 text-right text-[#999999] text-xs sm:text-sm">${inputs.dailyBuybackUSD.toLocaleString()}</td>
                        </tr>
                        <tr className="border-b border-[#333333]">
                          <td className="py-2 sm:py-3 px-2 sm:px-4 text-white text-xs sm:text-sm">Annual USD Buyback Budget</td>
                          <td className="py-2 sm:py-3 px-2 sm:px-4 text-right text-[#999999] text-xs sm:text-sm">${metrics.annualBuybackUSD.toLocaleString()}</td>
                        </tr>
                        <tr className="border-b border-[#333333]">
                          <td className="py-2 sm:py-3 px-2 sm:px-4 text-white text-xs sm:text-sm">Locked QUAI Percentage</td>
                          <td className="py-2 sm:py-3 px-2 sm:px-4 text-right text-[#999999] text-xs sm:text-sm">{inputs.lockedQuaiPct}%</td>
                        </tr>
                        <tr className="border-b border-[#333333]">
                          <td className="py-2 sm:py-3 px-2 sm:px-4 text-white text-xs sm:text-sm">Locked QUAI Amount</td>
                          <td className="py-2 sm:py-3 px-2 sm:px-4 text-right text-[#999999] text-xs sm:text-sm">{metrics.lockedQuaiAmount.toLocaleString()} QUAI</td>
                        </tr>
                        <tr className="bg-slate-800/50 border-b border-[#333333]">
                          <td className="py-2 sm:py-3 px-2 sm:px-4 font-semibold text-white text-xs sm:text-sm">QUAI Price</td>
                          <td className="py-2 sm:py-3 px-2 sm:px-4 text-right font-semibold text-white text-xs sm:text-sm">${metrics.impliedQuaiPrice.toFixed(4)}</td>
                        </tr>
                        <tr className="bg-slate-800/50 border-b border-[#333333]">
                          <td className="py-2 sm:py-3 px-2 sm:px-4 text-white text-xs sm:text-sm">TVL in USD</td>
                          <td className="py-2 sm:py-3 px-2 sm:px-4 text-right text-white text-xs sm:text-sm">${metrics.tvlUSD.toLocaleString()}</td>
                        </tr>
                        <tr className="bg-slate-800/50 border-b border-[#333333]">
                          <td className="py-2 sm:py-3 px-2 sm:px-4 text-white text-xs sm:text-sm">APR</td>
                          <td className="py-2 sm:py-3 px-2 sm:px-4 text-right text-white text-xs sm:text-sm">{metrics.calculatedAPR.toFixed(2)}%</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Collapsible Calculation Explainer */}
                <div>
                  <button
                    onClick={() => setIsCalculationOpen(!isCalculationOpen)}
                    className="flex items-center justify-between w-full text-left py-3 px-4 bg-slate-800/30 border border-slate-700/50 rounded-lg hover:bg-slate-800/50 transition-colors"
                  >
                    <h3 className="text-lg font-semibold text-white">
                      {inputMode === 'lockedPct' ? 'Price Calculation Formula' : 'APR Calculation Formula'}
                    </h3>
                    <div className={`transform transition-transform ${isCalculationOpen ? 'rotate-180' : ''}`}>
                      <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </button>

                  {isCalculationOpen && (
                    <div className="mt-2 bg-[#0a0a0a] border border-[#333333] rounded-lg p-4">
                      {inputMode === 'lockedPct' ? (
                        <>
                          <h4 className="text-sm font-semibold text-white mb-2">How QUAI Price is Calculated</h4>
                          <div className="text-xs text-[#999999] space-y-2">
                            <div className="bg-[#1a1a1a] border border-[#444444] rounded p-2 font-mono text-center">
                              <span className="text-green-400">quaiPrice</span> = <span className="text-blue-400">annualBuyback</span> / (<span className="text-purple-400">supply</span> * <span className="text-orange-400">lockedQuaiPct</span> * <span className="text-red-400">targetAPY</span>)
                            </div>
                            <div className="space-y-1">
                              <p><span className="text-blue-400">annualBuyback</span> = ${metrics.annualBuybackUSD.toLocaleString()} (annual USD buyback)</p>
                              <p><span className="text-purple-400">supply</span> = {currentSupply.toLocaleString()} QUAI (circulating supply)</p>
                              <p><span className="text-orange-400">lockedQuaiPct</span> = {(inputs.lockedQuaiPct / 100).toFixed(3)} ({inputs.lockedQuaiPct}% as decimal)</p>
                              <p><span className="text-red-400">targetAPY</span> = {(inputs.targetAPR / 100).toFixed(2)} ({inputs.targetAPR}% target APR as decimal)</p>
                            </div>
                            <div className="border-t border-[#444444] pt-2">
                              <p className="font-semibold">Calculation:</p>
                              <p>${metrics.annualBuybackUSD.toLocaleString()} / ({currentSupply.toLocaleString()} * {(inputs.lockedQuaiPct / 100).toFixed(3)} * {(inputs.targetAPR / 100).toFixed(2)})</p>
                              <p>= ${metrics.annualBuybackUSD.toLocaleString()} / {(currentSupply * (inputs.lockedQuaiPct / 100) * (inputs.targetAPR / 100)).toLocaleString()}</p>
                              <p className="text-green-400 font-semibold">= ${metrics.impliedQuaiPrice.toFixed(4)} per QUAI</p>
                            </div>
                          </div>
                        </>
                      ) : (
                        <>
                          <h4 className="text-sm font-semibold text-white mb-2">How APR is Calculated</h4>
                          <div className="text-xs text-[#999999] space-y-2">
                            <div className="bg-[#1a1a1a] border border-[#444444] rounded p-2 font-mono text-center">
                              <span className="text-green-400">APR</span> = <span className="text-blue-400">annualBuyback</span> / <span className="text-orange-400">TVL</span> * 100
                            </div>
                            <div className="space-y-1">
                              <p><span className="text-blue-400">annualBuyback</span> = ${metrics.annualBuybackUSD.toLocaleString()} (annual USD buyback)</p>
                              <p><span className="text-orange-400">TVL</span> = ${metrics.tvlUSD.toLocaleString()} ({metrics.lockedQuaiAmount.toLocaleString()} QUAI * ${metrics.impliedQuaiPrice.toFixed(4)})</p>
                              <p><span className="text-purple-400">quaiPrice</span> = ${metrics.impliedQuaiPrice.toFixed(4)} (input price)</p>
                              <p><span className="text-gray-400">lockedQuaiPct</span> = {inputs.lockedQuaiPct}% (input percentage)</p>
                            </div>
                            <div className="border-t border-[#444444] pt-2">
                              <p className="font-semibold">Calculation:</p>
                              <p>${metrics.annualBuybackUSD.toLocaleString()} / ${metrics.tvlUSD.toLocaleString()} * 100</p>
                              <p className="text-green-400 font-semibold">= {metrics.calculatedAPR.toFixed(2)}% APR</p>
                            </div>
                          </div>
                        </>
                      )}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* What is SOAP Section */}
        <Card className="modern-card">
          <CardHeader>
            <CardTitle className="text-xl font-bold text-white">What is SOAP?</CardTitle>
            <CardDescription className="text-[#999999]">
              Understanding the Subsidized Open-market Acquisition Protocol
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* SOAP Overview */}
            <div className="bg-gradient-to-r from-red-900/20 to-purple-900/20 border border-red-900/50 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-white mb-3">SOAP Overview</h3>
              <p className="text-[#999999] leading-relaxed mb-3">
                SOAP (Subsidized Open-market Acquisition Protocol) transforms traditional merge-mining into a protocol subsidy mechanism.
                Instead of miners receiving rewards from multiple chains directly (creating selling pressure), SOAP routes
                parent chain rewards to protocol-controlled addresses that automatically buy QUAI tokens.
              </p>
              <p className="text-[#999999] leading-relaxed">
                The purchased QUAI is then either burned to reduce supply or distributed to time-locked stakers,
                creating continuous buy pressure while rewarding long-term network participants.
              </p>
            </div>

            {/* How SOAP Works */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-white">How SOAP Works</h3>
              <div className="space-y-3">
                <div className="flex gap-3">
                  <div className="flex-shrink-0 w-8 h-8 bg-red-600 rounded-full flex items-center justify-center text-white text-sm font-bold">
                    1
                  </div>
                  <div className="flex-1">
                    <h4 className="text-md font-medium text-white mb-1">Multi-Chain Mining</h4>
                    <p className="text-[#999999] text-sm">
                      Miners with SHA256d (BCH), Scrypt (LTC/DOGE), or KAWPOW hardware can mine QUAI while
                      their parent chain rewards are automatically routed to protocol-controlled addresses.
                    </p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <div className="flex-shrink-0 w-8 h-8 bg-red-600 rounded-full flex items-center justify-center text-white text-sm font-bold">
                    2
                  </div>
                  <div className="flex-1">
                    <h4 className="text-md font-medium text-white mb-1">Automatic QUAI Buybacks</h4>
                    <p className="text-[#999999] text-sm">
                      Parent chain rewards (BCH, LTC, DOGE) are automatically converted to QUAI at market rates,
                      creating continuous buy pressure instead of selling pressure.
                    </p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <div className="flex-shrink-0 w-8 h-8 bg-red-600 rounded-full flex items-center justify-center text-white text-sm font-bold">
                    3
                  </div>
                  <div className="flex-1">
                    <h4 className="text-md font-medium text-white mb-1">Burn & Reward Distribution</h4>
                    <p className="text-[#999999] text-sm">
                      Purchased QUAI is either burned to reduce supply or distributed to time-locked stakers,
                      creating sustainable yield without token inflation.
                    </p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <div className="flex-shrink-0 w-8 h-8 bg-red-600 rounded-full flex items-center justify-center text-white text-sm font-bold">
                    4
                  </div>
                  <div className="flex-1">
                    <h4 className="text-md font-medium text-white mb-1">Enhanced Security</h4>
                    <p className="text-[#999999] text-sm">
                      Workshares from different algorithms contribute to block weight and economic finality,
                      making reorg attacks more expensive while diversifying the security model.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Key Benefits */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-white">Key Benefits</h3>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="bg-[#0a0a0a] border border-[#333333] rounded-lg p-4">
                  <h4 className="text-md font-medium text-red-400 mb-2 flex items-center gap-2">
                    Deflationary Mechanism
                  </h4>
                  <p className="text-[#999999] text-sm">
                    Parent chain subsidies fund QUAI burns, reducing total supply while external miners provide security
                    without requiring QUAI emission increases.
                  </p>
                </div>

                <div className="bg-[#0a0a0a] border border-[#333333] rounded-lg p-4">
                  <h4 className="text-md font-medium text-green-400 mb-2 flex items-center gap-2">
                    Sustainable Rewards
                  </h4>
                  <p className="text-[#999999] text-sm">
                    Staking rewards come from external protocol subsidies rather than inflation,
                    creating sustainable yield backed by real economic activity.
                  </p>
                </div>

                <div className="bg-[#0a0a0a] border border-[#333333] rounded-lg p-4">
                  <h4 className="text-md font-medium text-blue-400 mb-2 flex items-center gap-2">
                    Enhanced Security
                  </h4>
                  <p className="text-[#999999] text-sm">
                    Multi-algorithm workshares increase block weight and reorg costs while diversifying
                    security across different hardware supply chains.
                  </p>
                </div>

                <div className="bg-[#0a0a0a] border border-[#333333] rounded-lg p-4">
                  <h4 className="text-md font-medium text-purple-400 mb-2 flex items-center gap-2">
                    Inverted Economics
                  </h4>
                  <p className="text-[#999999] text-sm">
                    Unlike traditional merge-mining that creates selling pressure, SOAP converts
                    external mining into permanent buy pressure and protocol support.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Disclaimer */}
        <Card className="modern-card">
          <CardHeader>
            <CardTitle className="text-xl font-bold text-yellow-400">Important Disclaimer</CardTitle>
            <CardDescription className="text-[#999999]">
              Legal Notice and Risk Warnings
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-sm text-[#cccccc] space-y-4">
              <p className="font-medium">
                <strong>NOT FINANCIAL ADVICE:</strong> This calculator is provided for educational and illustrative purposes only and does not constitute financial, investment, or trading advice.
              </p>
              <p>
                The calculations, projections, and estimates presented are purely hypothetical and based on theoretical scenarios. They are not indicative of future price expectations, returns, or performance of any cryptocurrency, token, or investment product.
              </p>
              <p>
                <strong>No Representations or Warranties:</strong> We make no representations or warranties of any kind, express or implied, about the completeness, accuracy, reliability, suitability, or availability of the information, calculations, or results provided. Any reliance you place on such information is strictly at your own risk.
              </p>
              <p>
                Cryptocurrency investments carry significant risk including the potential for total loss of capital. Past performance does not guarantee future results. Market conditions, regulatory changes, and technological developments may materially affect outcomes.
              </p>
              <p>
                <strong>Consult Professionals:</strong> Before making any financial decisions, please consult with qualified financial advisors, tax professionals, and legal counsel appropriate for your jurisdiction and circumstances.
              </p>
              <p className="text-xs text-[#999999] pt-2 border-t border-slate-700">
                By using this calculator, you acknowledge that you understand these limitations and agree that the creators and contributors shall not be liable for any losses or damages arising from your use of this tool.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  );
};

export default SOAPDistributionModel;
