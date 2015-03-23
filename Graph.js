/**
 * 最短路径选择
 * 思路：该问题可以转化为图的一个查找最短路径算法
 * 使用广度优先搜索方法
 * 25*25表示的图中，总共有625个坐标点
 * 障碍物数量小于等于625个，障碍物就相当于图上面没有的节点。从625个节点中删除不能访问的障碍物节点
 */


/**
 * 图对象
 * @param {number} rows  行
 * @param {number} cols  列
 * @param {number} start 起点
 * @param {number} end   终点
 * @param {number} n     障碍物个数
 */
function Graph(rows, cols, start, end, n) {

    this.rows = rows || 1;
    this.cols = cols || 1;
    // 节点数
    this.vertices = this.rows * this.cols;
    // 起点
    this.start = start || 0;
    // 终点
    this.end = end || 0;
    // z障碍物个数
    this.barrierCount = n || 0;
    // 边
    this.edges = 0;
    // 用来记录某个点关联的点数组
    this.adj = [];

    // 存储已访问过的顶点
    this.marked = [];

    // 保存从一个顶点到下一个顶点的所有边
    this.edgeTo = [];

    // 网格数组
    this.grid = [];

    // 记录障碍物数组
    this.barrier = [];

    // 记录最短路径数组
    this.path = [];

    // 初始化信息
    for (var i = 0; i < this.vertices; i++) {
        this.adj[i] = [];
        this.marked[i] = false;
    }

    if (!this.barrierCount) {
        this.barrierCount = getRandomNum(0, this.vertices / 2);
    }

    if (!this.end) {
        this.end = getRandomNum(0, this.vertices);
    }

    if (!this.start) {
        this.start = getRandomNum(0, this.vertices);
    }

    if (this.start > this.end) {
        var temp = this.end;
        this.end = this.start;
        this.start = temp;
    }
}

Graph.prototype = {

    /**
     * 添加边信息
     * @param {number} v 顶点1
     * @param {number} w 顶点2
     */
    addEdge: function (v, w) {
        this.adj[v].push(w);
        this.adj[w].push(v);
        this.edges++;
    },

    /**
     * 判断当前的路径是否访问过
     * @param  {number}  v 顶点
     * @return {Boolean}   [description]
     */
    hasPathTo: function (v) {
        return this.marked[v];
    },

    /**
     * 初始化障碍物位置
     * @param  {number} n 障碍物个数
     * @return {[type]}   [description]
     */
    initBarriers: function (n) {
        var count = 0;
        while (count < n) {
            var i = getRandomNum(0, this.rows),
                j = getRandomNum(0, this.cols);
            if (this.barrier.indexOf(this.grid[i][j]) < 0) {
                this.barrier.push(this.grid[i][j]);
                count++;
            }
        }

        this.barrier.sort(function (a, b) {
            return a - b;
        });
    },

    /**
     * 初始化边信息
     * @return {[type]} [description]
     */
    initEdges: function () {
        var count = 0;
        // 初始化网格数组
        for (var i = 0; i < this.rows; i++) {
            this.grid[i] = [];
            for (var j = 0; j < this.cols; j++) {
                this.grid[i][j] = count++;
            }
        }

        this.initBarriers(this.barrierCount);

        // 初始化边信息，避开障碍物
        for (var i = 0; i < this.rows; i++) {
            for (var j = 0; j < this.cols; j++) {
                var from = this.grid[i][j],
                    next = bottom = 0;
                if (this.barrier.indexOf(from) > 0) {
                    continue;
                }
                if (i + 1 < this.rows) bottom = this.grid[i + 1][j];
                if (j + 1 < this.cols) next = this.grid[i][j + 1];
                if (next && this.barrier.indexOf(next) < 0) {
                    this.addEdge(from, next);
                }
                if (bottom && this.barrier.indexOf(bottom) < 0) {
                    this.addEdge(from, bottom);
                }
            }
        }
    },

    /**
     * 深度优先搜索
     * @return {[type]}   [description]
     */
    dfs: function () {
        this.marked[this.start] = true;
        if (this.adj[this.start] != undefined) {
            console.log('Vistited vertex: ' + v);
        }

        var arr = this.adj[v];
        for (var i = 0; i < arr.length; i++) {
            if (!this.marked[arr[i]]) {
                this.dfs(arr[i]);
            }
        }
    },

    /**
     * 广度优先搜索算法
     * 1、查找与当前顶点相邻的未访问顶点，将其添加到已访问顶点列表及队列中，
     * 2、从图中取出下一个顶点v,添加到已访问的顶点列表
     * 3、将所有与v相邻的未访问顶点添加到队列
     * @return {[type]} [description]
     */
    bfs: function () {
        var queue = [];
        this.marked[this.start] = true;
        queue.push(this.start);
        while (queue.length > 0) {
            // 弹出队首
            var v = queue.shift();
            if (v) console.log('Vistited vertex: ' + v);

            // 查找与起点相邻的未访问的点
            var arr = this.adj[v];
            for (var i = 0; i < arr.length; i++) {
                // 如果未访问过，并且不是障碍物
                // 记录下边
                if (!this.marked[arr[i]] && this.barrier.indexOf(arr[i]) < 0) {
                    this.edgeTo[arr[i]] = v;
                    this.marked[arr[i]] = true;
                    //将相邻的顶点压入队列
                    queue.push(arr[i]);
                }
            }
        }
    },

    /**
     * 创建一个栈，用来存储与指定顶点有共同边的所有顶点
     * @param  {number} s 起点
     * @param  {number} e 终点
     * @return {Array}   最短路径顶点数组
     */
    pathTo: function () {
        var start = this.start,
            end = this.end;
        if (this.barrier.indexOf(start) > 0) {
            alert('起点为障碍物，请重试！');
            return false;
        }

        if (this.barrier.indexOf(end) > 0) {
            alert('终点为障碍物，请重试！');
            return false;
        }

        if (!this.hasPathTo(end)) {
            alert('没有路径到从' + start + '到' + end + ', 请重试！');
            return false;
        }

        for (var i = end; i && i != start; i = this.edgeTo[i]) {
            this.path.push(i);
        }

        this.path.push(start);
    },

    /**
     * 绘制表格
     * @param  {String} content table ID
     * @return {[type]}       [description]
     */
    paintGrid: function (table) {
        var $table = $('#' + table);
        $table.children('caption').text('起点：' + this.start + ' || 终点：' + this.end);
        // 绘制表格
        for (var i = 0; i < this.grid.length; i++) {
            var str = i + '->',
                tr = '<tr>';
            for (var j = 0; j < this.grid[i].length; j++) {
                var val = this.grid[i][j];
                tr += '<td data-num="' + val + '">' + val + '</td>';
            }
            $table.append(tr);
        }
    },

    /**
     * 绘制障碍物
     * @param  {String} content table ID
     * @return {[type]} [description]
     */
    paintBarriers: function (table) {
        var $table = $('#' + table);
        if (this.barrier.length > 0) {
            // 画图地雷
            for (var i = 0; i < this.barrier.length; i++) {
                var barrierNum = this.barrier[i];
                $table.find('[data-num="' + barrierNum + '"]').addClass('err');
            };
        }
    },

    /**
     * 绘制最短路径
     * @param  {String} table 表格ID
     * @return {[type]}       [description]
     */
    paintPath: function (table) {
        var path_len = this.path.length;
        if (path_len > 0) {
            for (var j = 0; j < path_len; j++) {
                var num = this.path[j];
                $('#' + table).find('[data-num="' + num + '"]').addClass('passed');
            }
        }
    },

    /**
     * 画出图表
     * @param  {String} content table ID
     * @return {[type]}         [description]
     */
    showGraph: function (table) {
        this.paintGrid(table);
        this.paintBarriers(table);
        this.paintPath(table);
    }
}

// 随机获取包含min不包含max之间的数
var getRandomNum = function (n, m) {
    return Math.floor(Math.random() * (m - n) + n);
};