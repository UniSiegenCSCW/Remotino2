import { connect } from 'react-redux';
import counterpart from 'counterpart';
import { changeLocale } from '../actions/uiActions';
import Link from '../components/Link';

const mapStateToProps = (state, ownProps) => (
  {
    enabled: state.ui.locale !== ownProps.locale
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
