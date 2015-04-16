


$(document).ready(function () {
    
    var droppable;
    
    var dragBoundary = {};
    dragBoundary.height = 100;

    var graphDrawing = new joint.dia.Graph;

    var paperDrawing = new joint.dia.Paper({
        el: $('#drawingPanel'),
        width: 1000,
        height: 500,
        model: graphDrawing,
        gridSize: 1
    });



    var resistor = new joint.shapes.circuit.BaseElement;
    resistor.type = 'resistor';
    element.set('position', { x: 100, y: 100 });

    var battery = new joint.shapes.circuit.BaseElement;
    battery.type = 'battery';
    battery.set('position', { x: 100, y: 100 });

    var bulb = new joint.shapes.circuit.BaseElement;
    bulb.type = 'bulb';
    bulb.set('position', { x: 100, y: 100 });

    var bulb = new joint.shapes.circuit.BaseElement;
    bulb.type = 'bulb';
    bulb.set('position', { x: 100, y: 100 });

    


   
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
