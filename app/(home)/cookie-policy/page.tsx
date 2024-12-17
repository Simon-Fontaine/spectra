import {
  PageHeader,
  PageHeaderDescription,
  PageHeaderHeading,
} from "@/components/page-header";
import { siteConfig } from "@/config/site";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Cookie Policy",
  description: `Learn how ${siteConfig.name} uses cookies`,
};

export default function CookiePolicy() {
  return (
    <div className="relative">
      <PageHeader>
        <PageHeaderHeading>{siteConfig.name} Cookie Policy</PageHeaderHeading>
        <PageHeaderDescription>
          Learn how we use cookies to enhance your experience.
        </PageHeaderDescription>
      </PageHeader>

      <div className="container py-6 space-y-6">
        <section>
          <h2 className="text-xl font-semibold">What Are Cookies?</h2>
          <p>
            Cookies are small text files stored on your device that help improve
            functionality, analyze performance, and remember your preferences.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold">Cookies We Use</h2>
          <ul className="list-disc list-inside space-y-2">
            <li>
              <span className="font-bold">Session Cookies</span>: To manage user
              authentication and sessions.
            </li>
            <li>
              <span className="font-bold">Preference Cookies</span>: To store
              dark/light mode preferences.
            </li>
            <li>
              <span className="font-bold">Analytics Cookies</span>: We use
              Vercel Analytics and SpeedInsights to analyze app performance.
            </li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold">Managing Cookies</h2>
          <p>
            You can manage or disable cookies through your browser settings.
            Disabling essential cookies may limit functionality.
          </p>
        </section>
      </div>
    </div>
  );
}
