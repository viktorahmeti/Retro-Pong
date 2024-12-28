import Canvas from './canvas.js';

class BackgroundCanvas extends Canvas {
    points;
    message;
    flickerEvery = 2;

    constructor(){
        super('background');
        this.initState();
        this._scheduleRandomFlicker();
    }

    initState = () => {
        this.points = 0;
        if (window.isTouch){
            this.message = 'TAP TO START';
        }
        else{
            this.message = 'PRESS ENTER TO START';
        }
    }

    _redraw = () => {
        this._draw();
    }

    _draw = (time) => {
        this.ctx.clearRect(0, 0, this.width, this.height);

        if (this.state == 'game_over'){
            this.canvas.classList.add('gameover');
        }
        else{
            this.canvas.classList.remove('gameover');
        }

        this._drawFlicker();
        this._drawPoints();
        this._drawMessage();
    }

    addPoint = () => {
        this.points += 1;
        this._draw();
    }

    _scheduleRandomFlicker = () => {
        this._draw();
        setTimeout(this._scheduleRandomFlicker, this._getRandomFlickerMillis());
    }

    _getRandomFlickerMillis = () => {
        return this.flickerEvery * 1000 * Math.random();
    }

    _drawMessage = () => {
        if (this.state == 'before_play'){
            this.ctx.save();
            this.ctx.font = "bold 24px system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif"
            const text = this.ctx.measureText(this.message);
            let textWidth = text.width;
            let textHeight = text.actualBoundingBoxAscent + text.actualBoundingBoxDescent;
            this.ctx.fillText(this.message, Math.floor(this.width/2 - textWidth/2), Math.floor(this.height/2 + textHeight/2));
            this.ctx.restore();
        }
    }

    _drawPoints = () => {
        const text = this.ctx.measureText(this.points);
        let textWidth = text.width;
        let textHeight = text.actualBoundingBoxAscent + text.actualBoundingBoxDescent;

        if (this.state == 'playing' || this.state == 'game_over'){
            this.ctx.fillText(this.points, Math.floor(this.width/2 - textWidth/2), Math.floor(this.height/2 + textHeight/2));
        }
    }

    _drawFlicker() {
        for (let y = 0; y < this.height; y += 4) {
            this.ctx.save();
            this.ctx.fillStyle = `rgba(0, 0, 0, 0.2)`;
            this.ctx.shadowBlur = 5;
            if (Math.random() * this.height < 5){
                this.ctx.fillStyle = `rgba(0, 0, 0, 0.5)`;
            }

            this.ctx.fillRect(0, y, this.width, 2);
            this.ctx.restore();
        }
    }
}

export default BackgroundCanvas;