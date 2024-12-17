import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: "Review the terms for using the Spectra website and services.",
};

export default function TermsOfServicePage() {
  return (
    <div className="relative">
      <section className="container py-8 space-y-6">
        <h1 className="text-3xl font-bold leading-tight tracking-tighter md:text-4xl">
          Spectra Terms of Service
        </h1>
        <p className="text-lg text-foreground/80">
          Last Updated: 17/12/2024 16:50
        </p>

        <h2 className="text-xl font-semibold">1. Acceptance of Terms</h2>
        <p>
          By accessing and using the Spectra website (owspectra.com) and
          associated team services, you agree to these Terms of Service
          (“Terms”). If you do not agree, please discontinue use immediately.
        </p>

        <h2 className="text-xl font-semibold">2. About Spectra</h2>
        <p>
          Spectra is an amateur Overwatch 2 esports team based in Belgium. We
          are not a registered company. Our website and services are provided on
          a voluntary, hobby basis for team members and affiliated users.
        </p>

        <h2 className="text-xl font-semibold">3. Eligibility and Accounts</h2>
        <ul className="list-disc list-inside space-y-2">
          <li>
            <strong>Invitations:</strong> Accounts are created via admin
            invitation.
          </li>
          <li>
            <strong>Age Requirement:</strong> You must be at least 16 years old
            to join the team or use our services.
          </li>
          <li>
            <strong>Security:</strong> Keep your login details confidential.
            Notify us if you suspect unauthorized use of your account.
          </li>
        </ul>

        <h2 className="text-xl font-semibold">4. Data Use and Privacy</h2>
        <p>
          We process personal data per our{" "}
          <a href="/privacy-policy" className="underline text-primary">
            Privacy Policy
          </a>
          . This includes gameplay history, user preferences, and limited
          personal information. As we operate from Belgium, we endeavor to
          comply with relevant EU laws, including GDPR.
        </p>

        <h2 className="text-xl font-semibold">5. User Conduct</h2>
        <p>You agree not to:</p>
        <ul className="list-disc list-inside space-y-2">
          <li>
            Engage in activities that harm or disrupt our services, servers, or
            other users.
          </li>
          <li>Harass, bully, or use hate speech towards any individual.</li>
          <li>
            Violate any applicable laws or regulations, including intellectual
            property or data protection laws.
          </li>
        </ul>

        <h2 className="text-xl font-semibold">6. Intellectual Property</h2>
        <p>
          All content, logos, graphics, and materials provided through our
          website or services are the property of Spectra or our licensors. You
          may not use, reproduce, or redistribute these materials without
          written permission.
        </p>

        <h2 className="text-xl font-semibold">7. Termination</h2>
        <p>
          We may suspend or terminate access to our services if you violate
          these Terms. Upon termination, your account and associated data may be
          removed.
        </p>

        <h2 className="text-xl font-semibold">8. Changes to These Terms</h2>
        <p>
          We reserve the right to update these Terms periodically. Changes will
          be posted here with an updated “Last Updated” date. Your continued use
          after modifications indicates acceptance of the revised Terms.
        </p>

        <h2 className="text-xl font-semibold">
          9. Governing Law & Jurisdiction
        </h2>
        <p>
          These Terms and any disputes arising under them are governed by
          Belgian law. Any conflicts will be resolved in the competent courts of
          Belgium.
        </p>

        <h2 className="text-xl font-semibold">10. Contact Us</h2>
        <p>
          For questions about these Terms, please email us at{" "}
          <a
            href="mailto:gdpr@owspectra.com"
            className="underline text-primary"
          >
            gdpr@owspectra.com
          </a>
          .
        </p>
      </section>
    </div>
  );
}
