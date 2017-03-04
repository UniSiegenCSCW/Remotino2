import React from 'react';

export default class Dialog extends React.Component {
  static propTypes = {
    children: React.PropTypes.node,
  };

  constructor(props) {
    super(props);

    this.state = {
      show: true
    };

    this.handleClick = this.handleClick.bind(this);
  }

  handleClick() {
    this.setState({
      show: false
    });
  }

  render() {
    if (!this.state.show) {
      return null;
    }

    return (
      <div className="backdrop">
        <div className="dialog">
          <div className="message">
            {this.props.children}
          </div>
          <div className="button">
            <button onClick={this.handleClick}>OK</button>
          </div>
        </div>
      </div>
    );
  }
}
