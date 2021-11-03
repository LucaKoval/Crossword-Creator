import React, { Component } from "react";

import './styles/global.css';
import styles from './styles/App.module.css';
import Crossword from './components/Crossword';


class App extends Component {
  	constructor(props) {
    	super(props);

    	this.state = {
    	};
  	}

  	render() {
  		return(
  			<div className={styles.container}>
  				<div className={styles.contentContainer}>
	  				<div className={styles.crosswordContainer}>
	  					<Crossword
	  						size={4}
	  					/>
	  				</div>
	  				<div className={styles.buttonContainer}>
	            		<input
	              			type="Submit"
	              			className={styles.button}
	              			value="Generate"
	              			// onClick={this.onSubmit}
	            		/>
	            		<div className={styles.buttonShadow} />
	          		</div>
	          	</div>
  			</div>
  		);
  	}
}

export default App;
