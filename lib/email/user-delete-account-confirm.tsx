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

interface SpectraAccountDeletionConfirmationProps {
  email: string;
}

export const SpectraAccountDeletionConfirmation = ({
  email,
}: SpectraAccountDeletionConfirmationProps) => {
  const previewText = `Your account has been permanently deleted from ${APP_CONFIG_PUBLIC.APP_NAME}`;
  return (
    <Html>
      <Head />
      <Preview>{previewText}</Preview>
      <Tailwind>
        <Body className="mx-auto my-auto bg-[#ffffff] px-2 font-sans">
          <Container className="mx-auto my-[40px] max-w-[465px] rounded border border-[#e5e7eb] border-solid p-[20px]">
            {/* Logo */}
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
              Account Deleted
            </Heading>

            {/* Greeting */}
            <Text className="text-[#030712] text-[14px] leading-[24px]">
              Hi {email},
            </Text>

            {/* Confirmation Message */}
            <Text className="text-[#030712] text-[14px] leading-[24px]">
              We're writing to confirm that your account on{" "}
              {APP_CONFIG_PUBLIC.APP_NAME} has been permanently deleted.
            </Text>
            <Text className="text-[#030712] text-[14px] leading-[24px]">
              We're sorry to see you go. If you have any questions or need
              further assistance, please contact our support team.
            </Text>

            {/* Support Contact */}
            <Text className="text-[#030712] text-[14px] leading-[24px]">
              You can reach us at{" "}
              <Link
                href={`mailto:${APP_CONFIG_PUBLIC.APP_HELP_EMAIL}`}
                className="text-[#7c3aed] no-underline"
              >
                {APP_CONFIG_PUBLIC.APP_HELP_EMAIL}
              </Link>
              .
            </Text>

            <Hr className="mx-0 my-[26px] w-full border border-[#e5e7eb] border-solid" />

            {/* Footer */}
            <Text className="text-[#6b7280] text-[12px] leading-[24px]">
              Thank you for having been a part of {APP_CONFIG_PUBLIC.APP_NAME}.
              We hope to have the opportunity to see you again in the future.
            </Text>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
};

SpectraAccountDeletionConfirmation.PreviewProps = {
  email: "user@example.com",
};

export default SpectraAccountDeletionConfirmation;
