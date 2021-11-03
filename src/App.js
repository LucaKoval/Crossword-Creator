import React, { Component } from "react";

import './styles/global.css';
import styles from './styles/App.module.css';
import Crossword from './components/Crossword';


class App extends Component {
  	constructor(props) {
    	super(props);

    	this.state = {
    		size: 4,
    		data: [],
    	};
  	}

  	componentDidMount() {
  		this.generateData();
  	}

  	generateData = () => {
  		let size = this.state.size;
  		let data = [];
  		for (let i = 0; i < size; i++) {
  			let row = [];
  			for (let j = 0; j < size; j++) {
  				row.push(Math.floor(Math.random() * 4 * size));
  			}
  			data.push(row);
  		}
  		this.setState({ data: data });
  	}

  	render() {
  		return(
  			<div className={styles.container}>
  				<div className={styles.contentContainer}>
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
	          		</div>
	          	</div>
  			</div>
  		);
  	}
}

export default App;
