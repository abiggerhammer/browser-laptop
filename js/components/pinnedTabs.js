/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this file,
 * You can obtain one at http://mozilla.org/MPL/2.0/. */

const React = require('react')
const ReactDOM = require('react-dom')
const ImmutableComponent = require('./immutableComponent')
const Tab = require('./tab')
const windowActions = require('../actions/windowActions')
const appActions = require('../actions/appActions')
const siteTags = require('../constants/siteTags')
const siteUtil = require('../state/siteUtil')
const dnd = require('../dnd')

class PinnedTabs extends ImmutableComponent {
  onDrop (e) {
    const clientX = e.clientX
    const sourceDragData = this.props.sourceDragData
    // This must be executed async because the state change that this causes
    // will cause the onDragEnd to never run
    setTimeout(() => {
      const key = sourceDragData.get('key')
      let droppedOnTab = dnd.closestFromXOffset(this.tabRefs.filter(tab => tab && tab.props.frameProps.get('key') !== key), clientX)
      if (droppedOnTab) {
        const isLeftSide = dnd.isLeftSide(ReactDOM.findDOMNode(droppedOnTab), clientX)
        const droppedOnFrameProps = this.props.frames.find(frame => frame.get('key') === droppedOnTab.props.frameProps.get('key'))
        windowActions.moveTab(sourceDragData, droppedOnFrameProps, isLeftSide)
        if (!sourceDragData.get('pinnedLocation')) {
          windowActions.setPinned(sourceDragData, true)
          appActions.addSite(sourceDragData, siteTags.PINNED)
        } else {
          appActions.moveSite(siteUtil.getDetailFromFrame(sourceDragData, siteTags.PINNED),
            siteUtil.getDetailFromFrame(droppedOnFrameProps, siteTags.PINNED),
            isLeftSide)
        }
      }
    }, 0)
  }

  onDragOver (e) {
    e.dataTransfer.dropEffect = 'move'
    e.preventDefault()
  }

  render () {
    this.tabRefs = []
    return <div className='pinnedTabs'
      onDragOver={this.onDragOver.bind(this)}
      onDrop={this.onDrop.bind(this)}>
       {
          this.props.frames
            .filter(frameProps => frameProps.get('pinnedLocation'))
            .map(frameProps =>
                <Tab activeDraggedTab={this.props.tabs.get('activeDraggedTab')}
                  ref={node => this.tabRefs.push(node)}
                  sourceDragData={this.props.sourceDragData}
                  draggingOverData={this.props.draggingOverData}
                  frameProps={frameProps}
                  frames={this.props.frames}
                  key={'tab-' + frameProps.get('key')}
                  paintTabs={this.props.paintTabs}
                  previewTabs={this.props.previewTabs}
                  isActive={this.props.activeFrame === frameProps}
                  isPrivate={frameProps.get('isPrivate')}
                  partOfFullPageSet={this.props.partOfFullPageSet}/>)
      }
    </div>
  }
}

module.exports = PinnedTabs
