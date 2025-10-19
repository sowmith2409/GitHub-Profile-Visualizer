import {Link} from 'react-router-dom'

import './index.css'

const NotFound = () => (
  <div className="not-found-container">
    <img
      src="https://res.cloudinary.com/dkxqg2chl/image/upload/v1753966457/Group_7519_ajismr.png"
      alt="page not found"
      className="not-found-image"
    />
    <h1 className="not-found-heading">PAGE NOT FOUND</h1>
    <p className="not-found-para">
      we are sorry, the page you requested could not be found Please go back to
      the homepage.
    </p>
    <Link to="/" className="link">
      <button type="button" className="home-button">
        Go to Home
      </button>
    </Link>
  </div>
)

export default NotFound
