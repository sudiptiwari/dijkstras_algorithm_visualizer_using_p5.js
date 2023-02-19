function setup() {
    let cnv = createCanvas(windowWidth / 1.2, windowHeight / 1.2);
    // cnv.position(100,100);
    cnv.position(windowWidth / 2 - width / 2, windowHeight / 2 - height / 2); // set the position of the canvas to the center of the window
    cnv.class('canvas'); // use .canvas { } to style in css
}

function draw() {
    background(40,40,40);
    ellipse(200, 200, 50, 50);
}