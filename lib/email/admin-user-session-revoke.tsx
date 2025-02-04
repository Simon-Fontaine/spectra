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

interface SpectraSessionRevokedByAdminProps {
  email: string;
  adminUsername: string;
  count?: number;
}

export const SpectraSessionRevokedByAdmin = ({
  email,
  adminUsername,
  count = 1,
}: SpectraSessionRevokedByAdminProps) => {
  const sessionText =
    count > 1
      ? `${count} of your active sessions`
      : "one of your active sessions";
  const previewText = `Your ${sessionText} have been revoked by an administrator`;

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
              Session Revoked Notification
            </Heading>

            <Text className="text-[#030712] text-[14px] leading-[24px]">
              Hi {email},
            </Text>

            <Text className="text-[#030712] text-[14px] leading-[24px]">
              We would like to inform you that {sessionText} have been revoked
              by an administrator (<strong>{adminUsername}</strong>).
            </Text>

            <Text className="text-[#030712] text-[14px] leading-[24px]">
              If you did not expect this action or believe it may have been
              taken in error, please contact our support team immediately.
            </Text>

            <Hr className="mx-0 my-[26px] w-full border border-[#e5e7eb] border-solid" />

            <Text className="text-[#6b7280] text-[12px] leading-[24px]">
              If you have any questions or concerns, please reach out to us at{" "}
              <Link
                href={`mailto:${APP_CONFIG_PUBLIC.APP_HELP_EMAIL}`}
                className="text-[#7c3aed] no-underline"
              >
                {APP_CONFIG_PUBLIC.APP_HELP_EMAIL}
              </Link>
              .
            </Text>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
};

SpectraSessionRevokedByAdmin.PreviewProps = {
  email: "user@example.com",
  adminUsername: "admin@example.com",
  count: 2,
};

export default SpectraSessionRevokedByAdmin;
