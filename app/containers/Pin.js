import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import Pin from '../components/Pin';
import * as MicrocontrollerActions from '../actions/microcontroller';

function mapStateToProps(state, ownProps) {
  const pin = ownProps.pin;
  return { pin };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(MicrocontrollerActions, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(Pin);
