/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import { Box, formControlClasses } from "@mui/joy";
import { SxProps } from "@mui/joy/styles/types";
// eslint-disable-next-line no-restricted-imports
import { Form, FormikFormProps, useFormikContext } from "formik";
import { RefObject, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";

import { findFirstInteractableChild } from "../../helpers/findFirstInteractableChild";
import { usePrevious } from "../../hooks/usePrevious";

const inputsSelector =
  'input, textarea, select, [role="input"], [role="checkbox"], [role="radio"], [role="textbox"]';

function useScrollToError({
  enabled = true,
  formRef,
}: {
  enabled?: boolean;
  formRef: RefObject<HTMLFormElement | null>;
}) {
  const { isSubmitting, errors } = useFormikContext();
  const wasSubmitting = usePrevious(isSubmitting);

  useEffect(() => {
    if (wasSubmitting && !isSubmitting && errors && enabled) {
      scrollToFirstFormError(formRef);
    }
  }, [wasSubmitting, isSubmitting, errors, enabled, formRef]);

  return formRef;
}

export function scrollToFirstFormError(
  formRef?: RefObject<HTMLFormElement | null>,
) {
  // If there's a formRef, use the form;
  // if not, search the whole document for validation errors
  const root = formRef?.current ?? document;

  const componentEl =
    // Assume all elements with .Mui-error are HTMLElements
    // and that the first error in the DOM is also the first
    // error spatially
    root
      .getElementsByClassName(formControlClasses.error)
      .item(0) as HTMLElement;

  if (!componentEl) {
    return;
  }

  // Assume that we've either selected the parent of a label or a label itself
  let label: HTMLElement = componentEl.querySelector("label") ?? componentEl;

  // Get the input for-id, or fall back to first input
  const forId = label.getAttribute("for");
  const labelFor = forId ? document.getElementById(forId) : null;
  const input =
    labelFor ?? componentEl.querySelector(inputsSelector) ?? componentEl;

  // If by chance the input element we've selected has an aria-labelledby attr.,
  // use that instead as the label
  const ariaLabelled = input.getAttribute("aria-labelledby");
  if (ariaLabelled) {
    label = document.getElementById(ariaLabelled) ?? label;
  }

  // Focus on input
  input.focus({ preventScroll: true });
  // Scroll to label
  label.scrollIntoView({ behavior: "smooth" });
}

function useRevalidateOnLanguageChange(enabled: boolean) {
  const { validateForm } = useFormikContext();
  const {
    i18n: { language },
  } = useTranslation();
  const languageRef = useRef(language);
  useEffect(() => {
    if (!enabled) {
      return;
    }
    if (languageRef.current === language) {
      return;
    }
    void validateForm();
    languageRef.current = language;
  }, [enabled, language, validateForm]);
}

interface FormPlusOptions {
  scrollToError?: boolean;
  revalidateOnLanguageChange?: boolean;
  sx?: SxProps;
  "data-testid"?: string;
  "aria-label"?: string;
  "aria-labelledby"?: string;
  "aria-describedby"?: string;
  isSearchForm?: boolean;
}

/* Formik <Form> wrapper that utilizes useScrollToError()
 *   e.g. <Formik><FormPlus> ...<FormPlus></Formik>
 */
export function FormPlus({
  children,
  scrollToError = true,
  revalidateOnLanguageChange = true,
  autoFocus = false,
  isSearchForm,
  ...props
}: Omit<FormikFormProps, "autoComplete" | "noValidate" | "ref" | "style"> &
  FormPlusOptions) {
  const formRef = useRef<HTMLFormElement | null>(null);
  useScrollToError({ enabled: scrollToError, formRef });
  useRevalidateOnLanguageChange(revalidateOnLanguageChange);
  const [formContent, setFormContent] = useState<HTMLElement | null>(null);

  useEffect(() => {
    if (formContent && autoFocus) {
      findFirstInteractableChild(formContent)?.focus();
    }
  }, [formContent, autoFocus]);

  return (
    <Box
      component={Form}
      autoComplete="off"
      {...props}
      ref={(el: HTMLFormElement) => {
        formRef.current = el;
        setFormContent(el);
      }}
      noValidate
      role={isSearchForm ? "search" : "form"}
      aria-label={props["aria-label"]}
      aria-labelledby={props["aria-labelledby"]}
      aria-describedby={props["aria-describedby"]}
    >
      {children}
    </Box>
  );
}
