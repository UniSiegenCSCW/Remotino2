// Adapted from https://github.com/Lighthouse-io/react-visjs-timeline

import vis from 'vis';
import React, { Component, PropTypes } from 'react';
import ReplayControls from '../containers/ReplayControls';

export default class Timeline extends Component {
  static propTypes = {
    removeItem: PropTypes.func.isRequired,
    moveItem: PropTypes.func.isRequired,
    showingTimeline: PropTypes.bool.isRequired,
    items: PropTypes.array.isRequired,
    groups: PropTypes.array.isRequired,
    options: PropTypes.object.isRequired,
    start: PropTypes.object,
    end: PropTypes.object,
  };

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
    const { items, options, start, end, groups, removeItem, moveItem } = this.props;

    let $el = this.TimelineElement;
    let timelineItems;

    if (start && end) {
      const replayItem = {
        id: -1,
        type: 'range',
        content: 'Replay',
        className: 'timeline-replay-element',
        group: -1,
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
    }, options);

    if (!!$el) {
      $el.setOptions(fullOptions);
      $el.setItems(timelineItems);
      $el.setGroups(groups);
    } else {
      $el = this.TimelineElement = new vis.Timeline(container, items, groups, options);
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
