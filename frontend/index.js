import { backend } from "declarations/backend";

class PongGame {
    constructor() {
        this.canvas = document.getElementById('gameCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.canvas.width = 800;
        this.canvas.height = 400;

        this.paddleWidth = 10;
        this.paddleHeight = 60;
        this.ballSize = 10;

        // Enhanced AI settings
        this.aiReactionSpeed = 0.25; // Increased from 0.12
        this.aiErrorMargin = 8; // Reduced from 15
        this.aiPredictionFactor = 12; // Increased from 8

        this.player1 = {
            y: this.canvas.height / 2 - this.paddleHeight / 2,
            score: 0,
            speed: 7 // Increased from 5.5
        };

        this.player2 = {
            y: this.canvas.height / 2 - this.paddleHeight / 2,
            score: 0,
            speed: 5
        };

        this.ball = {
            x: this.canvas.width / 2,
            y: this.canvas.height / 2,
            speedX: 5,
            speedY: 5
        };

        this.keys = {};
        this.gameLoop = null;
        this.isPaused = false;
        this.isGameStarted = false;

        this.sounds = {
            hit: new Audio('https://www.myinstants.com/media/sounds/bonk.mp3'),
            score: new Audio('https://www.myinstants.com/media/sounds/mlg-airhorn.mp3')
        };

        this.setupEventListeners();
        this.updateButtonStates();
    }

    // [Previous methods remain unchanged until updateAI]

    updateAI() {
        // Enhanced prediction based on ball direction
        let predictedY = this.ball.y;
        
        if (this.ball.speedX < 0) {
            // Ball moving towards AI
            predictedY = this.ball.y + (this.ball.speedY * this.aiPredictionFactor);
            
            // Account for bounces
            if (predictedY < 0) {
                predictedY = Math.abs(predictedY);
            } else if (predictedY > this.canvas.height) {
                predictedY = this.canvas.height - (predictedY - this.canvas.height);
            }
            
            // Add minimal randomization
            predictedY += (Math.random() - 0.5) * this.aiErrorMargin;
        } else {
            // Return to center when ball moving away
            predictedY = this.canvas.height / 2;
        }

        const paddleCenter = this.player1.y + (this.paddleHeight / 2);
        
        // More aggressive movement
        if (Math.abs(paddleCenter - predictedY) > this.aiErrorMargin) {
            if (paddleCenter < predictedY) {
                this.player1.y += this.player1.speed * this.aiReactionSpeed;
            } else {
                this.player1.y -= this.player1.speed * this.aiReactionSpeed;
            }
        }

        // Keep paddle within bounds
        if (this.player1.y < 0) this.player1.y = 0;
        if (this.player1.y > this.canvas.height - this.paddleHeight) {
            this.player1.y = this.canvas.height - this.paddleHeight;
        }
    }

    // [Rest of the methods remain unchanged]
}

window.onload = () => {
    const game = new PongGame();
    game.updateHighScores();
};
