import {Component} from 'react'

import {Link} from 'react-router-dom'

import Loader from 'react-loader-spinner'

import {
  PieChart,
  Pie,
  Legend,
  Cell,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'

import Header from '../Header'

import './index.css'

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

class Analysis extends Component {
  state = {
    isLoading: true,
    noUserName: false,
    isError: false,
    profileSummary: {},
  }

  componentDidMount() {
    this.fetchProfileSummary()
  }

  fetchProfileSummary = async () => {
    const mySearchValue = JSON.parse(localStorage.getItem('searchValue'))
    console.log(mySearchValue)
    if (!mySearchValue || mySearchValue.trim() === '') {
      this.setState({isLoading: false, noUserName: true})
    } else {
      try {
        const url = `https://apis2.ccbp.in/gpv/profile-summary/${mySearchValue}?api_key=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`
        const response = await fetch(url)
        const data = await response.json()
        const profileSummary = {
          langCommitCount: data.langCommitCount,
          langRepoCount: data.langRepoCount,
          langStarCount: data.langStarCount,
          quarterCommitCount: data.quarterCommitCount,
          repoCommitCount: data.repoCommitCount,
          repoCommitCountDescriptions: data.repoCommitCountDescriptions,
          repoStarCount: data.repoStarCount,
          repoStarCountDescriptions: data.repoStarCountDescriptions,
          user: data.user,
        }
        if (response.ok) {
          this.setState({isLoading: false, profileSummary})
        } else {
          this.setState({isLoading: false, isError: true})
        }
      } catch (error) {
        this.setState({isLoading: false, isError: true})
      }
    }
  }

  retry = () => {
    this.setState({isLoading: true})
    this.fetchProfileSummary()
  }

  displayProfileSummary = () => {
    const {noUserName, profileSummary, isError} = this.state

    const lineData = Object.entries(
      profileSummary.quarterCommitCount || {},
    ).map(([quarter, commits]) => ({
      quarter,
      commits,
    }))

    const pieChartData = Object.entries(profileSummary.langRepoCount || {}).map(
      ([name, value]) => ({
        name,
        value,
      }),
    )

    const pieChartData2 = Object.entries(
      profileSummary.langCommitCount || {},
    ).map(([name, value]) => ({
      name,
      value,
    }))

    const commit = Object.entries(profileSummary.repoCommitCount || {}).map(
      ([name, value]) => ({
        name,
        value,
        description: (profileSummary.repoCommitCountDescriptions || {})[name],
      }),
    )

    return (
      <div className="summary-container">
        <Header />
        {noUserName && (
          <div className="no-data-container">
            <img
              src="https://res.cloudinary.com/dkxqg2chl/image/upload/v1753858170/Empty_Box_Illustration_1_hbeng9.png"
              alt="empty analysis"
              className="no-analysis-image"
            />
            <h1 className="no-data-heading">No Data Found</h1>
            <p className="no-data-para">
              GitHub username is empty, please provide a valid username for
              Analysis
            </p>
            <Link to="/" className="link">
              <button type="button" className="analysis-home-button">
                Go to Home
              </button>
            </Link>
          </div>
        )}

        {!noUserName && isError && (
          <div className="empty-container">
            <img
              src="https://res.cloudinary.com/dkxqg2chl/image/upload/v1753689835/Group_7522_l9uswp.png"
              alt="failure view"
              className="empty-image"
            />
            <p className="empty-para">Something went wrong. Please try again</p>
            <button type="button" className="retry-button" onClick={this.retry}>
              Try Again
            </button>
          </div>
        )}
        {!noUserName && !isError && profileSummary.length === 0 && (
          <div className="empty-container">
            <img
              src="https://res.cloudinary.com/dkxqg2chl/image/upload/v1753808986/Layer_3_mkvlc6.png"
              alt="no repositories"
              className="analysis-empty-image"
            />
            <h1 className="empty-para">No Repositories Found</h1>
          </div>
        )}
        {!noUserName && !isError && profileSummary.length !== 0 && (
          <div className="analysis-container">
            {profileSummary.user && (
              <div className="user-info">
                <img
                  src={profileSummary.user.avatarUrl}
                  alt={profileSummary.user.login}
                  className="user-avatar"
                />
                <h1 className="user-login-heading">
                  {profileSummary.user.login}
                </h1>
              </div>
            )}
            <h1 className="analysis-heading">Analysis</h1>
            <div className="line-graph-container">
              <ResponsiveContainer width="95%" height={300}>
                <LineChart
                  data={lineData}
                  margin={{top: 10, right: 30, left: 0, bottom: 5}}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="quarter" />
                  <YAxis />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="commits"
                    stroke="#3B82F6"
                    strokeWidth={2}
                    dot={{r: 4}}
                  />
                </LineChart>
              </ResponsiveContainer>
              <p data-testid="Commits Per Quarter" className="graph-para">
                Commits Per Quarter
              </p>
            </div>
            <div className="repo-align">
              <div className="repo-pie-container">
                <h1 className="repo-pie-heading">Language Per Repos</h1>
                <ResponsiveContainer height={400} width={400}>
                  <PieChart>
                    <Pie
                      cx="50%"
                      cy="50%"
                      data={pieChartData}
                      startAngle={0}
                      endAngle={360}
                      innerRadius="40%"
                      outerRadius="70%"
                      dataKey="value"
                    >
                      {pieChartData.map((entry, index) => (
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
              <div className="repo-pie-container">
                <h1 className="repo-pie-heading">Language Per Commits</h1>
                <ResponsiveContainer height={400} width={400}>
                  <PieChart>
                    <Pie
                      cx="50%"
                      cy="50%"
                      data={pieChartData2}
                      startAngle={0}
                      endAngle={360}
                      innerRadius="40%"
                      outerRadius="70%"
                      dataKey="value"
                    >
                      {pieChartData2.map((entry, index) => (
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
            <h1 className="repo-pie-heading">Commits Per Repo (Top 10)</h1>
            <div className="commit-pie-container-1">
              <ResponsiveContainer width="100%" aspect={1.8}>
                <PieChart>
                  <Pie
                    cx="50%"
                    cy="50%"
                    data={commit}
                    startAngle={0}
                    endAngle={360}
                    innerRadius="40%"
                    outerRadius="70%"
                    dataKey="value"
                  >
                    {commit.map((entry, index) => (
                      <Cell
                        key={entry.name}
                        name={entry.description}
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
            <div className="commit-pie-container-2">
              <ResponsiveContainer width="100%" aspect={0.7}>
                <PieChart>
                  <Pie
                    cx="50%"
                    cy="50%"
                    data={commit}
                    startAngle={0}
                    endAngle={360}
                    innerRadius="40%"
                    outerRadius="70%"
                    dataKey="value"
                  >
                    {commit.map((entry, index) => (
                      <Cell
                        key={entry.name}
                        name={entry.description}
                        fill={colors[index % colors.length]}
                      />
                    ))}
                  </Pie>
                  <Legend
                    iconType="square"
                    layout="vertical"
                    verticalAlign="bottom"
                    align="center"
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
          <div className="summary-loader-container" data-testid="loader">
            <Loader type="TailSpin" color="#3B82F6" height={50} width={50} />
          </div>
        ) : (
          this.displayProfileSummary()
        )}
      </>
    )
  }
}

export default Analysis
