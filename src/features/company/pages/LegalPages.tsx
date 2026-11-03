import { PageHeader } from '@/components/ui/PageHeader';
import { Notice } from '@/components/ui/States';
import { useDocumentTitle } from '@/hooks/common';
import styles from './CompanyPages.module.css';

export function PrivacyPage() {
  useDocumentTitle('Privacy');
  return (
    <>
      <PageHeader eyebrow="Legal" title="Privacy" lede="How this demonstration handles information." />
      <div className={`container ${styles.wrap}`}>
        <Notice tone="demo" title="Demo placeholder">This is not a legal privacy policy. Chema Trade must provide and approve the final policy before any real data is collected.</Notice>
        <div className="prose">
          <h2>This demo collects nothing remotely</h2>
          <p>There is no backend. Anything you type into a form is kept only in your browser’s local storage so it can appear in the demo dashboard. It is never transmitted to Chema Trade or any third party by this site.</p>
          <h2>Clearing demo data</h2>
          <p>Use “Reset demo data” in the demo admin dashboard, or clear this site’s data in your browser settings, to remove everything stored by the demo.</p>
          <h2>Please use sample data</h2>
          <p>Do not enter real personal or confidential information in the demo forms.</p>
          <h2>Production policy</h2>
          <p>A production version will need a policy covering what is collected, why, how long it is kept, who processes it, and how to exercise your rights.</p>
        </div>
      </div>
    </>
  );
}

export function TermsPage() {
  useDocumentTitle('Terms');
  return (
    <>
      <PageHeader eyebrow="Legal" title="Terms of use" lede="Terms that apply to this demonstration." />
      <div className={`container ${styles.wrap}`}>
        <Notice tone="demo" title="Demo placeholder">These are not legal terms. Final terms must be supplied by Chema Trade.</Notice>
        <div className="prose">
          <h2>Demonstration only</h2>
          <p>This site is a frontend demonstration. All equipment, specifications, articles, requests and statistics are sample content.</p>
          <h2>No offers or availability</h2>
          <p>Nothing here is an offer, quotation, stock statement or guarantee. Actual availability, specifications and prices must be confirmed by Chema Trade.</p>
          <h2>Simulated submissions</h2>
          <p>Forms are simulated. Submitting them does not contact Chema Trade, place orders, or book any service.</p>
          <h2>Demo dashboard</h2>
          <p>The dashboard is a demonstration of a future admin interface. It has no real authentication and must not be treated as secure.</p>
        </div>
      </div>
    </>
  );
}
