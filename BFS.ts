import {Graph, SearchAlgorithm, Node} from "./Graph";

class BFS extends SearchAlgorithm {

    queue : Node[];
    onVisitNode : (Node) => void;
    onProcessNode : (Node) => void;
    started : boolean;


    constructor(graph: Graph, targetFunction){
        super(graph, targetFunction);
        this.queue = [graph.initialNode];
        this.onVisitNode = null;
        this.onProcessNode = null;
        this.started = false;
    }

    search() {
        if (!this.started)
        {
            if (this.onVisitNode)
                this.onVisitNode(this.queue[0]);
            this.queue[0].estado = Node.ESTADO.VISITADO;
            this.started = true;
            if (this.targetFunction(this.queue[0]))
                return this.queue[0];
        }

        while(this.queue.length > 0) {
            //Pega o inicio da fila
            var v = this.queue[0];


            var unvisitedNeighbor = v.OneUnvisitedNeighbor();

            //Se não existirem visinhos não visitados
            if (unvisitedNeighbor == null)
            {
                //Marca como processado
                if (this.onProcessNode)
                    this.onProcessNode(v);
                v.estado = Node.ESTADO.PROCESSADO;
                this.queue.shift();
            }
            //Se for um visinho não visitado, marca como visitado e bota na fila
            else
            {
                if (this.onVisitNode)
                    this.onVisitNode(unvisitedNeighbor.destino);
                unvisitedNeighbor.destino.estado = Node.ESTADO.VISITADO;
                this.queue.push(unvisitedNeighbor.destino);
                if (this.targetFunction(unvisitedNeighbor.destino))
                    return unvisitedNeighbor.destino;
            }
        }
        //Se não encontrou o que procura, então retorna um null
        return null;
    }
}