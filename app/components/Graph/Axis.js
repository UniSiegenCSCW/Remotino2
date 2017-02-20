import React from 'react';
import ReactDOM from 'react-dom';
import d3 from 'd3';

export default class Axis extends React.Component {
  static propTypes = {
    height: React.PropTypes.number,
    axis: React.PropTypes.func,
    axisType: React.PropTypes.oneOf(['x', 'y']),
  };

  componentDidMount() {
    this.renderAxis();
  }

  componentDidUpdate() {
    this.renderAxis();
  }


  renderAxis() {
    const { axis } = this.props;
    const node = ReactDOM.findDOMNode(this);
    d3.select(node).call(axis);
  }

  render() {
    const { height, axisType } = this.props;
    return (
      <g
        className="axis"
        transform={axisType === 'x' ? `translate(0, ${height})` : 'translate(0, 0)'}
      />
    );
  }
}
