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

interface SpectraAccountDeletedByAdminProps {
  email: string;
  adminUsername: string;
}

export const SpectraAccountDeletedByAdmin = ({
  email,
  adminUsername,
}: SpectraAccountDeletedByAdminProps) => {
  const previewText = `Your ${APP_CONFIG_PUBLIC.APP_NAME} account has been deleted by an administrator`;

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
              Your Account Has Been Deleted
            </Heading>

            <Text className="text-[#030712] text-[14px] leading-[24px]">
              Hi {email},
            </Text>
            <Text className="text-[#030712] text-[14px] leading-[24px]">
              We&apos;re writing to inform you that your{" "}
              {APP_CONFIG_PUBLIC.APP_NAME} account has been permanently deleted
              by an administrator (<strong>{adminUsername}</strong>).
            </Text>
            <Text className="text-[#030712] text-[14px] leading-[24px]">
              If you believe this action was taken in error, please{" "}
              <Link
                href={"mailto:support@owspectra.com"}
                className="text-[#7c3aed] no-underline"
              >
                contact our support team
              </Link>{" "}
              immediately. However, please note that once the account is
              deleted, we may be limited in what we can restore.
            </Text>

            <Hr className="mx-0 my-[26px] w-full border border-[#e5e7eb] border-solid" />

            <Text className="text-[#6b7280] text-[12px] leading-[24px]">
              If you did not expect this, please reach out to us.
            </Text>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
};

SpectraAccountDeletedByAdmin.PreviewProps = {
  email: "someone@example.com",
  adminUsername: "admin@owspectra.com",
} as SpectraAccountDeletedByAdminProps;

export default SpectraAccountDeletedByAdmin;
