class AudioPlayer{
    constructor(){
        this.audioContext = new (window.AudioContext || window.webkitAudioContext)({ latencyHint: 'interactive' });

        this.song = this._getRandomSong();

        this.lastNoteIndex = -1;

        this.noteToFrequencyMap = new Map();
        this.noteToFrequencyMap.set('C', 55);
        this.noteToFrequencyMap.set('C#', 58.27);
        this.noteToFrequencyMap.set('D', 61.73);
        this.noteToFrequencyMap.set('D#', 65.40);
        this.noteToFrequencyMap.set('E', 69.29);
        this.noteToFrequencyMap.set('F', 73.41);
        this.noteToFrequencyMap.set('F#', 77.78);
        this.noteToFrequencyMap.set('G', 82.40);
        this.noteToFrequencyMap.set('G#', 87.30);
        this.noteToFrequencyMap.set('A', 92.49);
        this.noteToFrequencyMap.set('A#', 97.99);
        this.noteToFrequencyMap.set('B', 103.82);
    }

    beep = () => {
        if (this.audioContext.state === 'suspended') {
            this.audioContext.resume();
        }

        let oscillator = this.audioContext.createOscillator();
        let gainNode = this.audioContext.createGain();
    
        // Connect the nodes
        oscillator.connect(gainNode);
        gainNode.connect(this.audioContext.destination);
    
        // Use a square wave for a retro feel
        oscillator.type = 'square';

        // Set the frequency (adjust for different pitches)
        oscillator.frequency.setValueAtTime(this._getNextBeepFrequency(), this.audioContext.currentTime); // C5 note

        // Control the volume
        gainNode.gain.setValueAtTime(0.1, this.audioContext.currentTime); // Start volume
        gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.2); // Fade out

        // Start and stop the oscillator
        oscillator.start(this.audioContext.currentTime);
        oscillator.stop(this.audioContext.currentTime + 0.2);
    }

    _getNextBeepFrequency = () => {
        let noteIndex;
        if (this.lastNoteIndex == null || this.lastNoteIndex == this.song.length - 1)
            noteIndex = 0;
        else
            noteIndex = this.lastNoteIndex + 1;

        let note = this.song[noteIndex];
        
        let letter = note[0];
        let octave = parseInt(note[1]);

        let frequency = this.noteToFrequencyMap.get(letter) * Math.pow(2, octave - 1);

        this.lastNoteIndex = noteIndex;

        return frequency;
    }

    updateSong = () => {
        this.song = this._getRandomSong();
        this.lastNoteIndex = null;
    }

    _getRandomSong = () => {
        let songs = [
            //Fur elise
            'E5 D#5 E5 D#5 E5 B4 D5 C5 A4 C4 E4 A4 B4 E4 G#4 B4 C5 A4',
            //Himni i Flamurit
            'D4 G4 D4 A3 D4 G4 A4 B4 G4 G4 F#4 G4 A4 G4 A4 D5 B4 D4 G4 D4 A3 D4 G4 A4 B4 G4 G4 F#4 G4 A4 G4 E4 F#4 D4 D4 A4 A4 G#4 A4 B4 C5 D5 B4 G4 G4 F#4 G4 A4 B4 C5 D5 E5 E5 D5 B4 C5 A4 B4 A4 B4 C5 D5 E5 D5 B4 C5 B4 A4 A4 G4 E5 D5 B4 C5 B4 A4 A4 G4',
            //6ths
            'E4 C5 C5 E4 E4 C5 C5 E4 F4 E4 D4 D4 D4 B4 B4 D4 D4 B4 B4 D4 E4 D4 C4 C4 C4 A4 A4 C4 C4 A4 A4 C4 D4 C4 B3 B3 B3 G#4 G#4 G#4 A4 B4'
        ];

        return songs[Math.floor(Math.random() * songs.length)].split(' ').map(s => [s.substring(0, s.length - 1), s[s.length - 1]]);
    }

    error = () => {
        if (this.audioContext.state === 'suspended') {
            this.audioContext.resume();
        }
    }
}

export default new AudioPlayer();