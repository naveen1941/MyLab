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

    markup: '<g class="rotatable element"><g class="scalable"><rect class="body"/><image/></g><circle class="input"/><circle class="output"/><text class="text"/></g>',
    defaults: joint.util.deepSupplement({
        type: 'circuit.BaseElement',
        size: { width: 120, height: 70 },
        attrs: {
            circle: { r: 7, stroke: 'black', fill: 'transparent', 'stroke-width': 2 },
            rect: { width: 80, height: 50 },
            text: {
                fill: 'black',
                ref: '.body', 'ref-x': .5, 'ref-y': .5, 'y-alignment': 'middle',
                'text-anchor': 'middle',
                'font-weight': 'bold',
                'font-size': '14px'
            },
            image: {
                width: 48, height: 48,
                ref: '.body', 'y-alignment': 'middle', 'ref-y': 15
            },
            '.element': { stroke: 'black', fill: 'transparent', 'stroke-width': 2 },
            //'.body': { width: 50, height: 20, fill: 'transparent' },
            '.input': { r: 7, stroke: 'black', fill: 'transparent', 'stroke-width': 2 ,ref: '.body', 'ref-x': -2, 'ref-y': 0.5, magnet: true, port: 'in' },
            '.output': { r: 7, stroke: 'black', fill: 'transparent', 'stroke-width': 2 , ref: '.body', 'ref-dx': 2, 'ref-y': 0.5, magnet: true, port: 'out' }
        }
    }, joint.shapes.basic.Generic.prototype.defaults)
});

joint.shapes.circuit.BreadBoardPort = joint.shapes.basic.Generic.extend({

    markup: '<g class="scalable"><circle class="port"/></g>',
    defaults: joint.util.deepSupplement({
        type: 'circuit.BreadBoardPort',
        size: { width: 7, height: 7 },
        attrs: {
        circle: { r: 3, stroke: 'black', fill: 'transparent', magnet: true,'stroke-width': 2 },
        }
    }, joint.shapes.basic.Generic.prototype.defaults),

    logicalPosition: {'posX':-1,'posY':-1}
});



if (typeof exports === 'object') {

    module.exports = joint.shapes.circuit;
}