
$(document).ready(function () {

    var droppable;

    var dragBoundary = {};
    dragBoundary.height = 100;

    var elements = [];

    var graphDrawing = new joint.dia.Graph;

    var canvasWidth = 1000;
    var canvasHeight = 600;

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
        snapLinks :true,
        animation: true,
        validateConnection: function (vs, ms, vt, mt, e, vl) {

            if (e === 'target') {
                // target requires an input port to connect
                if (!mt || !mt.getAttribute('class') || mt.getAttribute('class').indexOf('input') < 0) return false;

                // check whether the port is being already used
                var portUsed = _.find(this.model.getLinks(), function (link) {

                    return (link.id !== vl.model.id &&
                            link.get('target').id === vt.model.id &&
                            link.get('target').port === mt.getAttribute('port'));
                });

                return !portUsed;

            } else { // e === 'source'

                // source requires an output port to connect
                return ms && ms.getAttribute('class') && ms.getAttribute('class').indexOf('output') >= 0;
            }
        }
    });



    var addElementMIcon = function (x, y, imagepah, type) {
        var element = new joint.shapes.circuit.BaseElement({
            position: { x: x, y: y },
            initPosition: { x: x, y: y },
            port: { 'port': undefined },
            numerical:{'current':undefined, 'voltage':undefined, 'impedance':undefined},
            attrs: {
                image: { 'xlink:href': '../images/'+imagepah }
            }

        });
        element.initComponent = function (current,voltage, impedance) {
            this.current = current;
            this.voltage = voltage;
            this.impedance=impedance;
        }
        element.setCurrent=function (current){
            this.current=current;
        }
        element.setVoltage= function (voltage){
            this.voltage=voltage;
        }
        element.setImpedance = function (impedance) {
            this.impedance=impedance;
        }

        element.type = type;
        elements.push(element);
        graphDrawing.addCell(element);
    }

    var addPort = function (x, y, x_log, y_log) {
        var element = new joint.shapes.circuit.BreadBoardPort({
            position: { x: x, y: y },
            logicalPosition: { x: x_log, y: y_log },
            isOccupied: { 'isOccupied': false },
            isSecondaryOccupied: { 'isSecondaryOccupied': false },
        });
        graphDrawing.addCell(element);
    }

    var makeBreadBoard = function () {
         //for(var i=1,k=0;i<canvasWidth/unit;i++,k++){
         //    for (var j = 4,l=0 ; j <canvasWidth/unit; j++,l++) {
         //        addPort(i*unit,j*unit, k,l);
         //    }
         //}
        for (var i = 1, k = 0; i < 15; i++, k++) {
            for (var j = 4, l = 0 ; j < 15; j++, l++) {
                addPort(i * unit, j * unit, k, l);
            }
        }



        logical_rows = k - 1;
        logical_columns = l - 1;
        console.log(logical_rows + ':' + logical_columns);
    }

    makeBreadBoard();

    var addElementTIcon = function (x, y, imagepah, type) {
        var element = new joint.shapes.circuit.BaseElement({
            position: { x: x, y: y },
            initPosition: { x: x, y: y },
            port: { 'port': undefined }
            //attrs: {
            //    image: { 'xlink:href': '../images/' + imagepah, 'ref-x': -10, 'ref-y': -10, width: 60 }
            //}
        });
        element.type = type;
        graphDrawing.addCell(element);
    }

    addElementMIcon(100, 20, 'image1.png', 'resistor');
    addElementMIcon(350, 20, 'battery.png', 'battery');
    addElementMIcon(600, 20, 'bulbon.png', 'bulb');

    var button = new joint.shapes.basic.Rect({
        position: { x: 100, y: 450 },
        size: { width: 100, height: 30 },
        attrs: { rect: { fill: 'blue' }, text: { text: 'Go', fill: 'white' },magnet:false}
    });

    graphDrawing.addCell(button);





    _.each(elements, function (element) {
        
        switch(element.type){
            case "resistor":
                element.initComponent(undefined,undefined,100);
                break;
            case "battery":
                element.initComponent(undefined,10,1);
                break;
            case "bulb":
                element.initComponent(undefined,undefined,10);
                break;
        }
    });


    //gets called on change of every link source and target..
    graphDrawing.on('change:source change:target', function (model, end) {
        var e = 'target' in model.changed ? 'target' : 'source';

        if ((model.previous(e).id && !model.get(e).id) || (!model.previous(e).id && model.get(e).id)) {
           // validateCircuit();
        }
    });

    var validateCircuit = function () {
        var isConnected = false;

        var startElement = elements[0];
        var progressElement = startElement;
        var firstTime = true;
        var i = 0;
        while (true) {
            var outLinks = graphDrawing.getConnectedLinks(progressElement, { outbound: true });

            if (outLinks.length==0) {
                break;
            }
            else {
                progressElement = graphDrawing.getCell(outLinks[0].get('target').id);
            }
            if (progressElement === startElement) {
                
                isConnected = true;

                break;
            }
        }


        if (isConnected)
        {
            var links = graphDrawing.getLinks();
            _.each(links, function (link) {
                paperDrawing.findViewByModel(link).sendToken(V('circle', { r: 7, fill: 'green' }).node)
            });
        }



    }


    paperDrawing.on('cell:pointerup', function (cellView, evt, x, y) {

        if (cellView.model instanceof joint.shapes.circuit.BaseElement) {


            var p0 = this._p0;
            var _pos_cellView = cellView.model.get('position');
            var _referencePortBoundary = g.rect(_pos_cellView.x, _pos_cellView.y, unit, unit);
            var ports = graphDrawing.get('cells').find(function (cell) {
                if (cell instanceof joint.shapes.circuit.BreadBoardPort) {
                    if (_referencePortBoundary.intersect(cell.getBBox())) {
                        elementDrop(cellView, cell, function () {
                            cellView.model.set('position', p0);
                        });
                        return {};
                    }
                }
            });
        }
        else if (cellView.model instanceof joint.shapes.basic.Rect) {

            validateCircuit();

        }
    });

    paperDrawing.on('cell:pointermove', function (cellView, evt, x, y) {


    });

    //whether a drop is valid or not
    var isValidDrop = function (cellView, port) {

        var dropPosition = port.get('position');
        var dropBoundary = g.rect(dropPosition.x, dropPosition.y, (5 * unit), (3 * unit));
        var isValid;

        var elements = graphDrawing.findModelsInArea(dropBoundary);
        _.each(elements, function (element) {
            if (element instanceof joint.shapes.circuit.BaseElement && dropBoundary.intersect(element.getBBox()) && (cellView.model != element)) {
                isValid = true;
                return {};
            }
        });
        if (isValid) {
            return { 'isValid': false };
        }
        else return {'isValid':true};
    }


    var elementDrop = function (cellView, port, moveToInitial) {

        var logicalPos = port.get('logicalPosition');
        var isOccupied = port.get('isOccupied');
        if (logicalPos.x + 4 > logical_rows || logicalPos.y + 3 > logical_columns || isOccupied.isOccupied) {
            moveToInitial();
        }
        else {

            //checks whether any element is present below it already
            var responce = isValidDrop(cellView, port);
            if (responce.isValid) {

                //detaching old ports
                 var oldAttachedPort=cellView.model.get('port');
                 if(oldAttachedPort.port){
                     oldAttachedPort.port.set('isOccupied',{'isOccupied':false});

                     var oldPortPosition = oldAttachedPort.port.get('position');
                     var oldBoundary = g.rect(oldPortPosition.x, oldPortPosition.y, (5 * unit), (3 * unit));
                     var oldPorts = graphDrawing.findModelsInArea(oldBoundary);
                     _.each(oldPorts, function (old_each_port) {
                         if (old_each_port instanceof joint.shapes.circuit.BreadBoardPort) {
                             old_each_port.attr({
                                 '.port': { fill: 'white' }
                             });
                         }
                     });
                 }


                //attaching new ports
                 var portPosition = port.get('position');
                 var boundary = g.rect(portPosition.x, portPosition.y, 5 * unit, 3 * unit);
                 port.set('isOccupied', { 'isOccupied': true });
                 cellView.model.set('port', { 'port': port });
                 var ports = graphDrawing.findModelsInArea(boundary);
                 _.each(ports, function (each_port) {
                     if (each_port instanceof joint.shapes.circuit.BreadBoardPort) {
                         each_port.attr({
                             '.port': { fill: 'black' }
                         });
                     }
                 });

                 cellView.model.set('position', portPosition);
            }
            else {
                moveToInitial();
            }

        }
    }

    paperDrawing.on('cell:pointerdown', function (cellView, evt, x, y) {
        if (cellView.model instanceof joint.shapes.circuit.BaseElement) {
            cellView.model.toFront();
            this._p0 = cellView.model.get('position');
        }

    });

    graphDrawing.on('remove', function (cell) {

        //+++ ADD check whether removes element is linkview or not

        //validateCircuit();
    })

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
