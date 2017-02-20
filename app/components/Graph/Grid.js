import React from 'react';
import ReactDOM from 'react-dom';
import d3 from 'd3';

export default class Grid extends React.Component {
  static propTypes = {
    height:	React.PropTypes.number,
    grid:	React.PropTypes.func,
    gridType:	React.PropTypes.oneOf(['x', 'y']),
  };

  componentDidMount() {
    this.renderGrid();
  }

  componentDidUpdate() {
    this.renderGrid();
  }


  renderGrid() {
    const { grid } = this.props;
    const node = ReactDOM.findDOMNode(this);
    d3.select(node).call(grid);
  }

  render() {
    const { height, gridType } = this.props;
    return (
      <g
        className="y-grid"
        transform={gridType === 'x' ? `translate(0, ${height})` : 'translate(0, 0)'}
      />
    );
  }
}
