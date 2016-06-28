// Adapted from https://github.com/Lighthouse-io/react-visjs-timeline

import vis from 'vis';
import React, { Component, PropTypes } from 'react';
import ReplayControls from '../containers/ReplayControls';
import Link from './Link';
import FontAwesome from 'react-fontawesome';

const eventPropTypes = {};

export default class Timeline extends Component {
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

    const {
      items,
      options,
      changeRange,
      removeItem,
      moveItem,
    } = this.props;
    const timelineItems = new vis.DataSet(items);

    const fullOptions = Object.assign({
      editable: {
        add: false,
        updateTime: true,
        updateGroup: false,
        remove: true
      },
      onRemove: (item, callback) => {
        removeItem(item.id);
        callback(null);
      },
      onMove: (item, callback) => {
        moveItem(item.id, item.start);
        callback(null);
      }
    }, options);

    if (!!$el) {
      $el.setOptions(fullOptions);
      $el.setItems(timelineItems);
    } else {
      $el = this.TimelineElement = new vis.Timeline(container, timelineItems, options);

      $el.on('rangechanged', changeRange);
    }
  }

  render() {
    return (
      <div>
        <div className="controls">
          <ReplayControls />
          <div className="timeline-controls">
            <Link onClick={() => { this.TimelineElement.fit(); }}>
              <FontAwesome name="arrows-h" /> Focus recorded events
            </Link>
          </div>
        </div>
        <div ref="container" />
      </div>
    );
  }
}

Timeline.propTypes = Object.assign({
  items: PropTypes.array,
  options: PropTypes.object,
}, eventPropTypes);
