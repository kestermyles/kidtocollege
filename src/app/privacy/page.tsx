import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy — KidToCollege",
  description: "How KidToCollege collects, uses, and protects your personal information.",
};

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-white pt-28 pb-20">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="font-display text-3xl sm:text-4xl font-bold text-navy mb-2">
          Privacy Policy
        </h1>
        <p className="font-mono-label text-xs text-navy/40 uppercase tracking-wider mb-10">
          Effective date: March 28, 2026
        </p>

        <div className="space-y-10 font-body text-navy/80 leading-relaxed">
          <section>
            <h2 className="font-display text-xl font-bold text-navy mb-3">
              1. What data we collect
            </h2>
            <p>
              When you use KidToCollege, we collect the information you provide through
              our search wizard and account features. This may include:
            </p>
            <ul className="list-disc pl-6 mt-3 space-y-1">
              <li>College and major preferences</li>
              <li>GPA and test scores (SAT/ACT)</li>
              <li>Extracurricular activities and interests</li>
              <li>Budget and financial priorities</li>
              <li>Essay drafts and coaching interactions</li>
              <li>Email address and account role (parent or student), if you create an account</li>
            </ul>
            <p className="mt-3">
              We also collect standard technical data such as your IP address, browser type,
              device information, and pages visited, through privacy-first analytics
              (Vercel Analytics).
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl font-bold text-navy mb-3">
              2. How we use your data
            </h2>
            <p>We use the information you provide to:</p>
            <ul className="list-disc pl-6 mt-3 space-y-1">
              <li>Generate personalised AI research reports, scholarship recommendations, and coaching content</li>
              <li>Save your searches, saved colleges, checklists, and essay drafts to your account</li>
              <li>Improve the accuracy, quality, and relevance of our service</li>
              <li>Maintain and secure the platform</li>
            </ul>
            <p className="mt-3">
              We do not use your data to make admissions decisions. The reports we generate
              are for informational and guidance purposes only.
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl font-bold text-navy mb-3">
              3. Data sharing
            </h2>
            <p>
              We do not currently sell, rent, or share your personal data with any third
              party, including colleges, universities, scholarship bodies, or data brokers.
            </p>
            <p className="mt-3">
              We may share anonymised, aggregated data (e.g. &ldquo;the most-searched major
              this month&rdquo;) that cannot identify any individual user.
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl font-bold text-navy mb-3">
              4. Future advertising
            </h2>
            <p>
              KidToCollege is currently ad-free. In the future, this policy may be updated
              to include interest-based advertising. If we make any material changes to how
              your data is used for advertising purposes, we will notify you by email (if
              you have an account) or through a prominent notice on the site, and give you
              the opportunity to opt out before any such changes take effect.
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl font-bold text-navy mb-3">
              5. Cookies and analytics
            </h2>
            <p>
              We use essential cookies to maintain your authentication session if you are
              signed in. We use Vercel Analytics, a privacy-first analytics tool, to
              understand how the site is used. Vercel Analytics does not use cookies and
              does not collect personally identifiable information.
            </p>
            <p className="mt-3">
              We do not use third-party tracking cookies, advertising pixels, or
              fingerprinting technologies.
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl font-bold text-navy mb-3">
              6. Data retention and deletion
            </h2>
            <p>
              Your data is retained for as long as your account is active or as needed to
              provide the service. Anonymised search data (with no link to your identity)
              may be retained indefinitely to improve our AI models and service quality.
            </p>
            <p className="mt-3">
              You may request deletion of your account and all associated personal data at
              any time by contacting us at{" "}
              <a
                href="mailto:privacy@kidtocollege.com"
                className="text-gold hover:text-gold/80 underline underline-offset-2"
              >
                privacy@kidtocollege.com
              </a>
              . We will process deletion requests within 30 days.
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl font-bold text-navy mb-3">
              7. Data security
            </h2>
            <p>
              We use industry-standard security measures to protect your data, including
              encrypted connections (HTTPS), secure authentication via Supabase Auth, and
              row-level security on all database tables. API keys and sensitive credentials
              are stored server-side only and are never exposed to the browser.
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl font-bold text-navy mb-3">
              8. Children&apos;s privacy
            </h2>
            <p>
              KidToCollege is designed for use by high school students and their parents or
              guardians. We do not knowingly collect data from children under 13. If you
              believe a child under 13 has provided us with personal information, please
              contact us and we will delete it promptly.
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl font-bold text-navy mb-3">
              9. Contact
            </h2>
            <p>
              For any questions about this privacy policy, data requests, or to exercise
              your rights, contact us at{" "}
              <a
                href="mailto:privacy@kidtocollege.com"
                className="text-gold hover:text-gold/80 underline underline-offset-2"
              >
                privacy@kidtocollege.com
              </a>
              .
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl font-bold text-navy mb-3">
              10. Governing law
            </h2>
            <p>
              This privacy policy is governed by and construed in accordance with the laws
              of the State of Texas, without regard to its conflict of law provisions.
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl font-bold text-navy mb-3">
              11. Affiliate &amp; partner relationships
            </h2>
            <p>
              We may in the future receive compensation from partners including
              student loan providers, test preparation companies and scholarship
              platforms. Any such relationships will be clearly disclosed and will
              never influence our editorial guidance or college recommendations. We
              will update this policy and notify users before any such relationships
              take effect.
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl font-bold text-navy mb-3">
              12. Changes to this policy
            </h2>
            <p>
              We may update this privacy policy from time to time. When we make material
              changes, we will notify users through the site or by email. Continued use of
              KidToCollege after changes are posted constitutes acceptance of the revised
              policy.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
