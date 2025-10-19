import {Component} from 'react'

import {Link} from 'react-router-dom'

import Loader from 'react-loader-spinner'

import {AiOutlineStar} from 'react-icons/ai'

import {GoRepoForked} from 'react-icons/go'

import Header from '../Header'

import './index.css'

const cssClassList = [
  'language-item-1',
  'language-item-2',
  'language-item-3',
  'language-item-4',
]

class Repository extends Component {
  state = {
    isLoading: '',
    repoList: [],
    noData: false,
    isError: false,
  }

  componentDidMount() {
    this.fetchRepository()
  }

  fetchRepository = async () => {
    this.setState({isLoading: true})
    const mySearchValue = JSON.parse(localStorage.getItem('searchValue'))
    if (!mySearchValue || mySearchValue.trim() === '') {
      this.setState({noData: true, isLoading: false})
    } else {
      try {
        const token = process.env.REACT_APP_GITHUB_TOKEN
        const url = `https://apis2.ccbp.in/gpv/repos/${mySearchValue}`
        const response = await fetch(url, {
          headers: {
            Authorization: `token ${token}`,
          },
        })
        const data = await response.json()
        console.log(data)
        const repoList = data.map(each => ({
          id: each.id,
          name: each.name,
          forksCount: each.forks_count,
          languages: each.languages,
          stargazersCount: each.stargazers_count,
          owner: each.owner,
        }))
        if (response.ok) {
          this.setState({isLoading: false, repoList})
        } else {
          this.setState({isLoading: false, isError: true})
        }
      } catch (error) {
        this.setState({isLoading: false, isError: true})
      }
    }
  }

  displayRepositories = () => {
    const {repoList, noData, isError} = this.state

    return (
      <div className="repo-container">
        <Header />
        {noData && (
          <div className="mt-data-container">
            <img
              src="https://res.cloudinary.com/dkxqg2chl/image/upload/v1753858170/Empty_Box_Illustration_1_hbeng9.png"
              alt="empty repositories"
              className="mt-data-image"
            />
            <h1 className="mt-data-heading">No Data Found</h1>
            <p className="mt-data-para">
              GitHub Username is empty, please provide a valid username for
              Repositories
            </p>
            <Link to="/" className="link">
              <button type="button" className="mt-home-button">
                Go to Home
              </button>
            </Link>
          </div>
        )}
        {!noData && isError && (
          <div className="fail-container">
            <img
              src="https://res.cloudinary.com/dkxqg2chl/image/upload/v1753689835/Group_7522_l9uswp.png"
              alt="failure view"
              className="fail-image"
            />
            <p className="fail-para">Something went wrong. Please try again</p>
            <button
              type="button"
              className="try-button"
              onClick={this.fetchRepository}
            >
              Try Again
            </button>
          </div>
        )}
        {!noData && !isError && repoList.length === 0 && (
          <div className="no-container">
            <img
              src="https://res.cloudinary.com/dkxqg2chl/image/upload/v1753808986/Layer_3_mkvlc6.png"
              alt="no repositories"
              className="no-res-image"
            />
            <h1 className="no-paragraph">No Repositories Found</h1>
          </div>
        )}
        {!noData && !isError && repoList.length !== 0 && (
          <div className="repo-list-container">
            <div className="user-info">
              <img
                src={repoList[0]?.owner?.avatar_url}
                alt={repoList[0]?.owner?.login}
                className="user-avatar"
              />
              <h1 className="user-login-heading">
                {repoList[0]?.owner?.login}
              </h1>
            </div>
            <h1 className="repo-heading">Repositories</h1>
            <ul className="repo-list">
              {repoList.map(each => (
                <Link
                  key={each.id}
                  className="link"
                  to={`/repositories/${each.name}`}
                >
                  <li className="repo-item">
                    <h1 className="repo-item-heading">{each.name}</h1>
                    <p className="repo-item-para">
                      To create a nested list using the web editor on GitHub or
                      a text editor that uses a monospaced font, like Atom, you
                      can align your list visually.
                    </p>
                    <ul className="languages-list">
                      {each.languages.map(item => (
                        <li
                          key={item.name}
                          className={
                            cssClassList[
                              Math.floor(Math.random() * cssClassList.length)
                            ]
                          }
                        >
                          <p className="languages">{item.name}</p>
                        </li>
                      ))}
                    </ul>
                    <div className="star-fork-container">
                      <div className="star-container">
                        <AiOutlineStar color="#94A3B8" size={16} />
                        <p className="star-fork-para">{each.stargazersCount}</p>
                      </div>
                      <div className="fork-container">
                        <GoRepoForked color="#94A3B8" size={16} />
                        <p className="star-fork-para">{each.forksCount}</p>
                      </div>
                    </div>
                  </li>
                </Link>
              ))}
            </ul>
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
          this.displayRepositories()
        )}
      </>
    )
  }
}

export default Repository
