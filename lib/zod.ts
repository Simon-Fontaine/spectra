import { Role, Specialty } from "@prisma/client";
import { z } from "zod";

// Common validation utilities
const validationMessages = {
  required: (field: string) => `${field} is required`,
  length: {
    min: (field: string, length: number) =>
      `${field} must be at least ${length} characters`,
    max: (field: string, length: number) =>
      `${field} cannot exceed ${length} characters`,
  },
  format: {
    email: "Please enter a valid email address",
    username:
      "Username must be lowercase and contain only letters, numbers, and underscores",
    displayName:
      "Display name must contain only letters, numbers, underscores, and spaces",
  },
  password: {
    match: "Passwords do not match",
  },
};

// Reusable schema factories
const createStringSchema = (options: {
  field: string;
  minLength?: number;
  maxLength?: number;
  regex?: RegExp;
  regexMessage?: string;
}) => {
  const { field, minLength, maxLength, regex, regexMessage } = options;

  let schema = z
    .string({ required_error: validationMessages.required(field) })
    .trim();

  if (minLength !== undefined) {
    schema = schema.min(
      minLength,
      validationMessages.length.min(field, minLength)
    );
  }

  if (maxLength !== undefined) {
    schema = schema.max(
      maxLength,
      validationMessages.length.max(field, maxLength)
    );
  }

  if (regex) {
    schema = schema.regex(regex, regexMessage);
  }

  return schema;
};

// Specific schemas
export const getPasswordSchema = (type: "Password" | "ConfirmPassword") =>
  createStringSchema({
    field: type,
    minLength: 8,
    maxLength: 32,
  });

export const getEmailSchema = () =>
  createStringSchema({
    field: "Email",
    minLength: 1,
  }).email(validationMessages.format.email);

export const getUsernameSchema = () =>
  createStringSchema({
    field: "Username",
    minLength: 1,
    maxLength: 48,
    regex: /^[a-z0-9_]+$/,
    regexMessage: validationMessages.format.username,
  });

export const getDisplayNameSchema = () =>
  createStringSchema({
    field: "Display name",
    maxLength: 48,
    regex: /^[a-zA-Z0-9_ ]*$/,
    regexMessage: validationMessages.format.displayName,
  }).optional();

export const getAvatarUrlSchema = () =>
  createStringSchema({
    field: "Avatar URL",
  })
    .url()
    .optional();

export const getRoleSchema = () => z.nativeEnum(Role);

export const getSpecialtySchema = () => z.nativeEnum(Specialty);

export const signUpSchema = z
  .object({
    email: getEmailSchema(),
    username: getUsernameSchema(),
    password: getPasswordSchema("Password"),
    confirmPassword: getPasswordSchema("ConfirmPassword"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: validationMessages.password.match,
    path: ["confirmPassword"],
  });

export const apiSignUpSchema = z.object({
  email: getEmailSchema(),
  username: getUsernameSchema(),
  password: getPasswordSchema("Password"),
  displayName: getDisplayNameSchema(),
  avatarUrl: getAvatarUrlSchema(),
});

export const signInSchema = z.object({
  usernameOrEmail: z.union([getEmailSchema(), getUsernameSchema()]),
  password: getPasswordSchema("Password"),
});

export const forgotPasswordSchema = z.object({
  email: getEmailSchema(),
});

export const resetPasswordSchema = z
  .object({
    password: getPasswordSchema("Password"),
    confirmPassword: getPasswordSchema("ConfirmPassword"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: validationMessages.password.match,
    path: ["confirmPassword"],
  });
