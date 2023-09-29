import {new_maze} from "./maze.js";
import {choose} from "./util.js";
import {agent, pals, wall, start, end} from "./palettes.js";
import {A_star} from "./traverse.js";

const pal = choose(pals);

let size;
let res;
let maze;
let path;
let cost;
let unit;
let xs = 0;
let ys = 0;
let xe = 99;
let ye = 99;
let i = 0;
let is_path = true;
let play = false;

const new_map = () => {
    noiseSeed(Math.random() * 1000);
    maze = new_maze(res, res);
    draw_map();
}

const do_path = () => {
    draw_map();
    let result = A_star(maze, {x: xs, y: ys}, {
        x: xe,
        y: ye
    }, (a, b) => Math.abs(a.x - b.x) + Math.abs(a.y - b.y), 1);
    if (!result) {
        is_path = false;
    } else {
        is_path = true;
        cost = result.cost;
        path = result.path;
    }
    play = true;
    i = 0;
    frameRate(res / 2);
    loop();
}

const draw_map = () => {
    play = false;
    background("#FFF");
    for (let x = 0; x < maze.length; x++) {
        for (let y = 0; y < maze.length; y++) {
            if (x === xs && y === ys) {
                fill(start);
                stroke(start);
            } else if (x === xe && y === ye) {
                fill(end);
                stroke(end);
            } else if (maze[x][y] === -1) {
                fill(wall);
                stroke(wall);
            } else {
                fill(pal[floor(maze[x][y]/4)]);
                stroke(pal[floor(maze[x][y]/4)]);
            }
            rect(x * unit, y * unit, unit, unit);
        }
    }
}

const do_dropdown = () => {
    const menus =
        [document.getElementById("xs"),
        document.getElementById("ys"),
        document.getElementById("xe"),
        document.getElementById("ye")];

    for (let i = 0; i < res; i++) {
        for (let dd of menus) {
            const option = document.createElement("option");
            option.text = i;
            option.value = i;
            dd.add(option);
        }
    }
    menus[2].selectedIndex = res - 1;
    menus[3].selectedIndex = res - 1;
    menus[0].onchange = () => {xs = menus[0].selectedIndex; draw_map()};
    menus[1].onchange = () => {ys = menus[1].selectedIndex; draw_map()};
    menus[2].onchange = () => {xe = menus[2].selectedIndex; draw_map()};
    menus[3].onchange = () => {ye = menus[3].selectedIndex; draw_map()};
}

const run_button = document.getElementById("run");
run_button.onclick = () => {
    do_path();
}

const new_map_button = document.getElementById("new_map");
new_map_button.onclick = new_map;



window.setup = () => {
    res = 100;
    do_dropdown();
    size = Math.min(window.innerWidth, window.innerHeight)
    unit = size / res;
    createCanvas(size, size);
    rectMode(CORNER);
    background("#FFF");
}


window.draw = () => {
    if (play && !is_path) {
        background("#FFF");
        fill("#FF0000");
        text("No path found", 10, 10);
        noLoop();
    } else if (play && is_path) {
        if (i === path.length) noLoop();
        fill(agent);
        stroke(agent);
        if (i < path.length) {
            const [x, y] = path[i];
            rect(x * unit, y * unit, unit, unit);
            i++;
        }
    }
}

