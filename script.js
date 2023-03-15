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
    graph = new Graph();
    graph.display2dArray();
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
        this.shortestPathCheckbox = createCheckbox(' Find Path', false);
        this.checkboxes = [this.nodeCheckbox, this.edgeCheckbox, this.shortestPathCheckbox];
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
        this.shortestPathCheckbox.position(this.x, this.y + 60);
    }
}


class Edge {
    constructor(startX, startY, endX, endY, weight) {
        this.startX = startX;
        this.startY = startY;
        this.endX = endX;
        this.endY = endY;
        this.weight = weight;
    }
}

class Graph {
    constructor() {
        this.noOfEdges = circles.length;
        this.edgesMatrix = [];
            for (let i = 0; i < this.noOfEdges; i++) {
                this.edgesMatrix[i] = [];
                for (let j = 0; j < this.noOfEdges; j++) {
                    if(circles[i].x === edges[j].startX && circles[i].y === edges[j].startY) {
                        
                    }
                    this.edgesMatrix[i][j] = i + j;
                }
            }
    }

    display2dArray() {
        // Dipslay 2-D array
        for (let i = 0; i < this.noOfEdges; i++) {
            for (let i = 0; i < this.noOfEdges; i++) {
                for (let j = 0; j < this.noOfEdges; j++) {
                    console.log(this.edgesMatrix[i][j]);
                }
                console.log(`\n`);
            }
        }
    }
}


