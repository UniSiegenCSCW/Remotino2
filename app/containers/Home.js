import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import Home from '../components/Home';
import * as MicrocontrollerActions from '../actions/microcontroller';

function mapStateToProps(state) {
  return {
    connectionState: state.connectionState,
    ports: state.ports,
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(MicrocontrollerActions, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(Home);
