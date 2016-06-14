// Adapted from https://github.com/Lighthouse-io/react-visjs-timeline

import vis from 'vis';
import React, { Component, PropTypes } from 'react';

const events = [
  'currentTimeTick',
  'click',
  'contextmenu',
  'doubleClick',
  'groupDragged',
  'changed',
  'rangechange',
  'rangechanged',
  'select',
  'timechange',
  'timechanged'
];

const eventPropTypes = {};
const eventDefaultProps = {};

events.forEach(event => {
  eventPropTypes[event] = PropTypes.func;
  eventDefaultProps[`${event}Handler`] = () => {};
});

export default class Timeline extends Component {

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

    const { items, options } = this.props;

    const timelineItems = new vis.DataSet(items);

    if (!!$el) {
      $el.setOptions(options);
      $el.setItems(timelineItems);
    } else {
      $el = this.TimelineElement = new vis.Timeline(container, timelineItems, options);

      events.forEach(event => {
        $el.on(event, this.props[`${event}Handler`]);
      });
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

Timeline.defaultProps = Object.assign({
  items: [],
  options: {},
  customTimes: {},
}, eventDefaultProps);
