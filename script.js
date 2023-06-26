let cnv;
let checkboxes;
let circles = []; // Array to store the circles
let edges = []; // Array to store the edges
let shortestPathEdges = []; // Array to store final result of edges that are in shortest path between start and end node
let startingCircle;
let endCircle;
let edge; // edge variable to hold details inside drawing edges
let starting_node_selected = false;
let edge_draw_flag = false;
let graph;
const inf = 99999;
let startNode = inf; // variable to store start node for algorithm implementation
let endNode = inf;

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
    if (checkboxes.shortestPathCheckbox.checked()) {
        shortestPathEdges = [];
        console.log(`New graph created.`);
        let graph = new Graph();
        graph.implement_dijkstra();
        graph.displayShortestPathEdges();
    }

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
    // Display shortest path edges with another color
    for (let i = 0; i < shortestPathEdges.length; i++) {
        let e2 = shortestPathEdges[i];
        stroke(206, 250, 5);
        line(e2.startX, e2.startY, e2.endX, e2.endY);
        // Calculate mid-point for showing e1.weight
        let midX = (e2.startX + e2.endX) / 2;
        let midY = (e2.startY + e2.endY) / 2;

        //Draw e1.weight above the line
        textSize(20);
        textAlign(CENTER, CENTER);
        text(e2.weight, midX - midY / 40, midY - midX / 40);
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
        if (circle.number == startNode) {
            fill(25, 202, 185);
        }
        if (circle.number == endNode) {
            fill(229, 0, 169);
        }
        stroke(255);
        strokeWeight(2);
        ellipse(circle.x, circle.y, 50, 50);



        textAlign(CENTER, CENTER);
        textSize(32);
        fill(255);
        noStroke();
        text(circle.number, circle.x, circle.y);

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
        // alert(`Please Click on the screen inside the board to draw a node: `)
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

    if (checkboxes.endNodeCheckbox.checked() && isMouseClickedInsideCanvas()) {
        for (let i = 0; i < circles.length; i++) {
            let circle = circles[i];
            let d_start = dist(mouseX, mouseY, circle.x, circle.y);
            if (d_start < 25) {
                endNode = circle.number;
                console.log(`Node ${(endNode)} selected as end node`);
            }
        }
    }
    // if (checkboxes.shortestPathCheckbox.checked()) {
    //     console.log(`New graph created.`);
    //     let graph = new Graph();
    //     graph.implement_dijkstra();
    //     graph.displayShortestPathEdges();
    // }

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
        this.endNodeCheckbox = createCheckbox(' End Node', false);
        this.shortestPathCheckbox = createCheckbox(' Find Path', false);
        this.checkboxes = [this.nodeCheckbox, this.edgeCheckbox, this.startNodeCheckbox, this.endNodeCheckbox, this.shortestPathCheckbox];
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
        this.endNodeCheckbox.position(this.x, this.y + 90);
        this.shortestPathCheckbox.position(this.x, this.y + 120);
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
        this.algorithmExecuted = false;
        this.edgesCreated = false;
    }
}

class Graph {
    constructor() {
        this.noOfNodes = circles.length;
        this.noOfEdges = edges.length;
        this.src = startNode - 1; // changed to startNode-1
        this.des = endNode - 1;
        this.sptSet = [];
        this.distToNodes = new Array(this.noOfNodes).fill(inf);
        this.distToNodes[this.src] = 0;

        // set up and initialize all element to 0
        this.edgesMatrix = [];
        for (let i = 0; i < this.noOfNodes; i++) {
            this.edgesMatrix[i] = new Array(this.noOfNodes).fill(0);
        }
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

    implement_dijkstra() {
        let visited = new Array(this.noOfNodes).fill(false); // creates array of length this.noOfNodes and sets all the value to false
        let parent = new Array(this.noOfNodes).fill(-1);
        let distance = new Array(this.noOfNodes).fill(inf);
        distance[this.src] = 0;
        visited[this.src] = true;

        let row = this.src;

        for (let v = 0; v < this.noOfNodes - 1; v++) {
            // update distance matrix if necessary
            let minDistance = inf;
            let minIndex = -1;
            for (let i = 0; i < this.noOfNodes; i++) {
                if (!visited[i] && (this.edgesMatrix[row][i] != -1) && (distance[row] + this.edgesMatrix[row][i]) <= distance[i]) {

                    // block for step by step highlight of paths being checked
                    for (let j = 0; j < edges.length; j++) {
                        let e1 = edges[j];
                        if ((e1.sourceCircle == row && e1.destCircle == i) || (e1.sourceCircle == i && e1.destCircle == row)) {
                            stroke(255, 0, 0);
                            line(e1.startX, e1.startY, e1.endX, e1.endY);
                            // Calculate mid-point for showing e1.weight
                            let midX = (e1.startX + e1.endX) / 2;
                            let midY = (e1.startY + e1.endY) / 2;

                            //Draw e1.weight above the line
                            textSize(20);
                            textAlign(CENTER, CENTER);
                            text(e1.weight, midX - midY / 40, midY - midX / 40);
                        }

                    }

                    distance[i] = distance[row] + this.edgesMatrix[row][i];
                    parent[i] = row;
                }
            }

            // let minDistance = inf;
            // let minIndex = -1;
            for (let i = 0; i < this.noOfNodes; i++) {
                if (!visited[i] && distance[i] < minDistance) {
                    minDistance = distance[i];
                    minIndex = i;
                }
            }

            visited[minIndex] = true;
            // parent[minIndex] = row;
            row = minIndex;
        }

        let temp_src = this.des;
        for (let i = 0; i < this.noOfNodes; i++) {
            let edgeWeight = this.edgesMatrix[parent[temp_src]][temp_src];
            shortestPathEdges.push(new Edge(
                circles[parent[temp_src]].x, circles[parent[temp_src]].y, parent[temp_src],
                circles[temp_src].x, circles[temp_src].y, temp_src,
                edgeWeight
            ));
            temp_src = parent[temp_src];
            if (temp_src == this.src) {
                break;
            }
        }

    }

    displayShortestPathEdges() {
        for (let i = 0; i < shortestPathEdges.length; i++) {
            let edge = shortestPathEdges[i];
            console.log(`Edge ${i + 1}:`);
            console.log(`Start: (${edge.startX}, ${edge.startY}), Node ${edge.sourceCircle}`);
            console.log(`End: (${edge.endX}, ${edge.endY}), Node ${edge.destCircle}`);
            console.log(`Weight: ${edge.weight}`);
            console.log('---');
        }
    }
}


