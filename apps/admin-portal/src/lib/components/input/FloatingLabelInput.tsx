/**
 * Copyright 2026 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import Input from "@mui/joy/Input";
import { styled } from "@mui/joy/styles";
import {
  ChangeEvent,
  InputHTMLAttributes,
  ReactNode,
  forwardRef,
  useId,
} from "react";

import { useTranslation } from "@/lib/i18n/client";

const StyledInput = styled("input")({
  border: "none", // remove the native input border
  minWidth: 0, // remove the native input width
  outline: 0, // remove the native input outline
  padding: 0, // remove the native input padding
  paddingTop: "1em",
  flex: 1,
  color: "inherit",
  backgroundColor: "transparent",
  fontFamily: "inherit",
  fontSize: "inherit",
  fontStyle: "inherit",
  fontWeight: "inherit",
  lineHeight: "inherit",
  textOverflow: "ellipsis",
  "&::placeholder": {
    opacity: 0,
    transition: "0.1s ease-out",
  },
  "&:focus::placeholder": {
    opacity: 1,
  },
  "&:focus ~ label, &:not(:placeholder-shown) ~ label, &:-webkit-autofill ~ label":
    {
      top: "0.5rem",
      fontSize: "0.75rem",
    },
  "&:focus ~ label": {
    color: "var(--Input-focusedHighlight)",
  },
  "&:-webkit-autofill": {
    alignSelf: "stretch", // to fill the height with the root slot
  },
  "&:-webkit-autofill:not(* + &)": {
    marginInlineStart: "calc(-1 * var(--Input-paddingInline))",
    paddingInlineStart: "var(--Input-paddingInline)",
    borderTopLeftRadius:
      "calc(var(--Input-radius) - var(--variant-borderWidth, 0px))",
    borderBottomLeftRadius:
      "calc(var(--Input-radius) - var(--variant-borderWidth, 0px))",
  },
});

const StyledLabel = styled("label")(({ theme }) => ({
  position: "absolute",
  lineHeight: 1,
  top: "calc((var(--Input-minHeight) - 1em) / 2)",
  left: "calc(var(--_Input-paddingBlock) + var(--Input-decoratorChildRadius) + var(--Input-radius) + var(--Input-gap))",
  color: theme.vars.palette.text.tertiary,
  fontWeight: theme.vars.fontWeight.md,
  transition: "all 150ms cubic-bezier(0.4, 0, 0.2, 1)",
}));

interface InnerInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
}

const InnerInput = forwardRef<HTMLInputElement, InnerInputProps>(
  function InnerInput({ label, ...props }, ref) {
    const id = useId();
    return (
      <>
        <StyledInput {...props} ref={ref} id={id} />
        <StyledLabel htmlFor={id}>{label}</StyledLabel>
      </>
    );
  },
);

interface FloatingLabelInputProps {
  placeholder?: string;
  type?: string;
  startDecorator?: ReactNode;
  defaultValue?: string;
  onChange?: (event: ChangeEvent<HTMLInputElement>) => void;
}

export function FloatingLabelInput({
  placeholder,
  type,
  startDecorator,
  defaultValue,
  onChange,
}: Readonly<FloatingLabelInputProps>) {
  const { t } = useTranslation();
  return (
    <Input
      startDecorator={startDecorator}
      type={type}
      defaultValue={defaultValue}
      slots={{ input: InnerInput }}
      slotProps={{
        root: {
          role: "search",
          "aria-label": placeholder,
        },
        input: {
          placeholder: t("enterSearchterm"),
          label: placeholder,
        },
      }}
      sx={{
        "--Input-minHeight": "56px",
        "--Input-radius": "12px",
      }}
      onChange={onChange}
    />
  );
}
