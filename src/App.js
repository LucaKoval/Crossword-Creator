import React, { Component } from "react";

import './styles/global.css';
import styles from './styles/App.module.css';
import ClueTable from './components/ClueTable';
import Crossword from './components/Crossword';
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

    	this.START_SIZE = 3;

    	this.state = {
    		size: this.START_SIZE,
    		clues: [],
    		board: [],
    		sortedWords: [],
    		frequenciesDenom: 40000,
    		worker: undefined,
			inProgress: false,
			generationTime: 0,
    	};

    	this.handleSizeChange = this.handleSizeChange.bind(this);
  	}

  	componentDidMount() {
		this.setState({ sortedWords: SortedWords["text"] });
  		this.setState({ board: this.generateClearBoard(this.START_SIZE) });
  	}

  	generateClearBoard(size) {
  		let board = [];
  		for (let i = 0; i < size; i++) {
  			let row = [];
  			for (let j = 0; j < size; j++) {
  				row.push("");
  			}
  			board.push(row);
  		}
  		return board;
  	}

  	generateData = () => {
  		if (!this.state.inProgress) {
			const startTime = Math.trunc(performance.now());
			this.setState({ inProgress: true });
	  		const clearBoard = this.generateClearBoard(this.state.size)


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
				const endTime = Math.trunc(performance.now());
				const totalTime = (endTime-startTime)/1000;

				worker.terminate();
	  			worker = undefined;

	  			thisComponent.setState({ 
					board: e.data.data, 
					clues: e.data.clues,
					inProgress: false,
					worker: worker,
					generationTime: totalTime,
				});
	  		}
	  	}
  	}

  	handleSizeChange = (e) => {
  		const size = e.nativeEvent.data;
  		if (size !== null && Number(size) > 0) {
  			const numSize = Number(size);
  			this.setState({ board: this.generateClearBoard(numSize), size: numSize });
  		}
  	}

  	render() {
  		return(
  			<div className={styles.container}>
  				<div className={styles.contentContainer}>
	  				<div className={styles.crosswordContainer}>
	  					<Crossword
	  						size={this.state.size}
	  						board={this.state.board}
	  					/>
	  				</div>
	  				<div className="inputContainer">
	  					<input
	  						type="number"
	  						className="input"
	  						placeholder="3"
	  						value={this.state.size}
	  						onChange={this.handleSizeChange}
	  					/>
	  				</div>
	  				<div className="buttonContainer">
	            		<input
	              			type="Submit"
	              			className={this.state.inProgress ? "inactiveButton" : "button"}
	              			value={this.state.inProgress ? "In progress" : "Generate new"}
	              			onClick={this.generateData}
	            		/>
	            		<div className={this.state.inProgress ? "inactiveShadow" : "buttonShadow"} />
	          		</div>
	          		<p>
						Time to generate: {this.state.generationTime} seconds
					</p>
	          		{ this.state.clues.length > 0 && <div className={styles.clueTableContainer}>
  						<ClueTable
  							data={this.state.clues}
  						/>
  					</div> }
	        	</div>
  			</div>
  		);
  	}
}

export default App;
