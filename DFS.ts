//import {Graph, SearchAlgorithm, Node} from "./Graph";

class DFS extends SearchAlgorithm {

    stack : Node[];
    onVisitNode : (Node) => void;
    onProcessNode : (Node) => void;
    started : boolean;

    constructor(graph: Graph, targetFunction: (Node) => boolean){
        super(graph, targetFunction);
        this.stack = [graph.initialNode];
        this.onVisitNode = null;
        this.onProcessNode = null;
        this.started = false;
    }

    search() {
        if (!this.started)
        {
            if (this.onVisitNode)
                this.onVisitNode(this.stack[0]);
            this.stack[0].estado = Node.ESTADO.VISITADO;
            this.started = true;
            if (this.targetFunction(this.stack[0]))
                return this.stack[0];
        }

        while(this.stack.length > 0) {
            //Pega o topo da pilha
            let v = this.stack[this.stack.length-1];


            let unvisitedNeighbor = v.OneUnvisitedNeighbor();

            //Se não existirem visinhos não visitados
            if (unvisitedNeighbor == null)
            {
                //Marca como processado
                if (this.onProcessNode)
                    this.onProcessNode(v);
                v.estado = Node.ESTADO.PROCESSADO;
                this.stack.pop();
            }
            //Se for um visinho não visitado, marca como visitado e bota na pilha
            else
            {
                if (this.onVisitNode)
                    this.onVisitNode(unvisitedNeighbor.destino);
                unvisitedNeighbor.destino.estado = Node.ESTADO.VISITADO;
                this.stack.push(unvisitedNeighbor.destino);
                if (this.targetFunction(unvisitedNeighbor.destino))
                    return unvisitedNeighbor.destino;
            }
        }
        //Se não encontrou o que procura, então retorna um null
        return null;
    }
}