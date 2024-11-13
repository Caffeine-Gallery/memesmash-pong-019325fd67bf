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

        this.player1 = {
            y: this.canvas.height / 2 - this.paddleHeight / 2,
            score: 0,
            speed: 5
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
        this.sounds = {
            hit: new Audio('https://www.myinstants.com/media/sounds/bonk.mp3'),
            score: new Audio('https://www.myinstants.com/media/sounds/mlg-airhorn.mp3')
        };

        this.setupEventListeners();
    }

    setupEventListeners() {
        document.addEventListener('keydown', (e) => this.keys[e.key] = true);
        document.addEventListener('keyup', (e) => this.keys[e.key] = false);
        document.getElementById('startGame').addEventListener('click', () => this.start());
    }

    start() {
        if (this.gameLoop) return;
        this.resetGame();
        this.gameLoop = setInterval(() => this.update(), 1000/60);
    }

    resetGame() {
        this.ball.x = this.canvas.width / 2;
        this.ball.y = this.canvas.height / 2;
        this.ball.speedX = 5 * (Math.random() > 0.5 ? 1 : -1);
        this.ball.speedY = 5 * (Math.random() > 0.5 ? 1 : -1);
    }

    update() {
        this.movePaddles();
        this.moveBall();
        this.draw();
    }

    movePaddles() {
        // Player 1 (W/S)
        if (this.keys['w'] && this.player1.y > 0) {
            this.player1.y -= this.player1.speed;
        }
        if (this.keys['s'] && this.player1.y < this.canvas.height - this.paddleHeight) {
            this.player1.y += this.player1.speed;
        }

        // Player 2 (Arrow Up/Down)
        if (this.keys['ArrowUp'] && this.player2.y > 0) {
            this.player2.y -= this.player2.speed;
        }
        if (this.keys['ArrowDown'] && this.player2.y < this.canvas.height - this.paddleHeight) {
            this.player2.y += this.player2.speed;
        }
    }

    async moveBall() {
        this.ball.x += this.ball.speedX;
        this.ball.y += this.ball.speedY;

        // Wall collisions
        if (this.ball.y <= 0 || this.ball.y >= this.canvas.height) {
            this.ball.speedY *= -1;
            this.sounds.hit.play();
        }

        // Paddle collisions
        if (this.checkPaddleCollision()) {
            this.ball.speedX *= -1.1; // Increase speed slightly
            this.sounds.hit.play();
        }

        // Scoring
        if (this.ball.x <= 0) {
            this.player2.score++;
            this.sounds.score.play();
            document.getElementById('player2-score').textContent = this.player2.score;
            if (this.player2.score >= 5) {
                await this.endGame(2);
            } else {
                this.resetGame();
            }
        }
        if (this.ball.x >= this.canvas.width) {
            this.player1.score++;
            this.sounds.score.play();
            document.getElementById('player1-score').textContent = this.player1.score;
            if (this.player1.score >= 5) {
                await this.endGame(1);
            } else {
                this.resetGame();
            }
        }
    }

    async endGame(winner) {
        clearInterval(this.gameLoop);
        this.gameLoop = null;
        
        // Save score to backend
        await backend.saveScore(winner, Math.max(this.player1.score, this.player2.score));
        
        // Update high scores display
        this.updateHighScores();
        
        alert(`Player ${winner} wins!`);
        this.player1.score = 0;
        this.player2.score = 0;
        document.getElementById('player1-score').textContent = '0';
        document.getElementById('player2-score').textContent = '0';
    }

    async updateHighScores() {
        const scores = await backend.getHighScores();
        const highScoresDiv = document.getElementById('highScores');
        highScoresDiv.innerHTML = '<h3>High Scores</h3>' + 
            scores.map(score => `<div>Player ${score.player}: ${score.score}</div>`).join('');
    }

    checkPaddleCollision() {
        // Player 1 paddle
        if (this.ball.x <= this.paddleWidth && 
            this.ball.y >= this.player1.y && 
            this.ball.y <= this.player1.y + this.paddleHeight) {
            return true;
        }
        
        // Player 2 paddle
        if (this.ball.x >= this.canvas.width - this.paddleWidth && 
            this.ball.y >= this.player2.y && 
            this.ball.y <= this.player2.y + this.paddleHeight) {
            return true;
        }
        
        return false;
    }

    draw() {
        // Clear canvas
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        // Draw paddles
        this.ctx.fillStyle = '#ff69b4';
        this.ctx.fillRect(0, this.player1.y, this.paddleWidth, this.paddleHeight);
        this.ctx.fillRect(this.canvas.width - this.paddleWidth, this.player2.y, this.paddleWidth, this.paddleHeight);

        // Draw ball
        this.ctx.beginPath();
        this.ctx.arc(this.ball.x, this.ball.y, this.ballSize, 0, Math.PI * 2);
        this.ctx.fillStyle = '#fff';
        this.ctx.fill();
        this.ctx.closePath();

        // Draw center line
        this.ctx.setLineDash([5, 15]);
        this.ctx.beginPath();
        this.ctx.moveTo(this.canvas.width / 2, 0);
        this.ctx.lineTo(this.canvas.width / 2, this.canvas.height);
        this.ctx.strokeStyle = '#fff';
        this.ctx.stroke();
    }
}

// Initialize game
window.onload = () => {
    const game = new PongGame();
    game.updateHighScores();
};
