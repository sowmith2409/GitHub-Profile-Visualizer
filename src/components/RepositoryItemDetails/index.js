import {Component} from 'react'

import Loader from 'react-loader-spinner'
import {PieChart, Pie, Legend, Cell, ResponsiveContainer} from 'recharts'

import {RiStarSFill} from 'react-icons/ri'
import {GoRepoForked} from 'react-icons/go'

import Header from '../Header'

import './index.css'

const cssClasses = [
  'language-item-01',
  'language-item-02',
  'language-item-03',
  'language-item-04',
]

const colors = [
  '#31A4E6',
  '#54CA76',
  '#9261F3',
  '#F2637F',
  '#F5C452',
  '#fecba6',
  '#b3d23f',
  '#a44c9e',
]

class RepositoriesItemDetails extends Component {
  state = {
    isLoading: true,
    repoItemDetails: {},
    isError: false,
  }

  componentDidMount() {
    this.fetchRepoItemDetails()
  }

  fetchRepoItemDetails = async () => {
    try {
      const myUserName = JSON.parse(localStorage.getItem('searchValue'))
      const {match} = this.props
      const {params} = match
      const {repoName} = params
      const token = process.env.REACT_APP_GITHUB_TOKEN
      const url = `https://apis2.ccbp.in/gpv/specific-repo/${myUserName}/${repoName}`
      const response = await fetch(url, {
        headers: {
          Authorization: `token ${token}`,
        },
      })
      const data = await response.json()
      console.log(data)
      const repoItemDetails = {
        name: data.name,
        lanuages: data.lanuages,
        stargazersCount: data.stargazers_count,
        forksCount: data.forks_count,
        contributors: data.contributors,
        openIssuesCount: data.open_issues_count,
        watchersCount: data.watchers_count,
      }
      if (response.ok) {
        this.setState({isLoading: false, repoItemDetails})
      } else {
        this.setState({isLoading: false, isError: true})
      }
    } catch (error) {
      this.setState({isLoading: false, isError: true})
    }
  }

  retry = () => {
    this.setState({isLoading: true})
    this.fetchRepoItemDetails()
  }

  displayRepoItemDetails = () => {
    const {repoItemDetails, isError} = this.state

    return (
      <div className="repo-item-container">
        <Header />
        {isError ? (
          <div className="Profile-view-container">
            <img
              src="https://res.cloudinary.com/dkxqg2chl/image/upload/v1753689835/Group_7522_l9uswp.png"
              alt="failure view"
              className="error-img"
            />
            <p className="error-para">Something went wrong. Please try again</p>
            <button
              type="button"
              className="try-again-button"
              onClick={this.retry}
            >
              Try again
            </button>
          </div>
        ) : (
          <div className="details-container">
            <h1 className="item-name">{repoItemDetails.name}</h1>
            <p className="item-para">
              To create a nested list using the web editor on GitHub or a text
              editor that uses a monospaced font, like Atom, you can align your
              list visually.
            </p>
            <ul className="item-languages-list">
              {repoItemDetails.lanuages.map(item => (
                <li
                  key={item.name}
                  className={
                    cssClasses[Math.floor(Math.random() * cssClasses.length)]
                  }
                >
                  <p className="lang-para">{item.name}</p>
                </li>
              ))}
            </ul>
            <div className="item-star-fork-container">
              <div className="item-star-container">
                <RiStarSFill height={16} width={16} color="#FBBF24" />
                <p className="item-star-fork-para">
                  {repoItemDetails.stargazersCount}
                </p>
              </div>
              <div className="item-fork-container">
                <GoRepoForked height={16} width={16} color="#94A3B8" />
                <p className="item-star-fork-para">
                  {repoItemDetails.forksCount}
                </p>
              </div>
            </div>
            <div className="commits-issues-count">
              <div className="commit-issue-card">
                <p className="commit-para">Watchers Counts</p>
                <p className="commit-count">{repoItemDetails.watchersCount}</p>
              </div>
              <div className="commit-issue-card">
                <p className="issue-para">Issues Counts</p>
                <p className="issue-count">{repoItemDetails.openIssuesCount}</p>
              </div>
            </div>
            <h1 className="contributes-para">Contributors</h1>
            <p className="contributes-count">{`${repoItemDetails.contributors.length} Members`}</p>
            <ul className="contribute-list">
              {repoItemDetails.contributors.slice(0, 5).map(each => (
                <li>
                  <img
                    src={each.avatar_url}
                    alt="contributor profile"
                    className="contribute-image"
                  />
                </li>
              ))}
              {repoItemDetails.contributors.length > 5 && (
                <li className="more-count">
                  +{repoItemDetails.contributors.length - 5}
                </li>
              )}
            </ul>
            <h1 className="contributes-para">Languages</h1>
            <div className="pie-container">
              <ResponsiveContainer className="response-container">
                <PieChart>
                  <Pie
                    cx="50%"
                    cy="50%"
                    data={repoItemDetails.lanuages}
                    startAngle={0}
                    endAngle={360}
                    innerRadius="40%"
                    outerRadius="70%"
                    dataKey="value"
                  >
                    {repoItemDetails.lanuages.map((entry, index) => (
                      <Cell
                        key={entry.name}
                        name={entry.name}
                        fill={colors[index % colors.length]}
                      />
                    ))}
                  </Pie>
                  <Legend
                    iconType="square"
                    layout="vertical"
                    verticalAlign="middle"
                    align="right"
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}
      </div>
    )
  }

  render() {
    const {isLoading} = this.state

    return (
      <>
        {isLoading ? (
          <div className="loader-container" data-testid="loader">
            <Loader type="TailSpin" color="#3B82F6" height={50} width={50} />
          </div>
        ) : (
          this.displayRepoItemDetails()
        )}
      </>
    )
  }
}

export default RepositoriesItemDetails
