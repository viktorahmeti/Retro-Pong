import Canvas from './canvas.js';

class BouncingBallCanvas extends Canvas {
    //reference framerate is 60fps
    //frame length = 60/60 = 1 frame per 16.66ms
    //speed of ball is referenced per frame
    radius;
    velocityX;
    velocityY;
    x;
    y;
    plate;
    gameOverCallback;
    onPoint;
    prevFrameTime;

    constructor(plate, gameOverCallback, onPoint){
        super('bouncing-ball');
        this.plate = plate;
        this.gameOverCallback = gameOverCallback;
        this.onPoint = onPoint;
        this.initState();
    }

    initState = () => {
        this.radius = Math.floor(20 + this.width / 500);
        [this.x, this.y] = [Math.floor(this.width / 2), this.height - this.radius - this.plate.hoverHeight - this.plate.plateHeight];
        this.velocityX = 0;
        this.velocityY = 0;
        this._redraw();
    }

    updateState(newState){
        super.updateState(newState);

        if (this.state == 'playing'){
            [this.velocityX, this.velocityY] = this._getRandomVelocities();
            this.animation = window.requestAnimationFrame(this._draw)
        }
        else{
            window.cancelAnimationFrame(this.animation);
        }
    }

    _redraw = () => {
        this.ctx.clearRect(0, 0, this.width, this.height);
        this._drawBall();
    }

    _draw = (time) => {
        this.animation = window.requestAnimationFrame(this._draw);

        if (time - this.prevFrameTime < this.fps)
            return;
        this.prevFrameTime = time;

        this.ctx.clearRect(this.x - this.radius - this.blurSize - 5, this.y - this.radius - this.blurSize - 5, 2 * (this.radius + this.blurSize + 5), 2 * (this.radius + this.blurSize + 5));

        this.x = Math.max(this.radius, Math.min(this.x + this.velocityX, this.width - this.radius));

        //if it's going to hit the plate
        if (this.x + this.radius/2 >= this.plate.x && this.x - this.radius/2 <= this.plate.x + this.plate.plateWidth){
            this.y = Math.max(this.radius, Math.min(this.y + this.velocityY, this.height - this.radius - this.plate.hoverHeight - this.plate.plateHeight));
        }
        else{
            this.y = Math.max(this.radius, this.y + this.velocityY);
        }

        if (this.x >= this.width - this.radius || this.x <= this.radius){
            this.velocityX = -this.velocityX;
            window.beep();
        }

        if (this.y <= this.radius){
            this.velocityY = -this.velocityY;
            window.beep();
            return;
        }

        if (
            this.y >= this.height - this.radius - this.plate.hoverHeight - this.plate.plateHeight && 
            this.x >= this.plate.x && this.x <= this.plate.x + this.plate.plateWidth
        ){
            this.velocityY = -this.velocityY;
            this.velocityX += 0.1 * this.plate.velocity;
            window.beep();
        }

        if (this.y > this.height - this.radius - this.plate.hoverHeight - this.plate.plateHeight){
            window.cancelAnimationFrame(this.animation);
            this.animation = null;
            this.gameOverCallback();
            return;
        }

        if (this.y == this.height - this.radius - this.plate.hoverHeight - this.plate.plateHeight){
            this.onPoint();
            window.beep();
        }

        this._drawBall();
    }

    _drawBall = () => {
        this.ctx.beginPath();
        this.ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
        this.ctx.fill();
        this.ctx.closePath();
    }

    _getRandomVelocities = () => {
        let velocityX = 3 + Math.random() * (this.width * this.fps / 1000 - 3);
        // velocityX = 0;
        if (Math.random() > 0.5){
            velocityX = -velocityX;
        }

        //the diagonal of the screen in 1second
        let diagonal = Math.sqrt(this.height * this.height + this.width * this.width);
        let velocityY = Math.round(-(diagonal * this.fps / 1000));

        return [velocityX, velocityY];
    }
}

export default BouncingBallCanvas;