import { connect } from 'react-redux';
import counterpart from 'counterpart';
import { changeLocale } from '../actions/microcontroller';
import Link from '../components/Link';

const mapStateToProps = (state, ownProps) => (
  {
    enabled: state.mapping.locale !== ownProps.locale
  }
);

const mapDispatchToProps = (dispatch, ownProps) => (
  {
    onClick: () => {
      counterpart.setLocale(ownProps.locale);
      dispatch(changeLocale(ownProps.locale));
    },
  }
);

const LocaleSwitcher = connect(
  mapStateToProps,
  mapDispatchToProps,
)(Link);

export default LocaleSwitcher;
