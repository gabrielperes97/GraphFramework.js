//import {Graph, SearchAlgorithm} from "./Graph";

class SimulatedAnnealing
{

    InitialTemperature : number = 10000;
    coolingRate : number = 0.003;
    graph : Graph;


    constructor(graph: Graph)
    {
        this.graph = graph;
    }

    execute() : Tour
    {
        let temp : number = this.InitialTemperature;
        let coolingRate : number = this.coolingRate;


        let currentSolution : Tour = this.random_solution();


        let best : Tour = currentSolution.clone();
        while (temp > 1)
        {
            let newSolution : Tour = currentSolution.clone();

            let tourPos1 : number =  Math.floor((Math.random() * (newSolution.tourSize()-1))+1);
            let tourPos2 : number =  Math.floor((Math.random() * (newSolution.tourSize()-1))+1);

            newSolution.swap(tourPos1, tourPos2);

            let currentEnergy : number = currentSolution.distance;
            let neighbourEnergy: number = newSolution.distance;

            if (SimulatedAnnealing.acceptanceProbability(currentEnergy, neighbourEnergy, temp) > Math.random())
            {
                currentSolution = newSolution.clone();
            }

            if (currentSolution.distance < best.distance)
            {
                best = currentSolution.clone();
            }

            temp *= 1-coolingRate;
        }

        return best;
    }

    private static acceptanceProbability(energy: number, newEnergy: number, temperature : number)
    {
        if (newEnergy < energy)
            return 1;
        else
            return Math.exp((energy - newEnergy) / temperature);
    }

    private random_solution(): Tour
    {
        let tour = new Tour(this.graph);

        let nodes : Node[] = [];
        for (let nodesKey in this.graph.nodes) {
            if(this.graph.nodes[nodesKey] != this.graph.initialNode)
                nodes.push(this.graph.nodes[nodesKey]);
        }

        for (let i = nodes.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [nodes[i], nodes[j]] = [nodes[j], nodes[i]];
        }

        nodes.unshift(this.graph.initialNode);
        nodes.push(this.graph.initialNode);

        nodes.forEach(function (value, index, array) {
            tour.addNode(value);
        });
        return tour;
    }
}