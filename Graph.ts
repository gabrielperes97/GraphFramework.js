
//Grafo
class Graph {

    initialNode : Node;
    nodes : { [id:string] : any};
    edges : Edge[];


    constructor()
    {
        this.initialNode = null;
        this.nodes = {};
        this.edges = [];
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

