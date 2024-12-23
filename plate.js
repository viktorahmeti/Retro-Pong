import Canvas from './canvas.js';

class PlateCanvas extends Canvas {
    velocity;
    plateHeight;
    plateWidth;
    x;
    sensitivity = 15;
    background;

    constructor(background){
        super('plate');
        this.background = background;
        this.initState();
    }

    initState = () => {
        this.velocity = 0;
        this.plateHeight = 20;
        if (window.isTouch){
            this.hoverHeight = 128;
        }
        else{
            this.hoverHeight = 32;
        }
        this.defaultPlateWidth = Math.max(30, Math.min(200, this.width / 3));
        this.plateWidth = this.defaultPlateWidth;
        this.x = Math.floor((this.width - this.plateWidth) / 2);
        this._draw();
    }

    move = (clientX) => {
        this.x = Math.max(0, Math.min(clientX - this.plateWidth / 2, this.width - this.plateWidth))
    }

    _draw = (time) => {
        if (time !== undefined){
            this.animation = window.requestAnimationFrame(this._draw);
        }
        else{
            window.cancelAnimationFrame(this.animation);
        }

        this.ctx.clearRect(0, 0, this.width, this.height);

        if (time !== undefined && !window.isTouch){
            this.plateWidth = this.defaultPlateWidth;
            this.x = Math.max(0, Math.min(this.x + this.velocity, this.width - this.plateWidth))
        }

        this._drawPlate();
    }

    _drawPlate = () => {
        this.ctx.fillRect(this.x, this.height - this.hoverHeight - this.plateHeight, this.plateWidth, this.plateHeight);
    }
}

export default PlateCanvas;