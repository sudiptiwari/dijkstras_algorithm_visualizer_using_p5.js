let cnv;
let checkboxes;
let circles = []; // Array to store the circles
let edges = []; // Array to store the edges
let startingCircle;
let endCircle;
let edge; // edge variable to hold details inside drawing edges
let starting_node_selected = false;
let edge_draw_flag = false;
let graph;
let startNode = 9999; // variable to store start node for algorithm implementation
// let circlesCount = 0;

function setup() {
    cnv = createCanvas(windowWidth / 1.2, windowHeight / 1.2);
    cnv.position(windowWidth / 2 - cnv.width / 2, windowHeight / 2 - cnv.height / 2); // set the position of the canvas to the center of the window
    cnv.class('canvas'); // use .canvas { } to style in css
    // cnv.mouseClicked(isMouseClickedInsideCanvas);

    checkboxes = new CheckBoxes(0, 60); // parameters indicate the position of checkboxes
    checkboxes.display();
    // checkboxes.addClass('checkbox'); // use .checkboxes { } to style in CSS
}

function draw() {
    frameRate(60);
    background(40, 40, 40);
    // edge_draw_flag = false;

    // line(mouseX, mouseY, pmouseX, pmouseY);
    for (let i = 0; i < edges.length; i++) {
        let e1 = edges[i];
        stroke(240, 234, 214);
        line(e1.startX, e1.startY, e1.endX, e1.endY);
        // Calculate mid-point for showing e1.weight
        let midX = (e1.startX + e1.endX) / 2;
        let midY = (e1.startY + e1.endY) / 2;

        //Draw e1.weight above the line
        textSize(20);
        textAlign(CENTER, CENTER);
        text(e1.weight, midX - midY / 40, midY - midX / 40);

    }

    // Loop through the array and display all the circles
    for (let i = 0; i < circles.length; i++) {
        let circle = circles[i];
        // noFill();
        if (circle == startingCircle) {
            fill(201, 127, 127); // Set fill color to red if selected
        }
        else if (circle == endCircle) {
            fill(143, 188, 143);
        }
        else { fill(40, 40, 40); }
        if(circle.number == startNode) {
            fill(25, 202, 185);
        }
        stroke(255);
        strokeWeight(2);
        ellipse(circle.x, circle.y, 50, 50);



        textAlign(CENTER, CENTER);
        textSize(32);
        fill(255);
        noStroke();
        text(circle.number, circle.x, circle.y);

        // console.log(circle.x, circle.y);

    }
    if (!checkboxes.nodeCheckbox.checked() && !checkboxes.edgeCheckbox.checked() && checkboxes.shortestPathCheckbox.checked()) {
        frameRate(20);
        graph = new Graph();
        // graph.display2dArray();
    }
}

function isMouseClickedInsideCanvas() {
    if (/*mouseIsPressed &&*/
        mouseX >= (0) &&
        mouseX <= (cnv.width) &&
        mouseY >= (0) &&
        mouseY <= (cnv.height)) {
        return true;
    }
    else {
        return false;
    }
}

// Reset start and end node after mouse is released
function mouseReleased() {
    // if Draw edges checkbox is checked and mouse is released
    if (!checkboxes.nodeCheckbox.checked() && checkboxes.edgeCheckbox.checked() && !checkboxes.shortestPathCheckbox.checked()) {
        if (edge_draw_flag) {
            edge.weight = 0;
            while (edge.weight == 0 || edge.weight !== edge.weight /* only NaN is not equal to itself */) {
                edge.weight = parseInt(prompt(`Please Enter Weight of edge: `));
            }
            edges.push(edge);
            console.log(`Edge drawn!`);
            startingCircle = null;
            endCircle = null;
            // edge = null;
            starting_node_selected = false;
            edge_draw_flag = false;
        }
    }
}

function mousePressed() {
    // creating nodes
    if (isMouseClickedInsideCanvas() && checkboxes.nodeCheckbox.checked() && !checkboxes.edgeCheckbox.checked() && !checkboxes.shortestPathCheckbox.checked() && mouseIsPressed) {
        let circle = {
            x: mouseX,
            y: mouseY,
            number: circles.length + 1
        };
        circles.push(circle);
        console.log(`Node ${(circle.number)} drawn!`);
    }

    if (checkboxes.startNodeCheckbox.checked() && isMouseClickedInsideCanvas()) {
        for (let i = 0; i < circles.length; i++) {
            let circle = circles[i];
            let d_start = dist(mouseX, mouseY, circle.x, circle.y);
            if (d_start < 25) {
                startNode = circle.number;
                console.log(`Node ${(startNode)} selected as start node`);
            }
        }
    }
}

// Draw edges
function mouseDragged() {
    if (!checkboxes.edgeCheckbox.checked() || !isMouseClickedInsideCanvas()) {
        return; // don't run this function if "Draw Edge" checkbox is not selected
    }
    if (isMouseClickedInsideCanvas() && !checkboxes.nodeCheckbox.checked() && checkboxes.edgeCheckbox.checked() && !checkboxes.shortestPathCheckbox.checked()) {
        if (!starting_node_selected) {
            for (let i = 0; i < circles.length; i++) {
                let circle = circles[i];
                let d_start = dist(mouseX, mouseY, circle.x, circle.y);
                if (d_start < 25) {
                    startingCircle = circle;
                    edge = new Edge(startingCircle.x, startingCircle.y);
                    edge.sourceCircle = i;
                    starting_node_selected = true;
                    break;
                }
            }
        }
        if (starting_node_selected) {
            edge_draw_flag = false;
            for (let i = 0; i < circles.length; i++) {
                let circle = circles[i];
                if (circle != startingCircle) {
                    let d_end = dist(mouseX, mouseY, circle.x, circle.y);
                    if (d_end < 25) {
                        endCircle = circle;
                        edge.endX = endCircle.x;
                        edge.endY = endCircle.y;
                        edge.destCircle = i;
                        edge_draw_flag = true;
                        break;
                    }
                }
            }
        }
    }
}

class CheckBoxes {
    constructor(x, y) {
        this.nodeCheckbox = createCheckbox(' Draw Node', false);
        this.edgeCheckbox = createCheckbox(' Draw Edge', false);
        this.startNodeCheckbox = createCheckbox(' Start Node', false);
        this.shortestPathCheckbox = createCheckbox(' Find Path', false);
        this.checkboxes = [this.nodeCheckbox, this.edgeCheckbox, this.startNodeCheckbox, this.shortestPathCheckbox];
        this.x = x;
        this.y = y;

        // Add event listeners to each checkbox
        for (let checkbox of this.checkboxes) {
            checkbox.changed(() => {
                if (checkbox.checked()) {
                    // Uncheck all other checkboxes
                    for (let otherCheckbox of this.checkboxes) {
                        if (otherCheckbox !== checkbox) {
                            otherCheckbox.checked(false); // Uncheck all other checkboxes
                        }
                    }
                }
            });
        }
    }

    display() {
        this.nodeCheckbox.position(this.x, this.y);
        this.edgeCheckbox.position(this.x, this.y + 30);
        this.startNodeCheckbox.position(this.x, this.y + 60);
        this.shortestPathCheckbox.position(this.x, this.y + 90);
    }
}


class Edge {
    constructor(startX, startY, sourceCircle, endX, endY, destCircle, weight) {
        this.startX = startX;
        this.startY = startY;
        this.sourceCircle = sourceCircle;
        this.endX = endX;
        this.endY = endY;
        this.destCircle = destCircle;
        this.weight = weight;
    }
}

class Graph {
    constructor() {
        this.noOfNodes = circles.length
        this.noOfEdges = edges.length;
        // set up and initialize all element to 0
        this.edgesMatrix = [];
        for (let i = 0; i < this.noOfNodes; i++) {
            this.edgesMatrix[i] = new Array(this.noOfNodes).fill(0);
        }

        // set non diagonal elements to weight(make directed graph)
        // for (let i = 0; i < this.noOfEdges; i++) {
        //     let e = edges[i];
        //     var statingCircleFound = false;
        //     var endingCircleFound = false;
        //     for(let j = 0; j < this.noOfEdges; j++) {
        //         let circle = circles[j];
        //         if(statingCircleFound && endingCircleFound) {
        //             break;
        //         }
        //         if(!statingCircleFound && e.startX == circle.x && e.startY == circle.y) {
        //             var row = j;
        //             statingCircleFound = true;
        //         } 
        //         if(!endingCircleFound && e.endX == circle.x && e.endY == circle.y) {
        //             var column = j;
        //             endingCircleFound = true;
        //         }
        //     }
        //     this.edgesMatrix[row][column]  = e.weight;
        // }
        for (let i = 0; i < this.noOfEdges; i++) {
            let e = edges[i];
            this.edgesMatrix[e.sourceCircle][e.destCircle] = e.weight;
        }


        // transform to non directed graph
        for (let i = 0; i < this.noOfNodes; i++) {
            for (let j = 0; j < this.noOfNodes; j++) {
                if (i != j) {
                    if (this.edgesMatrix[i][j] == 0 && this.edgesMatrix[j][i] != 0) {
                        this.edgesMatrix[i][j] = this.edgesMatrix[j][i];
                    }
                    if (this.edgesMatrix[i][j] == 0 && this.edgesMatrix[j][i] == 0) {
                        this.edgesMatrix[i][j] = -1; // ~ no path
                        this.edgesMatrix[j][i] = -1; // ~ no path
                    }
                }
            }
        }
    }

    display2dArray() {
        // Dipslay 2-D array
        for (let i = 0; i < this.noOfNodes; i++) {
            for (let j = 0; j < this.noOfNodes; j++) {
                console.log(this.edgesMatrix[i][j]);
            }
            console.log(`\n`);
        }
    }
}



// A Javascript program for Dijkstra's single
// source shortest path algorithm.
// The program is for adjacency matrix
// representation of the graph    
let V = 9;

// A utility function to find the
// vertex with minimum distance
// value, from the set of vertices
// not yet included in shortest
// path tree
function minDistance(dist, sptSet) {

    // Initialize min value
    let min = Number.MAX_VALUE;
    let min_index = -1;

    for (let v = 0; v < V; v++) {
        if (sptSet[v] == false && dist[v] <= min) {
            min = dist[v];
            min_index = v;
        }
    }
    return min_index;
}

// A utility function to print
// the constructed distance array
function printSolution(dist) {
    document.write("Vertex \t\t Distance from Source<br>");
    for (let i = 0; i < V; i++) {
        document.write(i + " \t\t " +
            dist[i] + "<br>");
    }
}

// Function that implements Dijkstra's
// single source shortest path algorithm
// for a graph represented using adjacency
// matrix representation
// function dijkstra(graph, src) {
//     let dist = new Array(V);
//     let sptSet = new Array(V);

//     // Initialize all distances as
//     // INFINITE and stpSet[] as false
//     for (let i = 0; i < V; i++) {
//         dist[i] = Number.MAX_VALUE;
//         sptSet[i] = false;
//     }

//     // Distance of source vertex
//     // from itself is always 0
//     dist[src] = 0;

//     // Find shortest path for all vertices
//     for (let count = 0; count < V - 1; count++) {

//         // Pick the minimum distance vertex
//         // from the set of vertices not yet
//         // processed. u is always equal to
//         // src in first iteration.
//         let u = minDistance(dist, sptSet);

//         // Mark the picked vertex as processed
//         sptSet[u] = true;

//         // Update dist value of the adjacent
//         // vertices of the picked vertex.
//         for (let v = 0; v < V; v++) {

//             // Update dist[v] only if is not in
//             // sptSet, there is an edge from u
//             // to v, and total weight of path
//             // from src to v through u is smaller
//             // than current value of dist[v]
//             if (!sptSet[v] && graph[u][v] != 0 &&
//                 dist[u] != Number.MAX_VALUE &&
//                 dist[u] + graph[u][v] < dist[v]) {
//                 dist[v] = dist[u] + graph[u][v];
//             }
//         }
//     }

//     // Print the constructed distance array
//     printSolution(dist);
// }

// // Driver code

// dijkstra(graph, 0);

