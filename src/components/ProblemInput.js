import React, { Component } from "react";

import '../styles/global.css';

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
      <div>
        <input type = "file" onChange={this.onFileChange}/>
      </div>
    );
  }
}

export default ProblemInput;