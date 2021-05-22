import config from '/SERVER_CONFIG'

export function updatePositions(futuresPositions, currentBalance) {
    const container = document.getElementById('openPositions')
    document.getElementById('openPositionsCount').innerText = futuresPositions.length
  
    let html = `
      <div class="position-table-header position-entry">
        <span></span>
        <span>symbol</span>
        <span>lev</span>
        <span>size</span>
        <span>amount</span>
        <span>PnL (ROE %)</span>
        <span class="only-desktop">Outcome</span>
        <span class="only-desktop">Distance</span>
        <span class="only-desktop">Idle</span>
        <span class="only-desktop">Risk</span>
      </div>
    `
    for (const position of futuresPositions) {
      const margin = Number(position.markPrice) * Math.abs(Number(position.positionAmt)) / Number(position.leverage)
      const PnL = Number(position.unRealizedProfit)
      const ROE = (PnL * 100 * position.leverage) / (Math.abs(Number(position.positionAmt)) * Number(position.entryPrice))
      const updateTimeInMin = Math.ceil((Date.now() - new Date(position.updateTime).getTime()) / 1000 / 60)
      const balancePercent = margin * 100 / currentBalance
      const priceDistanceFromOpening = Math.abs(ROE / position.leverage)
      const priceDistanceFromLimitOrder = Math.abs(priceDistanceFromOpening) + config.takeProfit
      const profitExpectet = config.takeProfit * Math.abs(margin) / 100 * position.leverage
  
      // calculate risks
      const riskBalanceUsageFactor = 2
      const riskROEFactor = 10
      const riskDistanceFactor = 6
      const riskIdleFactor = 30
      const riskLeverageFactor = 5
  
      const riskBalanceUsage = Math.round((balancePercent / riskBalanceUsageFactor) * 10)
      const riskROE = Math.round(Math.abs(ROE / riskROEFactor) * 5)
      const riskDistance = Math.round(Math.abs(priceDistanceFromLimitOrder / riskDistanceFactor) * 6)
      const riskIdle = Math.round((updateTimeInMin / riskIdleFactor) * 5)
      const riskLeverage = Math.round((position.leverage / riskLeverageFactor) * 5)
  
      const risk = Math.round((riskBalanceUsage + riskROE + riskDistance + riskIdle + riskLeverage))
      const riskScaled = Math.round(risk / 2 / 10)
      let riskDotsCount = riskScaled
      if (riskScaled > 5) riskDotsCount = 5
      else if (riskScaled < 0) riskDotsCount = 0
      const riskDots = Array(riskDotsCount).fill('🔴').join('').padEnd(10, '⚪️')
  
      html += `
        <div class="position-entry">
          <span class="${position.positionAmt > 0 ? 'position-long' : 'position-short'}"></span>
          <span>${position.symbol.slice(0, -4)}</span>
          <span class="position-leverage">${position.leverage}x</span>
          <span>${Math.abs(Number(position.positionAmt))}</span>
          <span>${margin.toFixed(2)}$ <span class="position-margin-percent">(${balancePercent.toFixed(2)}%) </span></span>
          <span class="${PnL < 0 ? 'position-pnl-negative' : 'position-pnl-positive'}">${PnL.toFixed(2)}$ (${ROE.toFixed(2)}%)</span>
          <span class="only-desktop">${profitExpectet.toFixed(2)}$</span>
          <span class="only-desktop">${priceDistanceFromLimitOrder.toFixed(2)}%</span>
          <span class="only-desktop">${updateTimeInMin} min</span>
          <span class="only-desktop position-risk">
            ${riskDots}
            <div class="position-risk-details">
              <div class="position-risk-details-title">Risk Scores</div>
              <div class="position-risk-details-row">
                <span>Amount risk</span>
                <span>${riskBalanceUsage}</span>
              </div>
              <div class="position-risk-details-row">
                <span>ROE risk</span>
                <span>${riskROE}</span>
              </div>
              <div class="position-risk-details-row">
                <span>Distance risk</span>
                <span>${riskDistance}</span>
              </div>
              <div class="position-risk-details-row">
                <span>Idle risk</span>
                <span>${riskIdle}</span>
              </div>
              <div class="position-risk-details-row">
                <span>Leverage risk</span>
                <span>${riskLeverage}</span>
              </div>
              <div class="position-risk-details-row position-risk-details-total">
                <span>Total risk score</span>
                <span>${risk}</span>
              </div>
            </div>
            </span>
        </div>
      `
    }
    container.innerHTML = html
  }