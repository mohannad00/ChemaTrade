import { PageHeader } from '@/components/ui/PageHeader';
import { Button } from '@/components/ui/Button';
import { Notice } from '@/components/ui/States';
import { useDocumentTitle } from '@/hooks/common';
import styles from './CompanyPages.module.css';

export function AboutPage() {
  useDocumentTitle('About');
  return (
    <>
      <PageHeader eyebrow="About Chema Trade" title="Scientific equipment, sourced and supported" lede="Chema Trade supplies laboratory equipment, maintenance and spare parts. This page is a design placeholder: the company story, history and credentials will be supplied by Chema Trade." demoTag />
      <div className={`container ${styles.wrap}`}>
        <div className={`prose ${styles.text}`}>
          <h2>What this site covers</h2>
          <p>Chema Trade’s offer is organised in three areas: laboratory equipment, maintenance services and spare parts. Each area is represented in this demo so the structure, navigation and workflows can be reviewed.</p>
          <h2>How we will work with customers</h2>
          <p>The intended flow is simple: browse equipment, request a quotation or maintenance, and have Chema Trade confirm availability, specifications and scope directly with you.</p>
          <h2>What is not stated here</h2>
          <p>Deliberately, this demo makes no claims about years in business, number of customers, supplier partnerships, certifications, warranties or awards. Those facts will be added only once Chema Trade provides and verifies them.</p>
        </div>
        <Notice tone="demo" title="Placeholder copy">Replace this page with approved company information before launch.</Notice>
        <div className={styles.nfActions}>
          <Button to="/contact">Contact Chema Trade</Button>
          <Button to="/equipment" variant="secondary">Browse equipment</Button>
        </div>
      </div>
    </>
  );
}
