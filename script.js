let cnv;
let checkboxes;
let circles = []; // Array to store the circles
let edges = []; // Array to store the edges
let startingCircle;
let endCircle;
let edge; // edge variable to hold details inside drawing edges
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
    // Loop through the array and display all the circles
    for (let i = 0; i < circles.length; i++) {
        let circle = circles[i];
        // noFill();
        if (circle == startingCircle) {
            fill(255, 0, 0); // Set fill color to red if selected
        }
        else if (circle == endCircle) {
            fill(0, 255, 0);
        }
        else { fill(40, 40, 40); }
        stroke(255);
        strokeWeight(2);
        ellipse(circle.x, circle.y, 50, 50);


        textAlign(CENTER, CENTER);
        textSize(32);
        fill(255);
        noStroke();
        text(i + 1, circle.x, circle.y);

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

function mousePressed() {
    // creating nodes
    if (isMouseClickedInsideCanvas() && checkboxes.nodeCheckbox.checked() && !checkboxes.edgeCheckbox.checked() && !checkboxes.shortestPathCheckbox.checked() && mouseIsPressed) {
        let circle = {
            x: mouseX,
            y: mouseY,
            number: circles.length + 1
        };
        circles.push(circle);
    }

    // drawing edges
    if (isMouseClickedInsideCanvas() && !checkboxes.nodeCheckbox.checked() && checkboxes.edgeCheckbox.checked() && !checkboxes.shortestPathCheckbox.checked()) {
        if (mousePressed) {
            for (let i = 0; i < circles.length; i++) {
                let circle = circles[i];
                let d = dist(mouseX, mouseY, circle.x, circle.y);
                if (d < 25) {
                    // If the mouse is inside the circle, select it
                    startingCircle = circle;
                    // startingCircle.fillColor(255,0,0);
                    edge = new Edge(startingCircle.x, startingCircle.y);
                    break;
                }
            }
            if(mouseReleased)
            {
                for (let i = 0; i < circles.length; i++) {
                    let circle = circles[i];
                    let d = dist(mouseX, mouseY, circle.x, circle.y);
                    if (d < 25) {
                        // If the mouse is inside the circle, select it
                        endCircle = circle;
                        // endCircle.fillColor(0,255,0);
                        console.log(`End circle detected`);
                        edge.endX = endCircle.x;
                        edge.endY = endCircle.y;
                        break;
                    }
                }
            }
        }

        // let edge = new Edge()
    }
}


class CheckBoxes {
    constructor(x, y) {
        this.nodeCheckbox = createCheckbox(' Draw Node', false);
        this.edgeCheckbox = createCheckbox(' Draw Edge', false);
        this.shortestPathCheckbox = createCheckbox(' Find Path', false);
        this.x = x;
        this.y = y;
    }

    display() {
        this.nodeCheckbox.position(this.x, this.y);
        this.edgeCheckbox.position(this.x, this.y + 30);
        this.shortestPathCheckbox.position(this.x, this.y + 60);
    }

    // isNodeChecked() {
    //     if (this.nodeCheckbox.checked()) { return true; }
    // }
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