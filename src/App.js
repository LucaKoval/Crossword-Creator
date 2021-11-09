import React, { Component } from "react";

import './styles/global.css';
import styles from './styles/App.module.css';
import ClueTable from './components/ClueTable';
import Crossword from './components/Crossword';
import ProblemInput from './components/ProblemInput';

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
	  				<div className={styles.buttonContainer}>
	            		<input
	              			type="Submit"
	              			className={styles.button}
	              			value="Generate"
	              			onClick={this.generateData}
	            		/>
	            		<div className={styles.buttonShadow} />
						<ProblemInput/>
	          		</div>
	        	</div>
  			</div>
  		);
  	}
}

export default App;
