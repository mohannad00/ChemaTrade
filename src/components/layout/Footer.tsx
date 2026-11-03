import { Link } from 'react-router-dom';
import { DEMO_DISCLAIMER } from '@/config/app.config';
import styles from './Footer.module.css';

export function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={`container ${styles.grid}`}>
        <div>
          <p className={styles.brand}>Chema <em>Trade</em></p>
          <p className={styles.note}>{DEMO_DISCLAIMER}</p>
        </div>
        <nav aria-label="Equipment and services">
          <h2 className="eyebrow">Explore</h2>
          <ul>
            <li><Link to="/equipment">Equipment catalog</Link></li>
            <li><Link to="/maintenance">Maintenance services</Link></li>
            <li><Link to="/spare-parts">Spare parts</Link></li>
            <li><Link to="/resources">Technical resources</Link></li>
          </ul>
        </nav>
        <nav aria-label="Requests and company">
          <h2 className="eyebrow">Company</h2>
          <ul>
            <li><Link to="/request-quote">Request a quotation</Link></li>
            <li><Link to="/request-maintenance">Request maintenance</Link></li>
            <li><Link to="/about">About</Link></li>
            <li><Link to="/contact">Contact</Link></li>
          </ul>
        </nav>
        <nav aria-label="Legal and demo">
          <h2 className="eyebrow">Legal &amp; demo</h2>
          <ul>
            <li><Link to="/privacy">Privacy</Link></li>
            <li><Link to="/terms">Terms</Link></li>
            <li><Link to="/admin">Demo admin dashboard</Link></li>
          </ul>
        </nav>
      </div>
      <div className={`container ${styles.base}`}>
        <span className="mono">© {new Date().getFullYear()} Chema Trade — frontend demo</span>
        <span className="mono">Demo build · no backend connected</span>
      </div>
    </footer>
  );
}
