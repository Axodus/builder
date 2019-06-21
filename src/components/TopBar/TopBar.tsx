import * as React from 'react'
import { Link } from 'react-router-dom'
import { Header, Grid, Icon, Popup } from 'decentraland-ui'
import { T } from 'decentraland-dapps/dist/modules/translation/utils'
import { IntercomWidget } from 'decentraland-dapps/dist/components/Intercom/IntercomWidget'
import { getExceededMetrics } from 'modules/scene/utils'

import ShortcutTooltip from 'components/ShortcutTooltip'
import Chip from 'components/Chip'
import OwnIcon from 'components/Icon'
import DeployButton from 'components/DeployButton'
import { locations } from 'routing/locations'
import { Gizmo } from 'modules/editor/types'
import { Shortcut } from 'modules/keyboard/types'
import { Props } from './TopBar.types'
import './TopBar.css'

const widget = IntercomWidget.getInstance()

export default class TopBar extends React.PureComponent<Props> {
  handleMoveMode = () => {
    const { gizmo, onSetGizmo } = this.props
    onSetGizmo(gizmo === Gizmo.MOVE ? Gizmo.NONE : Gizmo.MOVE)
  }

  handleRotateMode = () => {
    const { gizmo, onSetGizmo } = this.props
    onSetGizmo(gizmo === Gizmo.ROTATE ? Gizmo.NONE : Gizmo.ROTATE)
  }

  handleTogglePreview = () => {
    const { onTogglePreview, isPreviewing } = this.props
    widget.unmount()
    onTogglePreview(!isPreviewing)
  }

  handleToggleSidebar = () => {
    const { onToggleSidebar, isSidebarOpen } = this.props
    onToggleSidebar(!isSidebarOpen)
  }

  handleTitleClick = () => {
    this.props.onOpenModal('EditProjectModal')
  }

  handleOpenDeployModal = () => {
    this.props.onOpenModal('DeployModal')
  }

  handleExport = () => {
    this.props.onOpenModal('ExportModal', { project: this.props.currentProject })
  }

  isSceneLoading() {
    const { metrics, isLoading } = this.props
    return isLoading || (metrics.entities > 0 && metrics.triangles === 0)
  }

  getExceededMetric() {
    const { metrics, limits } = this.props
    const exceededMetrics = getExceededMetrics(metrics, limits)
    return exceededMetrics.length > 0 ? exceededMetrics[0] : ''
  }

  render() {
    const {
      gizmo,
      areEntitiesOutOfBoundaries,
      currentProject,
      isLoading,
      isPreviewing,
      isSidebarOpen,
      selectedEntityId,
      enabledTools,
      onReset,
      onDelete,
      onDuplicate
    } = this.props

    const exceededMetric = this.getExceededMetric()

    return (
      <Grid className="TopBar">
        <Grid.Column mobile={4} tablet={4} computer={4} className="left-column" verticalAlign="middle">
          <Header size="medium" className="project-title-header">
            <Link className="text" to={locations.root()}>
              <Icon name="chevron left" />
            </Link>
            {currentProject ? (
              <>
                <div className="project-title" onClick={this.handleTitleClick} title={currentProject.title}>
                  {currentProject.title}
                </div>
                <OwnIcon name="edit" className="edit-project-icon" onClick={this.handleTitleClick} />
              </>
            ) : null}
          </Header>
        </Grid.Column>
        <Grid.Column mobile={6} tablet={6} computer={7} className="middle-column">
          <Grid.Row>
            <div className="editor-actions">
              <span className="editor-modes">
                <ShortcutTooltip shortcut={Shortcut.MOVE} position="bottom center" className="tool" popupClassName="top-bar-popup">
                  <Chip
                    icon="move"
                    isActive={gizmo === Gizmo.MOVE && !!selectedEntityId}
                    isDisabled={!enabledTools.move}
                    onClick={this.handleMoveMode}
                  />
                </ShortcutTooltip>
                <ShortcutTooltip shortcut={Shortcut.ROTATE} position="bottom center" className="tool" popupClassName="top-bar-popup">
                  <Chip
                    icon="rotate"
                    isActive={gizmo === Gizmo.ROTATE && !!selectedEntityId}
                    isDisabled={!enabledTools.rotate}
                    onClick={this.handleRotateMode}
                  />
                </ShortcutTooltip>
              </span>
              <ShortcutTooltip shortcut={Shortcut.RESET_ITEM} position="bottom center" className="tool" popupClassName="top-bar-popup">
                <Chip icon="undo" isDisabled={!enabledTools.reset} onClick={onReset} />
              </ShortcutTooltip>
              <ShortcutTooltip shortcut={Shortcut.DUPLICATE_ITEM} position="bottom center" className="tool" popupClassName="top-bar-popup">
                <Chip icon="duplicate" isDisabled={!enabledTools.duplicate} onClick={onDuplicate} />
              </ShortcutTooltip>
              <ShortcutTooltip shortcut={Shortcut.DELETE_ITEM} position="bottom center" className="tool" popupClassName="top-bar-popup">
                <Chip icon="delete" isDisabled={!enabledTools.delete} onClick={onDelete} />
              </ShortcutTooltip>
            </div>
          </Grid.Row>
        </Grid.Column>
        <Grid.Column mobile={6} tablet={6} computer={5} className="right-column">
          <Grid.Row>
            <ShortcutTooltip shortcut={Shortcut.PREVIEW} position="bottom center" className="tool" popupClassName="top-bar-popup">
              <Chip icon="preview" isActive={isPreviewing} isDisabled={isLoading} onClick={this.handleTogglePreview} />
            </ShortcutTooltip>
            <ShortcutTooltip shortcut={Shortcut.EXPORT_SCENE} position="bottom center" className="tool" popupClassName="top-bar-popup">
              <Chip icon="export" isDisabled={isLoading} onClick={this.handleExport} />
            </ShortcutTooltip>
            <ShortcutTooltip shortcut={Shortcut.TOGGLE_SIDEBAR} position="bottom center" className="tool" popupClassName="top-bar-popup">
              <Chip icon="sidebar" isActive={isSidebarOpen} onClick={this.handleToggleSidebar} />
            </ShortcutTooltip>
            <span className="contest-button-wrapper">
              <Popup
                className="contest-disabled"
                content={
                  areEntitiesOutOfBoundaries ? (
                    <T id="topbar.bounds_exceeded" values={{ br: <br /> }} />
                  ) : (
                    <T id="topbar.limits_exceeded" values={{ metric: exceededMetric, br: <br /> }} />
                  )
                }
                position="bottom center"
                disabled={isLoading || (exceededMetric === '' && !areEntitiesOutOfBoundaries)}
                trigger={
                  <span>
                    <DeployButton onClick={this.handleOpenDeployModal} isDisabled={isLoading || exceededMetric !== '' || areEntitiesOutOfBoundaries} />
                  </span>
                }
                on="hover"
                inverted
              />
            </span>
          </Grid.Row>
        </Grid.Column>
      </Grid>
    )
  }
}
