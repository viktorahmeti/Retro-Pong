class Canvas{
    constructor(elementId){
        let gameContainer = document.getElementById('game-container');
        this.canvas = document.createElement('canvas');
        this.canvas.setAttribute('id', elementId);
        gameContainer.appendChild(this.canvas);
        this.canvas.width = gameContainer.getBoundingClientRect().width;
        this.canvas.height = gameContainer.getBoundingClientRect().height;

        this.ctx = this.canvas.getContext('2d');
        this.animation = null;
        this.width = this.canvas.width;
        this.height = this.canvas.height;
        this.fps = Math.floor(1000 / 60);

        this.blurSize = 10;

        this.ctx.shadowBlur = this.blurSize;
        this._greenContext();
        this.ctx.font = "bold 80px system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif";
        this.state = 'before_play';
        this.ctx.clearRect(0, 0, this.width, this.height);
    }

    updateState(newState){
        this.state = newState;

        switch(this.state){
            case 'game_over':
                this._redContext();
                break;
            default:
                this._greenContext();
        }

        this._redraw();
    }

    _greenContext = () => {
        this.ctx.shadowColor = '#66FF66';
        this.ctx.fillStyle = '#66FF66';
    }

    _redContext = () => {
        this.ctx.shadowColor = '#FF0000';
        this.ctx.fillStyle = '#FF0000';
    }
}

export default Canvas;