import BackgroundCanvas from './background.js';
import PlateCanvas from './plate.js';
import BouncingBallCanvas from './ball.js';

class Game{
    state = 'before_play';
    background;
    plate;
    bouncingBall;
    gameContainer;

    constructor(){
        this.background = new BackgroundCanvas();
        this.plate = new PlateCanvas(this.background);
        this.bouncingBall = new BouncingBallCanvas(this.plate, this.onGameOver, () => this.background.addPoint());
        this.gameContainer = document.getElementById('game-container')
        
        document.addEventListener('keypress', (e) => {
            if (this.state !== 'before_play'){
                return;
            }

            if (e.key == 'Enter'){
                this.updateState('playing');
            }
        });

        document.addEventListener('keypress', (e) => {
            if (this.state !== 'game_over'){
                return;
            }

            if (e.key == 'Enter'){
                this.background.initState();
                this.plate.initState();
                this.bouncingBall.initState();

                this.updateState('playing');
            }
        });

        document.addEventListener('keydown', (e) => {
            if (this.state !== 'playing'){
                return;
            }

            if (e.key == 'a' || e.keyCode == 37){
                this.plate.velocity = -this.plate.sensitivity;
            }
            else if(e.key == 'd' || e.keyCode == 39){
                this.plate.velocity = this.plate.sensitivity;
            }

            this.plate.animation = window.requestAnimationFrame(this.plate._draw);
        });

        document.addEventListener('keyup', (e) => {
            if (this.state !== 'playing'){
                return;
            }

            if (e.key == 'a' || e.keyCode == 37){
                if (this.plate.velocity == -this.plate.sensitivity){
                    this.plate.velocity = 0;
                }
            }
            else if(e.key == 'd' || e.keyCode == 39){
                if (this.plate.velocity == this.plate.sensitivity){
                    this.plate.velocity = 0;
                }
            }

            window.cancelAnimationFrame(this.plate.animation);
        });

        if (window.isTouch){
            this.gameContainer.addEventListener('touchstart', (e) => {
                if (this.state != 'before_play'){
                    return;
                }

                this.updateState('playing');
            });

            this.gameContainer.addEventListener('touchstart', (e) => {
                if (this.state != 'game_over'){
                    return;
                }

                this.background.initState();
                this.plate.initState();
                this.bouncingBall.initState();
    
                this.updateState('playing');
            });

            this.gameContainer.addEventListener('touchstart', (e) => {
                if (this.state !== 'playing'){
                    return;
                }

                this.plate.move(e.targetTouches[0].clientX)
                this.plate.animation = window.requestAnimationFrame(this.plate._draw);
            });

            this.gameContainer.addEventListener('touchmove', (e) => {
                e.preventDefault();
                if (this.state !== 'playing'){
                    return;
                }

                this.plate.move(e.targetTouches[0].clientX)
                this.plate.animation = window.requestAnimationFrame(this.plate._draw);
            });

            this.gameContainer.addEventListener('touchend', (e) => {
                if (this.state !== 'playing'){
                    return;
                }
                window.cancelAnimationFrame(this.plate.animation);
            });

            this.gameContainer.addEventListener('touchcancel', (e) => {
                if (this.state !== 'playing'){
                    return;
                }
                window.cancelAnimationFrame(this.plate.animation);
            });
        }
    }

    updateState = (newState) => {
        this.state = newState;
        this.background.updateState(newState);
        this.plate.updateState(newState);
        this.bouncingBall.updateState(newState);
    }

    onGameOver = () => {
        this.updateState('game_over');
        //more code here
    }
}

window.isTouch = (('ontouchstart' in window) ||
(navigator.maxTouchPoints > 0) ||
(navigator.msMaxTouchPoints > 0));

window.addEventListener('load', () => new Game());