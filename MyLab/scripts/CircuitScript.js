


$(document).ready(function () {
    
    var droppable;
    
    var dragBoundary = {};
    dragBoundary.height = 100;

    var graphDrawing = new joint.dia.Graph;

    var canvasWidth=1000;
    var canvasHeight=600;

    var unit = 30;
    var logical_rows = -1;
    var logical_columns = -1;

    var paperDrawing = new joint.dia.Paper({
        el: $('#drawingPanel'),
        width: canvasWidth,
        height: canvasHeight,
        model: graphDrawing,
        gridSize: 1,
        async: true,
        animation: true
    });



    var addElementMIcon = function (x,y,imagepah,type) {
        var element = new joint.shapes.circuit.BaseElement({
            position: { x: x, y: y },
            //attrs: {
            //    image: { 'xlink:href': '../images/'+imagepah }
            //}

        });
        element.type = type;
        graphDrawing.addCell(element);
    }

    var addPort = function (x,y,x_log, y_log) {
        var element = new joint.shapes.circuit.BreadBoardPort({
            position: { x: x, y: y },
            logicalPosition: { x: x_log, y: y_log },
            isOccupied:false
        });
        graphDrawing.addCell(element);
    }

    var makeBreadBoard = function () {
        for(var i=1,k=0;i<10;i++,k++){
            for (var j = 4,l=0 ; j <15; j++,l++) {
                addPort(i*unit,j*unit, k,l);
            }
        }
        logical_rows = k - 1;
        logical_columns = l - 1;
        console.log(logical_rows+':'+logical_columns);
    }

    makeBreadBoard();

    var addElementTIcon = function (x, y, imagepah, type) {
        var element = new joint.shapes.circuit.BaseElement({
            position: { x: x, y: y },
            //attrs: {
            //    image: { 'xlink:href': '../images/' + imagepah, 'ref-x': -10, 'ref-y': -10, width: 60 }
            //}
        });
        element.type = type;
        graphDrawing.addCell(element);
    }

    addElementMIcon(10, 10, 'image1.png', 'resistor');
    addElementMIcon(250, 30, 'battery.png', 'battery');
    addElementTIcon(400, 50, 'bulbon.png', 'resistor');
  

    paperDrawing.on('cell:pointerup', function (cellView, evt, x, y) {

        if (cellView.model instanceof joint.shapes.circuit.BaseElement) {

            var _pos_cellView = cellView.model.get('position');
            var _referencePortBoundary = g.rect(_pos_cellView.x, _pos_cellView.y, unit, unit);
            var ports = graphDrawing.get('cells').find(function (cell) {
                if (cell instanceof joint.shapes.circuit.BreadBoardPort) {
                    cell.attr({
                        '.port': { fill: 'white' }
                    });
                    if (_referencePortBoundary.intersect(cell.getBBox())) {
                        var log_pos=cell.get('logicalPosition');
                        
                        elementDrop(cellView, cell, function () {
                            cellView.model.set('position', this._p0);
                        });

                    }
                }
            });


        }
        cellView.model.set('position', this._p0);
    });

    paperDrawing.on('cell:pointermove', function (cellView, evt, x, y) {


    });



    var elementDrop = function (cellView,port,moveToInitial) {

        var logicalPos = port.get('logicalPosition');

        if(logicalPos.x+4>logical_rows || logicalPos.y+3>logical_columns || port.isOccupied){
            moveToInitial();
        }
        else {
            var portPosition = port.get('position');
            var boundary = g.rect(portPosition.x, portPosition.y, 4 * unit, 3 * unit);

            var ports = graphDrawing.findModelsInArea(boundary);
            _.each(ports, function (each_port) {
                each_port.isOccupied = true;
                each_port.attr({
                    '.port': { fill: 'black' }
                });
            });


        }

    }


    

    paperDrawing.on('cell:pointerdown', function (cellView, evt, x, y) {
            
        this._p0 = cellView.model.get('position');

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
