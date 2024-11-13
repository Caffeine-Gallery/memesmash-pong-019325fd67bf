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
        this.aiReactionSpeed = 0.3; // Increased from 0.1
        this.aiErrorMargin = 5; // Reduced from 20
        this.aiPredictionFactor = 1.2; // New prediction multiplier

        this.player1 = {
            y: this.canvas.height / 2 - this.paddleHeight / 2,
            score: 0,
            speed: 7 // Increased from 5
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

    // ... [previous methods remain unchanged until updateAI]

    updateAI() {
        // Predict ball's future position
        const futureY = this.predictBallPosition();
        const paddleCenter = this.player1.y + (this.paddleHeight / 2);
        
        // Add slight randomization to make AI more human-like
        const randomFactor = (Math.random() - 0.5) * this.aiErrorMargin;
        const targetY = futureY + randomFactor;

        // Calculate optimal movement
        const distance = targetY - paddleCenter;
        const movement = Math.sign(distance) * this.player1.speed * this.aiReactionSpeed;

        // Apply movement with momentum
        this.player1.y += movement;

        // Keep paddle within bounds
        if (this.player1.y < 0) this.player1.y = 0;
        if (this.player1.y > this.canvas.height - this.paddleHeight) {
            this.player1.y = this.canvas.height - this.paddleHeight;
        }
    }

    predictBallPosition() {
        // Only predict when ball is moving towards AI
        if (this.ball.speedX >= 0) {
            return this.canvas.height / 2; // Return to center if ball moving away
        }

        // Calculate time for ball to reach paddle
        const timeToReach = (this.ball.x - this.paddleWidth) / -this.ball.speedX;
        
        // Predict Y position
        let predictedY = this.ball.y + (this.ball.speedY * timeToReach * this.aiPredictionFactor);
        
        // Account for bounces
        const bounces = Math.floor(predictedY / this.canvas.height);
        if (bounces % 2 === 0) {
            predictedY = predictedY % this.canvas.height;
        } else {
            predictedY = this.canvas.height - (predictedY % this.canvas.height);
        }

        return predictedY;
    }

    // ... [rest of the methods remain unchanged]
}

window.onload = () => {
    const game = new PongGame();
    game.updateHighScores();
};
