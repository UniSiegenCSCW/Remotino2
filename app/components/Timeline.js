// Adapted from https://github.com/Lighthouse-io/react-visjs-timeline

import vis from 'vis';
import React, { Component, PropTypes } from 'react';
import ReplayControls from '../containers/ReplayControls';

const eventPropTypes = {};

export default class Timeline extends Component {
  static propTypes = {
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
    const { items, options, start, end } = this.props;

    const timeChange = (start !== nextProps.start) || (end !== nextProps.end);
    const itemsChange = items !== nextProps.items;
    const optionsChange = options !== nextProps.options;

    return itemsChange || optionsChange || timeChange;
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
      start,
      end,
      removeItem,
      moveItem,
    } = this.props;

    let timelineItems;

    if (start && end) {
      const replayItem = {
        id: -1,
        type: 'range',
        content: 'Replay',
        className: 'timeline-replay-element',
        start,
        end,
      };
      timelineItems = new vis.DataSet([replayItem, ...items]);
    } else {
      timelineItems = new vis.DataSet(items);
    }

    const fullOptions = Object.assign({
      onRemove: (item, callback) => {
        removeItem(item.id);
        callback(null);
      },
      onMove: (item, callback) => {
        moveItem(item.id, item.start, item.end);
        callback(null);
      },
      order: (a, b) => {
        // Allways show the replay bar on the bottom
        if (a.id === -1) {
          return -1;
        } else if (b.id === -1) {
          return 1;
        } else {
          return a.id - b.id;
        }
      }
    }, options);

    if (!!$el) {
      $el.setOptions(fullOptions);
      $el.setItems(timelineItems);
      try {
        $el.getCustomTime('replay_current');
        $el.setCustomTime(new Date(), 'replay_current');
      } catch (err) {
        $el.addCustomTime(new Date(), 'replay_current');
      }
    } else {
      $el = this.TimelineElement = new vis.Timeline(container, timelineItems, options);
    }
  }

  render() {
    const { showingTimeline } = this.props;

    return (
      <div>
        <div className="controls">
          <ReplayControls fitTimeline={() => { this.TimelineElement.fit(); }} />
        </div>
        <div ref="container" style={{ display: showingTimeline ? 'block' : 'none' }} />
      </div>
    );
  }
}

Timeline.propTypes = Object.assign({
  items: PropTypes.array.isRequired,
  options: PropTypes.object.isRequired,
  start: PropTypes.object,
  end: PropTypes.object,
}, eventPropTypes);
