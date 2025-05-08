/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import { Button, Stack, Typography } from "@mui/joy";
import { Formik, FormikValues } from "formik";
import { ReactNode } from "react";

import { BaseModal } from "@eshg/lib-portal/components/BaseModal";
import { FormPlus } from "@eshg/lib-portal/components/form/FormPlus";

interface FormDialogProps<T> {
  open: boolean;
  onClose: () => void;
  title: string;
  description: string;
  children?: ReactNode;
  color: "primary" | "danger";
  confirmLabel: string;
  onSubmit: (model: T) => Promise<void> | void;
  cancelLabel: string;
  initialValues: T;
}

export function FormDialog<T extends FormikValues>({
  open,
  onClose,
  title,
  description,
  children,
  color,
  confirmLabel,
  onSubmit,
  cancelLabel,
  initialValues,
}: FormDialogProps<T>) {
  return (
    <BaseModal modalTitle={title} color={color} open={open} onClose={onClose}>
      <Formik initialValues={initialValues} onSubmit={onSubmit}>
        {({ isSubmitting }) => {
          return (
            <FormPlus>
              <Typography textColor="text.secondary">{description}</Typography>
              {children}
              <Stack sx={{ paddingTop: 2 }}>
                <Stack direction="row" spacing={2} sx={{ marginLeft: "auto" }}>
                  <Button
                    size="sm"
                    variant="outlined"
                    color="neutral"
                    data-testid="formDialogCancel"
                    onClick={onClose}
                  >
                    {cancelLabel}
                  </Button>
                  <Button
                    type="submit"
                    size="sm"
                    color={color}
                    loading={isSubmitting}
                    loadingPosition="start"
                    data-testid="formDialogConfirm"
                  >
                    {confirmLabel}
                  </Button>
                </Stack>
              </Stack>
            </FormPlus>
          );
        }}
      </Formik>
    </BaseModal>
  );
}
