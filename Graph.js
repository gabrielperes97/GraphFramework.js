
//Grafo
class Graph {
    constructor()
    {
        this.initialNode = null;
        this.nodes = [];
        this.edges = [];
    }

    addBidiretionalEdge(from, to)
    {
        from.addNeighbor(to);
        to.addNeighbor(from);
    }

    addNode(node)
    {
        this.nodes.push(node);
    }
}

//aresta

EDGE_ESTADO = {
    VISITADO: 1,
    NAO_VISITADO: 2,
};

class Edge {


    static get FLUXO() {
        return EDGE_FLUXO;
    }


    static get ESTADO() {
        return EDGE_ESTADO;

    }

    constructor(origem, destino, peso, rotulo)
    {
        this.origem = origem;
        this.destino = destino;
        this.peso = peso;
        this.rotulo = rotulo;
        this.estado = Node.ESTADO.NAO_VISITADO;
    }
}

//Vertice
NODE_ESTADO = {
    VISITADO: 1,
    NAO_VISITADO: 2,
    PROCESSADO: 3,
};

class Node {

    static get ESTADO() {
        return NODE_ESTADO;
    }

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
        unvisited = [];
        this.neighbors.forEach(function (edge, index) {
            if (edge.destino.estado === Node.ESTADO.NAO_VISITADO)
            {
                unvisited.push(edge);
            }
        });
    }

    addNeighbor(vertex) {
        var neighbor = new Edge(this, vertex, 0, "");
        this.neighbors.push(neighbor);
        return neighbor;
    }
}


class SearchAlgorithm {

    constructor(graph, targetFunction){
        this.graph = graph;
        this.targetFunction = targetFunction;
    }

    search() {
        return null;
    }
}

