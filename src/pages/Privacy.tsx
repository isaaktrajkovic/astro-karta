import type { ReactNode } from 'react';

const PolicySection = ({
  id,
  title,
  updated,
  children,
}: {
  id: string;
  title: string;
  updated: string;
  children: ReactNode;
}) => (
  <section
    id={id}
    className="scroll-mt-24 rounded-2xl border border-border bg-card/60 p-6 md:p-10 shadow-xl space-y-8"
  >
    <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
      <div>
        <p className="text-xs uppercase tracking-[0.3em] text-primary/80">Policy</p>
        <h2 className="text-2xl md:text-3xl font-bold text-gradient">{title}</h2>
      </div>
      <p className="text-sm text-muted-foreground">Last updated: {updated}</p>
    </div>
    <div className="space-y-8">{children}</div>
  </section>
);

const Subsection = ({ title, children }: { title: string; children: ReactNode }) => (
  <div className="space-y-3">
    <h3 className="text-lg md:text-xl font-semibold text-foreground">{title}</h3>
    <div className="space-y-3 text-muted-foreground leading-relaxed">{children}</div>
  </div>
);

const TableWrapper = ({ children }: { children: ReactNode }) => (
  <div className="overflow-x-auto rounded-lg border border-border bg-background/40">
    <table className="w-full min-w-[640px] text-sm text-muted-foreground">{children}</table>
  </div>
);

const Th = ({ children }: { children: ReactNode }) => (
  <th className="px-4 py-3 text-left text-sm font-semibold text-foreground">{children}</th>
);

const Td = ({ children }: { children: ReactNode }) => (
  <td className="px-4 py-3 align-top">{children}</td>
);

const Privacy = () => {
  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="container mx-auto px-4">
        <div className="max-w-5xl mx-auto space-y-10">
          <header className="text-center space-y-3">
            <p className="text-sm uppercase tracking-[0.3em] text-primary/80">Legal</p>
            <h1 className="text-4xl md:text-5xl font-bold text-gradient">Privacy, Cookies, and GDPR</h1>
            <p className="text-sm text-muted-foreground">AstroWhisper policies and privacy notices</p>
          </header>

          <div className="rounded-2xl border border-border bg-card/60 p-6 md:p-8 shadow-xl text-center space-y-4">
            <p className="text-sm text-muted-foreground">Jump to a section:</p>
            <div className="flex flex-wrap justify-center gap-3">
              <a
                href="#privacy-policy"
                className="inline-flex items-center rounded-full border border-border px-4 py-2 text-sm text-muted-foreground transition-colors hover:border-primary/60 hover:text-primary"
              >
                Privacy Policy
              </a>
              <a
                href="#cookie-policy"
                className="inline-flex items-center rounded-full border border-border px-4 py-2 text-sm text-muted-foreground transition-colors hover:border-primary/60 hover:text-primary"
              >
                Cookie Policy
              </a>
              <a
                href="#gdpr-notice"
                className="inline-flex items-center rounded-full border border-border px-4 py-2 text-sm text-muted-foreground transition-colors hover:border-primary/60 hover:text-primary"
              >
                GDPR Privacy Notice
              </a>
            </div>
          </div>

          <PolicySection id="privacy-policy" title="Privacy Policy - AstroWhisper" updated="January 28, 2026">
            <Subsection title="1. INTRODUCTION">
              <p>
                This Privacy Policy explains how the AstroWhisper team ("we", "us", "our") collects, uses, and protects
                personal data when you visit astrowhisper.net or purchase astrology-related digital products and
                services.
              </p>
              <p>
                We provide astrology readings, personalized reports, and digital products for personal insight,
                entertainment, and spiritual exploration only. We collect only the data necessary to deliver your
                products and improve our services.
              </p>
              <p>
                We aim to comply with applicable data protection laws, including, where relevant, the General Data
                Protection Regulation (GDPR) for users in the European Economic Area (EEA) and the United Kingdom.
              </p>
            </Subsection>

            <Subsection title="2. DATA CONTROLLER AND CONTACT DETAILS">
              <p>The AstroWhisper team, operating from:</p>
              <div className="rounded-lg border border-border/60 bg-background/40 p-4 text-sm text-muted-foreground">
                <p>5830 E 2nd St, Ste 7000 #21238</p>
                <p>Casper, Wyoming 82609</p>
                <p>United States</p>
              </div>
              <p>is responsible for the processing of personal data described in this Policy.</p>
              <p>
                Contact us via the contact form on astrowhisper.net or email info@astrowhisper.net for privacy-related
                questions or to exercise your rights.
              </p>
            </Subsection>

            <Subsection title="3. PERSONAL DATA WE COLLECT">
              <p>We may collect the following categories of personal data:</p>
              <div className="space-y-4">
                <div className="space-y-2">
                  <p className="font-semibold text-foreground">a) Identification and contact data:</p>
                  <ul className="list-disc space-y-2 pl-6">
                    <li>Name (optional, for personalized reports)</li>
                    <li>Email address (required for delivery)</li>
                    <li>Billing address and country (for tax purposes)</li>
                    <li>Phone number (optional)</li>
                  </ul>
                </div>
                <div className="space-y-2">
                  <p className="font-semibold text-foreground">b) Astrology-related birth data (required for personalized products):</p>
                  <ul className="list-disc space-y-2 pl-6">
                    <li>Date of birth</li>
                    <li>Time of birth (if known)</li>
                    <li>Place of birth (city, country)</li>
                    <li>Optional life details you provide (relationship status, career questions, etc.)</li>
                  </ul>
                </div>
                <div className="space-y-2">
                  <p className="font-semibold text-foreground">c) Transaction data:</p>
                  <ul className="list-disc space-y-2 pl-6">
                    <li>Products purchased</li>
                    <li>Order dates and amounts</li>
                    <li>Payment status (we do not store full payment card details)</li>
                  </ul>
                </div>
                <div className="space-y-2">
                  <p className="font-semibold text-foreground">d) Technical and usage data:</p>
                  <ul className="list-disc space-y-2 pl-6">
                    <li>IP address</li>
                    <li>Browser type and device information</li>
                    <li>Pages visited</li>
                    <li>Time spent on site</li>
                    <li>Cookie and tracking data</li>
                  </ul>
                </div>
              </div>
            </Subsection>

            <Subsection title="4. HOW WE COLLECT PERSONAL DATA">
              <p>We collect data through:</p>
              <ul className="list-disc space-y-2 pl-6">
                <li>Website forms (checkout, contact, order forms)</li>
                <li>Cookies and similar technologies</li>
                <li>Payment processors</li>
                <li>Email communications</li>
                <li>Your voluntary submissions (birth data, questions)</li>
              </ul>
            </Subsection>

            <Subsection title="5. PURPOSES AND LEGAL BASES FOR PROCESSING">
              <p>We use personal data for these purposes:</p>
              <TableWrapper>
                <thead className="bg-muted/40">
                  <tr>
                    <Th>Purpose</Th>
                    <Th>Examples</Th>
                    <Th>Legal Basis</Th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-t border-border/60">
                    <Td>Product delivery</Td>
                    <Td>Generate natal charts, horoscopes, send PDFs</Td>
                    <Td>Contract performance</Td>
                  </tr>
                  <tr className="border-t border-border/60">
                    <Td>Order management</Td>
                    <Td>Process payments, send confirmations</Td>
                    <Td>Contract performance</Td>
                  </tr>
                  <tr className="border-t border-border/60">
                    <Td>Customer support</Td>
                    <Td>Answer inquiries, resolve issues</Td>
                    <Td>Contract performance, Legitimate interests</Td>
                  </tr>
                  <tr className="border-t border-border/60">
                    <Td>Website security</Td>
                    <Td>Prevent fraud, block attacks</Td>
                    <Td>Legitimate interests</Td>
                  </tr>
                  <tr className="border-t border-border/60">
                    <Td>Analytics</Td>
                    <Td>Improve site usability</Td>
                    <Td>Legitimate interests, Consent (cookies)</Td>
                  </tr>
                  <tr className="border-t border-border/60">
                    <Td>Marketing emails</Td>
                    <Td>Newsletters, offers (opt-in only)</Td>
                    <Td>Consent</Td>
                  </tr>
                  <tr className="border-t border-border/60">
                    <Td>Legal compliance</Td>
                    <Td>Tax records, disputes</Td>
                    <Td>Legal obligation</Td>
                  </tr>
                </tbody>
              </TableWrapper>
            </Subsection>

            <Subsection title="6. COOKIES AND TRACKING TECHNOLOGIES">
              <p>We use cookies and similar technologies to:</p>
              <ul className="list-disc space-y-2 pl-6">
                <li>Operate the website (essential cookies)</li>
                <li>Remember preferences (language, consent choices)</li>
                <li>Analyze traffic (Google Analytics or similar)</li>
                <li>Show relevant content</li>
              </ul>
              <p>See our Cookie Policy for details. You can manage cookie preferences through our cookie banner.</p>
            </Subsection>

            <Subsection title="7. DATA SHARING AND DISCLOSURE">
              <p>We share personal data only when necessary:</p>
              <div className="space-y-4">
                <div className="space-y-2">
                  <p className="font-semibold text-foreground">a) Service providers acting on our instructions:</p>
                  <ul className="list-disc space-y-2 pl-6">
                    <li>Payment processors (Stripe, PayPal)</li>
                    <li>Email delivery (SendGrid, etc.)</li>
                    <li>Hosting providers</li>
                    <li>Analytics services</li>
                  </ul>
                </div>
                <p>
                  <span className="font-semibold text-foreground">b)</span> Professional advisors (accountants, lawyers)
                </p>
                <p>
                  <span className="font-semibold text-foreground">c)</span> Legal authorities (when required by law)
                </p>
              </div>
              <p>We do not sell your personal data to third parties.</p>
            </Subsection>

            <Subsection title="8. INTERNATIONAL DATA TRANSFERS">
              <p>
                Our operations are based in the United States. Your data may be transferred to and processed in the US
                and other countries where our service providers operate.
              </p>
              <p>
                For EEA/UK users, we use appropriate safeguards such as Standard Contractual Clauses to protect data
                transfers.
              </p>
            </Subsection>

            <Subsection title="9. DATA RETENTION PERIODS">
              <p>We keep personal data only as long as necessary:</p>
              <TableWrapper>
                <thead className="bg-muted/40">
                  <tr>
                    <Th>Data Type</Th>
                    <Th>Retention Period</Th>
                    <Th>Reason</Th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-t border-border/60">
                    <Td>Order data</Td>
                    <Td>7 years</Td>
                    <Td>Tax and accounting laws</Td>
                  </tr>
                  <tr className="border-t border-border/60">
                    <Td>Birth data</Td>
                    <Td>Until order completion + 1 year</Td>
                    <Td>Support, disputes</Td>
                  </tr>
                  <tr className="border-t border-border/60">
                    <Td>Contact info</Td>
                    <Td>Until you unsubscribe + 1 year</Td>
                    <Td>Customer service</Td>
                  </tr>
                  <tr className="border-t border-border/60">
                    <Td>Analytics data</Td>
                    <Td>14-26 months</Td>
                    <Td>Site improvement</Td>
                  </tr>
                  <tr className="border-t border-border/60">
                    <Td>Marketing data</Td>
                    <Td>Until you withdraw consent</Td>
                    <Td>Marketing</Td>
                  </tr>
                </tbody>
              </TableWrapper>
              <p>You can request deletion at any time (subject to legal retention requirements).</p>
            </Subsection>

            <Subsection title="10. DATA SECURITY">
              <p>We implement reasonable security measures including:</p>
              <ul className="list-disc space-y-2 pl-6">
                <li>SSL encryption for data transmission</li>
                <li>Secure payment processing</li>
                <li>Access controls for staff and contractors</li>
                <li>Regular security updates</li>
                <li>Data backup procedures</li>
              </ul>
              <p>No system is 100% secure. Contact us immediately if you suspect a security issue.</p>
            </Subsection>

            <Subsection title="11. YOUR PRIVACY RIGHTS">
              <p>You have the following rights regarding your personal data:</p>
              <ul className="list-disc space-y-2 pl-6">
                <li>
                  <span className="font-semibold text-foreground">Access:</span> Request a copy of your data
                </li>
                <li>
                  <span className="font-semibold text-foreground">Rectification:</span> Correct inaccurate data
                </li>
                <li>
                  <span className="font-semibold text-foreground">Erasure:</span> Request deletion (subject to legal
                  obligations)
                </li>
                <li>
                  <span className="font-semibold text-foreground">Restriction:</span> Limit processing in certain cases
                </li>
                <li>
                  <span className="font-semibold text-foreground">Objection:</span> Object to processing based on
                  legitimate interests
                </li>
                <li>
                  <span className="font-semibold text-foreground">Portability:</span> Receive data in machine-readable
                  format
                </li>
                <li>
                  <span className="font-semibold text-foreground">Withdraw consent:</span> For processing based on
                  consent
                </li>
              </ul>
              <p>
                EEA/UK users have additional GDPR rights. To exercise rights, email info@astrowhisper.net or use the
                contact form, specifying your request type. We respond within 1 month (extendable for complex requests).
              </p>
            </Subsection>

            <Subsection title="12. CHILDREN'S PRIVACY">
              <p>
                Our services are not directed to children under 18. We do not knowingly collect data from children
                under 18. If we learn we have, we will delete it promptly.
              </p>
            </Subsection>

            <Subsection title="13. THIRD-PARTY LINKS">
              <p>
                Our site may link to third-party sites (payment processors, social media). We are not responsible for
                their privacy practices.
              </p>
            </Subsection>

            <Subsection title="14. CHANGES TO THIS PRIVACY POLICY">
              <p>
                We may update this Policy. Material changes will be posted here with a new "Last updated" date and
                notified via website notice or email where appropriate.
              </p>
              <p>Continued use after changes constitutes acceptance.</p>
            </Subsection>

            <Subsection title="15. CONTACT FOR PRIVACY MATTERS">
              <p>For privacy questions or rights requests:</p>
              <div className="rounded-lg border border-border/60 bg-background/40 p-4 text-sm text-muted-foreground">
                <p>Email: info@astrowhisper.net</p>
                <p>Contact form: astrowhisper.net/contact</p>
                <p>Address: 5830 E 2nd St, Ste 7000 #21238, Casper, Wyoming 82609, US</p>
              </div>
              <p>We aim to respond to inquiries within 3 business days. EEA/UK users may also contact their local data protection authority.</p>
              <p>By using astrowhisper.net, you acknowledge that you have read and understood this Privacy Policy.</p>
            </Subsection>
          </PolicySection>

          <PolicySection id="cookie-policy" title="Cookie Policy - AstroWhisper" updated="January 25, 2026">
            <Subsection title="1. WHAT ARE COOKIES?">
              <p>
                Cookies are small text files stored on your device (computer, phone, tablet) when you visit
                astrowhisper.net. They help the website remember your actions and preferences over time.
              </p>
              <p>
                We also use similar technologies like web beacons, pixels, and local storage to enhance your experience,
                analyze usage, and ensure security.
              </p>
            </Subsection>

            <Subsection title="2. WHY WE USE COOKIES">
              <p>Cookies enable us to:</p>
              <ul className="list-disc space-y-2 pl-6">
                <li>Keep the website working properly (essential functions)</li>
                <li>Remember your preferences (language, region)</li>
                <li>Analyze how visitors use our site to improve content</li>
                <li>Show relevant offers or content (if applicable)</li>
                <li>Prevent fraud and protect your account</li>
              </ul>
            </Subsection>

            <Subsection title="3. TYPES OF COOKIES WE USE">
              <p>We categorize cookies by purpose and duration:</p>
              <TableWrapper>
                <thead className="bg-muted/40">
                  <tr>
                    <Th>Category</Th>
                    <Th>Purpose</Th>
                    <Th>Examples</Th>
                    <Th>Duration</Th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-t border-border/60">
                    <Td>Essential</Td>
                    <Td>Required for basic site functions: navigation, security, checkout process</Td>
                    <Td>Session ID, security tokens, shopping cart</Td>
                    <Td>Session (deleted when you close browser) or up to 1 year</Td>
                  </tr>
                  <tr className="border-t border-border/60">
                    <Td>Preferences</Td>
                    <Td>Remember your choices: language, cookie settings, region</Td>
                    <Td>Language preference, consent choices</Td>
                    <Td>1 month to 1 year</Td>
                  </tr>
                  <tr className="border-t border-border/60">
                    <Td>Analytics</Td>
                    <Td>Understand site performance: page views, bounce rates, popular content</Td>
                    <Td>Google Analytics (_ga, _gid), visitor statistics</Td>
                    <Td>1 day to 24 months</Td>
                  </tr>
                  <tr className="border-t border-border/60">
                    <Td>Marketing (if used)</Td>
                    <Td>Show relevant ads, track campaign performance</Td>
                    <Td>Facebook Pixel, Google Ads</Td>
                    <Td>1 month to 18 months</Td>
                  </tr>
                  <tr className="border-t border-border/60">
                    <Td>Functional</Td>
                    <Td>Enhanced features: testimonials, saved birth data for checkout</Td>
                    <Td>Form preferences, temporary birth data storage</Td>
                    <Td>Session to 30 days</Td>
                  </tr>
                </tbody>
              </TableWrapper>
            </Subsection>

            <Subsection title="4. THIRD-PARTY COOKIES AND SERVICES">
              <p>Some cookies come from third parties we work with:</p>
              <TableWrapper>
                <thead className="bg-muted/40">
                  <tr>
                    <Th>Provider</Th>
                    <Th>Purpose</Th>
                    <Th>Cookie Examples</Th>
                    <Th>Duration</Th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-t border-border/60">
                    <Td>Google Analytics</Td>
                    <Td>Site analytics and performance</Td>
                    <Td>_ga, _gid, _gat</Td>
                    <Td>1 day - 2 years</Td>
                  </tr>
                  <tr className="border-t border-border/60">
                    <Td>Stripe/PayPal</Td>
                    <Td>Secure payment processing</Td>
                    <Td>__stripe_mid, __stripe_sid</Td>
                    <Td>1 year</Td>
                  </tr>
                  <tr className="border-t border-border/60">
                    <Td>Facebook Pixel (if used)</Td>
                    <Td>Marketing and retargeting</Td>
                    <Td>_fbp, _fbc</Td>
                    <Td>90 days</Td>
                  </tr>
                  <tr className="border-t border-border/60">
                    <Td>Hotjar (if used)</Td>
                    <Td>User behavior analysis</Td>
                    <Td>_hjIncludedInSessionSampleRate</Td>
                    <Td>1 year</Td>
                  </tr>
                </tbody>
              </TableWrapper>
              <p>Each provider has their own privacy policy. Click their names above for details.</p>
            </Subsection>

            <Subsection title="5. YOUR COOKIE CHOICES AND CONTROLS">
              <p>When you first visit astrowhisper.net, you'll see a cookie banner where you can:</p>
              <ul className="list-disc space-y-2 pl-6">
                <li>Accept all cookies (recommended for best experience)</li>
                <li>Customize preferences (choose which categories to enable)</li>
                <li>Reject non-essential cookies (essential cookies always required)</li>
              </ul>
              <p>You can always change your preferences later by clicking the cookie settings link in the footer.</p>
              <p>Browser controls:</p>
              <ul className="list-disc space-y-2 pl-6">
                <li>Clear cookies: Delete all stored cookies</li>
                <li>Block cookies: Prevent new cookies from being set</li>
                <li>Third-party cookie blocking: Available in most modern browsers</li>
              </ul>
              <p>Note: Blocking essential cookies may break website functionality.</p>
            </Subsection>

            <Subsection title="6. HOW TO MANAGE COOKIES BY BROWSER">
              <TableWrapper>
                <thead className="bg-muted/40">
                  <tr>
                    <Th>Browser</Th>
                    <Th>How to Manage</Th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-t border-border/60">
                    <Td>Chrome</Td>
                    <Td>Settings &gt; Privacy and security &gt; Cookies and other site data</Td>
                  </tr>
                  <tr className="border-t border-border/60">
                    <Td>Firefox</Td>
                    <Td>Preferences &gt; Privacy &amp; Security &gt; Cookies and Site Data</Td>
                  </tr>
                  <tr className="border-t border-border/60">
                    <Td>Safari</Td>
                    <Td>Preferences &gt; Privacy &gt; Manage Website Data</Td>
                  </tr>
                  <tr className="border-t border-border/60">
                    <Td>Edge</Td>
                    <Td>Settings &gt; Cookies and site permissions &gt; Manage and delete cookies</Td>
                  </tr>
                </tbody>
              </TableWrapper>
              <p>Popular opt-out tools:</p>
              <ul className="list-disc space-y-2 pl-6">
                <li>Google Analytics: tools.google.com/dlpage/gaoptout</li>
                <li>Network Advertising Initiative: optout.networkadvertising.org</li>
                <li>YourAdChoices: youradchoices.com</li>
              </ul>
            </Subsection>

            <Subsection title="7. COOKIES FOR ASTROLOGY PRODUCTS">
              <p>When ordering personalized astrology products, we may temporarily store:</p>
              <ul className="list-disc space-y-2 pl-6">
                <li>Birth data (date, time, place) in session cookies for checkout accuracy</li>
                <li>Order preferences during the purchase process</li>
              </ul>
              <p>This data is deleted after order completion unless you create an account.</p>
            </Subsection>

            <Subsection title="8. COOKIES IN EMAILS">
              <p>
                Our transactional emails (order confirmations, support replies) may contain tracking pixels to confirm
                delivery and opens. You can disable this by adjusting email client settings.
              </p>
            </Subsection>

            <Subsection title="9. CHANGES TO COOKIES OR POLICY">
              <p>We may:</p>
              <ul className="list-disc space-y-2 pl-6">
                <li>Add or remove cookie types as our services evolve</li>
                <li>Update providers or technologies</li>
                <li>Change retention periods</li>
              </ul>
              <p>Material changes will be reflected in this policy with a new "Last updated" date and shown in the cookie banner.</p>
            </Subsection>

            <Subsection title="10. SPECIFIC COOKIES CURRENTLY IN USE">
              <TableWrapper>
                <thead className="bg-muted/40">
                  <tr>
                    <Th>Cookie Name</Th>
                    <Th>Provider</Th>
                    <Th>Purpose</Th>
                    <Th>Duration</Th>
                    <Th>Type</Th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-t border-border/60">
                    <Td>PHPSESSID</Td>
                    <Td>astrowhisper.net</Td>
                    <Td>Session management</Td>
                    <Td>Session</Td>
                    <Td>Essential</Td>
                  </tr>
                  <tr className="border-t border-border/60">
                    <Td>_ga</Td>
                    <Td>Google</Td>
                    <Td>Analytics ID</Td>
                    <Td>2 years</Td>
                    <Td>Analytics</Td>
                  </tr>
                  <tr className="border-t border-border/60">
                    <Td>_gid</Td>
                    <Td>Google</Td>
                    <Td>Analytics session</Td>
                    <Td>24 hours</Td>
                    <Td>Analytics</Td>
                  </tr>
                  <tr className="border-t border-border/60">
                    <Td>__stripe_mid</Td>
                    <Td>Stripe</Td>
                    <Td>Fraud prevention</Td>
                    <Td>1 year</Td>
                    <Td>Essential</Td>
                  </tr>
                  <tr className="border-t border-border/60">
                    <Td>__stripe_sid</Td>
                    <Td>Stripe</Td>
                    <Td>Checkout security</Td>
                    <Td>30 minutes</Td>
                    <Td>Essential</Td>
                  </tr>
                  <tr className="border-t border-border/60">
                    <Td>consent_**</Td>
                    <Td>astrowhisper.net</Td>
                    <Td>Cookie preferences</Td>
                    <Td>1 year</Td>
                    <Td>Preferences</Td>
                  </tr>
                  <tr className="border-t border-border/60">
                    <Td>region_**</Td>
                    <Td>astrowhisper.net</Td>
                    <Td>Location/timezone</Td>
                    <Td>30 days</Td>
                    <Td>Preferences</Td>
                  </tr>
                </tbody>
              </TableWrapper>
              <p className="text-sm">Note: Exact cookies may vary based on your location, browser, and enabled features.</p>
            </Subsection>

            <Subsection title="11. CONTACT ABOUT COOKIES">
              <p>Questions about our cookie practices? Contact us at:</p>
              <div className="rounded-lg border border-border/60 bg-background/40 p-4 text-sm text-muted-foreground">
                <p>Email: info@astrowhisper.net</p>
                <p>Website: astrowhisper.net/contact</p>
              </div>
            </Subsection>

            <Subsection title="12. ADDITIONAL RESOURCES">
              <ul className="list-disc space-y-2 pl-6">
                <li>EU Cookie Directive information: ec.europa.eu/ipg/cookies</li>
                <li>AllAboutCookies.org: Detailed cookie management guides</li>
                <li>Cookiebot Cookie Scanner: Free cookie scanning tool</li>
              </ul>
              <p>
                By continuing to use astrowhisper.net, you accept our use of cookies as described above. You can
                withdraw consent anytime through cookie settings.
              </p>
            </Subsection>
          </PolicySection>

          <PolicySection id="gdpr-notice" title="GDPR Privacy Notice - AstroWhisper" updated="January 25, 2026">
            <Subsection title="1. SCOPE OF THIS NOTICE">
              <p>
                This GDPR Privacy Notice supplements our Privacy Policy and applies specifically to users in the
                European Economic Area (EEA), United Kingdom (UK), and other regions where the General Data Protection
                Regulation (GDPR) or equivalent laws apply.
              </p>
              <p>
                In case of conflict between this notice and our Privacy Policy, the provisions offering you stronger
                protection will prevail.
              </p>
            </Subsection>

            <Subsection title="2. DATA CONTROLLER DETAILS">
              <p>
                <span className="font-semibold text-foreground">Data Controller:</span> AstroWhisper team
              </p>
              <p>
                <span className="font-semibold text-foreground">Address:</span> 5830 E 2nd St, Ste 7000 #21238, Casper,
                Wyoming 82609, United States
              </p>
              <p>
                <span className="font-semibold text-foreground">Contact:</span> info@astrowhisper.net or contact form at
                astrowhisper.net/contact
              </p>
              <p>We are responsible for determining the purposes and means of processing your personal data.</p>
            </Subsection>

            <Subsection title="3. LEGAL BASES FOR PROCESSING YOUR DATA">
              <p>We process personal data under the following GDPR legal bases:</p>
              <TableWrapper>
                <thead className="bg-muted/40">
                  <tr>
                    <Th>Processing Purpose</Th>
                    <Th>Legal Basis</Th>
                    <Th>Examples</Th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-t border-border/60">
                    <Td>Deliver astrology products</Td>
                    <Td>Contract (Art. 6(1)(b))</Td>
                    <Td>Generate natal charts, send PDF reports, process payments</Td>
                  </tr>
                  <tr className="border-t border-border/60">
                    <Td>Customer support</Td>
                    <Td>Contract + Legitimate interests (Art. 6(1)(b)(f))</Td>
                    <Td>Answer inquiries, resolve delivery issues</Td>
                  </tr>
                  <tr className="border-t border-border/60">
                    <Td>Website security</Td>
                    <Td>Legitimate interests (Art. 6(1)(f))</Td>
                    <Td>Fraud prevention, DDoS protection</Td>
                  </tr>
                  <tr className="border-t border-border/60">
                    <Td>Site analytics</Td>
                    <Td>Legitimate interests + Consent (Art. 6(1)(f)(a))</Td>
                    <Td>Google Analytics (anonymized), usage statistics</Td>
                  </tr>
                  <tr className="border-t border-border/60">
                    <Td>Marketing emails</Td>
                    <Td>Consent (Art. 6(1)(a))</Td>
                    <Td>Newsletters, promotional offers (opt-in only)</Td>
                  </tr>
                  <tr className="border-t border-border/60">
                    <Td>Tax/accounting</Td>
                    <Td>Legal obligation (Art. 6(1)(c))</Td>
                    <Td>7-year retention for IRS/Wyoming compliance</Td>
                  </tr>
                  <tr className="border-t border-border/60">
                    <Td>Birth data processing</Td>
                    <Td>Contract (Art. 6(1)(b))</Td>
                    <Td>Required for personalized horoscopes and readings</Td>
                  </tr>
                </tbody>
              </TableWrapper>
            </Subsection>

            <Subsection title="4. CATEGORIES OF PERSONAL DATA PROCESSED">
              <ul className="list-disc space-y-2 pl-6">
                <li>Contract data: Name, email, billing address, birth data (date/time/place)</li>
                <li>Technical data: IP address, browser info, pages visited</li>
                <li>Transaction data: Order history, payment status</li>
                <li>Communication data: Support tickets, inquiries</li>
              </ul>
              <p>
                Special category data (birth time/place) is processed only for contract fulfillment with your explicit
                provision during checkout.
              </p>
            </Subsection>

            <Subsection title="5. INTERNATIONAL DATA TRANSFERS (EXTRA-EEA)">
              <p>
                Our operations are based in the United States (outside EEA/UK). Personal data may be transferred to:
              </p>
              <TableWrapper>
                <thead className="bg-muted/40">
                  <tr>
                    <Th>Recipient Category</Th>
                    <Th>Location</Th>
                    <Th>Safeguards</Th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-t border-border/60">
                    <Td>AstroWhisper servers</Td>
                    <Td>USA</Td>
                    <Td>Standard Contractual Clauses (SCCs)</Td>
                  </tr>
                  <tr className="border-t border-border/60">
                    <Td>Payment processors (Stripe, PayPal)</Td>
                    <Td>USA/Ireland</Td>
                    <Td>SCCs + EU-US Data Privacy Framework</Td>
                  </tr>
                  <tr className="border-t border-border/60">
                    <Td>Email services</Td>
                    <Td>USA/EU</Td>
                    <Td>SCCs</Td>
                  </tr>
                  <tr className="border-t border-border/60">
                    <Td>Google Analytics</Td>
                    <Td>USA</Td>
                    <Td>SCCs + Anonymization</Td>
                  </tr>
                </tbody>
              </TableWrapper>
              <p className="font-semibold text-foreground">Safeguards in place:</p>
              <ul className="list-disc space-y-2 pl-6">
                <li>European Commission-approved Standard Contractual Clauses</li>
                <li>EU-US Data Privacy Framework (if certified)</li>
                <li>Technical measures (encryption, access controls)</li>
              </ul>
              <p>You can request copies of SCCs or transfer documentation by emailing info@astrowhisper.net.</p>
            </Subsection>

            <Subsection title="6. YOUR GDPR RIGHTS - HOW TO EXERCISE THEM">
              <p>You have the following rights under GDPR Chapter III:</p>
              <TableWrapper>
                <thead className="bg-muted/40">
                  <tr>
                    <Th>Right</Th>
                    <Th>Description</Th>
                    <Th>How to Exercise</Th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-t border-border/60">
                    <Td>Access (Art. 15)</Td>
                    <Td>Receive confirmation of processing + copy of your data</Td>
                    <Td>Email request with identity verification</Td>
                  </tr>
                  <tr className="border-t border-border/60">
                    <Td>Rectification (Art. 16)</Td>
                    <Td>Correct inaccurate/incomplete data</Td>
                    <Td>Update via account or contact us</Td>
                  </tr>
                  <tr className="border-t border-border/60">
                    <Td>Erasure ("right to be forgotten") (Art. 17)</Td>
                    <Td>Delete data (subject to legal retention)</Td>
                    <Td>Email request; 30-day response</Td>
                  </tr>
                  <tr className="border-t border-border/60">
                    <Td>Restriction (Art. 18)</Td>
                    <Td>Temporarily halt processing</Td>
                    <Td>Email with specific reason</Td>
                  </tr>
                  <tr className="border-t border-border/60">
                    <Td>Data portability (Art. 20)</Td>
                    <Td>Receive data in structured format</Td>
                    <Td>Applies to contract data only</Td>
                  </tr>
                  <tr className="border-t border-border/60">
                    <Td>Object (Art. 21)</Td>
                    <Td>Object to legitimate interest processing</Td>
                    <Td>Email with grounds for objection</Td>
                  </tr>
                  <tr className="border-t border-border/60">
                    <Td>Withdraw consent (Art. 7)</Td>
                    <Td>Stop consent-based processing</Td>
                    <Td>Cookie banner or unsubscribe link</Td>
                  </tr>
                </tbody>
              </TableWrapper>
              <p className="font-semibold text-foreground">How to make a request:</p>
              <ol className="list-decimal space-y-2 pl-6">
                <li>Email info@astrowhisper.net with subject "GDPR Request - [Your Name]"</li>
                <li>Provide order number/email used at purchase for verification</li>
                <li>Specify which right(s) you're exercising</li>
                <li>We verify identity before responding</li>
              </ol>
              <p>
                Response time: Within 1 month (extendable to 3 months for complex requests). Free of charge unless
                manifestly unfounded/excessive.
              </p>
            </Subsection>

            <Subsection title="7. DATA RETENTION PERIODS (ART. 5(1)(e))">
              <TableWrapper>
                <thead className="bg-muted/40">
                  <tr>
                    <Th>Data Category</Th>
                    <Th>Retention Period</Th>
                    <Th>Legal Basis</Th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-t border-border/60">
                    <Td>Order records</Td>
                    <Td>7 years</Td>
                    <Td>Tax laws (IRS, Wyoming)</Td>
                  </tr>
                  <tr className="border-t border-border/60">
                    <Td>Birth data</Td>
                    <Td>Order completion + 1 year</Td>
                    <Td>Contract, support</Td>
                  </tr>
                  <tr className="border-t border-border/60">
                    <Td>Marketing data</Td>
                    <Td>Until consent withdrawn</Td>
                    <Td>Consent</Td>
                  </tr>
                  <tr className="border-t border-border/60">
                    <Td>Analytics data</Td>
                    <Td>14 months maximum</Td>
                    <Td>Legitimate interests</Td>
                  </tr>
                  <tr className="border-t border-border/60">
                    <Td>Support tickets</Td>
                    <Td>3 years</Td>
                    <Td>Legitimate interests</Td>
                  </tr>
                </tbody>
              </TableWrapper>
              <p>You can request deletion anytime (Art. 17), subject to legal retention requirements.</p>
            </Subsection>

            <Subsection title="8. AUTOMATED DECISION-MAKING AND PROFILING (ART. 22)">
              <p>We do not engage in:</p>
              <ul className="list-disc space-y-2 pl-6">
                <li>Automated decision-making with legal/significant effects</li>
                <li>Systematic profiling</li>
              </ul>
              <p>
                Birth chart calculations use algorithms but require human review for personalized reports and do not
                produce automated legal effects.
              </p>
            </Subsection>

            <Subsection title="9. DATA PROCESSOR DETAILS">
              <p>Our main processors and their purposes:</p>
              <TableWrapper>
                <thead className="bg-muted/40">
                  <tr>
                    <Th>Processor</Th>
                    <Th>Purpose</Th>
                    <Th>Location</Th>
                    <Th>Transfer Safeguard</Th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-t border-border/60">
                    <Td>Stripe</Td>
                    <Td>Payments</Td>
                    <Td>USA/EU</Td>
                    <Td>SCCs, DPF</Td>
                  </tr>
                  <tr className="border-t border-border/60">
                    <Td>Website host</Td>
                    <Td>Hosting</Td>
                    <Td>USA</Td>
                    <Td>SCCs</Td>
                  </tr>
                  <tr className="border-t border-border/60">
                    <Td>Google</Td>
                    <Td>Analytics</Td>
                    <Td>USA</Td>
                    <Td>SCCs</Td>
                  </tr>
                  <tr className="border-t border-border/60">
                    <Td>Email service</Td>
                    <Td>Delivery</Td>
                    <Td>USA/EU</Td>
                    <Td>SCCs</Td>
                  </tr>
                </tbody>
              </TableWrapper>
              <p>All processors are contractually bound by GDPR-equivalent data processing agreements.</p>
            </Subsection>

            <Subsection title="10. SUPERVISORY AUTHORITY COMPLAINTS (ART. 77)">
              <p>
                If unsatisfied with our response to your rights request, you may complain to your local Data Protection
                Authority:
              </p>
              <p className="font-semibold text-foreground">Examples:</p>
              <ul className="list-disc space-y-2 pl-6">
                <li>Belgium: https://www.autoriteprotectiondonnees.be (APD/GBA)</li>
                <li>Other EEA: Use https://edpb.europa.eu/about-edpb/board/members_en</li>
              </ul>
              <p>We encourage contacting us first to resolve issues directly.</p>
            </Subsection>

            <Subsection title="11. DATA PROTECTION OFFICER (DPO)">
              <p>
                For a small business providing digital astrology services, we are not required to appoint a formal DPO
                (Art. 37(2)). Our team handles data protection responsibilities collectively.
              </p>
              <p>Contact info@astrowhisper.net for data protection matters.</p>
            </Subsection>

            <Subsection title="12. COOKIES AND CONSENT (ePrivacy Directive)">
              <p>
                Non-essential cookies require your prior, specific consent (ePrivacy Directive). See Cookie Policy for
                details. You can withdraw consent anytime via cookie settings.
              </p>
            </Subsection>

            <Subsection title="13. CHILDREN'S DATA (ART. 8)">
              <p>Our services require users to be 18+. We do not knowingly process children's data.</p>
            </Subsection>

            <Subsection title="14. CHANGES TO THIS GDPR NOTICE">
              <p>
                Material changes will be posted here with notification via website banner or email (where we have your
                contact details).
              </p>
            </Subsection>

            <Subsection title="15. CONTACT FOR GDPR MATTERS">
              <p className="font-semibold text-foreground">Primary contact:</p>
              <div className="rounded-lg border border-border/60 bg-background/40 p-4 text-sm text-muted-foreground">
                <p>Email: info@astrowhisper.net</p>
                <p>Website: astrowhisper.net/contact</p>
                <p>Address: 5830 E 2nd St, Ste 7000 #21238, Casper, Wyoming 82609, USA</p>
              </div>
              <p className="text-sm">Response commitment: 1 month maximum for rights requests.</p>
            </Subsection>
          </PolicySection>
        </div>
      </div>
    </div>
  );
};

export default Privacy;
