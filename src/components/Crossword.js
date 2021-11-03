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
  		let size = this.props.size;
  		let rows = [];
  		for (let i = 0; i < size; i++) {
  			let cellsInRow = [];
  			for (let j = 0; j < size; j++) {
  				cellsInRow.push(
  					<div
  						className={styles.cellContainer}
  						key={"cell "+i+""+j}
  					>
  						<div className={styles.cell}>
  							{i*size+j}
  						</div>
  					</div>
  				)
  			}
  			rows.push(
  				<div
  					className={styles.row}
  					key={"row"+i}
  				>
  					{cellsInRow}
  				</div>
  			)
  		}
  		return <div className={styles.board}>{rows}</div>
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
