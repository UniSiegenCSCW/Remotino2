import Pin from '../components/Pin';
import * as MicrocontrollerActions from '../actions/microcontroller';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { defaultTo } from 'ramda';
import { getNested } from '../utils/utils';

function mapStateToProps(state, ownProps) {
  const mapping = state.microcontroller.mapping;
  const pin = ownProps.pin;

  const name = defaultTo(`Pin ${pin.id}`, getNested(mapping, ['pins', pin.id, 'name']));
  const tags = defaultTo([], getNested(mapping, ['pins', pin.id, 'categories']));

  return { name, tags, pin };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(MicrocontrollerActions, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(Pin);
