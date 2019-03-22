import React, { Component } from 'react'
import appContext from './appContext'

const { Provider } = appContext


class AppState extends Component {
  state = initialState;  

  render() {
    return (
      <Provider
        value={{
          state: this.state,
          actions: {
            setPair: this.setPair,
            toggle: this.toggle
          }
        }}
      >
        {this.props.children}
      </Provider>
    )
  }

  setPair = (key, value) => {
    this.setState({ [key]: value })
  }

  toggle = (key) => {
    this.setState({ [key]: !this.state[key] })
  }
}

export default AppState;

const initialState = {
  query: {
    keywords: '',
    select: "BO:es:Bolivia:Espanol (Latinoamerica):67"
  },
  filter: {
    minVolume: 0,
    maxVolume: 1000000,
    minAdwords: 0,
    maxAdwords: 100,
    minCPC: 0,
    maxCPC: 1000,
    filterKeys: '',
    eraseKeys: ''
  },
  serpData: [
    { key: '-', volume: 0, cpc: 0, competencia: 0, id: 0, content: "|" }
  ],
  rankData: [],
  stats: { total_count: '', results_time: '-' },
  EditorTitle: '',
  EditorMeta: '',
  EditorText: ''
}