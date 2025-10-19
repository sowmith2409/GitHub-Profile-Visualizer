import {Link} from 'react-router-dom'

import Header from '../Header'

import './index.css'

const NoInternet = () => (
  <div className="no-internet-container">
    <Header />
    <img
      src="https://res.cloudinary.com/dkxqg2chl/image/upload/v1753689835/Group_7522_l9uswp.png"
      alt="no internet"
      className="network-image"
    />
    <p className="network-para">
      No Internet. Please Check the Internet Connection
    </p>
    <Link to="/" className="link">
      <button type="button" className="network-button">
        Try again
      </button>
    </Link>
  </div>
)

export default NoInternet
