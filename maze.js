
export const new_maze = (width, height) => {
    let maze = [];
    for (let x = 0; x < height; x++) {
        maze[x] = [];
        for (let y = 0; y < width; y++) {
            maze[x][y] = floor(map(noise(x * 0.03, y * 0.03), 0, 1, 0, 20));
        }
    }
    return add_walls(maze, 30, width);
}

export const add_walls = (maze, num_walls, size) => {
    for (let i = 0; i < num_walls; i++) {
        const sx = Math.floor(Math.random() * size);
        const sy = Math.floor(Math.random() * size);
        const axis = Math.floor(Math.random() * 2);
        if (axis === 1) {
            const ex = Math.floor(Math.random() * size);
            for (let x = Math.min(sx, ex); x <= Math.max(sx, ex); x++) {
                maze[x][sy] = -1;
            }
        } else {
            const ey = Math.floor(Math.random() * size);
            for (let y = Math.min(sy, ey); y <= Math.max(sy, ey); y++) {
                maze[sx][y] = -1;
            }
        }
    }
    return maze;
}