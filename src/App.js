import React, { Component } from "react";

import './styles/global.css';
import styles from './styles/App.module.css';
import ClueTable from './components/ClueTable';
import Crossword from './components/Crossword';
import ProblemInput from './components/ProblemInput';
import SortedWords from './data/sortedWords';

// Dictionary is from https://github.com/matthewreagan/WebstersEnglishDictionary
import Dictionary from './data/dictionary_compact';

class App extends Component {
  	constructor(props) {
    	super(props);

    	this.state = {
    		size: 4,
    		clues: [],
    		data: [],
    	};
  	}

  	componentDidMount() {
  		// put in generate data
  		// console.log(Dictionary["apple"].split(".")[1])
  		// let i = 0
  		// for (const word in Dictionary) {
  		// 	console.log(word)
  		// 	i++
  		// 	if (i > 30) break
  		// }

  		const sortedWords = SortedWords["text"];

  		// Create the initial empty board
  		let board = [];
  		for (let i = 0; i < this.state.size; i++) {
  			let row = [];
  			for (let j = 0; j < this.state.size; j++) {
  				row.push("");
  			}
  			board.push(row);
  		}

  		// Do DFS, fill the board
  		let wordCounter = 0;
  		let row = 0;
  		let col = 0;
  		let rowOrCol = 0;
  		let foundWord = false;
  		while (wordCounter < sortedWords.length && (row < this.state.size || col < this.state.size)) {
  			const word = sortedWords[wordCounter];
  			if (word.length === this.state.size) { // Fits in board (in simplified nxn case)
  				// Check that the word works with the rest of the board
  				let fits = true;
  				for (let i = 0; i < word.length; i++) {
  					let boardLetter;
  					if (rowOrCol % 2 === 0) { // Trying a row
  						boardLetter = board[row][i];
  					} else { // Trying a col
  						boardLetter = board[i][col];
  					}
  					console.log(rowOrCol, word, boardLetter, word[i])
  					if (boardLetter != "" && boardLetter != word[i]) fits = false;
  				}

  				if (fits) {
  					for (let i = 0; i < word.length; i++) {
	  					if (rowOrCol % 2 === 0) { // Trying a row
	  						board[row][i] = word[i];
	  					} else { // Trying a col
	  						board[i][col] = word[i];
	  					}
	  				}
	  				foundWord = true;
  				}
  				console.log(board)
  			}

  			if (foundWord) {
	  			if (rowOrCol % 2 === 0) { // Filled in a row
	  				if (col < this.state.size) { // We haven't filled all columns, so switch rowOrCol
	  					rowOrCol++;
	  				}
	  				row++;
	  			} else { // Filled in a col
	  				if (row < this.state.size) { // We haven't filled all rows, so switch rowOrCol
	  					rowOrCol++;
	  				}
	  				col++;
	  			}
	  			foundWord = false;
	  		}

  			wordCounter++;
  		}

  		this.generateData();
  	}

  	generateData = () => {
  		let size = this.state.size;
  		let clues = [];
  		for (let i = 0; i < size * 2; i++) {
  			let clue = "Test clue";
  			clues.push(clue);
  		}
  		this.setState({ clues: clues });

  		let data = [];
  		for (let i = 0; i < size; i++) {
  			let row = [];
  			for (let j = 0; j < size; j++) {
  				row.push(Math.floor(Math.random() * size * size));
  			}
  			data.push(row);
  		}
  		this.setState({ data: data });
  	}

  	render() {
  		return(
  			<div className={styles.container}>
  				<div className={styles.contentContainer}>
  					<div className={styles.clueTableContainer}>
  						<ClueTable
  							data={this.state.clues}
  						/>
  					</div>
	  				<div className={styles.crosswordContainer}>
	  					<Crossword
	  						size={this.state.size}
	  						data={this.state.data}
	  					/>
	  				</div>
	  				<div className="buttonContainer">
	            		<input
	              			type="Submit"
	              			className="button"
	              			value="Generate"
	              			onClick={this.generateData}
	            		/>
	            		<div className="buttonShadow" />
	          		</div>
	          		<ProblemInput />
	        	</div>
  			</div>
  		);
  	}
}

export default App;
