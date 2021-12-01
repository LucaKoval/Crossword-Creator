import React, { Component } from "react";

import './styles/global.css';
import styles from './styles/App.module.css';
import ClueTable from './components/ClueTable';
import Crossword from './components/Crossword';
import ProblemInput from './components/ProblemInput';
import SortedWords from './data/sortedWords';

// Dictionary is from https://github.com/matthewreagan/WebstersEnglishDictionary
import Dictionary from './data/dictionary_compact';

// Frequencies is from http://pi.math.cornell.edu/~mec/2003-2004/cryptography/subs/frequencies.html
import Frequencies from './data/frequencies';

class App extends Component {
  	constructor(props) {
    	super(props);

    	this.state = {
    		size: 4,
    		clues: [],
    		data: [],
    		sortedWords: [],
    		frequenciesDenom: 40000,
    	};
  	}

  	componentDidMount() {
  		const sortedWords = SortedWords["text"];
  		this.setState({ sortedWords: sortedWords });

  		// Have this not done initially so page can load in
  		this.generateData();
  	}

  	generateData = () => {
  		let sortedWords;
  		if (this.state.sortedWords.length === 0) {
			sortedWords = SortedWords["text"];
  		} else {
  			sortedWords = this.state.sortedWords;
  		}

  		let board = [];
  		for (let i = 0; i < this.state.size; i++) {
  			let row = [];
  			for (let j = 0; j < this.state.size; j++) {
  				row.push("");
  			}
  			board.push(row);
  		}
  		// REMOVE LINE BELOW?
  		this.setState({ data: board });

  		// Do DFS, fill the board
  		let wordCounter = 0;
  		let row = 0;
  		let col = 0;
  		let rowOrCol = 0;
  		let foundWord = false;
  		let counter = 0;
  		let writeOps = [];
  		while (counter < 2000 && (row < this.state.size || col < this.state.size)) {
  		// while (row < this.state.size || col < this.state.size) {
  			// Go back and replace the most-recently placed word
  			if (rowOrCol > 0) {
	  			rowOrCol--; // Get back
	  			const mostRecentOp = writeOps.pop();
	  			mostRecentOp.forEach(location => {
	  				board[location[0]][location[1]] = "";
	  			});

	  			if (rowOrCol % 2 === 0) { // Clear row
	  				row--;
	  			} else { // Clear col
	  				col--;
	  			}
	  		}

	  		while (wordCounter < sortedWords.length && (row < this.state.size || col < this.state.size)) {
	  			// Randomization
	  			if (Math.random() < 0.35) {
	  				// Random int example from https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/random
	  				wordCounter = Math.floor(Math.random() * sortedWords.length)
	  			}
	  			const word = sortedWords[wordCounter];

	  			if (word.length === this.state.size) { // Fits in board (in simplified nxn case)
	  				// Go through probabilistic rejection
	  				let frequenciesProduct = 1;
	  				let frequenciesDenom = this.state.frequenciesDenom;
	  				word.split("").forEach(letter => {
	  					frequenciesProduct *= Frequencies[letter]/frequenciesDenom;
	  				});

	  				// The higher the frequency, the lower the chance of rejecting and the higher the chance of accepting
	  				if (Math.random() < frequenciesProduct*100) { // Accept
	  					// Check that the word works with the rest of the board
		  				let fits = true;
		  				let writeOpRow = [];
		  				for (let i = 0; i < word.length; i++) {
		  					let boardLetter;
		  					if (rowOrCol % 2 === 0) { // Trying a row
		  						boardLetter = board[row][i];
		  						if (boardLetter == "") {
		  							writeOpRow.push([row, i])
		  						}
		  					} else { // Trying a col
		  						boardLetter = board[i][col];
		  						if (boardLetter == "") {
		  							writeOpRow.push([i, col])
		  						}
		  					}

		  					if (boardLetter != "" && boardLetter != word[i]) fits = false;
		  				}

		  				if (fits) { // If the word was placed/is able to be placed
		  					// console.log(word, frequenciesProduct)
		  					writeOps.push(writeOpRow);
		  					for (let i = 0; i < word.length; i++) {
			  					if (rowOrCol % 2 === 0) { // Trying a row
			  						board[row][i] = word[i];
			  					} else { // Trying a col
			  						board[i][col] = word[i];
			  					}
			  				}
			  				foundWord = true;
		  				}
	  				} else {
	  					// console.log("rejected", word, frequenciesProduct)
	  				}
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
	  		wordCounter = 0;
	  		counter++;
	  	}

  		this.setState({ data: board });
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
