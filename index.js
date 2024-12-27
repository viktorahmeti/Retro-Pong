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
        this.bouncingBall = new BouncingBallCanvas(this.plate, this.onGameOver, this.onPoint);
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

    onPoint = () => {
        this.plate.shine();
        this.background.addPoint();
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

const audioContext = new (window.AudioContext || window.webkitAudioContext)({ latencyHint: 'interactive' });

window.beep = () => {
    if (audioContext.state === 'suspended') {
        audioContext.resume();
    }

    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    // Connect the nodes
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    // Use a square wave for a retro feel
    oscillator.type = 'square';

    // Set the frequency (adjust for different pitches)
    oscillator.frequency.setValueAtTime(880, audioContext.currentTime); // A5 note

    // Control the volume
    gainNode.gain.setValueAtTime(0.1, audioContext.currentTime); // Start volume
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.2); // Fade out

    // Start and stop the oscillator
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.2);
}