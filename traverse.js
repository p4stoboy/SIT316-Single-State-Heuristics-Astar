

const can_visit = (maze, x, y) => (in_bounds(maze, x, y) && maze[x][y] > 4);

const in_bounds = (maze, x, y) => (x >= 0 && x < maze.length && y >= 0 && y < maze.length);

const new_node = (parent, position, goal, maze, heuristic, factor) => {
    let g, h, f;
    if (!parent) {
        g = h = f = 0;
    } else {
        const parent_height = maze[parent.pos.x][parent.pos.y];
        const position_height = maze[position.x][position.y];
        const dif = Math.abs(parent_height - position_height) + 1; //cost
        if (dif > 3 || position_height < 5) return null;
        g = parent.g + dif;
        h = heuristic(position, goal) * factor; // heuristic cost function
        f = g + h;
    }
    return {
        parent,
        pos: position,
        g,
        h,
        f
    };
}

const get_neighbours = (maze, node) => {
    const neighbors = [];
    const {x, y} = node.pos;
    const directions = [[0, -1], [0, 1], [-1, 0], [1, 0]];
    for (let i = 0; i < directions.length; i++) {
        const [dx, dy] = directions[i];
        if (can_visit(maze, x + dx, y + dy)) {
            neighbors.push({x: x + dx, y: y + dy});
        }
    }
    return neighbors;
}

export const A_star = (maze, start, goal, heuristic, factor) => {
    const open = [];
    const closed = [];
    let current = new_node(null, start, goal, maze, heuristic, factor);
    open.push(current);
    while (open.length > 0) {
        open.sort((a, b) => b.f - a.f);
        current = open.pop();
        closed.push(current);
        if (current.pos.x === goal.x && current.pos.y === goal.y) { // return current;
            let node = current;
            const cost = node.g;
            const path = [];
            while (node.parent) {
                path.push([node.pos.x, node.pos.y]);
                node = node.parent;
            }
            path.reverse();
            return {cost, path};
        }
        const neighbours = get_neighbours(maze, current);
        for (let n of neighbours) {
            const neighbor = new_node(current, n, goal, maze, heuristic, factor);
            if (!neighbor) continue;
            if (closed.some(node => node.pos.x === neighbor.pos.x && node.pos.y === neighbor.pos.y)) continue;
            const open_node = open.find(node => node.pos.x === neighbor.pos.x && node.pos.y === neighbor.pos.y);
            if (!open_node) {
                open.push(neighbor);
            } else if (neighbor.g < open_node.g) {
                open_node.g = neighbor.g;
                open_node.parent = neighbor.parent;
            }
        }
    }
    return null;
}