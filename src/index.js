import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function Tile(props) {
    return (
        <div className='tile' style={{backgroundColor: props.color, border: props.border}}></div>
    )
}

class Grid extends React.Component {
    render () {
        return (
            <div className='grid'>
                {
                this.props.grid.map(elem => {
                    return elem;
                })}
            </div>
        )
    }
}

class Game extends React.Component {
    constructor (props) {
        super (props);

        this.state = {
            board: this.generateRenderGrid()
        }

        this.snake = new Snake();
        this.food = new Food();
        this.tick();
    }

    generateRenderGrid() {
        let output = [];

        for (let i = 0; i < 36; i++) {
            for (let j = 0; j < 36; j++) {
                output.push(<Tile key={(i * 36) + j} color='#ffffff' border='none'/>)
            }
        }

        return output;
    }

    tick() {
        setInterval(() => {
            this.snake.firstTickMoveDir = this.snake.moveDir;

            if (JSON.stringify(this.snake.moveDir) !== "[0,0]") {
                this.snake.tail.unshift(this.snake.location);
            }

            this.snake.location = {
                x: this.snake.location.x + this.snake.moveDir[0],
                y: this.snake.location.y + this.snake.moveDir[1]
            }

            if (this.snake.location.x < 0 || this.snake.location.x > 35 || this.snake.location.y < 0 || this.snake.location.y > 1286) {
                this.snake = new Snake();
            }

            if (this.snake.location.x + this.snake.location.y === this.food.tile) {
                this.snake.length ++;
                this.food = new Food();
            }
            
            this.clearGrid();
            

            let newBoard = [...this.state.board];
            let newElement = <Tile key={this.snake.location.x + this.snake.location.y} color='#272F17' border='none'/>
            newBoard[this.snake.location.x + this.snake.location.y] = newElement

            newElement = <Tile key={this.food.tile} color="none" border='8px solid #272F17'/>
            newBoard[this.food.tile] = newElement;

            this.snake.tail.forEach((coordinate) => {
                if (coordinate.x === this.snake.location.x && coordinate.y === this.snake.location.y) {
                    this.snake = new Snake();
                    return;
                }
                newElement = <Tile key={coordinate.x + coordinate.y} color='#272F17' border='none'/>
                newBoard[coordinate.x + coordinate.y] = newElement
            });

            if (this.snake.tail.length > this.snake.length) {
                this.snake.tail.pop();
            }
    
            this.setState({
                board: newBoard
            })
        }, 100)
    }

    clearGrid() {
        let newBoard = [...this.state.board]

        this.state.board.forEach((_e, index) => {
            let newElement = <Tile key={index} color='#9BBA5A' border='none'/>
            newBoard[index] = newElement
        })

        this.setState({
            board: newBoard
        })
    }

    render () {
        return (
            <Grid grid={this.state.board}/>
        )
    }
}

class Snake {
    constructor () {
        this.location = {
            x: 0,
            y: 0
        }
        this.tail = []
        this.moveDir = [0, 0];
        this.length = 2
        this.firstTickMoveDir = [];

        document.addEventListener('keydown', (event) => {this.keyDown(event)});
    }

    keyDown(event) {
        const inputMaps = {
            'w': [0, -36],
            'd': [1, 0],
            's': [0, 36],
            'a': [-1, 0]
        }

        if (event.key in inputMaps) {
            if (JSON.stringify(inputMaps[event.key].map(Math.abs)) === JSON.stringify(this.firstTickMoveDir.map(Math.abs))) return;
            this.moveDir = inputMaps[event.key];
        }
    }
}

class Food {
    constructor () {
        this.tile = Math.floor(Math.random() * 1000);
    }
}

// ========================================

ReactDOM.render(<Game />, document.getElementById('root'));