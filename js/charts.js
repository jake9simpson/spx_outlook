/* ============================================
   Chart.js Configuration & Data Visualization
   S&P 500 Market Intelligence
   ============================================ */

// Global Chart.js defaults for dark theme
Chart.defaults.color = '#a1a1a6';
Chart.defaults.borderColor = 'rgba(255, 255, 255, 0.06)';
Chart.defaults.font.family = "-apple-system, BlinkMacSystemFont, 'SF Pro Text', 'Helvetica Neue', Arial, sans-serif";
Chart.defaults.font.size = 12;
Chart.defaults.plugins.legend.display = false;
Chart.defaults.animation.duration = 1200;
Chart.defaults.animation.easing = 'easeOutQuart';
Chart.defaults.responsive = true;
Chart.defaults.maintainAspectRatio = false;

// Color palette
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
  blueAlpha: 'rgba(41, 151, 255, 0.15)',
  greenAlpha: 'rgba(48, 209, 88, 0.15)',
  redAlpha: 'rgba(255, 69, 58, 0.15)',
};

// Gradient factory
function createGradient(ctx, colorStart, colorEnd) {
  const gradient = ctx.createLinearGradient(0, 0, 0, ctx.canvas.height);
  gradient.addColorStop(0, colorStart);
  gradient.addColorStop(1, colorEnd);
  return gradient;
}

// ============================================
// 1. S&P 500 Historical Performance (20 years)
// ============================================
function renderSP500HistoricalChart() {
  const ctx = document.getElementById('sp500HistoricalChart');
  if (!ctx) return;

  new Chart(ctx, {
    type: 'line',
    data: {
      labels: ['2006','2007','2008','2009','2010','2011','2012','2013','2014','2015','2016','2017','2018','2019','2020','2021','2022','2023','2024','2025','Feb 2026'],
      datasets: [{
        label: 'S&P 500',
        data: [1418, 1468, 903, 1115, 1258, 1258, 1426, 1848, 2059, 2044, 2239, 2674, 2507, 3231, 3756, 4766, 3840, 4770, 5881, 6845, 6836],
        borderColor: COLORS.blue,
        backgroundColor: function(context) {
          const chart = context.chart;
          const {ctx: c, chartArea} = chart;
          if (!chartArea) return COLORS.blueAlpha;
          return createGradient(c, 'rgba(41, 151, 255, 0.2)', 'rgba(41, 151, 255, 0.01)');
        },
        fill: true,
        tension: 0.3,
        pointRadius: 0,
        pointHoverRadius: 6,
        pointHoverBackgroundColor: COLORS.blue,
        borderWidth: 2.5,
      }]
    },
    options: {
      plugins: {
        tooltip: {
          backgroundColor: 'rgba(0,0,0,0.85)',
          titleColor: '#f5f5f7',
          bodyColor: '#a1a1a6',
          borderColor: 'rgba(255,255,255,0.1)',
          borderWidth: 1,
          cornerRadius: 12,
          padding: 12,
          displayColors: false,
          callbacks: {
            label: function(context) {
              return 'S&P 500: ' + context.parsed.y.toLocaleString();
            }
          }
        }
      },
      scales: {
        x: {
          grid: { display: false },
          ticks: { maxTicksLimit: 10 }
        },
        y: {
          grid: { color: 'rgba(255,255,255,0.04)' },
          ticks: {
            callback: function(value) { return value.toLocaleString(); }
          }
        }
      }
    }
  });
}

// ============================================
// 2. Annual Returns Bar Chart
// ============================================
function renderAnnualReturnsChart() {
  const ctx = document.getElementById('annualReturnsChart');
  if (!ctx) return;

  const years = ['2006','2007','2008','2009','2010','2011','2012','2013','2014','2015','2016','2017','2018','2019','2020','2021','2022','2023','2024','2025'];
  const returns = [15.8, 5.5, -37.0, 26.5, 15.1, 2.1, 16.0, 32.4, 13.7, 1.4, 12.0, 21.8, -4.4, 31.5, 18.4, 28.7, -18.1, 26.3, 25.0, 16.4];

  new Chart(ctx, {
    type: 'bar',
    data: {
      labels: years,
      datasets: [{
        label: 'Annual Return %',
        data: returns,
        backgroundColor: returns.map(r => r >= 0 ? COLORS.green : COLORS.red),
        borderRadius: 4,
        borderSkipped: false,
        barPercentage: 0.7,
      }]
    },
    options: {
      plugins: {
        tooltip: {
          backgroundColor: 'rgba(0,0,0,0.85)',
          cornerRadius: 12,
          padding: 12,
          callbacks: {
            label: function(context) {
              const v = context.parsed.y;
              return (v >= 0 ? '+' : '') + v.toFixed(1) + '%';
            }
          }
        }
      },
      scales: {
        x: {
          grid: { display: false }
        },
        y: {
          grid: { color: 'rgba(255,255,255,0.04)' },
          ticks: {
            callback: function(value) { return value + '%'; }
          }
        }
      }
    }
  });
}

// ============================================
// 3. Valuation Comparison (CAPE, P/E)
// ============================================
function renderValuationChart() {
  const ctx = document.getElementById('valuationChart');
  if (!ctx) return;

  new Chart(ctx, {
    type: 'bar',
    data: {
      labels: ['1929 Peak', '2000 Peak', '2007 Peak', '2021 Peak', 'Current (Feb 2026)'],
      datasets: [
        {
          label: 'Shiller CAPE Ratio',
          data: [33.1, 44.2, 27.5, 38.6, 39.7],
          backgroundColor: COLORS.blue,
          borderRadius: 6,
          barPercentage: 0.6,
        },
        {
          label: 'Forward P/E',
          data: [20.0, 27.2, 15.7, 22.4, 22.1],
          backgroundColor: COLORS.teal,
          borderRadius: 6,
          barPercentage: 0.6,
        }
      ]
    },
    options: {
      plugins: {
        legend: {
          display: true,
          position: 'top',
          labels: {
            usePointStyle: true,
            pointStyle: 'rectRounded',
            padding: 20,
          }
        },
        tooltip: {
          backgroundColor: 'rgba(0,0,0,0.85)',
          cornerRadius: 12,
          padding: 12,
        }
      },
      scales: {
        x: { grid: { display: false } },
        y: {
          grid: { color: 'rgba(255,255,255,0.04)' },
          beginAtZero: true,
          ticks: {
            callback: function(value) { return value + 'x'; }
          }
        }
      }
    }
  });
}

// ============================================
// 4. Sector Performance Heatmap-style Chart
// ============================================
function renderSectorChart() {
  const ctx = document.getElementById('sectorChart');
  if (!ctx) return;

  const sectors = ['Technology', 'Healthcare', 'Financials', 'Cons. Disc.', 'Industrials', 'Comm. Svc.', 'Energy', 'Cons. Staples', 'Utilities', 'Real Estate', 'Materials'];
  const ytd2026 = [-2.0, 8.0, 2.0, -3.0, 12.0, -3.0, 21.0, 15.0, 6.0, 4.0, 17.0];
  const full2025 = [33.7, 14.6, 15.0, 6.0, 19.4, 33.7, 8.3, 3.9, 16.0, 3.2, -10.5];

  new Chart(ctx, {
    type: 'bar',
    data: {
      labels: sectors,
      datasets: [
        {
          label: '2025 Full Year',
          data: full2025,
          backgroundColor: COLORS.blue,
          borderRadius: 4,
          barPercentage: 0.7,
          categoryPercentage: 0.8,
        },
        {
          label: '2026 YTD',
          data: ytd2026,
          backgroundColor: COLORS.teal,
          borderRadius: 4,
          barPercentage: 0.7,
          categoryPercentage: 0.8,
        }
      ]
    },
    options: {
      indexAxis: 'y',
      plugins: {
        legend: {
          display: true,
          position: 'top',
          labels: { usePointStyle: true, pointStyle: 'rectRounded', padding: 20 }
        },
        tooltip: {
          backgroundColor: 'rgba(0,0,0,0.85)',
          cornerRadius: 12,
          padding: 12,
          callbacks: {
            label: function(context) {
              const v = context.parsed.x;
              return context.dataset.label + ': ' + (v >= 0 ? '+' : '') + v.toFixed(1) + '%';
            }
          }
        }
      },
      scales: {
        x: {
          grid: { color: 'rgba(255,255,255,0.04)' },
          ticks: { callback: function(v) { return v + '%'; } }
        },
        y: { grid: { display: false } }
      }
    }
  });
}

// ============================================
// 5. Magnificent 7 Concentration Chart
// ============================================
function renderMag7Chart() {
  const ctx = document.getElementById('mag7Chart');
  if (!ctx) return;

  new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels: ['Apple', 'Microsoft', 'NVIDIA', 'Amazon', 'Alphabet', 'Meta', 'Tesla', 'Other 493 Stocks'],
      datasets: [{
        data: [7.1, 6.4, 6.2, 4.1, 3.8, 2.7, 2.0, 67.7],
        backgroundColor: [
          COLORS.blue, COLORS.green, COLORS.purple, COLORS.orange,
          COLORS.teal, COLORS.pink, COLORS.red, 'rgba(255,255,255,0.08)'
        ],
        borderWidth: 0,
        hoverOffset: 8,
      }]
    },
    options: {
      cutout: '65%',
      plugins: {
        legend: {
          display: true,
          position: 'right',
          labels: {
            usePointStyle: true,
            pointStyle: 'circle',
            padding: 12,
            font: { size: 12 }
          }
        },
        tooltip: {
          backgroundColor: 'rgba(0,0,0,0.85)',
          cornerRadius: 12,
          padding: 12,
          callbacks: {
            label: function(context) {
              return context.label + ': ' + context.parsed + '%';
            }
          }
        }
      }
    }
  });
}

// ============================================
// 6. Buffett Indicator Historical Chart
// ============================================
function renderBuffettChart() {
  const ctx = document.getElementById('buffettChart');
  if (!ctx) return;

  new Chart(ctx, {
    type: 'line',
    data: {
      labels: ['2000', '2003', '2005', '2007', '2009', '2011', '2013', '2015', '2017', '2019', '2021', '2023', '2025', 'Feb 2026'],
      datasets: [
        {
          label: 'Market Cap / GDP',
          data: [148, 72, 100, 110, 56, 79, 109, 117, 137, 153, 200, 171, 195, 230],
          borderColor: COLORS.blue,
          backgroundColor: 'rgba(41, 151, 255, 0.1)',
          fill: true,
          tension: 0.3,
          pointRadius: 3,
          borderWidth: 2.5,
        },
        {
          label: 'Historical Average (100%)',
          data: [100,100,100,100,100,100,100,100,100,100,100,100,100,100],
          borderColor: COLORS.orange,
          borderDash: [8, 4],
          borderWidth: 1.5,
          pointRadius: 0,
          fill: false,
        }
      ]
    },
    options: {
      plugins: {
        legend: {
          display: true,
          position: 'top',
          labels: { usePointStyle: true, pointStyle: 'line', padding: 20 }
        },
        tooltip: {
          backgroundColor: 'rgba(0,0,0,0.85)',
          cornerRadius: 12,
          padding: 12,
          callbacks: {
            label: function(context) {
              return context.dataset.label + ': ' + context.parsed.y + '%';
            }
          }
        }
      },
      scales: {
        x: { grid: { display: false } },
        y: {
          grid: { color: 'rgba(255,255,255,0.04)' },
          ticks: { callback: function(v) { return v + '%'; } }
        }
      }
    }
  });
}

// ============================================
// 7. Sentiment Indicators Radar Chart
// ============================================
function renderSentimentRadar() {
  const ctx = document.getElementById('sentimentRadar');
  if (!ctx) return;

  new Chart(ctx, {
    type: 'radar',
    data: {
      labels: ['AAII Bull %', 'Put/Call Ratio', 'VIX Level', 'CNN Fear/Greed', 'Fund Mgr Cash', 'Insider Buy/Sell'],
      datasets: [
        {
          label: 'Current Reading',
          data: [42, 35, 55, 36, 30, 28],
          borderColor: COLORS.blue,
          backgroundColor: 'rgba(41, 151, 255, 0.15)',
          borderWidth: 2,
          pointBackgroundColor: COLORS.blue,
          pointRadius: 4,
        },
        {
          label: 'Extreme Bullish (Danger)',
          data: [65, 20, 20, 90, 15, 15],
          borderColor: COLORS.red,
          backgroundColor: 'rgba(255, 69, 58, 0.08)',
          borderWidth: 1.5,
          borderDash: [5, 3],
          pointRadius: 0,
        }
      ]
    },
    options: {
      plugins: {
        legend: {
          display: true,
          position: 'top',
          labels: { usePointStyle: true, pointStyle: 'circle', padding: 20 }
        }
      },
      scales: {
        r: {
          beginAtZero: true,
          max: 100,
          grid: { color: 'rgba(255,255,255,0.06)' },
          angleLines: { color: 'rgba(255,255,255,0.06)' },
          pointLabels: { font: { size: 11 }, color: '#a1a1a6' },
          ticks: { display: false }
        }
      }
    }
  });
}

// ============================================
// 8. Earnings Growth Projection
// ============================================
function renderEarningsChart() {
  const ctx = document.getElementById('earningsChart');
  if (!ctx) return;

  new Chart(ctx, {
    type: 'bar',
    data: {
      labels: ['Q1 2025', 'Q2 2025', 'Q3 2025', 'Q4 2025', 'Q1 2026E', 'Q2 2026E', 'Q3 2026E', 'Q4 2026E'],
      datasets: [
        {
          label: 'EPS ($)',
          data: [57.2, 59.1, 60.8, 62.3, 63.5, 65.2, 66.8, 68.5],
          backgroundColor: function(context) {
            return context.dataIndex >= 4 ? 'rgba(41, 151, 255, 0.5)' : COLORS.blue;
          },
          borderRadius: 6,
          barPercentage: 0.6,
        },
        {
          label: 'YoY Growth %',
          type: 'line',
          data: [5.8, 10.2, 8.5, 9.1, 11.0, 10.3, 9.9, 9.9],
          borderColor: COLORS.green,
          borderWidth: 2,
          pointRadius: 4,
          pointBackgroundColor: COLORS.green,
          yAxisID: 'y1',
        }
      ]
    },
    options: {
      plugins: {
        legend: {
          display: true,
          position: 'top',
          labels: { usePointStyle: true, padding: 20 }
        },
        tooltip: { backgroundColor: 'rgba(0,0,0,0.85)', cornerRadius: 12, padding: 12 }
      },
      scales: {
        x: { grid: { display: false } },
        y: {
          position: 'left',
          grid: { color: 'rgba(255,255,255,0.04)' },
          ticks: { callback: function(v) { return '$' + v; } }
        },
        y1: {
          position: 'right',
          grid: { display: false },
          ticks: { callback: function(v) { return v + '%'; } }
        }
      }
    }
  });
}

// ============================================
// 9. Fed Funds Rate & Market
// ============================================
function renderFedRateChart() {
  const ctx = document.getElementById('fedRateChart');
  if (!ctx) return;

  new Chart(ctx, {
    type: 'line',
    data: {
      labels: ['Jan 2022','Jul 2022','Jan 2023','Jul 2023','Jan 2024','Jul 2024','Jan 2025','Jul 2025','Jan 2026'],
      datasets: [
        {
          label: 'Fed Funds Rate',
          data: [0.25, 2.5, 4.5, 5.25, 5.5, 5.5, 4.5, 4.25, 4.25],
          borderColor: COLORS.orange,
          borderWidth: 2.5,
          pointRadius: 3,
          tension: 0.1,
          yAxisID: 'y',
        },
        {
          label: 'S&P 500',
          data: [4516, 3785, 4077, 4589, 4770, 5522, 5881, 6200, 6836],
          borderColor: COLORS.blue,
          borderWidth: 2.5,
          pointRadius: 3,
          tension: 0.3,
          yAxisID: 'y1',
        }
      ]
    },
    options: {
      plugins: {
        legend: {
          display: true,
          position: 'top',
          labels: { usePointStyle: true, pointStyle: 'line', padding: 20 }
        },
        tooltip: { backgroundColor: 'rgba(0,0,0,0.85)', cornerRadius: 12, padding: 12 }
      },
      scales: {
        x: { grid: { display: false } },
        y: {
          position: 'left',
          grid: { color: 'rgba(255,255,255,0.04)' },
          ticks: { callback: function(v) { return v + '%'; } },
          title: { display: true, text: 'Fed Funds Rate', color: COLORS.orange }
        },
        y1: {
          position: 'right',
          grid: { display: false },
          ticks: { callback: function(v) { return v.toLocaleString(); } },
          title: { display: true, text: 'S&P 500', color: COLORS.blue }
        }
      }
    }
  });
}

// ============================================
// 10. Bull vs Bear Scenarios
// ============================================
function renderScenarioChart() {
  const ctx = document.getElementById('scenarioChart');
  if (!ctx) return;

  new Chart(ctx, {
    type: 'bar',
    data: {
      labels: ['Bear Case', 'Base Case', 'Bull Case'],
      datasets: [
        {
          label: 'S&P 500 Year-End Target',
          data: [4800, 6400, 7200],
          backgroundColor: [
            COLORS.red,
            COLORS.blue,
            COLORS.green,
          ],
          borderRadius: 8,
          barPercentage: 0.5,
        }
      ]
    },
    options: {
      plugins: {
        tooltip: {
          backgroundColor: 'rgba(0,0,0,0.85)',
          cornerRadius: 12,
          padding: 12,
          callbacks: {
            label: function(context) {
              return 'Target: ' + context.parsed.y.toLocaleString();
            }
          }
        }
      },
      scales: {
        x: { grid: { display: false } },
        y: {
          grid: { color: 'rgba(255,255,255,0.04)' },
          ticks: { callback: function(v) { return v.toLocaleString(); } },
          suggestedMin: 4000,
        }
      }
    }
  });
}

// ============================================
// 11. Historical CAPE vs Forward Returns
// ============================================
function renderCapeReturnsChart() {
  const ctx = document.getElementById('capeReturnsChart');
  if (!ctx) return;

  new Chart(ctx, {
    type: 'scatter',
    data: {
      datasets: [{
        label: 'CAPE vs 10yr Forward Return',
        data: [
          {x: 10, y: 14.2}, {x: 12, y: 12.8}, {x: 14, y: 11.1}, {x: 16, y: 9.8},
          {x: 18, y: 8.5}, {x: 20, y: 7.2}, {x: 22, y: 5.9}, {x: 24, y: 4.8},
          {x: 26, y: 3.7}, {x: 28, y: 2.8}, {x: 30, y: 2.1}, {x: 32, y: 1.4},
          {x: 34, y: 0.8}, {x: 36, y: 0.2}, {x: 38, y: -0.3},
          {x: 40, y: -0.8}, {x: 44, y: -1.5},
        ],
        backgroundColor: COLORS.blue,
        pointRadius: 6,
        pointHoverRadius: 8,
      },
      {
        label: 'Current Position',
        data: [{x: 39.7, y: null}],
        backgroundColor: COLORS.red,
        pointRadius: 10,
        pointStyle: 'star',
        pointHoverRadius: 14,
      }]
    },
    options: {
      plugins: {
        legend: {
          display: true,
          position: 'top',
          labels: { usePointStyle: true, padding: 20 }
        },
        tooltip: { backgroundColor: 'rgba(0,0,0,0.85)', cornerRadius: 12, padding: 12 },
        annotation: {
          annotations: {
            currentLine: {
              type: 'line',
              xMin: 39.7,
              xMax: 39.7,
              borderColor: COLORS.red,
              borderWidth: 2,
              borderDash: [6, 3],
              label: {
                display: true,
                content: 'Current CAPE: 39.7',
                position: 'start',
                backgroundColor: 'rgba(255,69,58,0.8)',
                color: '#fff',
                font: { size: 11 }
              }
            }
          }
        }
      },
      scales: {
        x: {
          title: { display: true, text: 'Shiller CAPE Ratio', color: '#a1a1a6' },
          grid: { color: 'rgba(255,255,255,0.04)' },
        },
        y: {
          title: { display: true, text: '10-Year Annualized Return', color: '#a1a1a6' },
          grid: { color: 'rgba(255,255,255,0.04)' },
          ticks: { callback: function(v) { return v + '%'; } }
        }
      }
    }
  });
}

// ============================================
// 12. Geopolitical Risk Timeline Chart
// ============================================
function renderGeopoliticalChart() {
  const ctx = document.getElementById('geopoliticalChart');
  if (!ctx) return;

  new Chart(ctx, {
    type: 'line',
    data: {
      labels: ['Jan 25','Feb 25','Mar 25','Apr 25','May 25','Jun 25','Jul 25','Aug 25','Sep 25','Oct 25','Nov 25','Dec 25','Jan 26','Feb 26'],
      datasets: [
        {
          label: 'Economic Policy Uncertainty Index',
          data: [280, 350, 320, 290, 260, 240, 250, 230, 245, 270, 310, 295, 340, 370],
          borderColor: COLORS.red,
          backgroundColor: 'rgba(255, 69, 58, 0.1)',
          fill: true,
          tension: 0.3,
          borderWidth: 2.5,
          pointRadius: 3,
        },
        {
          label: 'Geopolitical Risk Index',
          data: [160, 175, 165, 155, 150, 145, 140, 148, 155, 162, 170, 168, 180, 185],
          borderColor: COLORS.orange,
          borderWidth: 2,
          tension: 0.3,
          pointRadius: 3,
        }
      ]
    },
    options: {
      plugins: {
        legend: {
          display: true,
          position: 'top',
          labels: { usePointStyle: true, pointStyle: 'line', padding: 20 }
        },
        tooltip: { backgroundColor: 'rgba(0,0,0,0.85)', cornerRadius: 12, padding: 12 }
      },
      scales: {
        x: { grid: { display: false } },
        y: { grid: { color: 'rgba(255,255,255,0.04)' } }
      }
    }
  });
}

// ============================================
// Initialize all charts
// ============================================
function initAllCharts() {
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
}

// Run when DOM is ready
document.addEventListener('DOMContentLoaded', initAllCharts);
