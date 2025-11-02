import React from 'react';
import Card from '../../components/Card';

const whitepaperContentHtml = `
  <div class="text-center mb-8">
    <h1 class="!text-4xl !font-black !text-brand-primary">Flare Auto Earning</h1>
    <p class="text-lg text-gray-300">"Empowering Smart Digital Growth Through Automated Earnings"</p>
  </div>
  
  <div class="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm mb-8 bg-brand-dark/30 p-4 rounded-lg border border-white/10">
      <p><strong>Founded by:</strong> Flare</p>
      <p><strong>Type:</strong> Auto Earning | Trading</p>
      <p><strong>Head Office:</strong> Global Online Platform</p>
      <p class="md:col-span-2"><strong>Official Email:</strong> <a href="mailto:support@flareautoearning.com">support@flareautoearning.com</a></p>
      <p><strong>Website:</strong> <a href="https://www.flareautoearning.com" target="_blank" rel="noopener noreferrer">www.flareautoearning.com</a></p>
  </div>

  <h2>1. Company Overview</h2>
  <p>Flare Auto Earning is an innovative digital platform providing users with automated income opportunities through trading, network-based revenue, and compounding ROI systems. Our mission is to simplify earning through technology — offering a transparent, secure, and performance-driven environment for individuals and investors worldwide.</p>
  <p>The platform leverages <strong>smart automation, blockchain security, and ROI-based compounding growth</strong> to help investors earn consistently while maintaining sustainable company growth.</p>
  
  <div class="my-6 border-b border-white/10"></div>
  
  <h2>2. Vision & Mission</h2>
  <p><strong>Vision:</strong> To empower individuals globally through accessible, automated earning tools that promote financial independence and smart investment.</p>
  <p><strong>Mission:</strong> To provide a transparent, technology-driven platform that balances profitability, trust, and long-term stability in the digital earning ecosystem.</p>

  <div class="my-6 border-b border-white/10"></div>
  
  <h2>3. Founder Information</h2>
  <p><strong>Founder Name:</strong> Flare</p>
  <p><strong>Experience:</strong> Digital Trader, Blockchain Analyst, and Investment Strategist</p>
  <p><strong>Focus:</strong> Long-term sustainability through fair profit sharing and automated compounding models.</p>
  
  <div class="my-6 border-b border-white/10"></div>

  <h2>4. Investment & ROI Plans (Example Simulation)</h2>
  <p>Flare Auto Earning operates on a <strong>2% daily compound return model</strong> — meaning profits are added to capital daily for exponential growth.</p>
  <div class="overflow-x-auto my-4">
    <table class="w-full text-left">
      <thead>
        <tr class="border-b border-white/20">
          <th class="p-3">Investment ($)</th>
          <th class="p-3">Daily ROI</th>
          <th class="p-3">Duration</th>
          <th class="p-3">Total After 30 Days ($)</th>
          <th class="p-3">Total Profit ($)</th>
        </tr>
      </thead>
      <tbody>
        <tr><td class="p-3">35</td><td class="p-3">2%</td><td class="p-3">30 Days</td><td class="p-3">63.31</td><td class="p-3">28.31</td></tr>
        <tr><td class="p-3">50</td><td class="p-3">2%</td><td class="p-3">30 Days</td><td class="p-3">90.44</td><td class="p-3">40.44</td></tr>
        <tr><td class="p-3">100</td><td class="p-3">2%</td><td class="p-3">30 Days</td><td class="p-3">180.89</td><td class="p-3">80.89</td></tr>
        <tr><td class="p-3">200</td><td class="p-3">2%</td><td class="p-3">30 Days</td><td class="p-3">361.78</td><td class="p-3">161.78</td></tr>
        <tr><td class="p-3">300</td><td class="p-3">2%</td><td class="p-3">30 Days</td><td class="p-3">542.67</td><td class="p-3">242.67</td></tr>
        <tr><td class="p-3">500</td><td class="p-3">2%</td><td class="p-3">30 Days</td><td class="p-3">904.45</td><td class="p-3">404.45</td></tr>
      </tbody>
    </table>
  </div>
  <p class="text-sm text-gray-400 italic">(Calculated using daily compounding formula: Final = Principal × (1 + 0.02)^30)</p>

  <div class="my-6 border-b border-white/10"></div>

  <h2>5. Company Profit Sharing Overview</h2>
  <ul>
    <li>If 100 people invest, the company receives a capital pool accordingly.</li>
    <li>The company allocates <strong>2% daily ROI</strong> to investors from trading profits.</li>
    <li>The company maintains <strong>management reserves (10–20%)</strong> from total returns for sustainability and system operations.</li>
    <li>Total company revenue depends on trading volume, liquidity, and reinvestment structure.</li>
  </ul>
  <p class="mt-4"><strong>Example:</strong> If 100 investors deposit $100 each = $10,000 pool.</p>
  <ul>
      <li>Investors receive a total ~$18,089 after 30 days.</li>
      <li>The company earns ~$2,000–$3,000 net profit (after payouts and operational costs).</li>
  </ul>

  <div class="my-6 border-b border-white/10"></div>
  
  <h2>6. Working Model</h2>
  <ol>
    <li><strong>User Registration</strong> → Create account and verify KYC.</li>
    <li><strong>Investment Deposit</strong> → Choose package ($35-$500 or more).</li>
    <li><strong>Automated ROI</strong> → 2% daily return, compounded automatically.</li>
    <li><strong>Profit Withdrawal or Reinvestment</strong> → Weekly or monthly.</li>
    <li><strong>Referral Income (Optional)</strong> → Additional network earning opportunity.</li>
    <li><strong>Transparency Dashboard</strong> → Real-time earning reports and profit tracker.</li>
  </ol>
  
  <div class="my-6 border-b border-white/10"></div>

  <h2>7. Risk & Sustainability</h2>
  <ul>
    <li>ROI is performance-based and may fluctuate slightly depending on trading outcomes.</li>
    <li>The company ensures consistent operation through diversification of assets.</li>
    <li>All investors are advised to invest responsibly.</li>
  </ul>

  <div class="my-6 border-b border-white/10"></div>

  <h2>8. Terms & Conditions Summary</h2>
  <ol>
    <li><strong>Eligibility:</strong> Minimum age 18 years; valid identity required.</li>
    <li><strong>Voluntary Investment:</strong> All deposits are the investor's own decision.</li>
    <li><strong>Profit Distribution:</strong> Based on selected plan; credited automatically.</li>
    <li><strong>Refunds:</strong> Deposits are non-refundable once invested.</li>
    <li><strong>Risk Disclosure:</strong> Trading involves potential financial risk; profits are not guaranteed.</li>
    <li><strong>Security:</strong> Users must secure their login credentials.</li>
    <li><strong>Company Rights:</strong> ROI rates and policies may be adjusted for long-term stability.</li>
    <li><strong>Compliance:</strong> Users must follow all applicable financial and cyber laws.</li>
    <li><strong>Dispute Resolution:</strong> All matters governed under applicable business laws.</li>
    <li><strong>Contact:</strong> support@flareautoearning.com</li>
  </ol>

  <div class="my-6 border-b border-white/10"></div>
  
  <h2>9. Disclaimer</h2>
  <p>Flare Auto Earning is an independent digital platform offering income through compounding and trading systems. It does not provide financial advice or guarantee fixed returns. Investors are responsible for understanding all terms and associated risks.</p>

  <div class="my-6 border-b border-white/10"></div>

  <h2>10. Tagline</h2>
  <p class="text-xl italic text-brand-primary">"Empowering Smart Digital Growth Through Automated Earnings"</p>
`;

const WhitepaperPage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto">
      <Card>
        <div 
          className="prose prose-invert prose-p:text-brand-gray prose-h2:text-white prose-h2:text-2xl prose-h2:font-bold prose-a:text-brand-primary hover:prose-a:underline prose-li:text-brand-gray prose-strong:text-white max-w-none"
          dangerouslySetInnerHTML={{ __html: whitepaperContentHtml }} 
        />
      </Card>
    </div>
  );
};

export default WhitepaperPage;
