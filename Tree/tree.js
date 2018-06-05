//
//  main.js
//
//  A project template for using arbor.js
//

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
};

function logger(text) {
    $("#logger-text").append(text + "<br/>");
}

function clearLogger() {
    $("#logger-text").html("");
}

(function($){

    var Renderer = function(canvas){
        var canvas = $(canvas).get(0)
        var ctx = canvas.getContext("2d");
        var gfx = arbor.Graphics(canvas)
        var particleSystem

        var that = {
            init:function(system){
                //
                // the particle system will call the init function once, right before the
                // first frame is to be drawn. it's a good place to set up the canvas and
                // to pass the canvas size to the particle system
                //
                // save a reference to the particle system for use in the .redraw() loop
                particleSystem = system

                // inform the system of the screen dimensions so it can map coords for us.
                // if the canvas is ever resized, screenSize should be called again with
                // the new dimensions
                particleSystem.screenSize(canvas.width, canvas.height)
                particleSystem.screenPadding(80) // leave an extra 80px of whitespace per side

                // set up some event handlers to allow for node-dragging
                that.initMouseHandling()
            },

            redraw:function(){

                gfx.clear();
                //
                // redraw will be called repeatedly during the run whenever the node positions
                // change. the new positions for the nodes can be accessed by looking at the
                // .p attribute of a given node. however the p.x & p.y values are in the coordinates
                // of the particle system rather than the screen. you can either map them to
                // the screen yourself, or use the convenience iterators .eachNode (and .eachEdge)
                // which allow you to step through the actual node objects but also pass an
                // x,y point in the screen's coordinate system
                //

                var nodeBoxes = {}


                particleSystem.eachEdge(function(edge, pt1, pt2){
                    // edge: {source:Node, target:Node, length:#, data:{}}
                    // pt1:  {x:#, y:#}  source position in screen coords
                    // pt2:  {x:#, y:#}  target position in screen coords

                    // draw a line from pt1 to pt2
                    ctx.strokeStyle = "rgba(0,0,0, .333)"
                    ctx.lineWidth = 1
                    ctx.beginPath()
                    ctx.moveTo(pt1.x, pt1.y)
                    ctx.lineTo(pt2.x, pt2.y)
                    ctx.stroke()
                })

                particleSystem.eachNode(function(node, pt){
                    var label = node.data.label||""
                    var w = ctx.measureText(""+label).width + 10
                    if (!(""+label).match(/^[ \t]*$/)){
                        pt.x = Math.floor(pt.x)
                        pt.y = Math.floor(pt.y)
                    }else{
                        label = null
                    }

                    // draw a rectangle centered at pt
                    if (node.data.color) ctx.fillStyle = node.data.color
                    else ctx.fillStyle = "rgba(0,0,0,.2)"
                    if (node.data.color=='none') ctx.fillStyle = "white"

                    if (node.data.shape=='dot'){
                        gfx.oval(pt.x-w/2, pt.y-w/2, w,w, {fill:ctx.fillStyle})
                        nodeBoxes[node.name] = [pt.x-w/2, pt.y-w/2, w,w]
                    }else{
                        gfx.rect(pt.x-w/2, pt.y-10, w,20, 4, {fill:ctx.fillStyle})
                        nodeBoxes[node.name] = [pt.x-w/2, pt.y-11, w, 22]
                    }

                    // draw the text
                    if (label){
                        ctx.font = "20px Helvetica"
                        ctx.textAlign = "center"
                        ctx.fillStyle = "white"
                        if (node.data.color=='none') ctx.fillStyle = '#333333'
                        ctx.fillText(label||"", pt.x, pt.y+4)
                        ctx.fillText(label||"", pt.x, pt.y+4)
                    }
                })
            },

            initMouseHandling:function(){
                // no-nonsense drag and drop (thanks springy.js)
                var dragged = null;

                // set up a handler object that will initially listen for mousedowns then
                // for moves and mouseups while dragging
                var handler = {
                    clicked:function(e){
                        var pos = $(canvas).offset();
                        _mouseP = arbor.Point(e.pageX-pos.left, e.pageY-pos.top)
                        dragged = particleSystem.nearest(_mouseP);

                        if (dragged && dragged.node !== null){
                            // while we're dragging, don't let physics move the node
                            dragged.node.fixed = true
                        }

                        $(canvas).bind('mousemove', handler.dragged)
                        $(window).bind('mouseup', handler.dropped)

                        return false
                    },
                    dragged:function(e){
                        var pos = $(canvas).offset();
                        var s = arbor.Point(e.pageX-pos.left, e.pageY-pos.top)

                        if (dragged && dragged.node !== null){
                            var p = particleSystem.fromScreen(s)
                            dragged.node.p = p
                        }

                        return false
                    },

                    dropped:function(e){
                        if (dragged===null || dragged.node===undefined) return
                        if (dragged.node !== null) dragged.node.fixed = false
                        dragged.node.tempMass = 1000
                        dragged = null
                        $(canvas).unbind('mousemove', handler.dragged)
                        $(window).unbind('mouseup', handler.dropped)
                        _mouseP = null
                        return false
                    }
                }

                // start listening
                $(canvas).mousedown(handler.clicked);

            },

        }
        return that
    }

    $(document).ready(function(){
        var sys = arbor.ParticleSystem(1000, 600, 0.5);// create the system with sensible repulsion/stiffness/friction
        sys.parameters({gravity:true}); // use center-gravity to make the graph settle nicely (ymmv)
        sys.renderer = Renderer("#viewport");// our newly created renderer will have its .init() method called shortly by sys...

        // add some nodes to the graph and watch it go...
        sys.addEdge('a','b');
        sys.addEdge('a','c');
        sys.addEdge('a','d');
        sys.addEdge('a','e');
        sys.addNode('f', {alone:true, mass:.25});


        $("#gerar").click(function () {

            clearLogger();

            sys.eachNode(function (v) {
                sys.pruneNode(v);
            });

            var text = $("#editor-text").val();

            var graph = new Graph();

            //Encontra as arestas
            regex = new RegExp(/([A-Za-z0-9]+) *(\-\-|\-\>|\<\-) *([A-Za-z0-9]+)/g);
            var nodes = {};

            while ((matches = regex.exec(text)) != null) {
                if (nodes[matches[1]] == null)
                {
                    nodes[matches[1]] = new Node(matches[1], matches[1]);
                    graph.addNode(nodes[matches[1]]);
                    sys.addNode(matches[1], {color:'blue','shape':'dot','label': matches[1]});
                }
                if (nodes[matches[3]] == null)
                {
                    nodes[matches[3]] = new Node(matches[3], matches[3]);
                    graph.addNode(nodes[matches[3]]);
                    sys.addNode(matches[3], {color:'blue','shape':'dot','label': matches[3]});
                }
                sys.addEdge(matches[1], matches[3]);
                graph.addBidiretionalEdge(nodes[matches[1]], nodes[matches[3]]);
            }
            

            //Encontra as funções
            regex = new RegExp(/([A-Za-z]+)\(([A-Za-z0-9]+)\)/g);
            var startNode = null;
            var searchAlg = null;
            var target = null;
            while ((matches = regex.exec(text)) != null) {
                var funcao = matches[1].toLowerCase();
                var argumento = matches[2];

                switch (funcao)
                {
                    case "start":
                        if (startNode === null)
                        {
                            startNode = argumento;
                            graph.initialNode = nodes[startNode];
                        }
                        else
                        {
                            logger("Start duplicado");
                            return;
                        }
                        break;
                    case "dfs":
                        if (searchAlg === null)
                        {
                            searchAlg = DFS;
                            target = argumento;
                        }
                        else
                        {
                            logger("Algoritmo de busca já definido");
                            return;
                        }
                        break;
                    case "bfs":
                        if (searchAlg === null)
                        {
                            searchAlg = BFS;
                            target = argumento;
                        }
                        else
                        {
                            logger("Algoritmo de busca já definido");
                            return;
                        }
                        break;
                    default:
                        logger("Função inválida");
                        return;
                        break;
                }
            }

            if (startNode != null && searchAlg != null)
            {
                var search = new searchAlg(graph, function (node) {
                    return node.data === target;
                });
                search.onVisitNode = function (node) {
                    n = sys.getNode(node.data);
                    n.data["color"] = "yellow";
                    console.log("Visited: "+node.rotulo);
                    logger("Visited: "+node.rotulo);

                };
                search.onProcessNode = function (node) {
                    //pinta de outra cor
                    n = sys.getNode(node.rotulo);
                    n.data["color"] = "grey";
                    console.log("Processed: "+node.data);
                    logger("Processed: "+node.rotulo);
                };
                logger("Result: " + search.search().rotulo);
            }
        });

    });




})(this.jQuery);

