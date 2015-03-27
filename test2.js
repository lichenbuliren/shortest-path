$(function() {
    var rows = 25,
        cols = 25;
    var g = new Graph(rows,cols,0,0);
    g.initEdges();
    // 画出从起点开始的所有边
    g.bfs();

    // 计算从起点到终点最短路径
    g.pathTo();
    g.showGraph('grid-table');
});