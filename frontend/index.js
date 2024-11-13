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
        this.aiReactionSpeed = 0.15; // Increased from 0.1
        this.aiErrorMargin = 10; // Reduced from 20
        this.player1 = {
            y: this.canvas.height / 2 - this.paddleHeight / 2,
            score: 0,
            speed: 6 // Increased from 5
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
        // Only move when ball is coming towards AI
        if (this.ball.speedX < 0) {
            // Predict ball's Y position at paddle's X position
            const timeToReach = this.ball.x / -this.ball.speedX;
            let predictedY = this.ball.y + (this.ball.speedY * timeToReach);
            
            // Account for bounces
            while (predictedY < 0 || predictedY > this.canvas.height) {
                if (predictedY < 0) {
                    predictedY = -predictedY;
                } else if (predictedY > this.canvas.height) {
                    predictedY = 2 * this.canvas.height - predictedY;
                }
            }

            // Add small random error to make AI more human-like
            predictedY += (Math.random() - 0.5) * this.aiErrorMargin;
            
            const paddleCenter = this.player1.y + (this.paddleHeight / 2);
            
            // Move paddle towards predicted position
            if (Math.abs(paddleCenter - predictedY) > this.aiErrorMargin) {
                if (paddleCenter < predictedY) {
                    this.player1.y += this.player1.speed * this.aiReactionSpeed;
                } else {
                    this.player1.y -= this.player1.speed * this.aiReactionSpeed;
                }
            }
        } else {
            // Return to center when ball is moving away
            const centerY = this.canvas.height / 2 - this.paddleHeight / 2;
            if (Math.abs(this.player1.y - centerY) > this.paddleHeight / 2) {
                if (this.player1.y > centerY) {
                    this.player1.y -= this.player1.speed * this.aiReactionSpeed;
                } else {
                    this.player1.y += this.player1.speed * this.aiReactionSpeed;
                }
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
