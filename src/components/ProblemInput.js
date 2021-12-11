import React, { Component } from "react";

import '../styles/global.css';
import '../styles/ProblemInput.module.css';

class ProblemInput extends Component {
  constructor(props) {
    super(props);

    this.state = {
      selectedFile: null
    };
  }

  reader = null;

  onFileChange = event => {
    this.setState({ selectedFile: event.target.files[0] });
    this.reader = new FileReader(event.target.files[0]);
    console.log(event.target.files[0])
  };

  problemInfo = data => {
    console.log("recalculating problemInfo");
    // if (data){
    //   let parsedData = JSON.parse(data);
    //   console.log(parsedData);
    //   // return(
    //   //   <div>
    //   //     {
    //   //       "Board width: " + data.board.width +
    //   //       "\nBoard height: " + data.board.height
    //   //     }
    //   //   </div>
    //   // );
    //   return;
    // }
    // else return;
  };

  render() {
    return(
      <div className="buttonContainer">

        <input
            type="file"
            className="button"
            onChange={this.onFileChange}
        />
        <div className="buttonShadow" />
        {this.problemInfo(this.state.selectedFile)}
      </div>

    );
  }
}

export default ProblemInput;
