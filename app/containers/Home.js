import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import Home from '../components/Home';
import * as MicrocontrollerActions from '../actions/microcontroller';
import * as FlashActions from '../actions/flashActions';

function mapStateToProps(state) {
  return {
    connectionState: state.connectionState,
    ports: state.ports,
    flash: state.flash,
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({ ...MicrocontrollerActions, ...FlashActions }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(Home);
