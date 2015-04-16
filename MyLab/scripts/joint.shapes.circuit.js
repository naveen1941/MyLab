if (typeof exports === 'object') {

    var joint = {
        util: require('../src/core').util,
        shapes: {
            basic: require('./joint.shapes.basic')
        },
        dia: {
            Link: require('../src/joint.dia.link').Link
        }
    };
}

joint.shapes.circuit = {};

joint.shapes.circuit.BaseElement = joint.shapes.basic.Generic.extend({

    markup: '<g class="rotatable"><g class="scalable"><rect class="body"/></g><circle class="input"/><circle class="output"/></g>',

    defaults: joint.util.deepSupplement({

        type: 'circuit.BaseElement',
        size: { width: 60, height: 30 },
        attrs: {
            circle: { r: 7, stroke: 'black', fill: 'transparent', 'stroke-width': 2 },
            rect: { width: 50, height: 20 },
            '.body': {  width: 50, height: 20, fill: 'white', stroke: 'black', 'stroke-width': 2 },
            '.input': { r: 7, stroke: 'black', fill: 'transparent', 'stroke-width': 2 ,ref: '.body', 'ref-x': -2, 'ref-y': 0.5, magnet: 'passive', port: 'in' },
            '.output': { r: 7, stroke: 'black', fill: 'transparent', 'stroke-width': 2 , ref: '.body', 'ref-dx': 2, 'ref-y': 0.5, magnet: true, port: 'out' }
        }
    }, joint.shapes.basic.Generic.prototype.defaults)
});


if (typeof exports === 'object') {

    module.exports = joint.shapes.circuit;
}