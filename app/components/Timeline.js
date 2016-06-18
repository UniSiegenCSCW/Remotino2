// Adapted from https://github.com/Lighthouse-io/react-visjs-timeline

import vis from 'vis';
import React, { Component, PropTypes } from 'react';

const eventPropTypes = {};

export default class Timeline extends Component {
  static propTypes = {
    changeRange: PropTypes.func.isRequired,
    removeItem: PropTypes.func.isRequired,
  };

  componentWillMount() {
    this.state = {};
  }

  componentDidMount() {
    this.init();
  }

  shouldComponentUpdate(nextProps) {
    const {
      items,
      options,
    } = this.props;

    const itemsChange = items !== nextProps.items;
    const optionsChange = options !== nextProps.options;

    return itemsChange || optionsChange;
  }

  componentDidUpdate() {
    this.init();
  }

  componentWillUnmount() {
    this.TimelineElement.destroy();
  }

  init() {
    const { container } = this.refs;
    let $el = this.TimelineElement;

    const { items, changeRange, removeItem } = this.props;
    const timelineItems = new vis.DataSet(items);

    const options = {
      editable: {
        add: false,
        updateTime: true,
        updateGroup: false,
        remove: true
      },
      onRemove: (item, callback) => {
        removeItem(item.id);
        callback(null);
      }
    };

    if (!!$el) {
      $el.setOptions(options);
      $el.setItems(timelineItems);
    } else {
      $el = this.TimelineElement = new vis.Timeline(container, timelineItems, options);

      $el.on('rangechanged', changeRange);
    }
  }

  render() {
    return (
      <div>
        <a className="link" onClick={() => this.TimelineElement.fit()}>Snap</a>
        <div ref="container" />
      </div>
    );
  }
}

Timeline.propTypes = Object.assign({
  items: PropTypes.array,
  options: PropTypes.object,
}, eventPropTypes);
