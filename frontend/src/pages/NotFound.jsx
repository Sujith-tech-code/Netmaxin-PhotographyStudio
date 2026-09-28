import { Link } from 'react-router-dom';
import { ArrowLeft, Film } from 'lucide-react';
import PageHeader from '../components/PageHeader';
import Stamp from '../components/Stamp';

const NotFound = () => {
  return (
    <div className="not-found-page">
      <PageHeader
        label="Frame Not Found"
        title="404 — Blank Negative"
        subtitle="The frame or archive ledger you are looking for has not been exposed or has been filed under a different reference."
      />

      <div className="container container-narrow" style={{ textAlign: 'center', padding: '2rem 1.5rem 6rem' }}>
        <div style={{ marginBottom: '1.5rem' }}>
          <Stamp variant="rust">UNEXPOSED FRAME</Stamp>
        </div>
        <div style={{ color: 'var(--color-ink-muted)', marginBottom: '2rem' }}>
          <Film size={48} style={{ margin: '0 auto 1rem', display: 'block', color: 'var(--accent-rust)' }} />
          <p>Please return to the studio parlor or explore the curated contact sheets.</p>
        </div>
        <div>
          <Link to="/" className="btn btn-primary">
            <ArrowLeft size={16} />
            <span>Return to Studio Home</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
