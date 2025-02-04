import { APP_CONFIG_PUBLIC } from "@/config/config.public";
import {
  Body,
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

interface SpectraAdminUserUpdateEmailProps {
  email: string;
  changedField: string;
  oldValue?: string;
  newValue?: string;
  adminUsername: string;
}

export const SpectraAdminUserUpdateEmail = ({
  email,
  changedField,
  oldValue,
  newValue,
  adminUsername,
}: SpectraAdminUserUpdateEmailProps) => {
  const previewText = `Your ${APP_CONFIG_PUBLIC.APP_NAME} account ${changedField} was updated.`;

  return (
    <Html>
      <Head />
      <Preview>{previewText}</Preview>
      <Tailwind>
        <Body className="mx-auto my-auto bg-[#ffffff] px-2 font-sans">
          <Container className="mx-auto my-[40px] max-w-[465px] rounded border border-[#e5e7eb] border-solid p-[20px]">
            <Section className="mt-[32px]">
              <Img
                src={`${APP_CONFIG_PUBLIC.APP_URL}/images/icon.png`}
                width="40"
                height="40"
                alt={`${APP_CONFIG_PUBLIC.APP_NAME} Logo`}
                className="mx-auto my-0"
              />
            </Section>
            <Heading className="mx-0 my-[30px] p-0 text-center font-normal text-[#030712] text-[24px]">
              Your Account Was Updated
            </Heading>

            <Text className="text-[#030712] text-[14px] leading-[24px]">
              Hello {email},
            </Text>
            <Text className="text-[#030712] text-[14px] leading-[24px]">
              This is to let you know that an admin (
              <strong>{adminUsername}</strong>) has updated your account&apos;s{" "}
              <strong>{changedField}</strong>.
            </Text>

            {/* Show oldValue & newValue only if both are provided */}
            {oldValue !== undefined && newValue !== undefined && (
              <>
                <Text className="mt-3 mb-1 text-[#030712] text-[14px] leading-[24px]">
                  <strong>Previous {changedField}:</strong> {oldValue}
                </Text>
                <Text className="mb-3 text-[#030712] text-[14px] leading-[24px]">
                  <strong>New {changedField}:</strong> {newValue}
                </Text>
              </>
            )}

            <Text className="text-[#030712] text-[14px] leading-[24px]">
              If you did not request or expect this change, please{" "}
              <Link
                href="mailto:support@owspectra.com"
                className="text-[#7c3aed] no-underline"
              >
                contact support
              </Link>{" "}
              immediately.
            </Text>

            <Hr className="mx-0 my-[26px] w-full border border-[#e5e7eb] border-solid" />

            <Text className="text-[#6b7280] text-[12px] leading-[24px]">
              You&apos;re receiving this email because an admin made a change to
              your {APP_CONFIG_PUBLIC.APP_NAME} account. If this was not
              expected, please reach out to us.
            </Text>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
};

SpectraAdminUserUpdateEmail.PreviewProps = {
  email: "someone@example.com",
  changedField: "username",
  oldValue: "PlayerOne",
  newValue: "PlayerHero",
  adminUsername: "admin@example.com",
} as SpectraAdminUserUpdateEmailProps;

export default SpectraAdminUserUpdateEmail;
