/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this file,
 * You can obtain one at http://mozilla.org/MPL/2.0/. */

const React = require('react')
const ImmutableComponent = require('./immutableComponent')
const cx = require('../lib/classSet.js')
const AppActions = require('../actions/appActions')

import Config from '../constants/config.js'

class TabPage extends ImmutableComponent {
  render () {
    return <span className={cx({
      tabPage: true,
      active: this.props.active})}
      onClick={AppActions.setTabPageIndex.bind(this, this.props.index)
    }>
    </span>
  }
}

class TabPages extends ImmutableComponent {
  get tabCount () {
    return Math.ceil(this.props.frames.size / Config.tabs.tabsPerPage)
  }

  render () {
    return <div className='tabPages'>
    {
      Array.from(new Array(this.tabCount)).map((x, i) =>
        <TabPage index={i} active={this.props.tabPageIndex === i}/>)
    }
    </div>
  }
}

module.exports = TabPages
