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

interface SpectraAdminInvitationEmailProps {
  invitedEmail: string;
  adminUsername: string;
  inviteLink: string;
  expirationDate?: string;
}

export const SpectraAdminInvitationEmail = ({
  invitedEmail,
  adminUsername,
  inviteLink,
  expirationDate,
}: SpectraAdminInvitationEmailProps) => {
  const previewText = `You've been invited to register on ${APP_CONFIG_PUBLIC.APP_NAME}`;

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
              You've Been Invited to Join {APP_CONFIG_PUBLIC.APP_NAME}
            </Heading>

            <Text className="text-[#030712] text-[14px] leading-[24px]">
              Hi {invitedEmail},
            </Text>
            <Text className="text-[#030712] text-[14px] leading-[24px]">
              An admin (<strong>{adminUsername}</strong>) has invited you to
              create an account on {APP_CONFIG_PUBLIC.APP_NAME}.
            </Text>

            {expirationDate && (
              <Text className="text-[#030712] text-[14px] leading-[24px]">
                <strong>
                  This invitation will expire on {expirationDate}.
                </strong>
              </Text>
            )}

            <Text className="text-[#030712] text-[14px] leading-[24px]">
              To accept this invitation and set up your account, please click
              the button below:
            </Text>

            <Section className="mt-[32px] mb-[32px] text-center">
              <Button
                className="rounded bg-[#7c3aed] px-5 py-3 text-center font-semibold text-[#ffffff] text-[14px] no-underline"
                href={inviteLink}
              >
                Accept Invitation
              </Button>
            </Section>

            <Text className="text-[#030712] text-[14px] leading-[24px]">
              If the button above doesn't work, copy and paste this link into
              your browser:
            </Text>
            <Link
              href={inviteLink}
              className="break-all text-[#7c3aed] no-underline"
              style={{
                wordBreak: "break-all",
                overflowWrap: "break-word",
                whiteSpace: "normal",
              }}
            >
              {inviteLink}
            </Link>

            <Hr className="mx-0 my-[26px] w-full border border-[#e5e7eb] border-solid" />

            <Text className="text-[#6b7280] text-[12px] leading-[24px]">
              If you didn't expect this invitation or have any questions, please{" "}
              <Link
                href={`mailto:${APP_CONFIG_PUBLIC.APP_HELP_EMAIL}`}
                className="text-[#7c3aed] no-underline"
              >
                contact our support team
              </Link>{" "}
              or simply ignore this email.
            </Text>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
};

SpectraAdminInvitationEmail.PreviewProps = {
  invitedEmail: "someone@example.com",
  adminUsername: "Admin",
  inviteLink: "https://spectra.com/sign-up",
  expirationDate: "January 25, 2025 at 1:22 PM",
} as SpectraAdminInvitationEmailProps;

export default SpectraAdminInvitationEmail;
