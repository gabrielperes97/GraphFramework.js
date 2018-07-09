
//Grafo
class Graph {

    initialNode : Node;
    nodes : { [id:string] : any};

    constructor()
    {
        this.initialNode = null;
        this.nodes = {};
    }

    addBidiretionalEdge(from: Node, to: Node, weight: number =0, name: string ="")
    {
        this.addEdge(from, to, weight, name);
        this.addEdge(to, from, weight, name);
    }

    addEdge(from: Node, to: Node, weight: number, name: string = "")
    {
        if (!this.nodes[from.rotulo])
            this.nodes[from.rotulo] = from;
        from.addNeighbor(to, weight, name);
    }

    clearState(){
        for (let nodesKey in this.nodes) {
            this.nodes[nodesKey].clearState();
        }
    }


    clone() : Graph {
        let g : Graph = new Graph();
        for (let nodesKey in this.nodes) {
            g.nodes[nodesKey] = this.nodes[nodesKey].clone();
        }
        g.initialNode = g.nodes[this.initialNode.rotulo];
        return g;
    }
}

//aresta

enum EDGE_ESTADO {
    VISITADO,
    NAO_VISITADO
}

class Edge {

    static readonly ESTADO = EDGE_ESTADO;

    origem : Node;
    destino : Node;
    weight : number;
    rotulo : string;
    estado : EDGE_ESTADO;

    constructor(origem, destino, weight, rotulo)
    {
        this.origem = origem;
        this.destino = destino;
        this.weight = weight;
        this.rotulo = rotulo;

        this.estado = Edge.ESTADO.NAO_VISITADO;
    }

    clone(): Edge {
        let e = new Edge(this.origem, this.destino, this.weight, this.rotulo);
        e.estado = this.estado;
        return e;
    }
}

//Vertice
enum NODE_ESTADO {
    VISITADO,
    NAO_VISITADO,
    PROCESSADO
}

class Node {

    static readonly  ESTADO = NODE_ESTADO;

    rotulo : string;
    neighbors : Edge[];
    data : any;
    estado : NODE_ESTADO;

    constructor(rotulo, data) {
        this.rotulo = rotulo;
        this.neighbors = [];
        this.data = data;

        this.estado = Node.ESTADO.NAO_VISITADO;
    }

    OneUnvisitedNeighbor() {
        var i;
        for (i=0; i<this.neighbors.length; i++)
        {
            if (this.neighbors[i].destino.estado === Node.ESTADO.NAO_VISITADO)
            {
                return this.neighbors[i];
            }
        }
        return null;
    }

    unvisitedNeighbors() {
        let unvisited = [];
        this.neighbors.forEach(function (edge, index) {
            if (edge.destino.estado === Node.ESTADO.NAO_VISITADO)
            {
                unvisited.push(edge);
            }
        });
    }

    addNeighbor(node: Node, weight: number =0, name: string ="") {
        var neighbor = new Edge(this, node, weight, name);
        this.neighbors.push(neighbor);
        return neighbor;
    }
    
    getNeighbor(node: Node) : Edge
    {
        let neighbor : Edge = null;
        this.neighbors.forEach(function (value, index, array) {
            if (value.destino === node)
            {
                neighbor = value;
                return;
            }
        });
        return neighbor;
    }

    //Djikstra
    pathTo (target: Node, graph: Graph) : Tour
    {
        /*Node.prototype.estimativa : number;
        Node.prototype.precedente : Node;*/

        for (let nodesKey in graph.nodes) {
            let n: Node = graph.nodes[nodesKey];
            n.estimativa = Infinity;
            n.fechado = false;
        }
        this.estimativa = 0;
        this.precedente = this;


        let node : Node = this;
        let numNodes : number = Object.keys(graph.nodes).length;

        for (let i = 0; i < numNodes; i++) {
            node.fechado = true;

            node.neighbors.forEach(function (value, index, array) {
                if(!value.destino.fechado)
                {
                    let newEst = node.estimativa + value.weight;
                    if (newEst < value.destino.estimativa)
                    {
                        value.destino.estimativa = newEst;
                        value.destino.precedente = node;
                    }
                }
            });

            let menor :Node;
            for (let nodesKey in graph.nodes)
            {
                let n : Node = graph.nodes[nodesKey];
                if ((!menor || menor.estimativa > n.estimativa) && n.estimativa != 0 && !n.fechado)
                {
                    menor = n;
                }
            }

            node = menor;
        }

        node = target;
        let tour : Tour = new Tour(graph);
        tour.addNode(target);
        while (node != this)
        {
            node = node.precedente;
            tour.addNode(node);
        }
        tour.reverse();
        return tour;
    }

    clearState(){
        this.estado = Node.ESTADO.NAO_VISITADO;
        this.neighbors.forEach(function (edge, index) {
            edge.estado = Edge.ESTADO.NAO_VISITADO;
        });
    }

    clone(): Node {
        let n: Node = new Node(this.rotulo, this.data);
        n.estado = this.estado;
        this.neighbors.forEach(function (edge, index) {
            n.neighbors.push(edge.clone());
        });
        return n;
    }
}


class SearchAlgorithm {

    graph : Graph;
    targetFunction : (Node) => boolean;

    constructor(graph: Graph, targetFunction: (Node) => boolean){
        this.graph = graph;
        this.targetFunction = targetFunction;
    }

    search() {
        return null;
    }
}

class Tour {
    nodes : Node[] = [];
    distance : number = 0;

    graph : Graph;

    path : Edge[] = [];

    constructor(graph: Graph)
    {
        this.graph = graph;
    }

    addNode(node : Node)
    {
        this.nodes.push(node);
        this.refresh();
    }

    //TODO Otimizar a necessidade disso
    private refresh()
    {
        this.path = [];
        this.distance = 0;
        for (let i = 1; i < this.nodes.length; i++) {
            //se o nó é visinho
            let neighbor:Edge = this.nodes[i-1].getNeighbor(this.nodes[i]);
            if (neighbor)
            {
                this.path.push(neighbor);
                this.distance += neighbor.weight;
            } else //se não é vizinho então usa djikstra
            {
                let p = this.nodes[i-1].pathTo(this.nodes[i], this.graph);
                this.path.concat(p.path);
                this.distance += p.distance;
            }
        }
    }

    reverse() {
        this.nodes.reverse();
        this.refresh();
    }


    getNode(i : number) : Node {
        return this.nodes[i];
    }

    swap(origin: number, destiny:number){
        //Whisper words of wisdom
        let itBe = this.nodes[origin];
        this.nodes[origin] = this.nodes[destiny];
        this.nodes[destiny] = itBe;
        this.refresh();
    }

    tourSize() : number {
        return this.nodes.length;
    }

    clone(): Tour {
        let c : Tour = new Tour(this.graph);
        this.nodes.forEach(function (val, index) {
            c.nodes.push(val);
        });
        c.distance = this.distance;
        c.refresh();
        return c;
    }

    toString():string
    {
        let str : string = "";
        this.path.forEach(function (value, index, array) {
            str += value.origem.rotulo + " -> " + value.destino.rotulo + " | ";
        });
        return str;
    }

}

