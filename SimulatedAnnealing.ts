//import {Graph, SearchAlgorithm} from "./Graph";

class SimulatedAnnealing
{

    InitialTemperature : number = 4000000;


    constructor(graph: Graph, targetFunction: (Node) => boolean)
    {
        super(graph, targetFunction)
    }

    search()
    {
        let temp = this.InitialTemperature;
        let state = this.random_solution();
        while (temp = ) 
    }

    private random_solution(): Node
    {
        return this.graph.nodes[Math.floor(Math.random() * 6)];
    }
}