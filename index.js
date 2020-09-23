var echarts = require("echarts");
var fs = require('fs');
var path = require('path');
var { JSDOM } = require('jsdom');


/**
 * @param config = {
        width: 500 // Image width, type is number.
        height: 500 // Image height, type is number.
        option: {}, // Echarts configuration, type is Object.
        //If the path  is not set, return the Buffer of image.
        path:  '', // Path is filepath of the image which will be created.
    }

 *
 */
module.exports = function (config) {
    var chart, option = {
        title: {
            text: 'test'
        },
        tooltip: {},
        legend: {
            data: ['test']
        },
        xAxis: {
            data: ["a", "b", "c", "d", "f", "g"]
        },
        yAxis: {},
        series: [{
            name: 'test',
            type: 'bar',
            data: [5, 20, 36, 10, 10, 20]
        }]
    };

    let defaultConfig = {
      width: 500,
      height: 500,
      option,
      enableAutoDispose: true
    }

    config = Object.assign({}, defaultConfig, config)

    config.option.animation = false;
    const { window } = new JSDOM();
    global.window = window;
    global.navigator = window.navigator;
    global.document = window.document;
    const div = window.document.createElement('div');
    chart = echarts.init(div, null, {renderer: 'svg'});
    chart.setOption(config.option);
    if (config.path) {
        try {
            fs.writeFileSync(config.path, chart.getDom().toBuffer());
            if(config.enableAutoDispose){
              chart.dispose();
            }
            console.log("Create Img:" + config.path)
        } catch (err) {
            console.error("Error: Write File failed" + err.message)
        }
        
    } else {
        var buffer = chart.getDom().toBuffer();
        try{
          if(config.enableAutoDispose){
            chart.dispose();
          }
        }catch(e){}
        return buffer;
    }
}