google.load('visualization', '1', { packages: ['corechart', 'line'] });
google.setOnLoadCallback(drawBasic);
function drawBasic() {
   
}

var currentElementHoldsSlide = '';

var experimentReadings = {
        'Resistor': {
            'Impedance': [],
            'Voltage': [],
            'Current': []
        },
        'Battery': {
            'Impedance': [],
            'Voltage': [],
            'Current': []
        },
        'Bulb': {
            'Impedance': [],
            'Voltage': [],
            'Current': []
        }
    };


$(document).ready(function () {

        
    $('#cell1').html('-');
    $('#cell2').html('-');
    $('#cell3').html('-');

    

    var droppable;

    var dragBoundary = {};
    dragBoundary.height = 100;

    var elements = [];

    var graphDrawing = new joint.dia.Graph;

    var canvasWidth = 1100;
    var canvasHeight = 600;

    var unit = 30;
    var logical_rows = -1;
    var logical_columns = -1;

    var paperDrawing = new joint.dia.Paper({
        el: $('#drawingPanel'),
        width: canvasWidth,
        height: canvasHeight,
        model: graphDrawing,
        defaultLink: new joint.shapes.circuit.Wire,
        gridSize: 1,
        async: true,
        snapLinks :true,
        animation: true,
        validateConnection: function (vs, ms, vt, mt, e, vl) {

            if (vs.model instanceof joint.shapes.circuit.BreadBoardPort || ms.model instanceof joint.shapes.circuit.BreadBoardPort) {
                return false;
            }
           

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
        var image;
        if (type == 'bulb') {
            //image = { 'xlink:href': '../images/' + imagepah, 'y-alignment': 'middle'};
            image = { 'xlink:href': '../images/' + imagepah };

        }
        else{
            image = { 'xlink:href': '../images/' + imagepah };

            }
        var element = new joint.shapes.circuit.BaseElement({
            position: { x: x, y: y },
            initPosition: { x: x, y: y },
            port: { 'port': undefined },
            numerical: { 'current': undefined, 'voltage': undefined, 'impedance': undefined, 'r_current': undefined, 'r_voltage': undefined, 'r_impedance': undefined },
            attrs: {
                image: image,
                '.body': { 'stroke-width': 0 },
                '.cancelIcon':{r:15}
            }
        });
        element.initComponent = function (current, voltage, impedance) {
            var numerical=this.get('numerical');
            numerical.current = current;
            numerical.voltage = voltage;
            numerical.impedance = impedance;

            numerical.r_current = numerical.current * generateRandomNumber();
            numerical.r_voltage = numerical.voltage * generateRandomNumber();
            numerical.r_impedance = numerical.impedance * generateRandomNumber();
        }

        element.setCurrent = function (current) {
            var numerical = this.get('numerical');
            numerical.current = current;
            numerical.r_current = numerical.current * generateRandomNumber();

        }
        element.setVoltage = function (voltage) {
            var numerical = this.get('numerical');
            numerical.voltage = voltage;
            numerical.r_voltage = numerical.voltage * generateRandomNumber();

        }
        element.setImpedance = function (impedance) {
            var numerical = this.get('numerical');
            numerical.impedance = impedance;
            numerical.r_impedance = numerical.impedance * generateRandomNumber();
        }


       
        element.type = type;
        elements.push(element);
        graphDrawing.addCell(element);
    }

    var generateRandomNumber = function () {
        return Math.random() * (1 - 0.95) + 0.95;
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
         for(var i=1,k=0;i<canvasWidth/unit;i++,k++){
             for (var j = 4,l=0 ; j <(canvasHeight/unit)-1; j++,l++) {
                 addPort(i*unit,j*unit, k,l);
             }
        }

        //for (var i = 1, k = 0; i < 15; i++, k++) {
        //    for (var j = 4, l = 0 ; j < 15; j++, l++) {
        //        addPort(i * unit, j * unit, k, l);
        //    }
        //}



        logical_rows = k - 1;
        logical_columns = l - 1;
        //console.log(logical_rows + ':' + logical_columns);
    }


    var breadboardBG = new joint.shapes.circuit.ImageBackground({
        position: { x: 1, y: 320 },
        size: { width: 1100, height: 450 },
        attrs: {
            image: { 'xlink:href': '../images/plastic_texture.jpg', width: 1100, height: 450 },
        },
    });

   graphDrawing.addCell(breadboardBG);

    makeBreadBoard();

  
    //attrs: {
    //    image: { 'xlink:href': '../images/' + imagepah, 'ref-x': -10, 'ref-y': -10, width: 60 }
    //}


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

    addElementMIcon(100+100, 40, 'image1.png', 'resistor');
    addElementMIcon(350+100, 40, 'battery.png', 'battery');
    addElementMIcon(600+100, 40, 'bulboff.png', 'bulb');

    var button1 = new joint.shapes.basic.Rect({
        position: { x: (canvasWidth/2)-50, y: canvasHeight - 40 },
        size: { width: 100, height: 30 },
        attrs: {
            rect: { fill: 'blue' },
            text: { text: 'Start', fill: 'white' },
            magnet: false
        }
    });

    //var button2 = new joint.shapes.basic.Rect({
    //    position: { x: (canvasWidth / 2) - 50, y: canvasHeight - 40 },
    //    size: { width: 100, height: 30 },
    //    attrs: { rect: { fill: 'blue' }, text: { text: 'Stop', fill: 'white' }, magnet: false }
    //});

    var line = g.line(g.point(10, 20), g.point(50, 600));

   // button2.set('size', { width: 0, height: 0 });
    graphDrawing.addCell(button1);
   // graphDrawing.addCell(button2);



    _.each(elements, function (element) {
        
        switch(element.type){
            case "resistor":
                element.initComponent(undefined, undefined, 100);
                var num = element.get('numerical');
                $('#table_body').append("<tr id="+ element.get('id') +"><td>" + element.type + "</td><td>" + num.impedance + "</td><td>" + num.voltage + "</td><td>" + num.current + "</td></tr>");;

                break;
            case "battery":
                element.initComponent(undefined, 10, 1);
                var num = element.get('numerical');
                $('#table_body').append("<tr id=" + element.get('id') + "><td>" + element.type + "</td><td>" + num.impedance + "</td><td>" + num.voltage + "</td><td>" + num.current + "</td></tr>");;

                break;
            case "bulb":
                element.initComponent(undefined, undefined, 10);
                var num=element.get('numerical');
                $('#table_body').append("<tr id=" + element.get('id') + "><td>" + element.type + "</td><td>" + num.impedance + "</td><td>" + num.voltage + "</td><td>" + num.current + "</td></tr>");;
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

    var isConnected = false;

    var validateCircuit = function (cellView) {
        

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
           
            //button1.set('size', { width: 0, height: 0 });
            //button2.set('size', { width: 100, height: 30 });

           

            
            //bulboff.remove();
            //elements[2] = bulbOn;

            //graphDrawing.addCell(bulbOn);

            var bul = elements[2];

            bul.attr({
                image: { 'xlink:href': '../images/bulbon.png' }
           });
            button1.attr({
                text: { text: 'Stop' }
            });
           
            //var element = new joint.shapes.circuit.BaseElement({
            //    position: bul.get('position'),
            //    initPosition: bul.get('initPosition'),
            //    port: bul.get('port'),
            //    numerical: bul.get('numerical'),
            //    attrs: {
            //        image: { 'xlink:href': '../images/bulbon.png' },
            //        '.body': { 'stroke-width': 0 }
            //    }
            //});
            //element.type = 'bulb';

            //var outLinks = graphDrawing.getConnectedLinks(bul, { outbound: true });
            //var inLinks = graphDrawing.getConnectedLinks(bul, { inbound: true });

            //bul.remove({'disconnectLinks':true});

            //graphDrawing.addCell(element);

           
            startRandom();
        }

    }

    var randomizationTimer;

    paperDrawing.on('cancel:click', function (cellView, evt, x, y) {

        //console.log('cancel clicked');
    });


    graphDrawing.on('change:position', function (cell) {

        if (cell instanceof joint.shapes.circuit.ImageBackground) {
            cell.set('position', { x: 1, y: 320 });
        }

        //// has an obstacle been moved? Then reroute the link.
        //if (_.contains(elements, cell)) {
        //    var links = graphDrawing.getLinks();
        //    _.each(links, function (link) {
        //        paperDrawing.findViewByModel(link).update();
        //    });
            
        //}
    });


    paperDrawing.on('cell:pointerup', function (cellView, evt, x, y) {


        var event = 'Nothing';
        //try{
        //    event=button1.get('text').text;
        //}
        //catch(ex){

        //}
        if (cellView.model instanceof joint.shapes.basic.Rect) {
            event = cellView.model.get('attrs').text.text;
        }
         

        if (cellView.model instanceof joint.shapes.circuit.BaseElement) {


            var p0 = this._p0;
            var isValidDrop = false;
            var _pos_cellView = cellView.model.get('position');
            var _referencePortBoundary = g.rect(_pos_cellView.x, _pos_cellView.y, unit, unit);
            var ports = graphDrawing.get('cells').find(function (cell) {
                if (cell instanceof joint.shapes.circuit.BreadBoardPort) {
                    if (_referencePortBoundary.intersect(cell.getBBox())) {
                        isValidDrop = true;
                        elementDrop(cellView, cell, function () {
                            cellView.model.set('position', p0);
                        });
                        return {};
                    }
                }
            });
            if(!isValidDrop){
                cellView.model.set('position', p0);
            }

        }
        else if (event == 'Start') {
          
            validateCircuit(cellView);
        }
        else if (event == 'Stop') {

            isConnected = false;

            cellView.model.attr({
                text: {text:'Start'}
            });

            elements[2].attr({
                image: { 'xlink:href': '../images/bulboff.png' }
            });
            stopRandom();
        }
    });

    var startRandom= function () {
        randomizationTimer = setInterval(function () { showCircuitReadings() }, 1000);

    }
    var stopRandom= function () {
        window.clearInterval(randomizationTimer);
    }



    var makeViriablesRandomize = function () {

        _.each(elements, function (element) {
            var numerical = element.get('numerical');
            numerical.r_current = numerical.current * generateRandomNumber();
            numerical.r_voltage = numerical.voltage * generateRandomNumber();
            numerical.r_impedance = numerical.impedance * generateRandomNumber();
        });
        
    }

    var showCircuitReadings=function(){
        var resistor = elements[0];
        var battery = elements[1];
        var bulb = elements[2];

        var links = graphDrawing.getLinks();
        _.each(links, function (link) {
            paperDrawing.findViewByModel(link).sendToken(V('circle', { r: 7, fill: 'green' }).node)
            //paperDrawing.findViewByModel(link).sendToken(V('<path d="M15 8 L0 16 L0 0 Z" />', { fill: 'green' }).node)
        });

        makeViriablesRandomize();

        var totalImpedance = resistor.get('numerical').r_impedance + battery.get('numerical').r_impedance + bulb.get('numerical').r_impedance;
        var totalCurrent = battery.get('numerical').r_voltage / totalImpedance;

        _.each(elements, function (element) {
            //console.log(element.get('numerical'));
            element.get('numerical').r_current = totalCurrent;
            //console.log(element.get('numerical'));

        });

        _.each(elements, function (element) {
            //console.log(element.get('numerical'));
            var numerical = element.get('numerical');
            numerical.r_voltage = numerical.r_current * numerical.r_impedance;
            //console.log(element.get('numerical'));

        });

        $("#" + resistor.get('id')).html("<td>" + resistor.type + "</td><td>" + resistor.get('numerical').r_impedance + "</td><td>" + resistor.get('numerical').r_voltage + "</td><td>" + resistor.get('numerical').r_current + "</td>");
        $("#" + battery.get('id')).html("<td>" + battery.type + "</td><td>" + battery.get('numerical').r_impedance + "</td><td>" + battery.get('numerical').r_voltage + "</td><td>" + battery.get('numerical').r_current + "</td>");
        $("#" + bulb.get('id')).html("<td>" + bulb.type + "</td><td>" + bulb.get('numerical').r_impedance + "</td><td>" + bulb.get('numerical').r_voltage + "</td><td>" + bulb.get('numerical').r_current + "</td>");


    }

    $('#takeReading').click(function () {
        if (isConnected) {
            var resistor = elements[0].get('numerical');
            var battery = elements[1].get('numerical');
            var bulb = elements[2].get('numerical');

            experimentReadings.Resistor.Impedance.push(roundOff(resistor.impedance,3));
            experimentReadings.Resistor.Voltage.push(roundOff(resistor.r_voltage,3));
            experimentReadings.Resistor.Current.push(roundOff(resistor.r_current,3));

            experimentReadings.Battery.Impedance.push(roundOff(battery.impedance,3));
            experimentReadings.Battery.Voltage.push(roundOff(battery.voltage,3));
            experimentReadings.Battery.Current.push(roundOff(battery.r_current,3));
                
            experimentReadings.Bulb.Impedance.push(roundOff(bulb.impedance,3));
            experimentReadings.Bulb.Voltage.push(roundOff(bulb.r_voltage,3));
            experimentReadings.Bulb.Current.push(roundOff(bulb.r_current,3));


            showReadingsTable();
        }   
       

    });

    var roundOff = function(input, positions){
        return Math.round(input * Math.pow(10, positions)) / (Math.pow(10, positions));
    }
    var currentComponent = 'Component';
    var currentXreadings = 'X-Axis';
    var currentYreadings = 'Y-Axis';


    $("#componentSelect").change(function () {
        if (currentComponent != $("#componentSelect option:selected").text()) {
            currentComponent = $("#componentSelect option:selected").text();
            console.log(currentComponent);
        }
        showReadingsTable();
    });

    $("#xaxisSelect").change(function () {
        if (currentXreadings != $("#xaxisSelect option:selected").text()) {
            currentXreadings = $("#xaxisSelect option:selected").text();
        }
        showReadingsTable();
    });

    $("#yaxisSelect").change(function () {
        if (currentYreadings != $("#yaxisSelect option:selected").text()) {
            currentYreadings = $("#yaxisSelect option:selected").text();
        }
        showReadingsTable();

    });

    var showReadingsTable = function () {
        if (currentComponent != 'Component' && currentXreadings != 'X-Axis' && currentYreadings != 'Y-Axis') {

            $('#xAxisH').text(currentXreadings);
            $('#yAxisH').text(currentYreadings);

            var currentComponentReadings = experimentReadings[currentComponent];
            var xReadings = currentComponentReadings[currentXreadings ];
            var yReadings = currentComponentReadings[currentYreadings ];

            $('#table_body_readings').html('')

            var htmlChunk = '';
            var arrayChunk = '';

            for (var i = 0; i < xReadings.length; i++) {
                htmlChunk += '<tr><td>' + xReadings[i] + '</td><td>' + yReadings[i] + '</td></tr>'
                arrayChunk += '[' + xReadings[i]+', '+ yReadings[i]+ '], ';
            }

            $('#table_body_readings').html(htmlChunk)
            showGraph(arrayChunk.substring(0, arrayChunk.length-2));
        }
    }
    var showGraph = function(array) {
        var data = new google.visualization.DataTable();
        data.addColumn('number', 'X');
        data.addColumn('number', 'Impedance');

        var aaa = $.parseJSON('[' + array + ']');

        data.addRows(aaa);
        var options = {
            hAxis: {
                title: currentXreadings
            },
            vAxis: {
                title: currentYreadings
            }
        };
        var chart = new google.visualization.LineChart(document.getElementById('chartPanel'));
        chart.draw(data, options);
    }


   

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
        if (logicalPos.x + 4 > logical_rows || logicalPos.y + 3 > logical_columns || isOccupied.isOccupied || !port) {
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
                     //var oldPorts = graphDrawing.findModelsInArea(oldBoundary);
                     //_.each(oldPorts, function (old_each_port) {
                     //    if (old_each_port instanceof joint.shapes.circuit.BreadBoardPort) {
                     //        old_each_port.attr({
                     //            '.port': { fill: 'white' }
                     //        });
                     //    }
                     //});
                 }


                //attaching new ports
                 var portPosition = port.get('position');
                 var boundary = g.rect(portPosition.x, portPosition.y, 5 * unit, 3 * unit);
                 port.set('isOccupied', { 'isOccupied': true });
                 cellView.model.set('port', { 'port': port });
                 //var ports = graphDrawing.findModelsInArea(boundary);
                 //_.each(ports, function (each_port) {
                 //    if (each_port instanceof joint.shapes.circuit.BreadBoardPort) {
                 //        each_port.attr({
                 //            '.port': { fill: 'black' }
                 //        });
                 //    }
                 //});

                 cellView.model.set('position', g.point(portPosition.x,portPosition.y-4.5));

                    
                 var newElement = cellView.model.clone();
                 newElement.set('position',cellView.model.get('initPosition'));
                 graphDrawing.addCell(newElement);

            }
            else {
                moveToInitial();
            }

        }
    }

    paperDrawing.on('cell:mouseover ', function (cellView, evt) {


        

    });
   

    paperDrawing.on('cell:pointerdown', function (cellView, evt, x, y) {

        var className = evt.target.getAttribute('class');
        if (className == 'cancelIcon' || className == 'cancelIconText') {
            cellView.model.remove();
        }

        showHideSliders(cellView.model.type);
       

        if (cellView.model instanceof joint.shapes.circuit.BaseElement) {
            cellView.model.toFront();
            this._p0 = cellView.model.get('position');
        }

    });

    var showHideSliders = function (type) {
        if (type == 'resistor') {
            currentElementHoldsSlide = 'resistor';
            $('#resistance').val(elements[0].get('numerical').impedance);
            $('#currentElementSlider').text('Resistor');
            $('#resistorSliderDiv').css("visibility", "visible");
            $('#voltageSliderDiv').css("visibility", "hidden");
            $('#currentSliderDiv').css("visibility", "hidden");

        }
        else if (type == 'battery') {
            currentElementHoldsSlide = 'battery';
            $('#voltage').val(elements[1].get('numerical').voltage);
            $('#currentElementSlider').text('Battery');
            $('#resistorSliderDiv').css("visibility", "hidden");
            $('#voltageSliderDiv').css("visibility", "visible");
            $('#currentSliderDiv').css("visibility", "hidden");
        }
        else if (type == 'bulb') {
            currentElementHoldsSlide = 'bulb';
            $('#current').val(elements[2].get('numerical').impedance);
            $('#currentElementSlider').text('Bulb');
            $('#resistorSliderDiv').css("visibility", "visible");
            $('#voltageSliderDiv').css("visibility", "hidden");
            $('#currentSliderDiv').css("visibility", "hidden");
        }
    }
    showHideSliders('resistor');

    graphDrawing.on('remove', function (cell) {

        //+++ ADD check whether removes element is linkview or not
        //validateCircuit();
    })

    $('#resistance').on("input change", function () {
        if (currentElementHoldsSlide == 'resistor') {
            elements[0].get('numerical').impedance = $('#resistance').val();

        }
        else if (currentElementHoldsSlide == 'bulb') {
            elements[2].get('numerical').impedance = $('#resistance').val();

        }
    });
   
    $('#voltage').on("input change", function () {
        elements[1].get('numerical').voltage = $('#voltage').val();

    });

    $('#current').on("input change", function () {
        elements[2].get('numerical').current = $('#current').val();
    });


    $('.BaseElement').mouseenter(function () {
        
        $('.cancelIcon').css("visibility", "visible");
        $('.cancelIconText').css("visibility", "visible");
    });

    $('.BaseElement').mouseleave(function () {
        $('.cancelIcon').css("visibility", "hidden");
        $('.cancelIconText').css("visibility", "hidden");
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
