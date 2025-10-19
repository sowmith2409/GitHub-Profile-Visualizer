import {useState} from 'react'
import {Link, useLocation} from 'react-router-dom'
import {GiHamburgerMenu} from 'react-icons/gi'
import './index.css'

const myLinksList = [
  {id: 'HOME', displayText: 'Home', link: '/'},
  {id: 'REPOSITORIES', displayText: 'Repositories', link: '/repositories'},
  {id: 'ANALYSIS', displayText: 'Analysis', link: '/analysis'},
]

const Header = () => {
  const location = useLocation()

  const [myOption, getOption] = useState(false)
  const showOptions = () => {
    getOption(prev => !prev)
  }

  return (
    <>
      <nav className="nav-container" data-testid="header">
        <Link to="/" className="head-link">
          <h1 className="nav-heading">GitHub Profile Visualizer</h1>
        </Link>

        <ul className="nav-list">
          {myLinksList.map(each => (
            <li key={each.id}>
              <Link
                to={each.link}
                className={
                  location.pathname === each.link ? 'active-link' : 'link'
                }
              >
                {each.displayText}
              </Link>
            </li>
          ))}
        </ul>

        <button
          aria-label="Toggle menu"
          className="hamberg-button"
          type="button"
          onClick={showOptions}
        >
          <GiHamburgerMenu color="#ffffff" size={22} />
        </button>
      </nav>

      {myOption && (
        <ul className="hamberg-list">
          {myLinksList.map(each => (
            <li key={each.id}>
              <Link
                to={each.link}
                className={
                  location.pathname === each.link ? 'active-link' : 'link'
                }
                onClick={() => getOption(false)} // close menu on click
              >
                {each.displayText}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </>
  )
}

export default Header
