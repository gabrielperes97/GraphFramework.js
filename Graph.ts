
//Grafo
export class Graph {

    public initialNode : Node;
    nodes : Node[];
    edges : Edge[];
    constructor()
    {
        this.initialNode = null;
        this.nodes = [];
        this.edges = [];
    }

    addBidiretionalEdge(from, to, weight=0, name="")
    {
        from.addNeighbor(to, weight, name);
        to.addNeighbor(from, weight, name);
    }

    addNode(node)
    {
        this.nodes.push(node);
    }
}

//aresta

enum EDGE_ESTADO {
    VISITADO,
    NAO_VISITADO
}

export class Edge {

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

export class Node {

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

    addNeighbor(vertex, weight=0, name="") {
        var neighbor = new Edge(this, vertex, weight, name);
        this.neighbors.push(neighbor);
        return neighbor;
    }
}


export class SearchAlgorithm {

    graph : Graph;
    targetFunction : any; //todo passar pra função

    constructor(graph, targetFunction){
        this.graph = graph;
        this.targetFunction = targetFunction;
    }

    search() {
        return null;
    }
}

