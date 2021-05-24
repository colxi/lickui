//PLUGIN : Render columns with value=0 in graph charts
export const renderColumnPlugin = {
  beforeRender: function(chartInstance) {
    var datasets = chartInstance.config.data.datasets;
    for (var i = 0; i < datasets.length; i++) {
      var meta = datasets[i]._meta;
      // It counts up every time you change something on the chart so
      // this is a way to get the info on whichever index it's at
      var metaData = meta[Object.keys(meta)[0]];
      var bars = metaData.data;
      for (var j = 0; j < bars.length; j++) {
        var model = bars[j]._model;
        if (metaData.type === "horizontalBar" && model.base === model.x) {
          model.x = model.base + 2;
        } else if (model.base === model.y) {
          model.y = model.base - 2;
        }
      }
    }
  }
}

// PLUGIN : render horizontal line  (supports text)
export const renderHorizontalLinePlugin = {
  afterDraw: function(chartInstance, easing) {
    var lineOpts = chartInstance.options.drawHorizontalLine;
    if (lineOpts) {
      var yAxis = chartInstance.scales["y-axis-0"];
      var yValueStart = yAxis.getPixelForValue(lineOpts.lineY[0], 0, 0, true);
      var yValueEnd = yAxis.getPixelForValue(lineOpts.lineY[1], 0, 0, true);
      var xAxis = chartInstance.scales["x-axis-0"];
      var xValueStart = xAxis.getPixelForTick(0) - 5;
      var xValueEnd = xAxis.right;
      var ctx = chartInstance.chart.ctx;
      ctx.save();

      // render text
      ctx.font = lineOpts.textFont;
      ctx.fillStyle = lineOpts.textColor;
      // hardcode position to the right
      ctx.fillText(lineOpts.text, xAxis.right - lineOpts.text.length * 7, yValueStart - 8);
      // ...uncomment next line to use users provided position
      // ctx.fillText(lineOpts.text, lineOpts.textPosition, yValueStart - 8);

      // dotted line
      ctx.setLineDash([2, 2]);
      ctx.strokeStyle = lineOpts.lineColor;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(xValueStart, yValueStart);
      ctx.lineTo(xValueEnd, yValueEnd);
      ctx.stroke();
      ctx.restore();
    }
  }
}