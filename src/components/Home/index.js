import {Component} from 'react'

import Loader from 'react-loader-spinner'

import {RiBuildingLine} from 'react-icons/ri'

import {IoMdLink} from 'react-icons/io'

import {IoLocationOutline} from 'react-icons/io5'

import {HiOutlineSearch} from 'react-icons/hi'

import Header from '../Header'
import './index.css'

class Home extends Component {
  state = {
    inputValue: '',
    isError: false,
    isLoader: false,
    fetchStarted: true,
    errorMesg: '',
    userDetails: {},
  }

  componentDidMount() {
    localStorage.removeItem('searchValue')
  }

  getProfileDetails = async (event = null) => {
    const {inputValue} = this.state
    if (event) {
      event.preventDefault()
    }
    localStorage.setItem('searchValue', JSON.stringify(inputValue))
    const mySearchValue = JSON.parse(localStorage.getItem('searchValue'))
    try {
      this.setState({fetchStarted: false, isLoader: true})
      const url = `https://apis2.ccbp.in/gpv/profile-details/${mySearchValue}?api_key=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`
      const response = await fetch(url)
      const data = await response.json()
      const userDetails = {
        avatarUrl: data.avatar_url,
        bio: data.bio,
        company: data.company,
        followers: data.followers,
        following: data.following,
        location: data.location,
        name: data.name,
        publicRepos: data.public_repos,
        organizationsUrl: data.organizations_url,
        login: data.login,
        blog: data.blog,
      }
      if (response.ok) {
        this.setState({isLoader: false, isError: false, userDetails})
      } else {
        this.setState({
          isLoader: false,
          isError: true,
          errorMesg: data.error_msg,
        })
      }
    } catch (error) {
      this.setState({isLoader: false, isError: true})
    }
  }

  saveSearchValue = event => {
    this.setState({inputValue: event.target.value})
  }

  retry = () => {
    this.setState({isLoader: true})
    this.getProfileDetails()
  }

  displayProfie = () => {
    const {isError, userDetails} = this.state

    return (
      <>
        {isError ? (
          <div className="profile-view-container">
            <h1 className="home-heading">Github Profile Visualizer</h1>
            <img
              src="https://res.cloudinary.com/dkxqg2chl/image/upload/v1753689835/Group_7522_l9uswp.png"
              alt="failure view"
              className="error-image"
            />
            <p className="error-paragraph">
              Something went wrong. Please try again
            </p>
            <button type="button" className="again-button" onClick={this.retry}>
              Try again
            </button>
          </div>
        ) : (
          <div className="profile-container">
            <img
              src={userDetails.avatarUrl}
              alt={userDetails.name}
              className="profile-image"
            />
            <h1 className="name">{userDetails.name}</h1>
            <p className="bio-para-2">{userDetails.login}</p>
            <p className="bio-para-1">BLOG {userDetails.blog}</p>
            <p className="bio-para-3">BIO {userDetails.bio}</p>
            <div className="followers-container">
              <div className="category-container">
                <p className="count">{userDetails.followers}</p>
                <p className="count-category">FOLLOWERS</p>
              </div>
              <hr className="line" />
              <div className="category-container">
                <p className="count">{userDetails.following}</p>
                <p className="count-category">FOLLOWING</p>
              </div>
              <hr className="line" />
              <div className="category-container">
                <p className="count">{userDetails.publicRepos}</p>
                <p className="count-category">PUBLIC REPOS</p>
              </div>
            </div>
            <div className="company-details-container">
              <div className="category-container">
                <p className="company">Company</p>
                <div className="icon-container">
                  <RiBuildingLine color="#F8FAFC" size={24} />
                  <p className="com-name">{userDetails.company}</p>
                </div>
              </div>
              <div className="category-container-2">
                <p className="company">Company Url</p>
                <div className="icon-container">
                  <IoMdLink color="#F8FAFC" size={24} />
                  <p className="com-name">{userDetails.organizationsUrl}</p>
                </div>
              </div>
              <div className="category-container-2">
                <p className="company">Location</p>
                <div className="icon-container">
                  <IoLocationOutline color="#F8FAFC" size={24} />
                  <p className="com-name">{userDetails.location}</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </>
    )
  }

  render() {
    const {inputValue, isLoader, fetchStarted, errorMesg, isError} = this.state
    return (
      <>
        {isLoader ? (
          <div className="loader-container" data-testid="loader">
            <Loader type="TailSpin" color="#3B82F6" height={50} width={50} />
          </div>
        ) : (
          <div className="home-container">
            <Header />
            <div className="form-container">
              <form
                onSubmit={this.getProfileDetails}
                className="search-container"
              >
                <input
                  type="search"
                  placeholder="Enter github username"
                  className={isError ? 'error-search-input' : 'search-input'}
                  value={inputValue}
                  onChange={this.saveSearchValue}
                />
                <button
                  data-testid="searchButton"
                  type="submit"
                  className="search-icon-container"
                  aria-label="Search"
                >
                  <HiOutlineSearch color="#FFFFFF" size={24} />
                </button>
              </form>
              {isError && <p className="error-mesg">{errorMesg}</p>}
            </div>
            {fetchStarted ? (
              <div className="profile-view-container">
                <h1 className="home-heading">Github Profile Visualizer</h1>
                <img
                  src="https://res.cloudinary.com/dkxqg2chl/image/upload/v1753695393/Group_2_wiobif.png"
                  alt="gitHub profile visualizer home page"
                  className="home-img"
                />
              </div>
            ) : (
              this.displayProfie()
            )}
          </div>
        )}
      </>
    )
  }
}

export default Home
