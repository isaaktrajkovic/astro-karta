import type { ReactNode } from 'react';

const Section = ({ title, children }: { title: string; children: ReactNode }) => (
  <section className="space-y-4">
    <h2 className="text-lg md:text-xl font-semibold text-foreground">{title}</h2>
    <div className="space-y-4 text-muted-foreground leading-relaxed">{children}</div>
  </section>
);

const Terms = () => {
  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="container mx-auto px-4">
        <div className="max-w-5xl mx-auto space-y-10">
          <header className="text-center space-y-3">
            <p className="text-sm uppercase tracking-[0.3em] text-primary/80">Legal</p>
            <h1 className="text-4xl md:text-5xl font-bold text-gradient">Terms of Service</h1>
            <p className="text-sm text-muted-foreground">AstroWhisper - Last updated: January 28, 2026</p>
          </header>

          <div className="rounded-2xl border border-border bg-card/60 p-6 md:p-10 shadow-xl space-y-10">
            <Section title="1. INTRODUCTION">
              <p>
                These Terms of Service ("Terms") govern the use of the website astrowhisper.net and all related services
                and digital products offered by the AstroWhisper team ("us", "we", "our"). By accessing or using the
                website and purchasing or using any digital astrology product, the user or client ("you") agrees to be
                bound by these Terms.
              </p>
              <p>
                We provide astrology readings, personalized reports, and digital products for personal insight,
                entertainment, and spiritual exploration only.
              </p>
            </Section>

            <Section title="2. IDENTITY AND CONTACT DETAILS">
              <p>AstroWhisper is operated from:</p>
              <div className="rounded-lg border border-border/60 bg-background/40 p-4 text-sm text-muted-foreground">
                <p>5830 E 2nd St, Ste 7000 #21238</p>
                <p>Casper, Wyoming 82609</p>
                <p>United States</p>
              </div>
              <p>
                You can contact us via the contact form on astrowhisper.net or through the email address listed on the
                website.
              </p>
            </Section>

            <Section title="3. SERVICES AND DIGITAL PRODUCTS">
              <p>We offer astrology-focused digital products and services, including but not limited to:</p>
              <ul className="list-disc space-y-2 pl-6">
                <li>Personalized horoscopes (daily, weekly, monthly, yearly)</li>
                <li>Natal (birth) chart calculations and interpretations</li>
                <li>Synastry and relationship compatibility reports</li>
                <li>Transit and forecast reports</li>
                <li>Solar return and lunar return reports</li>
                <li>Career, money, and life-purpose astrology readings</li>
                <li>Astrocartography maps and location insight reports</li>
                <li>Pre-recorded astrology video/audio readings</li>
                <li>Downloadable PDF reports and guides</li>
              </ul>
              <p>
                All products are digital and delivered online via download, email, or your order confirmation page,
                unless otherwise stated on the product page. Services are intended solely for entertainment, spiritual
                exploration, and personal reflection and should not be treated as medical, psychological, financial, or
                legal advice.
              </p>
            </Section>

            <Section title="4. ELIGIBILITY AND CHECKOUT OPTIONS">
              <p>
                You must be at least 18 years old, or the age of legal majority in your jurisdiction, to purchase
                products or use our services.
              </p>
              <div className="space-y-3">
                <p>We offer the following checkout options:</p>
                <div className="space-y-2">
                  <p>
                    <span className="font-semibold text-foreground">a) Guest Checkout:</span> You may complete a purchase
                    without creating an account. You will receive your digital product via email or a download link on
                    the order confirmation page. You are responsible for saving your download link and keeping your
                    purchase confirmation email.
                  </p>
                  <p>
                    <span className="font-semibold text-foreground">b) Account Registration (optional):</span> You may
                    choose to create an account for easier access to past orders and future purchases. If you create an
                    account, you agree to provide accurate information, keep your credentials confidential, and remain
                    responsible for all activities under your account.
                  </p>
                </div>
              </div>
            </Section>

            <Section title="5. ORDERING, PRICING, AND PAYMENTS">
              <p>
                All prices and currencies are displayed on the website at the time of purchase and may change at any
                time without prior notice. Payments are processed through third-party payment providers listed at
                checkout, and you agree to their respective terms and privacy policies.
              </p>
              <p>Once your order is confirmed and payment is successful, you will receive access to your digital product via:</p>
              <ul className="list-disc space-y-2 pl-6">
                <li>Instant download link on the order confirmation page</li>
                <li>Email delivery to the address you provide at checkout</li>
                <li>Your account area (if you created an account)</li>
              </ul>
              <p>
                You are responsible for providing a correct email address and any necessary birth data (date, time,
                place of birth) required to prepare your astrology product. Incorrect or incomplete birth data may
                affect the accuracy or delivery of your product.
              </p>
            </Section>

            <Section title="6. DELIVERY OF DIGITAL PRODUCTS">
              <p>
                Digital products are usually delivered automatically upon successful payment or within the time frame
                indicated on the product page. Custom or personalized readings may require additional processing time as
                stated at checkout.
              </p>
              <p>
                In case of technical issues or delays (for example, email delivery problems or missing download links),
                please contact us with your order number and proof of purchase so we can resend or provide access to your
                product.
              </p>
              <p>
                Download links typically remain valid for 30 days from the date of purchase. We recommend downloading
                and saving your products promptly.
              </p>
            </Section>

            <Section title="7. REFUNDS AND CANCELLATIONS">
              <p>
                Due to the nature of digital and personalized astrology products, all sales are generally final and
                non-refundable once the product has been delivered or work on a custom reading has begun.
              </p>
              <p>In exceptional cases, such as:</p>
              <ul className="list-disc space-y-2 pl-6">
                <li>Technical errors preventing delivery</li>
                <li>Duplicate payments</li>
                <li>Inability to deliver the product due to our error</li>
              </ul>
              <p>We may, at our sole discretion, offer a refund or replacement product.</p>
              <p>
                If you wish to request a refund or cancel an order before work has started, you must contact us as soon
                as possible using the contact details on the website. Refund requests will be evaluated on a
                case-by-case basis.
              </p>
            </Section>

            <Section title="8. USE OF CONTENT AND INTELLECTUAL PROPERTY">
              <p>
                All content on astrowhisper.net and all delivered digital products (including text, images, charts,
                PDFs, audio, video, and software) are protected by copyright and other intellectual property laws.
              </p>
              <p>
                You receive a personal, non-exclusive, non-transferable license to use the purchased content for your
                private, non-commercial use only.
              </p>
              <p>You may not:</p>
              <ul className="list-disc space-y-2 pl-6">
                <li>Copy, distribute, or resell our content or products</li>
                <li>Publicly display or share readings intended for you personally</li>
                <li>Modify, adapt, or create derivative works from our content</li>
                <li>Use our content for commercial purposes without our prior written consent</li>
              </ul>
            </Section>

            <Section title="9. NO GUARANTEES - ENTERTAINMENT DISCLAIMER">
              <p className="font-semibold text-foreground">IMPORTANT: Astrology is inherently interpretive, symbolic, and speculative.</p>
              <p>
                Any information, insight, or forecast provided through AstroWhisper, including horoscopes, natal chart
                interpretations, transit forecasts, relationship readings, and any other content, is intended for
                entertainment and personal reflection purposes only.
              </p>
              <p>
                We do not guarantee that any event, outcome, or prediction described in our products will or will not
                occur in the future. Astrological readings reflect symbolic interpretations and should not be relied
                upon as factual predictions of future events.
              </p>
              <p>We do not provide:</p>
              <ul className="list-disc space-y-2 pl-6">
                <li>Medical or health advice</li>
                <li>Psychological or mental health counseling</li>
                <li>Financial or investment advice</li>
                <li>Legal advice or guidance</li>
              </ul>
              <p>
                Nothing on the site or in our products should be used as a substitute for professional advice from
                qualified practitioners in these fields.
              </p>
              <p>
                You remain fully responsible for your own decisions and actions. You agree that we are not liable for
                any outcomes, losses, damages, or consequences arising from your interpretation, reliance on, or use of
                our content or products.
              </p>
              <p>
                By purchasing or using our products, you acknowledge and accept that astrology readings are subjective
                and that results cannot be guaranteed.
              </p>
            </Section>

            <Section title="10. LIMITATION OF LIABILITY">
              <p>To the maximum extent permitted by applicable law:</p>
              <div className="space-y-2">
                <p>
                  <span className="font-semibold text-foreground">a)</span> We provide our website, services, and products
                  on an "as is" and "as available" basis without warranties of any kind, either express or implied.
                </p>
                <p>
                  <span className="font-semibold text-foreground">b)</span> We disclaim all liability for indirect,
                  incidental, special, consequential, or punitive damages arising from your use of our website or
                  products.
                </p>
                <p>
                  <span className="font-semibold text-foreground">c)</span> Our total liability for any claim related to
                  the use of our services or products is limited to the amount you paid for the specific product or
                  service giving rise to the claim.
                </p>
              </div>
            </Section>

            <Section title="11. USER CONDUCT AND PROHIBITED USES">
              <p>You agree not to:</p>
              <ul className="list-disc space-y-2 pl-6">
                <li>Use the website or products for any unlawful purpose</li>
                <li>Harass, threaten, or harm others, including our team members</li>
                <li>Attempt unauthorized access to our systems or data</li>
                <li>Interfere with the normal operation of the website</li>
                <li>Reverse engineer or circumvent technical measures used to protect our content</li>
                <li>Share, redistribute, or publicly post content from personalized readings</li>
                <li>Use automated systems (bots, scrapers) to access the website without permission</li>
              </ul>
            </Section>

            <Section title="12. THIRD-PARTY LINKS AND SERVICES">
              <p>
                Our website may contain links to third-party websites, applications, or services, including payment
                providers, analytics tools, and social media platforms.
              </p>
              <p>
                We are not responsible for the content, security, or privacy practices of these third parties, and you
                access them at your own risk under their respective terms and policies.
              </p>
            </Section>

            <Section title="13. CHANGES TO THE WEBSITE AND SERVICES">
              <p>
                We may update, modify, or discontinue any part of the website, our services, or our digital products at
                any time, including pricing and features, with or without prior notice.
              </p>
              <p>
                If you have already purchased a product, we will honor the terms applicable at the time of purchase for
                that specific product, unless changes are required by law.
              </p>
            </Section>

            <Section title="14. CHANGES TO THESE TERMS">
              <p>
                We may update these Terms from time to time. When we make material changes, we will update the "Last
                updated" date at the top of this document and, where reasonably possible, notify users via the website
                or email.
              </p>
              <p>
                Continued use of the website or purchase of products after changes have been published constitutes your
                acceptance of the updated Terms.
              </p>
            </Section>

            <Section title="15. GOVERNING LAW AND DISPUTE RESOLUTION">
              <p>
                These Terms are governed by the laws of the State of Wyoming, United States, without regard to
                conflict-of-law principles.
              </p>
              <p>
                Any dispute arising from or relating to these Terms, our website, or our products shall be submitted to
                the competent courts in Wyoming, unless mandatory consumer protection rules in your jurisdiction require
                otherwise.
              </p>
              <p>
                Before initiating any formal legal proceedings, you agree to contact us first to attempt to resolve the
                dispute informally within 30 days.
              </p>
            </Section>

            <Section title="16. SEVERABILITY">
              <p>
                If any provision of these Terms is found to be invalid or unenforceable by a court of competent
                jurisdiction, the remaining provisions shall continue in full force and effect.
              </p>
            </Section>

            <Section title="17. ENTIRE AGREEMENT">
              <p>
                These Terms, together with our Privacy Policy, Cookie Policy, and any additional terms presented at
                checkout, constitute the entire agreement between you and AstroWhisper regarding the use of our website
                and services.
              </p>
            </Section>

            <Section title="18. CONTACT">
              <p>If you have questions about these Terms, you can contact the AstroWhisper team at:</p>
              <div className="rounded-lg border border-border/60 bg-background/40 p-4 text-sm text-muted-foreground">
                <p>Email: info@astrowhisper.net</p>
                <p>Contact form: astrowhisper.net/contact</p>
              </div>
              <p>We aim to respond to inquiries within 3 business days.</p>
            </Section>

            <div className="rounded-xl border border-border bg-muted/30 p-4 text-sm text-muted-foreground">
              <p>
                By using astrowhisper.net or purchasing any of our products, you confirm that you have read, understood,
                and agree to be bound by these Terms of Service.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Terms;
