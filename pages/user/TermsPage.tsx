import React from 'react';
import Card from '../../components/Card';
import Button from '../../components/Button';

const termsContentHtml = `
  <h1 class="!text-3xl !font-bold !text-brand-primary !mb-4">Flare Auto Earning - Terms & Conditions</h1>
  
  <h2>1. Introduction</h2>
  <p>Welcome to Flare Auto Earning, a digital earning and trading platform designed to provide automated income opportunities through compounding returns.</p>
  <p>By accessing or using our platform, you agree to comply with these Terms & Conditions. Please read them carefully before investing or participating.</p>
  
  <div class="my-6 border-b border-white/10"></div>

  <h2>2. Definitions</h2>
  <ul>
    <li><strong>Company / Platform</strong> — refers to Flare Auto Earning and its management team.</li>
    <li><strong>Investor / User</strong> — any person who registers or invests funds through the platform.</li>
    <li><strong>Investment Plan</strong> — a structured earning program that provides daily or periodic returns based on the deposited amount.</li>
    <li><strong>ROI (Return on Investment)</strong> — the percentage of profit distributed to investors.</li>
    <li><strong>Compounding</strong> — reinvestment of daily profits to increase overall returns.</li>
  </ul>
  
  <div class="my-6 border-b border-white/10"></div>

  <h2>3. Eligibility</h2>
  <ul>
    <li>The minimum age for participation is 18 years.</li>
    <li>Users must provide accurate personal and financial information.</li>
    <li>The platform may reject or suspend accounts found in violation of laws or fraudulent activity.</li>
  </ul>
  
  <div class="my-6 border-b border-white/10"></div>

  <h2>4. Investment Policy</h2>
  <ul>
    <li>All investments are made voluntarily by users after reviewing the company's working plan.</li>
    <li>ROI percentages are variable and depend on market performance, internal revenue, and risk management.</li>
    <li>The company reserves the right to modify ROI, duration, or packages for sustainability.</li>
    <li>Users are encouraged to invest only what they can afford to risk.</li>
  </ul>

  <div class="my-6 border-b border-white/10"></div>

  <h2>5. Profit Distribution</h2>
  <ul>
    <li>Daily profits are credited automatically based on the user's selected plan.</li>
    <li>Compound profits increase automatically unless the user opts for withdrawal.</li>
    <li>Withdrawal requests must comply with the platform's rules, including minimum balance and verification.</li>
  </ul>

  <div class="my-6 border-b border-white/10"></div>

  <h2>6. Risk Disclaimer</h2>
  <ul>
    <li>All investments carry financial risk. Past performance is not a guarantee of future results.</li>
    <li>The company will not be liable for losses due to market volatility, technical failure, or investor negligence.</li>
    <li>Users accept full responsibility for their investment decisions.</li>
  </ul>

  <div class="my-6 border-b border-white/10"></div>

  <h2>7. Account & Security</h2>
  <ul>
    <li>Users are responsible for maintaining the confidentiality of their login credentials.</li>
    <li>Any suspicious activity must be reported immediately to the support team.</li>
    <li>The company will not be responsible for unauthorized access caused by user negligence.</li>
  </ul>

  <div class="my-6 border-b border-white/10"></div>

  <h2>8. Company Rights</h2>
  <ul>
    <li>The company reserves the right to update or change these terms without prior notice.</li>
    <li>In case of system maintenance, withdrawals or earnings may be temporarily delayed.</li>
    <li>Fraudulent or suspicious accounts may be terminated permanently.</li>
  </ul>

  <div class="my-6 border-b border-white/10"></div>

  <h2>9. Refund & Cancellation</h2>
  <ul>
    <li>Once deposited, investment amounts are non-refundable, except in rare cases approved by management.</li>
    <li>Users may withdraw profits according to company policy but cannot claim initial deposits before plan maturity.</li>
  </ul>

  <div class="my-6 border-b border-white/10"></div>

  <h2>10. Legal Jurisdiction</h2>
  <ul>
    <li>These Terms & Conditions are governed by the laws of the jurisdiction where Flare Auto Earning operates.</li>
    <li>In case of disputes, both parties agree to seek resolution through mediation or arbitration before legal action.</li>
  </ul>

  <div class="my-6 border-b border-white/10"></div>

  <h2>11. Contact & Support</h2>
  <p>For any concerns or clarifications, please contact:<br/>
  <a href="mailto:support@flareautoearning.com">support@flareautoearning.com</a>
  </p>
  <p>
  <a href="http://www.flareautoearning.com" target="_blank" rel="noopener noreferrer">www.flareautoearning.com</a>
  </p>
`;

interface TermsPageProps {
  onBack?: () => void;
}

const TermsPage: React.FC<TermsPageProps> = ({ onBack }) => {
  return (
    <div className="max-w-4xl mx-auto">
      <Card>
        <div 
          className="prose prose-invert prose-p:text-brand-gray prose-h2:text-white prose-h2:text-2xl prose-h2:font-bold prose-a:text-brand-primary hover:prose-a:underline prose-li:text-brand-gray prose-strong:text-white max-w-none"
          dangerouslySetInnerHTML={{ __html: termsContentHtml }} 
        />
      </Card>
      {onBack && (
        <div className="mt-8 text-center">
          <Button onClick={onBack} variant="secondary">
            Back to Home
          </Button>
        </div>
      )}
    </div>
  );
};

export default TermsPage;