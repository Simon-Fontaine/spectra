import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "Learn how Spectra protects your privacy and personal data.",
};

export default function PrivacyPolicyPage() {
  return (
    <div className="relative">
      <section className="container py-8 space-y-6">
        <h1 className="text-3xl font-bold leading-tight tracking-tighter md:text-4xl">
          Spectra Privacy Policy
        </h1>
        <p className="text-lg text-foreground/80">
          Last Updated: 17/12/2024 16:50
        </p>

        <p>
          At <strong>Spectra</strong> (“we,” “us,” “our”), protecting your
          personal data is a top priority. We operate as an amateur Overwatch 2
          esports team based in Belgium, and while we are not a registered
          company, we take your privacy seriously. This Privacy Policy outlines
          the types of personal information we collect, how we use and store it,
          and the measures we take to comply with applicable regulations,
          including the EU’s General Data Protection Regulation (GDPR).
        </p>

        <h2 className="text-xl font-semibold">1. Data We Collect</h2>
        <p>We may collect and process the following personal data:</p>
        <ul className="list-disc list-inside space-y-2">
          <li>
            <strong>Contact Information:</strong> Email address, username, and
            display name.
          </li>
          <li>
            <strong>Profile Details:</strong> Avatar URL, Overwatch role
            selection (e.g., main tank, hitscan DPS), and substitute status.
          </li>
          <li>
            <strong>Availability & Preferences:</strong> Scheduling preferences,
            calendar availability, or training session details.
          </li>
          <li>
            <strong>Game & Replay History:</strong> Uploaded screenshots, replay
            codes, and match results for team analytics and performance
            tracking.
          </li>
        </ul>
        <p>
          We only collect personal data from invited members after they complete
          the onboarding process.
        </p>

        <h2 className="text-xl font-semibold">2. How We Use Your Data</h2>
        <p>Your data is used to:</p>
        <ul className="list-disc list-inside space-y-2">
          <li>
            <strong>Manage Accounts:</strong> Create, maintain, and secure user
            accounts.
          </li>
          <li>
            <strong>Team Operations:</strong> Coordinate rosters, track
            performance, and schedule events, scrimmages, or practices.
          </li>
          <li>
            <strong>Analytics & Improvements:</strong> Analyze aggregated data
            for performance insights and future feature development.
          </li>
          <li>
            <strong>Support:</strong> Help with password resets, technical
            issues, and respond to user inquiries.
          </li>
        </ul>

        <h2 className="text-xl font-semibold">3. Data Storage and Security</h2>
        <p>
          We store personal data on secure servers provided by Supabase, located
          in Frankfurt, Germany. We use reasonable safeguards to protect against
          unauthorized access, disclosure, alteration, or destruction of your
          personal information.
        </p>

        <h2 className="text-xl font-semibold">4. Legal Basis for Processing</h2>
        <p>
          Our collection and processing of personal data may be based on various
          legal grounds, including your consent, our legitimate interests in
          providing team-related services, and compliance with legal obligations
          under EU law.
        </p>

        <h2 className="text-xl font-semibold">5. Your GDPR Rights</h2>
        <p>
          If you reside in the EU/EEA, including Belgium, you have rights under
          the GDPR, such as:
        </p>
        <ul className="list-disc list-inside space-y-2">
          <li>Access: Request a copy of the data we hold about you.</li>
          <li>Rectification: Correct inaccuracies in your personal data.</li>
          <li>
            Erasure: Ask us to delete your personal data, subject to certain
            exceptions.
          </li>
          <li>
            Restriction & Objection: Limit how we process your data or object to
            certain uses.
          </li>
        </ul>
        <p>
          To exercise these rights, contact us at{" "}
          <a
            href="mailto:gdpr@owspectra.com"
            className="underline text-primary"
          >
            gdpr@owspectra.com
          </a>
          .
        </p>

        <h2 className="text-xl font-semibold">6. Changes to This Policy</h2>
        <p>
          We may update this Privacy Policy occasionally. Changes will be posted
          here, and the “Last Updated” date will be revised. Continued use of
          our site after changes implies acceptance.
        </p>

        <h2 className="text-xl font-semibold">7. Contact Us</h2>
        <p>
          For questions or concerns, please email us at{" "}
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
