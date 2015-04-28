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

    markup: '<g class="rotatable element"><g class="scalable"><rect class="body"/><image/></g><circle class="cancelIcon"></circle><circle class="input"/><circle class="output"/><text class="text"/><text event="cancel:click" class="cancelIconText"/></g>',
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
                width: 80, height: 50,
                ref: '.body',  'ref-y': 0
            },
            '.cancelIcon': { ref: '.body', 'ref-dx': 15, 'ref-y': -15, fill: 'red', 'stroke-width': 0, r: 0, 'color': 'white' },
            //'.cancelIconText': { ref: '.body', 'ref-dx': 15, 'ref-y': -22, text: 'X', fill: 'white', foreground: 'white', 'font-size': 20, 'stroke-width': 0 },
            '.element': { stroke: 'black', fill: 'transparent', 'stroke-width': 2 },
            //'.body': { width: 50, height: 20, fill: 'transparent' },
            '.input': { r: 7, stroke: 'black', fill: 'transparent', 'stroke-width': 2 ,ref: '.body', 'ref-x': 0, 'ref-y': 0.5, magnet: true, port: 'in' },
            '.output': { r: 7, stroke: 'black', fill: 'transparent', 'stroke-width': 2 , ref: '.body', 'ref-dx': 0, 'ref-y': 0.5, magnet: true, port: 'out' }
        }
    }, joint.shapes.basic.Generic.prototype.defaults)
});

joint.shapes.circuit.ImageBackground = joint.shapes.basic.Generic.extend({

    markup: '<g class="rotatable element"><g class="scalable"><rect class="body"/><image/></g></g>',
    defaults: joint.util.deepSupplement({
        type: 'circuit.ImageBackground',
        size: { width: 120, height: 70 },
        attrs: {
            image: {
                width: 48, height: 48,
                ref: '.body', 'y-alignment': 'middle', 'ref-y': 15
            }
        }
    }, joint.shapes.basic.Generic.prototype.defaults)
});





joint.shapes.circuit.Wire = joint.dia.Link.extend({

    arrowheadMarkup: [
        '<g class="marker-arrowhead-group marker-arrowhead-group-<%= end %>">',
        '<circle class="marker-arrowhead" end="<%= end %>" r="7"/>',
        '</g>'
    ].join(''),

    vertexMarkup: [
        '<g class="marker-vertex-group" transform="translate(<%= x %>, <%= y %>)">',
        '<circle class="marker-vertex" idx="<%= idx %>" r="10" />',
        '<g class="marker-vertex-remove-group">',
        '<path class="marker-vertex-remove-area" idx="<%= idx %>" d="M16,5.333c-7.732,0-14,4.701-14,10.5c0,1.982,0.741,3.833,2.016,5.414L2,25.667l5.613-1.441c2.339,1.317,5.237,2.107,8.387,2.107c7.732,0,14-4.701,14-10.5C30,10.034,23.732,5.333,16,5.333z" transform="translate(5, -33)"/>',
        '<path class="marker-vertex-remove" idx="<%= idx %>" transform="scale(.8) translate(9.5, -37)" d="M24.778,21.419 19.276,15.917 24.777,10.415 21.949,7.585 16.447,13.087 10.945,7.585 8.117,10.415 13.618,15.917 8.116,21.419 10.946,24.248 16.447,18.746 21.948,24.248z">',
        '<title>Remove vertex.</title>',
        '</path>',
        '</g>',
        '</g>'
    ].join(''),

    defaults: joint.util.deepSupplement({

        type: 'circuit.Wire',

        attrs: {
            '.connection': { 'stroke-width': 2 },
            '.marker-vertex': { r: 7 }
        },

        router: { name: 'manhattan' },
        connector: { name: 'rounded', args: { radius: 10 } },

    }, joint.dia.Link.prototype.defaults)

});

//joint.shapes.ciruit.Button = joint.shapes.basic.Generic.extend({

//    markup: '<g class="scalable"><rect class="button"/><text class="title"/></g>',
//    defaults: joint.util.deepSupplement({
//        type: 'circuit.Button',
//        size: { width: 50, height: 30 },
//        attrs: {
//            rect:{},
//            text:{}
//        }
//    }, joint.shapes.basic.Generic.prototype.defaults),

//    logicalPosition: { 'posX': -1, 'posY': -1 }
//});

//joint.shapes.ciruit.Button = joint.shapes.basic.Generic.extend({

//    markup: '<g class="scalable"><rect class="button"/><text class="title"/></g>',
//    defaults: joint.util.deepSupplement({
//        type: 'circuit.Button',
//        size: { width: 50, height: 30 },
//        attrs: {
//            rect:{},
//            text:{}
//        }
//    }, joint.shapes.basic.Generic.prototype.defaults),

//    logicalPosition: { 'posX': -1, 'posY': -1 }
//});



joint.shapes.circuit.BreadBoardPort = joint.shapes.basic.Generic.extend({

    markup: '<g class="scalable"><circle class="port"/></g>',
    defaults: joint.util.deepSupplement({
        type: 'circuit.BreadBoardPort',
        size: { width: 7, height: 7 },
        attrs: {
        circle: { r: 3, stroke: 'black', fill: 'transparent', magnet:'none','stroke-width': 2 },
        }
    }, joint.shapes.basic.Generic.prototype.defaults),

    logicalPosition: {'posX':-1,'posY':-1}
});



if (typeof exports === 'object') {

    module.exports = joint.shapes.circuit;
}