/* ============================================
   Apache ECharts Configuration & Data Visualization
   S&P 500 Market Intelligence
   ============================================ */

// ============================================
// Color Palette & Theme Registration
// ============================================
const COLORS = {
  blue: '#2997ff',
  green: '#30d158',
  red: '#ff453a',
  orange: '#ff9f0a',
  purple: '#bf5af2',
  teal: '#64d2ff',
  yellow: '#ffd60a',
  pink: '#ff375f',
  white: '#f5f5f7',
  gray: '#6e6e73',
  labelColor: '#a1a1a6',
  titleColor: '#f5f5f7',
  gridLine: 'rgba(255,255,255,0.03)',
  tooltipBg: 'rgba(9,9,11,0.95)',
};

// Register custom ECharts theme: marketIntelligence
(function registerTheme() {
  const theme = {
    color: [
      COLORS.blue, COLORS.green, COLORS.red, COLORS.orange,
      COLORS.purple, COLORS.teal, COLORS.yellow, COLORS.pink
    ],
    backgroundColor: 'transparent',
    textStyle: {
      color: COLORS.labelColor,
      fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'SF Pro Text', 'Helvetica Neue', sans-serif",
      fontSize: 12
    },
    title: {
      textStyle: {
        color: COLORS.titleColor,
        fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
        fontWeight: 600,
        fontSize: 14
      },
      subtextStyle: {
        color: COLORS.labelColor,
        fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
        fontSize: 12
      }
    },
    legend: {
      textStyle: {
        color: COLORS.labelColor,
        fontFamily: "'Inter', -apple-system, sans-serif",
        fontSize: 12
      },
      pageTextStyle: { color: COLORS.labelColor },
      inactiveColor: 'rgba(255,255,255,0.15)'
    },
    tooltip: {
      backgroundColor: COLORS.tooltipBg,
      borderColor: 'rgba(255,255,255,0.08)',
      borderWidth: 1,
      textStyle: {
        color: COLORS.labelColor,
        fontFamily: "'Inter', -apple-system, sans-serif",
        fontSize: 12
      },
      extraCssText: 'border-radius: 8px; box-shadow: 0 8px 32px rgba(0,0,0,0.5); backdrop-filter: blur(12px);'
    },
    categoryAxis: {
      axisLine: { lineStyle: { color: 'rgba(255,255,255,0.06)' } },
      axisTick: { lineStyle: { color: 'rgba(255,255,255,0.06)' } },
      axisLabel: { color: COLORS.labelColor },
      splitLine: { lineStyle: { color: COLORS.gridLine } }
    },
    valueAxis: {
      axisLine: { lineStyle: { color: 'rgba(255,255,255,0.06)' } },
      axisTick: { lineStyle: { color: 'rgba(255,255,255,0.06)' } },
      axisLabel: { color: COLORS.labelColor },
      splitLine: { lineStyle: { color: COLORS.gridLine } }
    },
    line: {
      smooth: true,
      symbolSize: 0,
      lineStyle: { width: 2.5 }
    },
    bar: {
      barWidth: '60%',
      itemStyle: { borderRadius: [6, 6, 0, 0] }
    },
    radar: {
      axisLine: { lineStyle: { color: 'rgba(255,255,255,0.06)' } },
      splitLine: { lineStyle: { color: 'rgba(255,255,255,0.06)' } },
      splitArea: { areaStyle: { color: ['transparent', 'rgba(255,255,255,0.01)'] } }
    }
  };

  echarts.registerTheme('marketIntelligence', theme);
})();


// ============================================
// Utility: Manage chart instances for resize
// ============================================
const chartInstances = [];

function initChart(domId) {
  const el = document.getElementById(domId);
  if (!el) return null;
  // Dispose existing instance if any
  const existing = echarts.getInstanceByDom(el);
  if (existing) existing.dispose();
  const chart = echarts.init(el, 'marketIntelligence', { renderer: 'canvas' });
  chartInstances.push(chart);
  return chart;
}

// Debounced global resize handler
(function setupResize() {
  let resizeTimer;
  window.addEventListener('resize', function () {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(function () {
      chartInstances.forEach(function (chart) {
        if (chart && !chart.isDisposed()) {
          chart.resize();
        }
      });
    }, 150);
  });
})();


// ============================================
// Shared tooltip formatter helper
// ============================================
function tooltipBase() {
  return {
    backgroundColor: COLORS.tooltipBg,
    borderColor: 'rgba(255,255,255,0.08)',
    borderWidth: 1,
    textStyle: {
      color: COLORS.labelColor,
      fontFamily: "'Inter', -apple-system, sans-serif",
      fontSize: 12
    },
    extraCssText: 'border-radius: 8px; box-shadow: 0 8px 32px rgba(0,0,0,0.5);'
  };
}

// Shared animation config
const ANIM = {
  animationDuration: 800,
  animationEasing: 'cubicOut'
};


// ============================================
// 1. S&P 500 Historical Performance (20 years)
// ============================================
function renderSP500HistoricalChart() {
  const chart = initChart('sp500HistoricalChart');
  if (!chart) return;

  const labels = ['2006','2007','2008','2009','2010','2011','2012','2013','2014','2015','2016','2017','2018','2019','2020','2021','2022','2023','2024','2025','Feb 2026'];
  const data = [1418, 1468, 903, 1115, 1258, 1258, 1426, 1848, 2059, 2044, 2239, 2674, 2507, 3231, 3756, 4766, 3840, 4770, 5881, 6845, 6836];

  chart.setOption({
    ...ANIM,
    tooltip: {
      ...tooltipBase(),
      trigger: 'axis',
      formatter: function (params) {
        const p = params[0];
        return '<span style="color:' + COLORS.titleColor + ';font-weight:600;">' + p.name + '</span><br/>' +
               '<span style="color:' + COLORS.blue + ';">\u25CF</span> S&P 500: <span style="color:' + COLORS.white + ';font-weight:600;">' + p.value.toLocaleString() + '</span>';
      }
    },
    grid: {
      left: 60, right: 20, top: 20, bottom: 40, containLabel: false
    },
    xAxis: {
      type: 'category',
      data: labels,
      boundaryGap: false,
      axisLine: { lineStyle: { color: 'rgba(255,255,255,0.06)' } },
      axisTick: { show: false },
      axisLabel: {
        color: COLORS.labelColor,
        interval: function (index) {
          return index % 2 === 0;
        }
      },
      splitLine: { show: false }
    },
    yAxis: {
      type: 'value',
      axisLine: { show: false },
      axisTick: { show: false },
      axisLabel: {
        color: COLORS.labelColor,
        formatter: function (v) { return v.toLocaleString(); }
      },
      splitLine: { lineStyle: { color: COLORS.gridLine } }
    },
    series: [{
      name: 'S&P 500',
      type: 'line',
      data: data,
      smooth: 0.3,
      symbol: 'none',
      emphasis: {
        focus: 'series',
        itemStyle: { borderWidth: 2, borderColor: COLORS.blue },
        symbolSize: 10
      },
      lineStyle: { color: COLORS.blue, width: 2.5 },
      areaStyle: {
        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
          { offset: 0, color: 'rgba(41, 151, 255, 0.12)' },
          { offset: 1, color: 'rgba(41, 151, 255, 0)' }
        ])
      },
      itemStyle: { color: COLORS.blue }
    }]
  });
}


// ============================================
// 2. Annual Returns Bar Chart
// ============================================
function renderAnnualReturnsChart() {
  const chart = initChart('annualReturnsChart');
  if (!chart) return;

  const years = ['2006','2007','2008','2009','2010','2011','2012','2013','2014','2015','2016','2017','2018','2019','2020','2021','2022','2023','2024','2025'];
  const returns = [15.8, 5.5, -37.0, 26.5, 15.1, 2.1, 16.0, 32.4, 13.7, 1.4, 12.0, 21.8, -4.4, 31.5, 18.4, 28.7, -18.1, 26.3, 25.0, 16.4];

  chart.setOption({
    ...ANIM,
    tooltip: {
      ...tooltipBase(),
      trigger: 'axis',
      axisPointer: { type: 'shadow' },
      formatter: function (params) {
        const p = params[0];
        const v = p.value;
        const sign = v >= 0 ? '+' : '';
        return '<span style="color:' + COLORS.titleColor + ';font-weight:600;">' + p.name + '</span><br/>' +
               'Return: <span style="color:' + (v >= 0 ? COLORS.green : COLORS.red) + ';font-weight:600;">' + sign + v.toFixed(1) + '%</span>';
      }
    },
    grid: {
      left: 50, right: 16, top: 16, bottom: 40, containLabel: false
    },
    xAxis: {
      type: 'category',
      data: years,
      axisLine: { lineStyle: { color: 'rgba(255,255,255,0.06)' } },
      axisTick: { show: false },
      axisLabel: {
        color: COLORS.labelColor,
        rotate: 45,
        fontSize: 10
      },
      splitLine: { show: false }
    },
    yAxis: {
      type: 'value',
      axisLine: { show: false },
      axisTick: { show: false },
      axisLabel: {
        color: COLORS.labelColor,
        formatter: '{value}%'
      },
      splitLine: { lineStyle: { color: COLORS.gridLine } }
    },
    series: [{
      name: 'Annual Return',
      type: 'bar',
      data: returns.map(function (r) {
        return {
          value: r,
          itemStyle: {
            color: r >= 0 ? COLORS.green : COLORS.red,
            borderRadius: r >= 0 ? [6, 6, 0, 0] : [0, 0, 6, 6]
          }
        };
      }),
      barWidth: '60%',
      emphasis: {
        itemStyle: { shadowBlur: 10, shadowColor: 'rgba(0,0,0,0.3)' }
      }
    }]
  });
}


// ============================================
// 3. Valuation Comparison (CAPE, P/E)
// ============================================
function renderValuationChart() {
  const chart = initChart('valuationChart');
  if (!chart) return;

  const peaks = ['1929 Peak', '2000 Peak', '2007 Peak', '2021 Peak', 'Current\n(Feb 2026)'];
  const cape = [33.1, 44.2, 27.5, 38.6, 39.7];
  const forwardPE = [20.0, 27.2, 15.7, 22.4, 21.5];

  chart.setOption({
    ...ANIM,
    tooltip: {
      ...tooltipBase(),
      trigger: 'axis',
      axisPointer: { type: 'shadow' }
    },
    legend: {
      show: true,
      top: 0,
      right: 0,
      itemWidth: 14,
      itemHeight: 10,
      itemGap: 20,
      textStyle: { color: COLORS.labelColor, fontSize: 12 },
      data: ['Shiller CAPE Ratio', 'Forward P/E']
    },
    grid: {
      left: 50, right: 16, top: 40, bottom: 40, containLabel: false
    },
    xAxis: {
      type: 'category',
      data: peaks,
      axisLine: { lineStyle: { color: 'rgba(255,255,255,0.06)' } },
      axisTick: { show: false },
      axisLabel: { color: COLORS.labelColor, fontSize: 11 },
      splitLine: { show: false }
    },
    yAxis: {
      type: 'value',
      min: 0,
      axisLine: { show: false },
      axisTick: { show: false },
      axisLabel: {
        color: COLORS.labelColor,
        formatter: '{value}x'
      },
      splitLine: { lineStyle: { color: COLORS.gridLine } }
    },
    series: [
      {
        name: 'Shiller CAPE Ratio',
        type: 'bar',
        data: cape,
        barWidth: '30%',
        barGap: '15%',
        itemStyle: { color: COLORS.blue, borderRadius: [6, 6, 0, 0] },
        emphasis: { itemStyle: { shadowBlur: 10, shadowColor: 'rgba(0,0,0,0.3)' } }
      },
      {
        name: 'Forward P/E',
        type: 'bar',
        data: forwardPE,
        barWidth: '30%',
        itemStyle: { color: COLORS.teal, borderRadius: [6, 6, 0, 0] },
        emphasis: { itemStyle: { shadowBlur: 10, shadowColor: 'rgba(0,0,0,0.3)' } }
      }
    ]
  });
}


// ============================================
// 4. Sector Performance Horizontal Bar
// ============================================
function renderSectorChart() {
  const chart = initChart('sectorChart');
  if (!chart) return;

  const sectors = ['Technology', 'Healthcare', 'Financials', 'Cons. Disc.', 'Industrials', 'Comm. Svc.', 'Energy', 'Cons. Staples', 'Utilities', 'Real Estate', 'Materials'];
  const ytd2026 = [-2.0, 8.0, -3.0, -4.0, -1.5, -1.0, 14.0, 7.0, 5.0, 3.0, 7.0];
  const full2025 = [24.0, 14.6, 15.0, 6.0, 19.4, 33.7, 8.3, 3.9, 16.0, 3.2, -10.5];

  chart.setOption({
    ...ANIM,
    tooltip: {
      ...tooltipBase(),
      trigger: 'axis',
      axisPointer: { type: 'shadow' },
      formatter: function (params) {
        var out = '<span style="color:' + COLORS.titleColor + ';font-weight:600;">' + params[0].name + '</span><br/>';
        params.forEach(function (p) {
          var v = p.value;
          var sign = v >= 0 ? '+' : '';
          out += '<span style="color:' + p.color + ';">\u25CF</span> ' + p.seriesName + ': <span style="color:' + COLORS.white + ';font-weight:600;">' + sign + v.toFixed(1) + '%</span><br/>';
        });
        return out;
      }
    },
    legend: {
      show: true,
      top: 0,
      right: 0,
      itemWidth: 14,
      itemHeight: 10,
      itemGap: 20,
      textStyle: { color: COLORS.labelColor },
      data: ['2025 Full Year', '2026 YTD']
    },
    grid: {
      left: 100, right: 30, top: 40, bottom: 16, containLabel: false
    },
    xAxis: {
      type: 'value',
      axisLine: { show: false },
      axisTick: { show: false },
      axisLabel: {
        color: COLORS.labelColor,
        formatter: '{value}%'
      },
      splitLine: { lineStyle: { color: COLORS.gridLine } }
    },
    yAxis: {
      type: 'category',
      data: sectors,
      inverse: true,
      axisLine: { lineStyle: { color: 'rgba(255,255,255,0.06)' } },
      axisTick: { show: false },
      axisLabel: { color: COLORS.labelColor, fontSize: 11 },
      splitLine: { show: false }
    },
    series: [
      {
        name: '2025 Full Year',
        type: 'bar',
        data: full2025,
        barWidth: '35%',
        barGap: '10%',
        itemStyle: { color: COLORS.blue, borderRadius: [0, 6, 6, 0] },
        emphasis: { itemStyle: { shadowBlur: 10, shadowColor: 'rgba(0,0,0,0.3)' } }
      },
      {
        name: '2026 YTD',
        type: 'bar',
        data: ytd2026,
        barWidth: '35%',
        itemStyle: { color: COLORS.teal, borderRadius: [0, 6, 6, 0] },
        emphasis: { itemStyle: { shadowBlur: 10, shadowColor: 'rgba(0,0,0,0.3)' } }
      }
    ]
  });
}


// ============================================
// 5. Magnificent 7 Concentration (Doughnut)
// ============================================
function renderMag7Chart() {
  const chart = initChart('mag7Chart');
  if (!chart) return;

  const data = [
    { value: 7.3, name: 'Apple' },
    { value: 6.0, name: 'Microsoft' },
    { value: 6.5, name: 'NVIDIA' },
    { value: 4.2, name: 'Amazon' },
    { value: 4.1, name: 'Alphabet' },
    { value: 3.2, name: 'Meta' },
    { value: 2.7, name: 'Tesla' },
    { value: 66.0, name: 'Other 493 Stocks' }
  ];
  const colors = [
    COLORS.blue, COLORS.green, COLORS.purple, COLORS.orange,
    COLORS.teal, COLORS.pink, COLORS.red, 'rgba(255,255,255,0.08)'
  ];

  chart.setOption({
    ...ANIM,
    tooltip: {
      ...tooltipBase(),
      trigger: 'item',
      formatter: function (p) {
        return '<span style="color:' + COLORS.titleColor + ';font-weight:600;">' + p.name + '</span><br/>' +
               '<span style="color:' + p.color + ';">\u25CF</span> Weight: <span style="color:' + COLORS.white + ';font-weight:600;">' + p.value + '%</span>';
      }
    },
    legend: {
      orient: 'vertical',
      right: 10,
      top: 'center',
      itemWidth: 10,
      itemHeight: 10,
      itemGap: 12,
      textStyle: { color: COLORS.labelColor, fontSize: 12 },
      formatter: function (name) {
        var item = data.find(function (d) { return d.name === name; });
        return name + '  ' + (item ? item.value + '%' : '');
      }
    },
    series: [{
      name: 'S&P 500 Weight',
      type: 'pie',
      radius: ['55%', '82%'],
      center: ['35%', '50%'],
      avoidLabelOverlap: false,
      label: { show: false },
      emphasis: {
        scaleSize: 8,
        label: {
          show: true,
          fontSize: 14,
          fontWeight: 600,
          color: COLORS.white
        }
      },
      labelLine: { show: false },
      data: data.map(function (d, i) {
        return {
          value: d.value,
          name: d.name,
          itemStyle: { color: colors[i] }
        };
      })
    }]
  });
}


// ============================================
// 6. Buffett Indicator Historical Chart
// ============================================
function renderBuffettChart() {
  const chart = initChart('buffettChart');
  if (!chart) return;

  const labels = ['2000', '2003', '2005', '2007', '2009', '2011', '2013', '2015', '2017', '2019', '2021', '2023', '2025', 'Feb 2026'];
  const mcapGdp = [148, 72, 100, 110, 56, 79, 109, 117, 137, 153, 200, 171, 195, 220];
  const baseline = labels.map(function () { return 100; });

  chart.setOption({
    ...ANIM,
    tooltip: {
      ...tooltipBase(),
      trigger: 'axis',
      formatter: function (params) {
        var out = '<span style="color:' + COLORS.titleColor + ';font-weight:600;">' + params[0].name + '</span><br/>';
        params.forEach(function (p) {
          out += '<span style="color:' + p.color + ';">\u25CF</span> ' + p.seriesName + ': <span style="color:' + COLORS.white + ';font-weight:600;">' + p.value + '%</span><br/>';
        });
        return out;
      }
    },
    legend: {
      show: true,
      top: 0,
      right: 0,
      itemWidth: 20,
      itemHeight: 3,
      itemGap: 20,
      textStyle: { color: COLORS.labelColor },
      data: ['Market Cap / GDP', 'Historical Average (100%)']
    },
    grid: {
      left: 50, right: 16, top: 40, bottom: 40, containLabel: false
    },
    xAxis: {
      type: 'category',
      data: labels,
      boundaryGap: false,
      axisLine: { lineStyle: { color: 'rgba(255,255,255,0.06)' } },
      axisTick: { show: false },
      axisLabel: { color: COLORS.labelColor },
      splitLine: { show: false }
    },
    yAxis: {
      type: 'value',
      axisLine: { show: false },
      axisTick: { show: false },
      axisLabel: {
        color: COLORS.labelColor,
        formatter: '{value}%'
      },
      splitLine: { lineStyle: { color: COLORS.gridLine } }
    },
    series: [
      {
        name: 'Market Cap / GDP',
        type: 'line',
        data: mcapGdp,
        smooth: 0.3,
        symbol: 'circle',
        symbolSize: 5,
        showSymbol: false,
        emphasis: { focus: 'series', symbolSize: 10 },
        lineStyle: { color: COLORS.blue, width: 2.5 },
        itemStyle: { color: COLORS.blue },
        areaStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: 'rgba(41, 151, 255, 0.12)' },
            { offset: 1, color: 'rgba(41, 151, 255, 0)' }
          ])
        }
      },
      {
        name: 'Historical Average (100%)',
        type: 'line',
        data: baseline,
        smooth: false,
        symbol: 'none',
        lineStyle: {
          color: COLORS.orange,
          width: 1.5,
          type: [8, 4]
        },
        itemStyle: { color: COLORS.orange }
      }
    ]
  });
}


// ============================================
// 7. Sentiment Indicators Radar
// ============================================
function renderSentimentRadar() {
  const chart = initChart('sentimentRadar');
  if (!chart) return;

  chart.setOption({
    ...ANIM,
    tooltip: {
      ...tooltipBase(),
      trigger: 'item'
    },
    legend: {
      show: true,
      top: 0,
      right: 0,
      itemWidth: 10,
      itemHeight: 10,
      itemGap: 20,
      textStyle: { color: COLORS.labelColor },
      data: ['Current Reading', 'Extreme Bullish (Danger)']
    },
    radar: {
      shape: 'polygon',
      center: ['50%', '55%'],
      radius: '70%',
      indicator: [
        { name: 'AAII Bull %', max: 100 },
        { name: 'Put/Call\nRatio', max: 100 },
        { name: 'VIX Level', max: 100 },
        { name: 'CNN\nFear/Greed', max: 100 },
        { name: 'Fund Mgr\nCash', max: 100 },
        { name: 'Insider\nBuy/Sell', max: 100 }
      ],
      axisName: {
        color: COLORS.labelColor,
        fontSize: 11,
        fontFamily: "'Inter', -apple-system, sans-serif"
      },
      axisLine: { lineStyle: { color: 'rgba(255,255,255,0.06)' } },
      splitLine: { lineStyle: { color: 'rgba(255,255,255,0.06)' } },
      splitArea: { areaStyle: { color: ['transparent', 'rgba(255,255,255,0.01)'] } }
    },
    series: [{
      type: 'radar',
      data: [
        {
          name: 'Current Reading',
          value: [42, 35, 45, 62, 30, 28],
          symbol: 'circle',
          symbolSize: 6,
          lineStyle: { color: COLORS.blue, width: 2 },
          areaStyle: { color: 'rgba(41, 151, 255, 0.15)' },
          itemStyle: { color: COLORS.blue, borderColor: COLORS.blue, borderWidth: 2 }
        },
        {
          name: 'Extreme Bullish (Danger)',
          value: [65, 20, 20, 90, 15, 15],
          symbol: 'none',
          lineStyle: { color: COLORS.red, width: 1.5, type: [5, 3] },
          areaStyle: { color: 'rgba(255, 69, 58, 0.06)' },
          itemStyle: { color: COLORS.red }
        }
      ]
    }]
  });
}


// ============================================
// 8. Earnings Growth Projection (Mixed bar+line)
// ============================================
function renderEarningsChart() {
  const chart = initChart('earningsChart');
  if (!chart) return;

  const quarters = ['Q1 2025', 'Q2 2025', 'Q3 2025', 'Q4 2025', 'Q1 2026E', 'Q2 2026E', 'Q3 2026E', 'Q4 2026E'];
  const eps = [57.2, 59.1, 60.8, 63.5, 65.2, 67.5, 69.0, 70.5];
  const yoyGrowth = [5.8, 10.2, 8.5, 13.2, 11.1, 14.9, 13.5, 11.0];

  chart.setOption({
    ...ANIM,
    tooltip: {
      ...tooltipBase(),
      trigger: 'axis',
      axisPointer: { type: 'shadow' },
      formatter: function (params) {
        var out = '<span style="color:' + COLORS.titleColor + ';font-weight:600;">' + params[0].name + '</span><br/>';
        params.forEach(function (p) {
          if (p.seriesName === 'EPS ($)') {
            out += '<span style="color:' + p.color + ';">\u25CF</span> EPS: <span style="color:' + COLORS.white + ';font-weight:600;">$' + p.value.toFixed(1) + '</span><br/>';
          } else {
            out += '<span style="color:' + p.color + ';">\u25CF</span> YoY Growth: <span style="color:' + COLORS.white + ';font-weight:600;">' + p.value.toFixed(1) + '%</span><br/>';
          }
        });
        return out;
      }
    },
    legend: {
      show: true,
      top: 0,
      right: 0,
      itemWidth: 14,
      itemHeight: 10,
      itemGap: 20,
      textStyle: { color: COLORS.labelColor },
      data: ['EPS ($)', 'YoY Growth %']
    },
    grid: {
      left: 55, right: 55, top: 40, bottom: 40, containLabel: false
    },
    xAxis: {
      type: 'category',
      data: quarters,
      axisLine: { lineStyle: { color: 'rgba(255,255,255,0.06)' } },
      axisTick: { show: false },
      axisLabel: { color: COLORS.labelColor, fontSize: 10, rotate: 30 },
      splitLine: { show: false }
    },
    yAxis: [
      {
        type: 'value',
        position: 'left',
        axisLine: { show: false },
        axisTick: { show: false },
        axisLabel: {
          color: COLORS.labelColor,
          formatter: '${value}'
        },
        splitLine: { lineStyle: { color: COLORS.gridLine } }
      },
      {
        type: 'value',
        position: 'right',
        axisLine: { show: false },
        axisTick: { show: false },
        axisLabel: {
          color: COLORS.labelColor,
          formatter: '{value}%'
        },
        splitLine: { show: false }
      }
    ],
    series: [
      {
        name: 'EPS ($)',
        type: 'bar',
        yAxisIndex: 0,
        data: eps.map(function (v, i) {
          return {
            value: v,
            itemStyle: {
              color: i >= 4 ? 'rgba(41, 151, 255, 0.5)' : COLORS.blue,
              borderRadius: [6, 6, 0, 0]
            }
          };
        }),
        barWidth: '50%'
      },
      {
        name: 'YoY Growth %',
        type: 'line',
        yAxisIndex: 1,
        data: yoyGrowth,
        smooth: 0.3,
        symbol: 'circle',
        symbolSize: 7,
        showSymbol: true,
        lineStyle: { color: COLORS.green, width: 2 },
        itemStyle: { color: COLORS.green, borderColor: '#1a1a1a', borderWidth: 2 }
      }
    ]
  });
}


// ============================================
// 9. Fed Funds Rate & S&P 500 (Dual-axis line)
// ============================================
function renderFedRateChart() {
  const chart = initChart('fedRateChart');
  if (!chart) return;

  const labels = ['Jan 2022','Jul 2022','Jan 2023','Jul 2023','Jan 2024','Jul 2024','Jan 2025','Jul 2025','Jan 2026'];
  const fedRate = [0.25, 2.5, 4.5, 5.25, 5.5, 5.5, 4.375, 4.375, 3.625];
  const sp500 = [4516, 3785, 4077, 4589, 4770, 5522, 5881, 5700, 6836];

  chart.setOption({
    ...ANIM,
    tooltip: {
      ...tooltipBase(),
      trigger: 'axis',
      formatter: function (params) {
        var out = '<span style="color:' + COLORS.titleColor + ';font-weight:600;">' + params[0].name + '</span><br/>';
        params.forEach(function (p) {
          if (p.seriesName === 'Fed Funds Rate') {
            out += '<span style="color:' + p.color + ';">\u25CF</span> Fed Rate: <span style="color:' + COLORS.white + ';font-weight:600;">' + p.value + '%</span><br/>';
          } else {
            out += '<span style="color:' + p.color + ';">\u25CF</span> S&P 500: <span style="color:' + COLORS.white + ';font-weight:600;">' + p.value.toLocaleString() + '</span><br/>';
          }
        });
        return out;
      }
    },
    legend: {
      show: true,
      top: 0,
      right: 0,
      itemWidth: 20,
      itemHeight: 3,
      itemGap: 20,
      textStyle: { color: COLORS.labelColor },
      data: ['Fed Funds Rate', 'S&P 500']
    },
    grid: {
      left: 55, right: 60, top: 45, bottom: 40, containLabel: false
    },
    xAxis: {
      type: 'category',
      data: labels,
      boundaryGap: false,
      axisLine: { lineStyle: { color: 'rgba(255,255,255,0.06)' } },
      axisTick: { show: false },
      axisLabel: { color: COLORS.labelColor, fontSize: 10, rotate: 30 },
      splitLine: { show: false }
    },
    yAxis: [
      {
        type: 'value',
        position: 'left',
        name: 'Fed Funds Rate',
        nameTextStyle: { color: COLORS.orange, fontSize: 11, padding: [0, 0, 0, 0] },
        axisLine: { show: false },
        axisTick: { show: false },
        axisLabel: {
          color: COLORS.labelColor,
          formatter: '{value}%'
        },
        splitLine: { lineStyle: { color: COLORS.gridLine } }
      },
      {
        type: 'value',
        position: 'right',
        name: 'S&P 500',
        nameTextStyle: { color: COLORS.blue, fontSize: 11, padding: [0, 0, 0, 0] },
        axisLine: { show: false },
        axisTick: { show: false },
        axisLabel: {
          color: COLORS.labelColor,
          formatter: function (v) { return v.toLocaleString(); }
        },
        splitLine: { show: false }
      }
    ],
    series: [
      {
        name: 'Fed Funds Rate',
        type: 'line',
        yAxisIndex: 0,
        data: fedRate,
        smooth: 0.1,
        symbol: 'circle',
        symbolSize: 5,
        showSymbol: false,
        emphasis: { focus: 'series', symbolSize: 10 },
        lineStyle: { color: COLORS.orange, width: 2.5 },
        itemStyle: { color: COLORS.orange }
      },
      {
        name: 'S&P 500',
        type: 'line',
        yAxisIndex: 1,
        data: sp500,
        smooth: 0.3,
        symbol: 'circle',
        symbolSize: 5,
        showSymbol: false,
        emphasis: { focus: 'series', symbolSize: 10 },
        lineStyle: { color: COLORS.blue, width: 2.5 },
        itemStyle: { color: COLORS.blue }
      }
    ]
  });
}


// ============================================
// 10. Bull vs Bear Scenarios
// ============================================
function renderScenarioChart() {
  const chart = initChart('scenarioChart');
  if (!chart) return;

  const scenarios = ['Bear Case', 'Base Case', 'Bull Case'];
  const targets = [4800, 6400, 7200];
  const scenarioColors = [COLORS.red, COLORS.blue, COLORS.green];

  chart.setOption({
    ...ANIM,
    tooltip: {
      ...tooltipBase(),
      trigger: 'axis',
      axisPointer: { type: 'shadow' },
      formatter: function (params) {
        const p = params[0];
        return '<span style="color:' + COLORS.titleColor + ';font-weight:600;">' + p.name + '</span><br/>' +
               'Target: <span style="color:' + COLORS.white + ';font-weight:600;">' + p.value.toLocaleString() + '</span>';
      }
    },
    grid: {
      left: 60, right: 20, top: 20, bottom: 40, containLabel: false
    },
    xAxis: {
      type: 'category',
      data: scenarios,
      axisLine: { lineStyle: { color: 'rgba(255,255,255,0.06)' } },
      axisTick: { show: false },
      axisLabel: { color: COLORS.labelColor, fontSize: 13, fontWeight: 600 },
      splitLine: { show: false }
    },
    yAxis: {
      type: 'value',
      min: 4000,
      axisLine: { show: false },
      axisTick: { show: false },
      axisLabel: {
        color: COLORS.labelColor,
        formatter: function (v) { return v.toLocaleString(); }
      },
      splitLine: { lineStyle: { color: COLORS.gridLine } }
    },
    series: [{
      name: 'S&P 500 Year-End Target',
      type: 'bar',
      data: targets.map(function (v, i) {
        return {
          value: v,
          itemStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              { offset: 0, color: scenarioColors[i] },
              { offset: 1, color: scenarioColors[i].replace(')', ', 0.5)').replace('rgb', 'rgba') }
            ]),
            borderRadius: [8, 8, 0, 0]
          },
          label: {
            show: true,
            position: 'top',
            color: COLORS.white,
            fontWeight: 600,
            fontSize: 14,
            formatter: function (p) { return p.value.toLocaleString(); }
          }
        };
      }),
      barWidth: '45%',
      emphasis: {
        itemStyle: { shadowBlur: 16, shadowColor: 'rgba(0,0,0,0.4)' }
      }
    }]
  });
}


// ============================================
// 11. Historical CAPE vs Forward Returns (Scatter)
// ============================================
function renderCapeReturnsChart() {
  const chart = initChart('capeReturnsChart');
  if (!chart) return;

  const scatterData = [
    [10, 14.2], [12, 12.8], [14, 11.1], [16, 9.8],
    [18, 8.5], [20, 7.2], [22, 5.9], [24, 4.8],
    [26, 3.7], [28, 2.8], [30, 2.1], [32, 1.4],
    [34, 0.8], [36, 0.2], [38, -0.3],
    [40, -0.8], [44, -1.5]
  ];

  chart.setOption({
    ...ANIM,
    tooltip: {
      ...tooltipBase(),
      trigger: 'item',
      formatter: function (p) {
        if (p.seriesName === 'Current Position') {
          return '<span style="color:' + COLORS.red + ';font-weight:600;">Current CAPE: 39.7x</span><br/>' +
                 'Implied forward return: <span style="color:' + COLORS.white + ';font-weight:600;">~0%</span>';
        }
        return '<span style="color:' + COLORS.titleColor + ';font-weight:600;">CAPE: ' + p.value[0] + 'x</span><br/>' +
               '10yr Fwd Return: <span style="color:' + COLORS.white + ';font-weight:600;">' + p.value[1] + '%</span>';
      }
    },
    legend: {
      show: true,
      top: 0,
      right: 0,
      itemWidth: 10,
      itemHeight: 10,
      itemGap: 20,
      textStyle: { color: COLORS.labelColor },
      data: [
        { name: 'CAPE vs 10yr Forward Return', icon: 'circle' },
        { name: 'Current Position', icon: 'diamond' }
      ]
    },
    grid: {
      left: 60, right: 30, top: 45, bottom: 50, containLabel: false
    },
    xAxis: {
      type: 'value',
      name: 'Shiller CAPE Ratio',
      nameLocation: 'center',
      nameGap: 30,
      nameTextStyle: { color: COLORS.labelColor, fontSize: 12 },
      axisLine: { lineStyle: { color: 'rgba(255,255,255,0.06)' } },
      axisTick: { show: false },
      axisLabel: { color: COLORS.labelColor },
      splitLine: { lineStyle: { color: COLORS.gridLine } }
    },
    yAxis: {
      type: 'value',
      name: '10-Year Annualized Return',
      nameLocation: 'center',
      nameGap: 40,
      nameTextStyle: { color: COLORS.labelColor, fontSize: 12 },
      axisLine: { show: false },
      axisTick: { show: false },
      axisLabel: {
        color: COLORS.labelColor,
        formatter: '{value}%'
      },
      splitLine: { lineStyle: { color: COLORS.gridLine } }
    },
    series: [
      {
        name: 'CAPE vs 10yr Forward Return',
        type: 'scatter',
        data: scatterData,
        symbolSize: 10,
        itemStyle: {
          color: COLORS.blue,
          shadowBlur: 6,
          shadowColor: 'rgba(41, 151, 255, 0.3)'
        },
        emphasis: {
          symbolSize: 14,
          itemStyle: { shadowBlur: 12, shadowColor: 'rgba(41, 151, 255, 0.5)' }
        }
      },
      {
        name: 'Current Position',
        type: 'scatter',
        data: [[39.7, -0.5]],
        symbolSize: 18,
        symbol: 'diamond',
        itemStyle: {
          color: COLORS.red,
          shadowBlur: 10,
          shadowColor: 'rgba(255, 69, 58, 0.5)'
        },
        emphasis: {
          symbolSize: 22,
          itemStyle: { shadowBlur: 16, shadowColor: 'rgba(255, 69, 58, 0.7)' }
        },
        z: 10
      },
      {
        // Vertical mark line for current CAPE
        name: '_markline',
        type: 'scatter',
        data: [],
        markLine: {
          silent: true,
          symbol: 'none',
          lineStyle: {
            color: COLORS.red,
            width: 2,
            type: [6, 3]
          },
          label: {
            show: true,
            position: 'start',
            formatter: 'Current CAPE: 39.7',
            color: '#fff',
            backgroundColor: 'rgba(255,69,58,0.8)',
            padding: [4, 8],
            borderRadius: 4,
            fontSize: 11
          },
          data: [{ xAxis: 39.7 }]
        }
      }
    ]
  });
}


// ============================================
// 12. Geopolitical Risk Timeline
// ============================================
function renderGeopoliticalChart() {
  const chart = initChart('geopoliticalChart');
  if (!chart) return;

  const labels = ['Jan 25','Feb 25','Mar 25','Apr 25','May 25','Jun 25','Jul 25','Aug 25','Sep 25','Oct 25','Nov 25','Dec 25','Jan 26','Feb 26'];
  const epu = [280, 350, 320, 290, 260, 240, 250, 230, 245, 270, 310, 295, 340, 370];
  const gpr = [160, 175, 165, 155, 150, 145, 140, 148, 155, 162, 170, 168, 180, 185];

  chart.setOption({
    ...ANIM,
    tooltip: {
      ...tooltipBase(),
      trigger: 'axis',
      formatter: function (params) {
        var out = '<span style="color:' + COLORS.titleColor + ';font-weight:600;">' + params[0].name + '</span><br/>';
        params.forEach(function (p) {
          out += '<span style="color:' + p.color + ';">\u25CF</span> ' + p.seriesName + ': <span style="color:' + COLORS.white + ';font-weight:600;">' + p.value + '</span><br/>';
        });
        return out;
      }
    },
    legend: {
      show: true,
      top: 0,
      right: 0,
      itemWidth: 20,
      itemHeight: 3,
      itemGap: 20,
      textStyle: { color: COLORS.labelColor },
      data: ['Economic Policy Uncertainty Index', 'Geopolitical Risk Index']
    },
    grid: {
      left: 50, right: 16, top: 40, bottom: 40, containLabel: false
    },
    xAxis: {
      type: 'category',
      data: labels,
      boundaryGap: false,
      axisLine: { lineStyle: { color: 'rgba(255,255,255,0.06)' } },
      axisTick: { show: false },
      axisLabel: { color: COLORS.labelColor, fontSize: 10 },
      splitLine: { show: false }
    },
    yAxis: {
      type: 'value',
      axisLine: { show: false },
      axisTick: { show: false },
      axisLabel: { color: COLORS.labelColor },
      splitLine: { lineStyle: { color: COLORS.gridLine } }
    },
    series: [
      {
        name: 'Economic Policy Uncertainty Index',
        type: 'line',
        data: epu,
        smooth: 0.3,
        symbol: 'circle',
        symbolSize: 5,
        showSymbol: false,
        emphasis: { focus: 'series', symbolSize: 10 },
        lineStyle: { color: COLORS.red, width: 2.5 },
        itemStyle: { color: COLORS.red },
        areaStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: 'rgba(255, 69, 58, 0.12)' },
            { offset: 1, color: 'rgba(255, 69, 58, 0)' }
          ])
        }
      },
      {
        name: 'Geopolitical Risk Index',
        type: 'line',
        data: gpr,
        smooth: 0.3,
        symbol: 'circle',
        symbolSize: 5,
        showSymbol: false,
        emphasis: { focus: 'series', symbolSize: 10 },
        lineStyle: { color: COLORS.orange, width: 2 },
        itemStyle: { color: COLORS.orange }
      }
    ]
  });
}


// ============================================
// 13. Tail Risk Probability vs Impact (Bubble)
// ============================================
function renderTailRiskChart() {
  const chart = initChart('tailRiskChart');
  if (!chart) return;

  const risks = [
    { name: 'China-Taiwan Invasion',      x: 4,    y: 35, size: 22, color: 'rgba(255, 69, 58, 0.6)',  border: COLORS.red },
    { name: 'Pandemic Resurgence (H5N1)', x: 7.5,  y: 25, size: 18, color: 'rgba(255, 159, 10, 0.6)', border: COLORS.orange },
    { name: 'US Debt / Treasury Crisis',  x: 6.5,  y: 25, size: 16, color: 'rgba(255, 159, 10, 0.5)', border: COLORS.orange },
    { name: 'AI Bubble Correction',       x: 17.5, y: 20, size: 20, color: 'rgba(191, 90, 242, 0.6)', border: COLORS.purple },
    { name: 'CRE Crisis Escalation',      x: 25,   y: 10, size: 14, color: 'rgba(255, 159, 10, 0.4)', border: COLORS.orange },
    { name: 'Russia-NATO Conflict',       x: 7.5,  y: 15, size: 14, color: 'rgba(255, 69, 58, 0.5)',  border: COLORS.red },
    { name: 'Cyber Attack (Financial)',   x: 10,   y: 10, size: 12, color: 'rgba(100, 210, 255, 0.5)', border: COLORS.teal },
    { name: 'Climate Catastrophe',        x: 20,   y: 9,  size: 14, color: 'rgba(48, 209, 88, 0.4)',  border: COLORS.green }
  ];

  // Create individual series for each bubble (for proper legend)
  var series = risks.map(function (r) {
    return {
      name: r.name,
      type: 'scatter',
      data: [[r.x, r.y]],
      symbolSize: r.size * 2.5,
      itemStyle: {
        color: r.color,
        borderColor: r.border,
        borderWidth: 2,
        shadowBlur: 6,
        shadowColor: r.color
      },
      emphasis: {
        symbolSize: r.size * 3,
        itemStyle: { shadowBlur: 12 }
      }
    };
  });

  chart.setOption({
    ...ANIM,
    tooltip: {
      ...tooltipBase(),
      trigger: 'item',
      formatter: function (p) {
        return '<span style="color:' + COLORS.titleColor + ';font-weight:600;">' + p.seriesName + '</span><br/>' +
               'Probability: <span style="color:' + COLORS.white + ';font-weight:600;">' + p.value[0] + '%</span><br/>' +
               'S&P 500 Impact: <span style="color:' + COLORS.red + ';font-weight:600;">-' + p.value[1] + '%</span>';
      }
    },
    legend: {
      show: true,
      bottom: 0,
      left: 'center',
      itemWidth: 10,
      itemHeight: 10,
      itemGap: 16,
      textStyle: { color: COLORS.labelColor, fontSize: 11 },
      data: risks.map(function (r) { return r.name; })
    },
    grid: {
      left: 65, right: 30, top: 20, bottom: 80, containLabel: false
    },
    xAxis: {
      type: 'value',
      name: '12-Month Probability (%)',
      nameLocation: 'center',
      nameGap: 30,
      nameTextStyle: { color: COLORS.labelColor, fontSize: 12 },
      min: 0,
      max: 35,
      axisLine: { lineStyle: { color: 'rgba(255,255,255,0.06)' } },
      axisTick: { show: false },
      axisLabel: {
        color: COLORS.labelColor,
        formatter: '{value}%'
      },
      splitLine: { lineStyle: { color: COLORS.gridLine } }
    },
    yAxis: {
      type: 'value',
      name: 'Potential S&P 500 Drawdown (%)',
      nameLocation: 'center',
      nameGap: 45,
      nameTextStyle: { color: COLORS.labelColor, fontSize: 12 },
      min: 0,
      max: 45,
      axisLine: { show: false },
      axisTick: { show: false },
      axisLabel: {
        color: COLORS.labelColor,
        formatter: function (v) { return '-' + v + '%'; }
      },
      splitLine: { lineStyle: { color: COLORS.gridLine } }
    },
    series: series
  });
}


// ============================================
// 14. NEW: Risk Gauge Chart (72% Elevated Risk)
// ============================================
function renderRiskGaugeChart() {
  const chart = initChart('riskGaugeChart');
  if (!chart) return;

  chart.setOption({
    ...ANIM,
    series: [{
      type: 'gauge',
      center: ['50%', '60%'],
      radius: '85%',
      startAngle: 200,
      endAngle: -20,
      min: 0,
      max: 100,
      splitNumber: 10,
      axisLine: {
        lineStyle: {
          width: 20,
          color: [
            [0.25, COLORS.green],
            [0.50, COLORS.yellow],
            [0.75, COLORS.orange],
            [1, COLORS.red]
          ]
        }
      },
      pointer: {
        icon: 'path://M12.8,0.7l12,40.1H0.7L12.8,0.7z',
        length: '55%',
        width: 12,
        offsetCenter: [0, '-8%'],
        itemStyle: {
          color: 'auto',
          shadowColor: 'rgba(0,0,0,0.4)',
          shadowBlur: 8,
          shadowOffsetY: 2
        }
      },
      axisTick: {
        distance: -20,
        length: 6,
        lineStyle: {
          color: 'rgba(255,255,255,0.15)',
          width: 1
        }
      },
      splitLine: {
        distance: -22,
        length: 12,
        lineStyle: {
          color: 'rgba(255,255,255,0.2)',
          width: 2
        }
      },
      axisLabel: {
        distance: -4,
        color: COLORS.labelColor,
        fontSize: 10,
        formatter: function (value) {
          if (value === 0) return 'Low';
          if (value === 25) return 'Moderate';
          if (value === 50) return 'Elevated';
          if (value === 75) return 'High';
          if (value === 100) return 'Extreme';
          return '';
        }
      },
      title: {
        offsetCenter: [0, '32%'],
        color: COLORS.labelColor,
        fontSize: 14,
        fontFamily: "'Inter', -apple-system, sans-serif"
      },
      detail: {
        valueAnimation: true,
        formatter: function (value) {
          return '{value|' + value + '%}\n{label|ELEVATED RISK}';
        },
        rich: {
          value: {
            fontSize: 42,
            fontWeight: 700,
            color: COLORS.orange,
            fontFamily: "'Inter', -apple-system, sans-serif",
            lineHeight: 50
          },
          label: {
            fontSize: 12,
            fontWeight: 600,
            color: COLORS.labelColor,
            fontFamily: "'Inter', -apple-system, sans-serif",
            letterSpacing: 2,
            lineHeight: 24
          }
        },
        offsetCenter: [0, '10%']
      },
      anchor: {
        show: true,
        size: 16,
        showAbove: true,
        itemStyle: {
          borderColor: 'rgba(255,255,255,0.15)',
          borderWidth: 2,
          color: '#1a1a1a',
          shadowColor: 'rgba(0,0,0,0.5)',
          shadowBlur: 8
        }
      },
      data: [{
        value: 72,
        name: 'Composite Risk Score'
      }]
    }]
  });
}


// ============================================
// 15. NEW: Magnificent 7 Treemap
// ============================================
function renderMag7TreemapChart() {
  const chart = initChart('mag7TreemapChart');
  if (!chart) return;

  chart.setOption({
    ...ANIM,
    tooltip: {
      ...tooltipBase(),
      formatter: function (p) {
        if (!p.data || !p.data.name) return '';
        return '<span style="color:' + COLORS.titleColor + ';font-weight:600;">' + p.data.name + '</span><br/>' +
               'S&P 500 Weight: <span style="color:' + COLORS.white + ';font-weight:600;">' + p.data.value + '%</span>';
      }
    },
    series: [{
      type: 'treemap',
      top: 8,
      left: 8,
      right: 8,
      bottom: 8,
      roam: false,
      nodeClick: false,
      breadcrumb: { show: false },
      label: {
        show: true,
        formatter: function (p) {
          return '{name|' + p.data.name + '}\n{value|' + p.data.value + '%}';
        },
        rich: {
          name: {
            fontSize: 13,
            fontWeight: 600,
            color: '#fff',
            fontFamily: "'Inter', -apple-system, sans-serif",
            lineHeight: 22
          },
          value: {
            fontSize: 18,
            fontWeight: 700,
            color: 'rgba(255,255,255,0.9)',
            fontFamily: "'Inter', -apple-system, sans-serif",
            lineHeight: 26
          }
        },
        verticalAlign: 'middle',
        align: 'center'
      },
      upperLabel: { show: false },
      itemStyle: {
        borderColor: 'rgba(0,0,0,0.3)',
        borderWidth: 2,
        gapWidth: 3
      },
      emphasis: {
        itemStyle: {
          shadowBlur: 20,
          shadowColor: 'rgba(0,0,0,0.5)'
        },
        label: {
          rich: {
            name: { fontSize: 15 },
            value: { fontSize: 22 }
          }
        }
      },
      levels: [{
        itemStyle: {
          borderColor: 'rgba(0,0,0,0.5)',
          borderWidth: 0,
          gapWidth: 4
        }
      }],
      data: [
        {
          name: 'Apple',
          value: 7.3,
          itemStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 1, 1, [
              { offset: 0, color: '#2997ff' },
              { offset: 1, color: '#1a6ecc' }
            ])
          }
        },
        {
          name: 'Microsoft',
          value: 6.0,
          itemStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 1, 1, [
              { offset: 0, color: '#30d158' },
              { offset: 1, color: '#1e9940' }
            ])
          }
        },
        {
          name: 'NVIDIA',
          value: 6.5,
          itemStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 1, 1, [
              { offset: 0, color: '#bf5af2' },
              { offset: 1, color: '#8a3cb5' }
            ])
          }
        },
        {
          name: 'Amazon',
          value: 4.2,
          itemStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 1, 1, [
              { offset: 0, color: '#ff9f0a' },
              { offset: 1, color: '#cc7f08' }
            ])
          }
        },
        {
          name: 'Alphabet',
          value: 4.1,
          itemStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 1, 1, [
              { offset: 0, color: '#64d2ff' },
              { offset: 1, color: '#3ba8d4' }
            ])
          }
        },
        {
          name: 'Meta',
          value: 3.2,
          itemStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 1, 1, [
              { offset: 0, color: '#ff375f' },
              { offset: 1, color: '#cc2c4c' }
            ])
          }
        },
        {
          name: 'Tesla',
          value: 2.7,
          itemStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 1, 1, [
              { offset: 0, color: '#ff453a' },
              { offset: 1, color: '#cc372e' }
            ])
          }
        },
        {
          name: 'Other 493',
          value: 66.0,
          itemStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 1, 1, [
              { offset: 0, color: 'rgba(255,255,255,0.08)' },
              { offset: 1, color: 'rgba(255,255,255,0.03)' }
            ])
          },
          label: {
            rich: {
              name: {
                color: 'rgba(255,255,255,0.5)'
              },
              value: {
                color: 'rgba(255,255,255,0.4)'
              }
            }
          }
        }
      ]
    }]
  });
}


// ============================================
// 16. NEW: Sector Monthly Performance Heatmap
// ============================================
function renderSectorHeatmapChart() {
  const chart = initChart('sectorHeatmapChart');
  if (!chart) return;

  const months = ['Sep 2025', 'Oct 2025', 'Nov 2025', 'Dec 2025', 'Jan 2026', 'Feb 2026'];
  const sectors = ['Technology', 'Healthcare', 'Financials', 'Cons. Disc.', 'Industrials', 'Comm. Svc.', 'Energy', 'Cons. Staples', 'Utilities', 'Real Estate', 'Materials'];

  // data: [monthIndex, sectorIndex, value]
  // Synthetic but realistic monthly returns
  var rawData = [
    // Sep 2025
    [0, 0, -1.8], [0, 1, 0.4], [0, 2, -0.6], [0, 3, -2.1], [0, 4, -1.2],
    [0, 5, -0.9], [0, 6, -3.1], [0, 7, 0.8], [0, 8, 2.1], [0, 9, 1.5], [0, 10, -1.4],
    // Oct 2025
    [1, 0, 2.4], [1, 1, 1.1], [1, 2, 3.2], [1, 3, 1.8], [1, 4, 2.1],
    [1, 5, 1.5], [1, 6, -0.8], [1, 7, 0.3], [1, 8, -0.5], [1, 9, -1.2], [1, 10, 0.6],
    // Nov 2025
    [2, 0, 5.1], [2, 1, -0.3], [2, 2, 4.8], [2, 3, 3.9], [2, 4, 2.8],
    [2, 5, 3.2], [2, 6, 1.2], [2, 7, 1.4], [2, 8, -1.1], [2, 9, 0.8], [2, 10, 1.9],
    // Dec 2025
    [3, 0, -2.5], [3, 1, 1.8], [3, 2, -0.4], [3, 3, -3.2], [3, 4, -1.5],
    [3, 5, -1.8], [3, 6, 0.6], [3, 7, 0.2], [3, 8, 1.3], [3, 9, 0.5], [3, 10, -0.9],
    // Jan 2026
    [4, 0, 3.1], [4, 1, 4.2], [4, 2, 2.8], [4, 3, 0.8], [4, 4, 1.9],
    [4, 5, 1.6], [4, 6, -2.1], [4, 7, 1.3], [4, 8, 3.8], [4, 9, 1.0], [4, 10, 0.4],
    // Feb 2026 (partial)
    [5, 0, 1.1], [5, 1, 2.3], [5, 2, 2.0], [5, 3, -2.0], [5, 4, 1.2],
    [5, 5, 1.2], [5, 6, -1.3], [5, 7, 0.8], [5, 8, 1.5], [5, 9, 0.2], [5, 10, -1.2]
  ];

  // Find min/max for visual mapping
  var allValues = rawData.map(function (d) { return d[2]; });
  var minVal = Math.min.apply(null, allValues);
  var maxVal = Math.max.apply(null, allValues);
  var absMax = Math.max(Math.abs(minVal), Math.abs(maxVal));

  chart.setOption({
    ...ANIM,
    tooltip: {
      ...tooltipBase(),
      trigger: 'item',
      formatter: function (p) {
        var month = months[p.value[0]];
        var sector = sectors[p.value[1]];
        var val = p.value[2];
        var sign = val >= 0 ? '+' : '';
        var clr = val >= 0 ? COLORS.green : COLORS.red;
        return '<span style="color:' + COLORS.titleColor + ';font-weight:600;">' + sector + '</span><br/>' +
               month + ': <span style="color:' + clr + ';font-weight:600;">' + sign + val.toFixed(1) + '%</span>';
      }
    },
    grid: {
      left: 100, right: 30, top: 30, bottom: 50, containLabel: false
    },
    xAxis: {
      type: 'category',
      data: months,
      position: 'top',
      axisLine: { show: false },
      axisTick: { show: false },
      axisLabel: { color: COLORS.labelColor, fontSize: 11 },
      splitLine: { show: false },
      splitArea: { show: false }
    },
    yAxis: {
      type: 'category',
      data: sectors,
      inverse: true,
      axisLine: { show: false },
      axisTick: { show: false },
      axisLabel: { color: COLORS.labelColor, fontSize: 11 },
      splitLine: { show: false },
      splitArea: { show: false }
    },
    visualMap: {
      min: -absMax,
      max: absMax,
      calculable: false,
      orient: 'horizontal',
      left: 'center',
      bottom: 4,
      itemWidth: 14,
      itemHeight: 120,
      textStyle: { color: COLORS.labelColor, fontSize: 10 },
      inRange: {
        color: [
          '#ff453a',
          '#cc372e',
          '#7a2119',
          '#3a1510',
          'rgba(255,255,255,0.03)',
          '#0f2a14',
          '#1a5428',
          '#24993c',
          '#30d158'
        ]
      },
      formatter: function (val) {
        return (val >= 0 ? '+' : '') + val.toFixed(1) + '%';
      }
    },
    series: [{
      name: 'Sector Returns',
      type: 'heatmap',
      data: rawData,
      label: {
        show: true,
        color: COLORS.labelColor,
        fontSize: 11,
        fontWeight: 500,
        formatter: function (p) {
          var v = p.value[2];
          return (v >= 0 ? '+' : '') + v.toFixed(1);
        }
      },
      emphasis: {
        itemStyle: {
          shadowBlur: 10,
          shadowColor: 'rgba(0,0,0,0.5)',
          borderColor: 'rgba(255,255,255,0.3)',
          borderWidth: 2
        }
      },
      itemStyle: {
        borderColor: 'rgba(0,0,0,0.2)',
        borderWidth: 2,
        borderRadius: 3
      }
    }]
  });
}


// ============================================
// Initialize all charts
// ============================================
function initAllCharts() {
  // Original 13 charts
  renderSP500HistoricalChart();
  renderAnnualReturnsChart();
  renderValuationChart();
  renderSectorChart();
  renderMag7Chart();
  renderBuffettChart();
  renderSentimentRadar();
  renderEarningsChart();
  renderFedRateChart();
  renderScenarioChart();
  renderCapeReturnsChart();
  renderGeopoliticalChart();
  renderTailRiskChart();

  // 3 new charts
  renderRiskGaugeChart();
  renderMag7TreemapChart();
  renderSectorHeatmapChart();
}

// Run when DOM is ready
document.addEventListener('DOMContentLoaded', initAllCharts);
