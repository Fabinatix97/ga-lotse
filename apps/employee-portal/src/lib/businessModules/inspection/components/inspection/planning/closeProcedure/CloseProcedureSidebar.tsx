/**
 * Copyright 2026 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { Box, Button, Stack, Typography } from "@mui/joy";
import { Formik } from "formik";
import { useRef } from "react";

import {
  Sidebar,
  SidebarActions,
  SidebarContent,
  SidebarForm,
  SidebarFormHandle,
} from "@eshg/lib-employee-portal";
import { SubmitButton, TextareaField } from "@eshg/lib-portal";

interface CloseProcedureSidebar {
  open: boolean;
  handleClick: (value: string) => void;
  onClose: () => void;
}

interface CloseProcedureForm {
  closeProcedureNote: string;
}

export function CloseProcedureSidebar({
  open,
  handleClick,
  onClose,
}: Readonly<CloseProcedureSidebar>) {
  const initialValues: CloseProcedureForm = { closeProcedureNote: "" };

  function handleSubmit({ closeProcedureNote }: CloseProcedureForm) {
    handleClick(closeProcedureNote);
  }

  function handleClose() {
    sidebarFormRef.current?.resetForm();
    onClose();
  }
  const sidebarFormRef = useRef<SidebarFormHandle>(null);

  return (
    <Sidebar open={open} onClose={onClose}>
      <Formik
        initialValues={initialValues}
        enableReinitialize
        onSubmit={handleSubmit}
      >
        {({ isSubmitting, handleSubmit }) => (
          <SidebarForm
            ref={sidebarFormRef}
            aria-label="Vorgang mit Vermerk schließen"
            onSubmit={handleSubmit}
          >
            <SidebarContent title="Vorgang mit Vermerk schließen">
              <Stack direction="column" spacing={2}>
                <Typography>
                  Bitte geben Sie einen Vermerk ein, um den Vorgang zu
                  schließen.
                </Typography>

                <TextareaField
                  name="closeProcedureNote"
                  data-testid="close-procedure-note"
                  aria-label="Vermerk"
                  label="Vermerk"
                  required="Bitte geben Sie einen Vermerk ein."
                  minRows={10}
                />
              </Stack>
            </SidebarContent>
            <SidebarActions>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  width: "100%",
                  gap: 1,
                }}
              >
                <Button
                  data-testid="close-procedure-cancel"
                  variant="plain"
                  sx={{ flex: 1 }}
                  onClick={handleClose}
                >
                  Abbrechen
                </Button>
                <SubmitButton
                  data-testid="close-procedure-submit"
                  submitting={isSubmitting}
                  title="test"
                  color="danger"
                  sx={{ flex: 1 }}
                >
                  Vorgang schließen
                </SubmitButton>
              </Box>
            </SidebarActions>
          </SidebarForm>
        )}
      </Formik>
    </Sidebar>
  );
}
