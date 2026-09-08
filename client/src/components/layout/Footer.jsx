import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="container footer-grid">
        <div>
          <div className="brand brand--footer">
            <span className="brand__mark">ZT</span>
            <span className="brand__text">ZAM TALENT TOP</span>
          </div>
          <p className="footer-copy">
            Discover Zambia&apos;s talent, connect with trusted professionals and grow your creative or business network.
          </p>
        </div>

        <div>
          <h3>Explore</h3>
          <ul className="footer-list">
            <li><Link to="/discover">Discover talent</Link></li>
            <li><Link to="/categories">Categories</Link></li>
            <li><Link to="/marketplace">Marketplace</Link></li>
          </ul>
        </div>

        <div>
          <h3>For talent</h3>
          <ul className="footer-list">
            <li><Link to="/register">Create profile</Link></li>
            <li><Link to="/dashboard">Dashboard</Link></li>
            <li><Link to="/login">Login</Link></li>
          </ul>
        </div>

        <div>
          <h3>Contact</h3>
          <ul className="footer-list">
            <li><a href="mailto:hello@zamtalenttop.com">hello@zamtalenttop.com</a></li>
            <li><a href="tel:+260966000000">+260 966 000 000</a></li>
            <li><span>Lusaka, Zambia</span></li>
          </ul>
        </div>
      </div>

      <div className="container footer-bottom">
        <span>© 2026 ZAM TALENT TOP</span>
        <span>Discover Zambia&apos;s Talent. Connect. Create. Grow.</span>
      </div>
    </footer>
  );
}
