import {
  PageHeader,
  PageHeaderDescription,
  PageHeaderHeading,
} from "@/components/page-header";
import { siteConfig } from "@/config/site";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: `Read the terms of service for ${siteConfig.name}`,
};

export default function TermsOfService() {
  return (
    <div className="relative">
      <PageHeader>
        <PageHeaderHeading>
          {siteConfig.name} Terms of Service
        </PageHeaderHeading>
        <PageHeaderDescription>
          Review the terms for using our website and dashboard.
        </PageHeaderDescription>
      </PageHeader>

      <div className="container py-6 space-y-6">
        <section>
          <h2 className="text-xl font-semibold">Acceptance of Terms</h2>
          <p>
            By accessing the {siteConfig.name} website and dashboard, you agree
            to comply with these terms of service.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold">Account Management</h2>
          <p>
            Accounts are created via admin invitations. Users must be 16 years
            or older to join the team. Users are responsible for:
          </p>
          <ul className="list-disc list-inside mt-2 space-y-2">
            <li>Maintaining account confidentiality</li>
            <li>Updating or deleting their account data as needed</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold">User Data</h2>
          <p>
            Data collected through the platform is used for managing accounts
            and team-related functionalities. For GDPR-related requests, users
            can contact{" "}
            <a
              href="mailto:gdpr@owspectra.com"
              className="underline text-primary"
            >
              gdpr@owspectra.com
            </a>
            .
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold">Termination</h2>
          <p>
            Admins reserve the right to suspend or terminate accounts if users
            violate these terms.
          </p>
        </section>
      </div>
    </div>
  );
}
