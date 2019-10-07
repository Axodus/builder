import { connect } from 'react-redux'

import { RootState } from 'modules/common/types'
import { getLoadingSet, getErrorSet } from 'modules/sync/selectors'
import { login } from 'modules/auth/actions'
import { retrySync } from 'modules/sync/actions'
import { isLoggedIn } from 'modules/auth/selectors'
import { didDismissSignInToast, didDismissSyncedToast, getProjects } from 'modules/ui/dashboard/selectors'
import { dismissSignInToast, dismissSyncedToast } from 'modules/ui/dashboard/actions'
import { MapStateProps, MapDispatchProps, MapDispatch } from './SyncToast.types'
import SyncToast from './SyncToast'

const mapState = (state: RootState): MapStateProps => ({
  syncCount: getLoadingSet(state).size,
  errorCount: getErrorSet(state).size,
  projectCount: getProjects(state).length,
  isLoggedIn: isLoggedIn(state),
  didDismissSignInToast: didDismissSignInToast(state),
  didDismissSyncedToast: didDismissSyncedToast(state)
})

const mapDispatch = (dispatch: MapDispatch): MapDispatchProps => ({
  onRetry: () => dispatch(retrySync()),
  onLogin: options => dispatch(login(options)),
  onDismissSignInToast: () => dispatch(dismissSignInToast()),
  onDismissSyncedToast: () => dispatch(dismissSyncedToast())
})

export default connect(
  mapState,
  mapDispatch
)(SyncToast)
