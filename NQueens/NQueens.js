//import "../Graph";


/*class QEdge extends Edge {
    constructor(origem, destino) {
        super(origem, destino, Edge.FLUXO.BIDIRECIONAL, 0, "");

    }

}*/

class QNode extends Node {

    constructor(rotulo, tabuleiro) {
        super(rotulo, tabuleiro);
        this.createdChildrens = false;
    }

    OneUnvisitedNeighbor() {
        if (this.createdChildrens === false)
            this.createChildrens();
        return super.OneUnvisitedNeighbor();
    }

    unvisitedNeighbors() {
        if (this.createdChildrens === false)
            this.createChildrens();
        return super.unvisitedNeighbors();
    }

    /*addNeighbor(vertex) {
        var neighbor = new Edge(this, vertex);
        this.neighbors.push(neighbor);

        var otherWay = new Edge(vertex, this);
        vertex.neighbors.push(otherWay);
        return neighbor;
    }*/

    //Posso otimizar aqui para expandir apenas os filhos que podem ter alguma solução
    createChildrens() {
        if (this.data.queens < this.data.n) {
            var i;
            for (i=0; i< this.data.n; i++) {
                var t = this.data.clone();
                t.putQueen(this.data.queens, i);
                var str = "";
                t.queenList.forEach(function (value, index, array) {
                    str += " [" + value[0] + ", " + value[1] + "]";

                });
                this.addNeighbor(new QNode(str, t));
            }
        }
        this.createdChildrens = true;
    }
}

class Tabuleiro {

    constructor(n) {
        this.tabuleiro=[];
        this.n = parseInt(n);
        this.queens = 0;
        this.queenList = [];
        for (i=0; i<n; i++) {
            this.tabuleiro[i]=[];
            for (j=0; j<n; j++) {
                this.tabuleiro[i][j]=false;
            }
        }
    }

    static DontHasConflit(tabuleiro, lin, col) {
        var x=parseInt(lin);
        var y=parseInt(col);
        var i;

        //Horizontal à esquerda
        for (i=y-1; i>=0; i--)
        {
            if (tabuleiro.tabuleiro[x][i])
            {
                return false;
            }
        }
        //Horizontal a direita
        for (i=y+1; i<tabuleiro.n; i++)
        {
            if (tabuleiro.tabuleiro[x][i])
            {
                return false;
            }
        }
        //Vertical à cima
        for (i=x-1; i>=0; i--)
        {
            if (tabuleiro.tabuleiro[i][y])
            {
                return false;
            }

        }
        //Vertical para baixo
        for (i=x+1; i<tabuleiro.n; i++)
        {
            if (tabuleiro.tabuleiro[i][y])
            {
                return false;
            }
        }
        //Diagonal cima esquerda
        for (i=1; x-i>=0 && y-i>=0; i++)
        {
            if (tabuleiro.tabuleiro[x-i][y-i])
            {
                return false;
            }
        }
        //Diagonal baixo direita
        for (i=1; x+i<tabuleiro.n && y+i<tabuleiro.n; i++)
        {
            if (tabuleiro.tabuleiro[x+i][y+i])
            {
                return false;
            }
        }
        //Diagonal cima direita
        for (i=1; x-i>=0 && y+i>=0; i++)
        {
            if (tabuleiro.tabuleiro[x-i][y+i])
            {
                return false;
            }
        }
        //Diagonal baixo esquerda
        for (i=1; x+i<tabuleiro.n && y-i<tabuleiro.n; i++)
        {
            if (tabuleiro.tabuleiro[x+i][y-i])
            {
                return false;
            }
        }

        return true;
    }

    putQueen(x,y) {

        this.tabuleiro[x][y] = true;
        this.queens+=1;
        this.queenList.push([x,y]);
    }

    getAvaliablePositionsOnRow(y) {
        var positions = [];
        for (i=0; i<n; i++)
        {
            if (Tabuleiro.canPut(this, i,y))
                positions.push(i);
        }
        return positions;
    }

    getAvaliableTabOnRow(y) {
        var positions = this.getAvaliablePositionsOnRow(y);
        var tabs = [];
        for (var i=0; i<positions.length; i++)
        {
            var p = positions[i];
            var c = this.clone();
            c.putQueen(p, y);
            tabs.push(c);
        }
        return tabs;
    }

    itsRight() {
        for (var i=0; i<this.queenList.length; i++) {
            if (!Tabuleiro.DontHasConflit(this, this.queenList[i][0], this.queenList[i][1]))
                return false;
        }
        return true;
    }

    clone() {
        var c = new Tabuleiro(this.n);
        for (var i=0; i<this.n; i++)
        {
            for (var j=0; j<this.n; j++)
            {
                c.tabuleiro[i][j] = this.tabuleiro[i][j]?true:false;
            }
        }
        this.queenList.forEach(function (val, index) {
            c.queenList.push([val[0], val[1]]);
        });
        c.queens = this.queens;
        return c;
    }

    toString() {
        for (i=0; i<this.n; i++)
        {
            var s = "";
            for (j=0; j<this.n; j++)
            {
                s += this.tabuleiro[i][j]?"X":"-";
            }
            console.log(s);
        }
    }
}

class NQueens extends Graph{

    constructor(n) {
        super();
        this.n = parseInt(n);
        this.initialNode = new QNode("0-0", new Tabuleiro(this.n));
    }

    targetFunction(vertex) {
        return vertex.data.queenList.length === vertex.data.n && vertex.data.itsRight();
    }
}