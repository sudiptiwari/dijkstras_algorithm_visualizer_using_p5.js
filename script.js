let cnv;
let checkboxes;
let circles = []; // Array to store the circles
function setup() {
    cnv = createCanvas(windowWidth / 1.2, windowHeight / 1.2);
    cnv.position(windowWidth / 2 - width / 2, windowHeight / 2 - height / 2); // set the position of the canvas to the center of the window
    cnv.class('canvas'); // use .canvas { } to style in css

    checkboxes = new CheckBoxes(0, 60); // parameters indicate the position of checkboxes
    checkboxes.display();
    // checkboxes.addClass('checkbox'); // use .checkboxes { } to style in CSS
}

function draw() {
    background(40, 40, 40);
    // mousePressed();
    // Loop through the array and display all the circles
    for (let i = 0; i < circles.length; i++) {
        let circle = circles[i];
        noFill();
        stroke(255);
        strokeWeight(2);
        ellipse(circle.x, circle.y, 50, 50);

        textAlign(CENTER, CENTER);
        textSize(32);
        fill(100);
        noStroke();
        // text(circle.number, circle.x, circle.y);
        text(i+1, circle.x, circle.y);
    }
}

function isMouseClickedInsideCanvas()
{
    if( mouseIsPressed &&
    mouseX >= (windowWidth / 2 - cnv.width / 2) &&
    mouseX <= (windowWidth / 2 + cnv.width / 2) &&
    mouseY >= (windowHeight / 2 - cnv.height / 2) &&
    mouseY <= (windowHeight / 2 + cnv.height / 2) &&
    mouseX <= windowWidth &&
    mouseY <= windowHeight ) {
        return true;
    }
    else
    {
        return false;
    }
}

function mousePressed() {
    if (isMouseClickedInsideCanvas() && checkboxes.nodeCheckbox.checked() && !checkboxes.edgeCheckbox.checked() && !checkboxes.shortestPathCheckbox.checked() && mouseIsPressed) {
        // circle(mouseX, mouseY, 30);
        // circle.display();
        let circle = {
            x: mouseX,
            y: mouseY,
            number: circles.length + 1
        };
        circles.push(circle);
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
    
    isNodeChecked() {
        if (this.nodeCheckbox.checked()) { return true; }
    }
}
