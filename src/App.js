import React, { Component } from "react";

import './styles/global.css';
import styles from './styles/App.module.css';
import ClueTable from './components/ClueTable';
import Crossword from './components/Crossword';
import SortedWords from './data/sortedWords';
import TimesUsed from './data/timesUsed';

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
			genTime: 0,
			genTested: 0,
			genInserted: 0,
			
			manyWorkers: [undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined],
			manyInProgress: 0,
			manyTime: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
			manyTested: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
			manyInserted: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
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

	generateBoard = () => {
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
				TimesUsed: TimesUsed, // Should be a copy, not the sole instance
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
					genTime: totalTime,
					genTested: e.data.tested,
					genInserted: e.data.inserted
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

	generateManyBoards = () => {
		const startTime = Math.trunc(performance.now());
		this.setState({ manyInProgress: 10 });
		const clearBoard = this.generateClearBoard(this.state.size);
		let newWorkers = [undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined];

		//reset all manyWorkers
		for (let i = 0; i < 10; i++) {
			let oldWorker = this.state.manyWorkers[i];
			if (oldWorker !== undefined) {
				oldWorker.terminate();
			}
			this.setState({ manyWorkers: newWorkers });
		}

		
		for (let i = 0; i < 10; i++) {
			let worker = new window.Worker("./generate.js");
			newWorkers[i] = worker;
			worker.postMessage({ 
				sortedWords: this.state.sortedWords,
				board: clearBoard,
				size: this.state.size,
				TimesUsed: TimesUsed, // Should be a copy, not the sole instance
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

				let tempInserted = thisComponent.state.manyInserted.slice(0);
				tempInserted[i] = e.data.inserted;

				let tempTested = thisComponent.state.manyTested.slice(0);
				tempTested[i] = e.data.tested;

				thisComponent.setState((prevState) => ({
					manyInProgress: prevState.manyInProgress - 1,
					manyWorkers: tempWorkers,
					manyTime: tempTime,
					manyInserted: tempInserted,
					manyTested: tempTested
				}));
			}
		}
		this.setState({ manyWorkers: newWorkers });
	}

	printMany = (data) => {
		let outputStr = "["
		for (let i = 0; i < 10; i++){
			outputStr = outputStr + data[i] + ", ";
		}
		outputStr = outputStr.slice(0, outputStr.length - 2) + "]";
		return outputStr;
	}

	avg = (data) => {
		let val = 0;
		let nVals =0;
		for (let i = 0; i < 10; i++){
			if (data[i] > 0){
				val+=data[i];
				nVals++;
			}
		}
		return val/nVals;
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
					{ this.state.clues.length > 0 && <div className={styles.clueTableContainer}>
						<ClueTable
							data={this.state.clues}
						/>
					</div> }
					<div className="buttonContainer">
						<input
								type="Submit"
								className={this.state.inProgress ? "inactiveButton" : "button"}
								value={this.state.inProgress ? "In progress" : "Generate new"}
								onClick={this.generateBoard}
						/>
						<div className={this.state.inProgress ? "inactiveShadow" : "buttonShadow"} />
					</div>
					<div className="buttonContainer">
						<input
							type="Submit"
							className={(this.state.manyInProgress > 0)?"inactiveButton":"button"}
							value={(this.state.manyInProgress > 0)
								? this.state.manyInProgress + " in progress"
								:"Generate new x10"}
							onClick={this.generateManyBoards}
						/>
						<div className={(this.state.manyInProgress > 0)?"inactiveShadow":"buttonShadow"} />
					</div>
					<div className="statsContainer">
						<p>Time to generate 1: {this.state.genTime} seconds</p>
						<p>Words inserted for 1: {this.state.genInserted}</p>
						<p>Words tested for 1: {this.state.genTested}</p>
					</div>
					<div className="statsContainer">
						<p>Time to generate 10 (s): {this.printMany(this.state.manyTime)}</p>
						{/* <p>Words inserted for 10: {this.printMany(this.state.manyInserted)}</p> */}
						<p>Avg words inserted for {10-this.state.manyInProgress}: {this.avg(this.state.manyInserted)}</p>
						{/* <p>Words tested for 10: {this.printMany(this.state.manyTested)}</p> */}
						<p>Avg words tested for {10-this.state.manyInProgress}: {this.avg(this.state.manyTested)}</p>
					</div>
				</div>
			</div>
		);
	}
}

export default App;
