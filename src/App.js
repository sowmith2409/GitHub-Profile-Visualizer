import {Component} from 'react'
import {Route, Switch} from 'react-router-dom'

import Home from './components/Home'
import Repository from './components/Repository'
import RepositoriesItemDetails from './components/RepositoryItemDetails'
import Analysis from './components/Analysis'
import NotFound from './components/NotFound'
import NoInternet from './components/NoInternet'

import './App.css'

class App extends Component {
  state = {
    isOnline: navigator.onLine,
  }

  componentDidMount() {
    window.addEventListener('online', this.updateStatus)
    window.addEventListener('offline', this.updateStatus)
  }

  componentWillUnmount() {
    window.removeEventListener('online', this.updateStatus)
    window.removeEventListener('offline', this.updateStatus)
  }

  updateStatus = () => {
    this.setState({isOnline: navigator.onLine})
  }

  render() {
    const {isOnline} = this.state

    if (!isOnline) {
      return <NoInternet />
    }

    return (
      <Switch>
        <Route exact path="/" component={Home} />
        <Route exact path="/repositories" component={Repository} />
        <Route
          exact
          path="/repositories/:repoName"
          component={RepositoriesItemDetails}
        />
        <Route exact path="/analysis" component={Analysis} />
        <Route component={NotFound} />
      </Switch>
    )
  }
}

export default App
