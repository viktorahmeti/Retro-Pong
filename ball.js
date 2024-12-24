import Canvas from './canvas.js';

class BouncingBallCanvas extends Canvas {
    radius;
    velocityX;
    velocityY;
    x;
    y;
    plate;
    gameOverCallback;
    onPoint;

    constructor(plate, gameOverCallback, onPoint){
        super('bouncing-ball');
        this.plate = plate;
        this.gameOverCallback = gameOverCallback;
        this.onPoint = onPoint;
        this.initState();
    }

    initState = () => {
        this.radius = 30;
        [this.x, this.y] = [Math.floor(this.width / 2), this.height - this.radius - this.plate.hoverHeight - this.plate.plateHeight];
        this.velocityX = 0;
        this.velocityY = 0;
        this._draw();
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

    _draw = (time) => {
        if (!this.animation && time !== undefined){
            this.animation = window.requestAnimationFrame(this._draw);
        }
        else{
            window.cancelAnimationFrame(this.animation);
        }

        this.ctx.clearRect(0, 0, this.width, this.height);

        if (time !== undefined){
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
            }
    
            if (this.y <= this.radius){
                this.velocityY = -this.velocityY;
                return;
            }
    
            if (
                this.y >= this.height - this.radius - this.plate.hoverHeight - this.plate.plateHeight && 
                this.x >= this.plate.x && this.x <= this.plate.x + this.plate.plateWidth
            ){
                this.velocityY = -this.velocityY;
                this.velocityX += 0.1 * this.plate.velocity;
            }
    
            if (this.y > this.height - this.radius - this.plate.hoverHeight - this.plate.plateHeight){
                window.cancelAnimationFrame(this.animation);
                this.animation = null;
                this.gameOverCallback();
                return;
            }

            if (this.y == this.height - this.radius - this.plate.hoverHeight - this.plate.plateHeight){
                this.onPoint();
            }
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
        let velocityX = Math.floor(5 + Math.random() * 10);

        if (Math.random() > 0.5){
            velocityX = -velocityX;
        }

        return [velocityX, -15];
    }
}

export default BouncingBallCanvas;