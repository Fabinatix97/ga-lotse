/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { BaseModal } from "@eshg/lib-portal/components/BaseModal";
import { Row } from "@eshg/lib-portal/components/Row";
import { FormPlus } from "@eshg/lib-portal/components/form/FormPlus";
import { Button, Stack, Typography } from "@mui/joy";
import { Formik } from "formik";

import { CheckboxField } from "@/lib/shared/components/formFields/CheckboxField";

export function SharePinModal({
  pinToShare,
  onShared,
}: {
  pinToShare?: string;
  onShared: () => void;
}) {
  return (
    <BaseModal modalTitle="PIN zur Identifizierung" open={pinToShare != null}>
      <Formik initialValues={{}} onSubmit={() => onShared()}>
        <FormPlus>
          <Stack gap={2}>
            <Typography>
              Teilen Sie dem/der Bürger:in folgende PIN mit.
              <br />
              <Typography component="strong" fontWeight="xl">
                Diese PIN kann nicht erneut angezeigt werden.
              </Typography>
            </Typography>
            <div>
              <Typography
                sx={(theme) => ({
                  display: "inline-block",
                  borderRadius: theme.radius.sm,
                  backgroundColor: theme.palette.background.level2,
                  py: 1,
                  px: 2,
                  fontWeight: theme.fontWeight.lg,
                })}
              >
                {pinToShare}
              </Typography>
            </div>
            <CheckboxField
              name="pinShared"
              label="Ich habe die PIN dem/der Bürger:in mitgeteilt."
              required="Bitte bestätigen Sie die Weitergabe der PIN."
            />
            <Row justifyContent="end">
              <Button type="submit">Bestätigen und schließen</Button>
            </Row>
          </Stack>
        </FormPlus>
      </Formik>
    </BaseModal>
  );
}
