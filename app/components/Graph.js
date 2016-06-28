// Adapted from https://github.com/Lighthouse-io/react-visjs-timeline

import vis from 'vis';
import React, { Component, PropTypes } from 'react';

const eventPropTypes = {};

export default class Graph extends Component {
  static propTypes = {
    changeRange: PropTypes.func.isRequired,
    removeItem: PropTypes.func.isRequired,
    moveItem: PropTypes.func.isRequired,
  };

  componentWillMount() {
    this.state = {};
  }

  componentDidMount() {
    this.init();
  }

  shouldComponentUpdate(nextProps) {
    const { values } = this.props;

    const valuesChange = values !== nextProps.values;
    // const optionsChange = options !== nextProps.options;

    return valuesChange;
  }

  componentDidUpdate() {
    this.init();
  }

  componentWillUnmount() {
    this.GraphElement.destroy();
  }

  init() {
    const { container } = this.refs;
    let $el = this.GraphElement;

    // const { values } = this.props;

    const graphItems = new vis.DataSet();

    setInterval(() => {
      const now = new Date();
      graphItems.add({ x: Math.sin(now), y: now });
    }, 200);

    const options = {
      max: 100,
      min: 0,
    };

    if (!!$el) {
      // $el.setOptions(fullOptions);
      $el.setItems(graphItems);
    } else {
      $el = this.GraphElement = new vis.Graph2d(container, graphItems, options);

      // $el.on('rangechanged', changeRange);
    }
  }

  render() {
    return (
      <div ref="container" />
    );
  }
}

Graph.propTypes = Object.assign({
  values: PropTypes.array,
}, eventPropTypes);
