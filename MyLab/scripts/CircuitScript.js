


$(document).ready(function () {
    
    var droppable;
    
    var dragBoundary = {};
    dragBoundary.height = 100;

    var graphDrawing = new joint.dia.Graph;

    var canvasWidth=1000;
    var canvasHeight=600;

    var unit=30;

    var paperDrawing = new joint.dia.Paper({
        el: $('#drawingPanel'),
        width: canvasWidth,
        height: canvasHeight,
        model: graphDrawing,
        gridSize: 1,
        async: true 
    });



    var addElementMIcon = function (x,y,imagepah,type) {
        var element = new joint.shapes.circuit.BaseElement({
            position: { x: x, y: y },
            attrs: {
                image: { 'xlink:href': '../images/'+imagepah }
            }

        });
        element.type = type;
        graphDrawing.addCell(element);
    }

    var addPort = function (x,y) {
        var element = new joint.shapes.circuit.BreadBoardPort({
            position: { x: x, y: y },
        });
        graphDrawing.addCell(element);
    }

    var makeBreadBoard = function () {
        for(var i=1;i<7;i++){
            for (var j = 4 ; j <9; j++) {
                addPort(i*unit,j*unit);
            }
        }
    }

    makeBreadBoard();

    var addElementTIcon = function (x, y, imagepah, type) {
        var element = new joint.shapes.circuit.BaseElement({
            position: { x: x, y: y },
            attrs: {
                image: { 'xlink:href': '../images/' + imagepah, 'ref-x': -10, 'ref-y': -10, width: 60 }
            }
        });
        element.type = type;
        graphDrawing.addCell(element);
    }

    addElementMIcon(100, 30, 'image1.png', 'resistor');
    addElementMIcon(250, 30, 'battery.png', 'battery');
    addElementTIcon(400, 50, 'bulbon.png', 'resistor');
  

    paperDrawing.on('cell:pointerup', function (cellView, evt, x, y) {

        if (cellView.model instanceof joint.shapes.circuit.BaseElement) {


            var ports = graphDrawing.get('cells').find(function (cell) {
                if (cell instanceof joint.shapes.circuit.BreadBoardPort) {
                   
                    if (cell.getBBox().containsPoint(g.point(x, y))) {
                        console.log(cell);
                    }
                }
            });

        }
        

    });

    paperDrawing.on('cell:pointerdown', function (cellView, evt, x, y) {

        //console.log(cellView.model.getBBox());

        
            //console.log(cellView.model.get('position'));
        //}

        

    });


});
    































function Circuit() {
    this.mapping = [];
    this.isClosed=false;
    this.isEmpty = true;
    this.elements = [];

    this.addElement= function(element){
        elements.addElement(element);
        this.isEmpty = false;
    }

    this.removeElement = function (element) {
        elements.removeElement(element);
        if (elements.length == 0) {
            this.isEmpty = true;
        }
    }

    this.checkCircuit = function () {
        if (true) {
            this.isClosed = true;
        }
    }

    this.startFlow = function () {

    }

    this.stopFlow = function () {

    }

    this.drawCircuit=function(){

    }
}

function Node() {
    this.input = null;
    this.output = null;
}

function Junction() {

}

Wire.prototype = new Node();

function Wire() {
    this.resistance = 0;
    this.current = NaN;
}

Switch.prototype = new Node();
function Switch() {
    this.isClosed = false;
    this.resistance = NaN;
}


Battery.prototype = new Node();
function Battery(voltage) {
    this.voltage = voltage;
    this.impedance = NaN;
}


Resistor.prototype = new Node();
function Resistor(resistance) {
    this.resistance = resistance;
    this.current = NaN;
    this.voltage = NaN;;
}

VoltMeter.prototype = new Node();
function VoltMeter() {
    this.current = NaN;
    this.voltage = NaN;
    this.impedance = Nan;
}

Ammeter.prototype = new Node();
function Ammeter() {
    this.current = NaN;
    this.voltage = NaN;
    this.impedance = Nan;
}
