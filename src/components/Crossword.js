import React, { Component } from "react";

import '../styles/global.css';
import styles from '../styles/Crossword.module.css';


class Crossword extends Component {
  	constructor(props) {
    	super(props);

    	this.state = {
    	};
  	}

  	board = () => {
  		let data = this.props.data;
  		if (data.length > 0) {
	  		let size = this.props.size;
	  		let rows = [];
	  		for (let i = 0; i < size; i++) {
	  			let row = [];
	  			for (let j = 0; j < size; j++) {
	  				row.push(
	  					<div
	  						className={styles.cellContainer}
	  						key={"cell "+i+""+j}
	  					>
	  						<div className={styles.cell}>
	  							{data[i][j]}
	  						</div>
	  					</div>
	  				)
	  			}
	  			rows.push(
	  				<div
	  					className={styles.row}
	  					key={"row"+i}
	  				>
	  					{row}
	  				</div>
	  			)
	  		}
	  		return <div className={styles.board}>{rows}</div>
	  	}
	  	return <div className={styles.board}></div>
  	}

  	render() {
  		return(
  			<div className={styles.container}>
  				{this.board()}
  			</div>
  		);
  	}
}

export default Crossword;
