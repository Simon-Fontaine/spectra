import {
  PageHeader,
  PageHeaderDescription,
  PageHeaderHeading,
} from "@/components/page-header";
import { siteConfig } from "@/config/site";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: `Learn how ${siteConfig.name} protects your privacy`,
};

export default function PrivacyPolicy() {
  return (
    <div className="relative">
      <PageHeader>
        <PageHeaderHeading>{siteConfig.name} Privacy Policy</PageHeaderHeading>
        <PageHeaderDescription>
          Learn how we protect your privacy and personal data.
        </PageHeaderDescription>
      </PageHeader>

      <div className="container py-6 space-y-6">
        <section>
          <h2 className="text-xl font-semibold">Data We Collect</h2>
          <p>
            We collect the following personal data after users accept an
            invitation and complete onboarding:
          </p>
          <ul className="list-disc list-inside mt-2 space-y-2">
            <li>Email address</li>
            <li>Account preferences (e.g., availability)</li>
            <li>Game history via uploaded screenshots</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold">How We Use Data</h2>
          <p>We use collected data to:</p>
          <ul className="list-disc list-inside mt-2 space-y-2">
            <li>Create and manage user accounts</li>
            <li>Display team game history</li>
            <li>Allow users to update or delete their data</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold">Data Storage</h2>
          <p>
            All user data is securely stored on Supabase servers located in
            Frankfurt, Germany.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold">User Rights</h2>
          <p>
            Under GDPR, users have the right to access, update, or delete their
            personal data. To exercise these rights, send an email to{" "}
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
    </div>
  );
}
