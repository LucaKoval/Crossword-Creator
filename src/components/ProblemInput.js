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

  onFileChange = event => {
    this.setState({ selectedFile: event.target.files[0] });
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
      </div>

    );
  }
}

export default ProblemInput;
