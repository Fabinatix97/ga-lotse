/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import { Box, formControlClasses } from "@mui/joy";
import { SxProps } from "@mui/joy/styles/types";
// eslint-disable-next-line no-restricted-imports
import { Form, FormikFormProps, useFormikContext } from "formik";
import { MutableRefObject, useEffect, useRef } from "react";

import { usePrevious } from "../../hooks/usePrevious";

const inputsSelector =
  'input, textarea, select, [role="input"], [role="checkbox"], [role="radio"], [role="textbox"]';

export function useScrollToError({
  enabled = true,
  formRef,
}: {
  enabled?: boolean;
  formRef: MutableRefObject<HTMLFormElement | null>;
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
  formRef?: MutableRefObject<HTMLFormElement | null>,
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

interface FormPlusOptions {
  scrollToError?: boolean;
  sx?: SxProps;
}

/* Formik <Form> wrapper that utilizes useScrollToError()
 *   e.g. <Formik><FormPlus> ...<FormPlus></Formik>
 */
export function FormPlus({
  children,
  scrollToError = true,
  ...props
}: Omit<FormikFormProps, "autoComplete" | "noValidate" | "ref" | "style"> &
  FormPlusOptions) {
  const formRef = useRef<HTMLFormElement | null>(null);
  useScrollToError({ enabled: scrollToError, formRef });

  return (
    <Box
      component={Form}
      autoComplete="off"
      {...props}
      noValidate
      ref={formRef}
    >
      {children}
    </Box>
  );
}
