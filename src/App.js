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

    	this.state = {
    		size: 4,
    		clues: [],
    		data: [],
    		sortedWords: [],
    		frequenciesDenom: 40000,
    		worker: undefined,
				inProgress: false,
				generationTime: 0,
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
			const startTime = Math.trunc(performance.now());
			this.setState({ inProgress: true });
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
				const endTime = Math.trunc(performance.now());
				const totalTime = (endTime-startTime)/1000;

				worker.terminate();
  			worker = undefined;

  			thisComponent.setState({ 
					data: e.data.data, 
					clues: e.data.clues,
					inProgress: false,
					worker: worker,
					generationTime: totalTime,
				});
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
	              			className={this.state.inProgress?"inactiveButton":"button"}
	              			value={this.state.inProgress?"In progress":"Generate new"}
	              			onClick={this.generateData}
	            		/>
	            		<div className={this.state.inProgress?"inactiveShadow":"buttonShadow"} />
	          		</div>
	        	</div>
						<p>

							Time to generate: {this.state.generationTime} seconds
						</p>
  			</div>
  		);
  	}
}

export default App;
