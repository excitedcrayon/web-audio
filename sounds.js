
window.addEventListener('DOMContentLoaded', () => {
    new AudioVisuals('Johnny.mp3','Johnny - Josiah De Disciple');
});

/* // uncomment for a very fun bug :)
['DOMContentLoaded','resize'].forEach(event => {
    window.addEventListener(event, () => {
        new AudioVisuals('chiptune.mp3');
    });
});*/

let x = 0;
class AudioVisuals {
    constructor(audioTrackName, audioTitle) {
        this.canvas = document.querySelector('.visualizer');
        this.context = this.canvas.getContext('2d');

        this.audio1 = new Audio();
        this.audio1.src = audioTrackName;

        this.audioText = document.querySelector('.audio-text span');
        this.audioTitle = audioTitle;

        this.audioContext = new(window.AudioContext || window.webkitAudioContext)();

        this.audioSource = null;
        this.analyser = null;

        this.bufferLength = null;
        this.dataArray = null;
        this.barWidth = null;
        this.barHeight = null;

        this.phyllsYellowFillStyle = `rgb(243,204,15)`;
        this.phyllsCyanFillStyle = `rgb(38, 192, 201)`;
        this.josiahLightOrange = `#F09B40`;
        this.josiahOrange = `#C2452E`;

        this.controls = document.querySelectorAll('.controls button');

        this.volumeControl = document.querySelector('.volume input[type="range"]');
        this.volumeControlPercent = document.querySelector('.volume span');

        this.mainMethod();
    }
    mainMethod() {
        this.canvasDimensions();
        this.setWebAudioVariables();
        this.calculateVisualBarDimensions();
        this.controller();
        this.setAudioTrackTitle();
        this.setCanvasBackground();
        this.setAudioVolume();
        this.setAudioVolumePercentage();
        this.animate();
    }
    canvasDimensions() {
        window.addEventListener('resize', () => {
            console.log('resizing');
            this.canvas.width = window.innerWidth;
            this.canvas.height = window.innerHeight;
        });
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }
    controller() {
        this.controls.forEach(button => {
            button.addEventListener('click', () => {
                if (button.className === 'play') {
                    this.audioContext.resume();
                    this.audio1.play();
                } else if (button.className === 'pause') {
                    this.audio1.pause();
                } else if (button.className === 'stop') {
                    this.audio1.pause();
                    this.audio1.currentTime = 0;
                }
            });
        });
        this.audio1.addEventListener('ended', () => {
            console.log('Song has ended');
        });
        this.volumeControl.addEventListener('load', (event) => {
            console.log('loaded');
        });
        this.volumeControl.addEventListener('change', (event) => {
            this.audio1.volume = event.currentTarget.value / 100;
            this.setAudioVolumePercentage();
        });
    }
    setAudioTrackTitle(){
        this.audioText.innerHTML = `${this.audioTitle}`;
    }
    setCanvasBackground(){
        let bgImage = new Image();
        bgImage.src = 'makoela.jpeg';
        this.context.drawImage(bgImage,0,0);
    }
    setAudioVolume() {
        this.audio1.volume = (this.volumeControl.value) / 100;
    }
    setAudioVolumePercentage() {
        this.volumeControlPercent.innerHTML = ``;
        this.volumeControlPercent.innerHTML = `${this.volumeControl.value}%`;
    }
    setWebAudioVariables() {
        this.audioSource = this.audioContext.createMediaElementSource(this.audio1);
        this.analyser = this.audioContext.createAnalyser();
        this.audioSource.connect(this.analyser);
        this.analyser.connect(this.audioContext.destination);
    }
    calculateVisualBarDimensions() {
        this.analyser.fftSize = 64; // how many data points we collect from the sound
        this.bufferLength = this.analyser.frequencyBinCount; // how many data points we have used based on the fftsize. frequencyBinCount is always half of fftSize
        this.dataArray = new Uint8Array(this.bufferLength); // hold all the data points that we collect from the sound
        this.barWidth = (this.canvas.width / this.bufferLength * 1.5);
    }
    animate() {
        x = 0;
        let gradient = this.setGradient();
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.analyser.getByteFrequencyData(this.dataArray);
        for (let i = 0; i < this.bufferLength; i++) {
            this.barHeight = this.dataArray[i];
            gradient.addColorStop(0, this.josiahLightOrange);
            gradient.addColorStop(1, this.josiahOrange);
            // this.setBarColor(this.context, this.phyllsYellowFillStyle);
            this.setBarColor(this.context, gradient);
            this.context.fillRect(x, this.canvas.height - this.barHeight, this.barWidth, this.barHeight);
            x += this.barWidth;
        }
        requestAnimationFrame(this.animate.bind(this));
        // or requestAnimationFrame(() => this.animate())
    }
    setBarColor(context, color) {
        context.fillStyle = color;
    }
    setGradient() {
        return this.context.createLinearGradient(0, 0, 170, 0);
    }
}