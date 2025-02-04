import { APP_CONFIG_PUBLIC } from "@/config/config.public";
import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Img,
  Link,
  Preview,
  Section,
  Tailwind,
  Text,
} from "@react-email/components";

interface SpectraConfirmAccountDeletionProps {
  email: string;
  deletionLink: string;
  ipAddress?: string;
  userAgent?: string;
  location?: string;
  device?: string;
}

export const SpectraConfirmAccountDeletion = ({
  email,
  deletionLink,
  ipAddress,
  userAgent,
  location,
  device,
}: SpectraConfirmAccountDeletionProps) => {
  const previewText = `Confirm your account deletion on ${APP_CONFIG_PUBLIC.APP_NAME}`;

  return (
    <Html>
      <Head />
      <Preview>{previewText}</Preview>
      <Tailwind>
        <Body className="mx-auto my-auto bg-[#ffffff] px-2 font-sans">
          <Container className="mx-auto my-[40px] max-w-[465px] rounded border border-[#e5e7eb] border-solid p-[20px]">
            {/* Logo Section */}
            <Section className="mt-[32px]">
              <Img
                src={`${APP_CONFIG_PUBLIC.APP_URL}/images/icon.png`}
                width="40"
                height="40"
                alt={`${APP_CONFIG_PUBLIC.APP_NAME} Logo`}
                className="mx-auto my-0"
              />
            </Section>

            {/* Heading */}
            <Heading className="mx-0 my-[30px] p-0 text-center font-normal text-[#030712] text-[24px]">
              Confirm Your Account Deletion
            </Heading>

            {/* Greeting */}
            <Text className="text-[#030712] text-[14px] leading-[24px]">
              Hi {email},
            </Text>

            {/* Main Message */}
            <Text className="text-[#030712] text-[14px] leading-[24px]">
              We received a request to permanently delete your account on{" "}
              {APP_CONFIG_PUBLIC.APP_NAME}. If you initiated this request,
              please confirm by clicking the button below.
            </Text>

            {/* Call-to-Action Button */}
            <Section className="mt-[32px] mb-[32px] text-center">
              <Button
                className="rounded bg-[#7c3aed] px-5 py-3 text-center font-semibold text-[#ffffff] text-[14px] no-underline"
                href={deletionLink}
              >
                Confirm Account Deletion
              </Button>
            </Section>

            {/* Fallback Link */}
            <Text className="text-[#030712] text-[14px] leading-[24px]">
              If the button above doesn't work, copy and paste this link into
              your browser:
            </Text>
            <Link
              href={deletionLink}
              className="break-all text-[#7c3aed] no-underline"
              style={{
                wordBreak: "break-all",
                overflowWrap: "break-word",
                whiteSpace: "normal",
              }}
            >
              {deletionLink}
            </Link>

            <Hr className="mx-0 my-[26px] w-full border border-[#e5e7eb] border-solid" />

            {/* Footer with Request Details */}
            <Text className="text-[#6b7280] text-[12px] leading-[24px]">
              This account deletion request was initiated from IP address{" "}
              <span className="text-[#030712]">{ipAddress}</span>
              {location && (
                <>
                  , located in{" "}
                  <span className="text-[#030712]">{location}</span>
                </>
              )}
              {device && (
                <>
                  {" "}
                  using a <span className="text-[#030712]">{device}</span>{" "}
                  device
                </>
              )}
              {userAgent && (
                <>
                  {" "}
                  (<span className="text-[#030712]">{userAgent}</span>)
                </>
              )}
              . If you did not request this deletion, please disregard this
              email.
            </Text>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
};

SpectraConfirmAccountDeletion.PreviewProps = {
  email: "user@example.com",
  deletionLink: "https://spectra.com/api/auth/confirm?token=abc123",
  ipAddress: "127.0.0.1",
  location: "Brussels, Brussels Capital, Belgium",
  device: "Desktop",
  userAgent:
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/112.0.0.0 Safari/537.36",
};

export default SpectraConfirmAccountDeletion;
