import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Cookie Policy",
  description: "Learn how Spectra uses cookies to enhance your experience.",
};

export default function CookiePolicyPage() {
  return (
    <div className="relative">
      <section className="container py-8 space-y-6">
        <h1 className="text-3xl font-bold leading-tight tracking-tighter md:text-4xl">
          Spectra Cookie Policy
        </h1>
        <p className="text-lg text-foreground/80">
          Last Updated: 17/12/2024 16:50
        </p>

        <p>
          We use cookies and similar technologies on our website (owspectra.com)
          to improve functionality, remember your preferences, and analyze
          performance. Although we operate as an amateur esports team and not a
          registered company, we still respect your right to privacy and strive
          to comply with applicable EU laws, including GDPR.
        </p>

        <h2 className="text-xl font-semibold">1. What Are Cookies?</h2>
        <p>
          Cookies are small text files stored on your device when you visit a
          website. They help websites function properly, enhance user
          experience, and provide important analytics information.
        </p>

        <h2 className="text-xl font-semibold">2. Types of Cookies We Use</h2>
        <ul className="list-disc list-inside space-y-2">
          <li>
            <strong>Session Cookies:</strong> Maintain user sessions and ensure
            secure access to certain areas of the site.
          </li>
          <li>
            <strong>Preference Cookies:</strong> Store user settings like
            dark/light mode for a personalized experience.
          </li>
          <li>
            <strong>Analytics Cookies:</strong> Provided by tools like Vercel
            Analytics to measure site performance and improve features.
          </li>
        </ul>

        <h2 className="text-xl font-semibold">3. Managing Cookies</h2>
        <p>
          Most browsers let you manage or disable cookies in their settings. You
          can remove or block cookies, but doing so may affect site
          functionality.
        </p>

        <h2 className="text-xl font-semibold">4. Changes to This Policy</h2>
        <p>
          We may update this Cookie Policy from time to time. Updates will be
          posted here with a revised “Last Updated” date. Continuing to use our
          website after changes take effect indicates your acceptance of those
          changes.
        </p>
      </section>
    </div>
  );
}
