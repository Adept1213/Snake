let config = {
    width : document.documentElement.clientWidth,
    height : document.documentElement.clientHeight - 70,

    colorSnake : 'green',
    colorFood : 'yellow',

    speedSnake : 100,
    speedFood : 5000,

    score : 0,

    direction : null,   
}

let canvas = document.getElementById('canvas'),
ctx = canvas.getContext('2d');

let interval;
function fillBoard () {
    canvas.width = config.width;
    canvas.height = config.height;
    ctx.fillStyle = 'rgb(9, 24, 68)';
    ctx.fillRect(0, 0, config.width, config.height );
}
function random (min, max) {
    return Math.round(min + Math.random() * (max - min));
}
function draw (obj, event) {
    fillBoard();
    obj.eat(food);
    food.create();
    obj.move(event);
    obj.create(); 
    clash();
}
function  clash () {
    for ( let i = 1; i < snake.arr.length; i++) {
        if ( snake.arr[0][0] == snake.arr[i][0] && snake.arr[0][1] == snake.arr[i][1]) {
            clearInterval (interval)
        }
    }
}


let food = {
    w  : 15,
    h : 15,
    color : config.colorFood,
    bool : true,
    arr : [],

    create () {
        //add random coordinate in array  every 10sec 
        if (this.bool) {
            this.arr.push([random(0, config.width - 20), random (0, config.height - 20)]);
            this.bool = false;
            setTimeout(() => {
                this.bool = true;
            }, config.speedFood);
        }
        // draw food
        for ( let i = 0; i < this.arr.length; i++) {
            ctx.fillStyle  = this.color;
            ctx.fillRect (this.arr[i][0], this.arr[i][1], this.w, this.h);
        }      
    }
}

let snake =  {

    h : 20,
    w : 20,
    color : config.colorSnake,
    arr : [
        [config.width / 2, config.height / 2],
        [config.width / 2 + 20, config.height / 2],
        [config.width / 2 + 40, config.height / 2],
        [config.width / 2 + 60, config.height / 2],
    ],

    create () {  
        for ( let i = 0; i < this.arr.length; i++){
            i == 0 ? ctx.fillStyle = 'rgb(90, 62, 0)' : ctx.fillStyle = this.color;            
            ctx.fillRect (this.arr[i][0], this.arr[i][1], this.w, this.h );
        }      
    },

    move ( event ) {
        let left = this.arr[0][0];
        let top  = this.arr[0][1];

        event == 'KeyA' ? left -= 20 : left;
        event == 'KeyD' ? left += 20 : left;
        event == 'KeyW' ? top -= 20 : top;
        event == 'KeyS' ? top += 20 : top;

        left > config.width  ? left = 0 : left;
        left < 0? left = config.width : left;
        top > config.height ? top = 0 : top;
        top < 0 ? top = config.height : top; 

        this.arr.unshift([left, top]);
        this.arr.pop();

        this.saveDirection(event);
    },

    saveDirection (event) {
        event == 'KeyW' ? config.direction = 'KeyS' :
        event == 'KeyS' ? config.direction = 'KeyW' :
        event == 'KeyA' ? config.direction = 'KeyD' :
        event == 'KeyD' ? config.direction = 'KeyA' : null
    }, 

    eat (obj) {
        
        for ( let i = 0; i < obj.arr.length; i++ ) {
            if ( ((obj.arr[i][0] + 15 > this.arr[0][0]) && (obj.arr[i][0] - 15 < this.arr[0][0]) 
                && (obj.arr[i][1] + 15 > this.arr[0][1]) && (obj.arr[i][1] - 15 < this.arr[0][1])) ) {

                    obj.arr.splice(i, 1);

                    let left = this.arr[0][0];
                    let top  = this.arr[0][1];
                    this.arr.unshift([left, top]);

                    config.score++;
                    score.textContent = `Score - ${config.score}`
            }
        }
    }

}


draw(snake);

interval = setInterval (draw, config.speedSnake, snake, 'KeyA');

document.addEventListener ( 'keydown', event => {
    if ( (event.code == 'KeyS' || event.code == 'KeyW' || event.code == 'KeyA' || event.code == 'KeyD') && (event.code != config.direction) ){
        clearInterval (interval);
        interval = setInterval ( draw, config.speedSnake, snake, event.code);
    }

})

restart.onclick = () => {
    clearInterval (interval);
    config.score = 0;
    score.textContent = `Score - ${config.score}`;
    food.arr = [];
    snake.arr = [
        [config.width / 2, config.height / 2],
        [config.width / 2 + 20, config.height / 2],
        [config.width / 2 + 40, config.height / 2],
        [config.width / 2 + 60, config.height / 2],
    ];
    interval = setInterval (draw, config.speedSnake, snake, 'KeyA');

}


