import React, { Component } from "react";

import '../styles/global.css';
import styles from '../styles/ClueTable.module.css';


class ClueTable extends Component {
  	constructor(props) {
    	super(props);

    	this.state = {
    	};
  	}

  	table = () => {
  		let data = this.props.data;
  		if (data.length > 0) {
  			let rows = [];
	  		for (let i = 0; i < data.length; i++) {
	  			let row = [];
	  			let clueNumber = 0;
	  			if (i < data.length/2) {
	  				clueNumber = i + 1 + " down";
	  			} else {
	  				clueNumber = i + 1 - data.length/2 + " across";
	  			}
	  			for (let j = 0; j < 2; j++) {
	  				row.push(
	  					<div
	  						className={styles.cellContainer}
	  						key={"cell "+i+""+j}
	  					>
	  						{/* Conditional styling example from https://www.pluralsight.com/guides/applying-classes-conditionally-react */}
	  						<div className={`styles.cell ${j === 0 ? styles.headerCell : styles.dataCell}`}>
	  							{j === 0 ? clueNumber : data[i].slice(0, 30)}
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
  				{this.table()}
  			</div>
  		);
  	}
}

export default ClueTable;
