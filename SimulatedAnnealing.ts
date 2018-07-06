import {Graph, SearchAlgorithm} from "./Graph";

class SimulatedAnnealing extends SearchAlgorithm
{
    constructor(graph: Graph, targetFunction: any)
    {
        super(graph, targetFunction)
    }
}