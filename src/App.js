import React, { Component } from "react";

import './styles/global.css';
import styles from './styles/App.module.css';
import ClueTable from './components/ClueTable';
import Crossword from './components/Crossword';
import ProblemInput from './components/ProblemInput';
import SortedWords from './data/sortedWords';
import TimesUsed from './data/timesUsed';
// import Worker from "./workers/generate.js";

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
    		worker: undefined,
    	};
  	}

  	componentDidMount() {
  		const sortedWords = SortedWords["text"];
  		this.setState({ sortedWords: sortedWords });

		this.setState({ sortedWords: SortedWords["text"] });
  		this.setState({ data: this.generateClearBoard() });
  	}

  	generateClearBoard() {
  		let board = [];
  		for (let i = 0; i < this.state.size; i++) {
  			let row = [];
  			for (let j = 0; j < this.state.size; j++) {
  				row.push("");
  			}
  			board.push(row);
  		}
  		return board;
  	}

  	generateData = () => {
  		const clearBoard = this.generateClearBoard()


  		let oldWorker = this.state.worker;
  		if (oldWorker !== undefined) {
	  		oldWorker.terminate();
	  		oldWorker = undefined;
	  		this.setState({ worker: oldWorker });
	  	}

  		let worker = new window.Worker("./generate.js");
  		this.setState({ worker: worker });
  		worker.postMessage({ 
  			sortedWords: this.state.sortedWords,
  			board: clearBoard,
  			size: this.state.size,
  			TimesUsed: TimesUsed,
  			Frequencies: Frequencies,
  			frequenciesDenom: this.state.frequenciesDenom,
  			Dictionary: Dictionary,
  		});

  		let thisComponent = this;
  		worker.onmessage = function(e) {
  			thisComponent.setState({ data: e.data.data, clues: e.data.clues });

  			worker.terminate();
  			worker = undefined;
  			thisComponent.setState({ worker: worker });
  		}
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
