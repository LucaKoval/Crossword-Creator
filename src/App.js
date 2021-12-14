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
				
				manyWorkers: [undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined],
				manyInProgress: 0,
				manyTime: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
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

			//deletes the thread & returns the time it took to terminate
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

		generateManyData = () => {
			const startTime = Math.trunc(performance.now());
			this.setState({ manyProgress: 10 });
			const clearBoard = this.generateClearBoard()
			let newWorkers = [undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined];

			//reset all manyWorkers
			for (let i = 0; i < 10; i++) {
				let oldWorker = this.state.manyWorkers[i];
				if (oldWorker !== undefined) {
					oldWorker.terminate();
				}
				this.setState({ manyWorkers: newWorkers });
			}

			
			for  (let i = 0; i < 10; i++) {
				let worker = new window.Worker("./generate.js");
				newWorkers[i] = worker;
				worker.postMessage({ 
					sortedWords: this.state.sortedWords,
					board: clearBoard,
					size: this.state.size,
					TimesUsed: TimesUsed,
					Frequencies: Frequencies,
					frequenciesDenom: this.state.frequenciesDenom,
					Dictionary: Dictionary,
				});

				//deletes the thread & returns the time it took to terminate
				let thisComponent = this;
				worker.onmessage = function(e) {
					worker.terminate();
					let tempWorkers = thisComponent.state.manyWorkers.slice(0);
					tempWorkers[i] = undefined;

					let tempTime = thisComponent.state.manyTime.slice(0);
					const endTime = Math.trunc(performance.now());
					tempTime[i] = (endTime-startTime)/1000;;
					console.log(i);

					thisComponent.setState((prevState) => ({
						manyInProgress: prevState.manyInProgress - 1,
						manyWorkers: tempWorkers,
						manyTime: tempTime,
					}));
				}
			}
			this.setState({ manyWorkers: newWorkers });
  	}

		printManyTime = () => {
			let outputStr = "["
			for (let i = 0; i < 10; i++){
				outputStr = outputStr + this.state.manyTime[i] + "s, ";
			}
			outputStr = outputStr.slice(0, outputStr.length - 2) + "]";
			return outputStr;
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
						<div className="buttonContainer">
							<input
								type="Submit"
								className={(this.state.manyProgress > 0)?"inactiveButton":"button"}
								value={(this.state.manyProgress > 0)
									? this.state.manyProgress + " in progress"
									:"Generate new x10"}
								onClick={this.generateManyData}
							/>
							<div className={(this.state.manyProgress > 0)?"inactiveShadow":"buttonShadow"} />
	          </div>
						<p>
							Time to generate 1: {this.state.generationTime} seconds
						</p>
						<p>
							Time to generate 10: {this.printManyTime()}
						</p>
	        </div>
  			</div>
  		);
  	}
}

export default App;
