/**
 * Copyright 2024 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { InputField } from "@eshg/lib-portal/components/formFields/InputField";
import {
  Box,
  Button,
  FormControl,
  FormHelperText,
  Stack,
  Typography,
} from "@mui/joy";
import { useFormikContext } from "formik";
import { useState } from "react";

import { InformationStatementFormValues } from "@/lib/businessModules/travelMedicine/components/informationStatement/InformationStatementStepper";
import { SignDocumentModal } from "@/lib/businessModules/travelMedicine/components/informationStatement/SignDocumentModal";
import { FormSheetTitle } from "@/lib/businessModules/travelMedicine/components/shared/components/FormSheet";
import { useTranslation } from "@/lib/i18n/client";

export function SignatureSection() {
  const { t } = useTranslation([
    "travelMedicine/signature",
    "travelMedicine/forms",
  ]);
  const { errors, touched, submitCount } =
    useFormikContext<InformationStatementFormValues>();
  const [isSignatureModalOpen, setIsSignatureModalOpen] = useState(false);
  return (
    <Box data-testid="signature-section">
      <FormSheetTitle
        requiredTitle={t("common.requiredTitle", {
          ns: "travelMedicine/forms",
        })}
      >
        {t("panelSection.title")}
      </FormSheetTitle>
      <Typography>
        {t("panelSection.ownerLabel")}
        <sup> *</sup>
      </Typography>
      <Stack
        direction="row"
        spacing={2}
        sx={{
          width: "100%",
        }}
      >
        <InputField
          sx={{ width: "65%" }}
          label={null}
          aria-label={"Signaturfeld"}
          placeholder="Max Mustermann"
          name="signer"
          data-testid="signature-section-name"
        />
        <Box sx={{ width: "45%" }}>
          <Button
            color="primary"
            variant="solid"
            sx={{ width: "100%" }}
            onClick={() => setIsSignatureModalOpen(true)}
            data-testid="signature-section-button"
          >
            {t("panelSection.modalButton")}
          </Button>
          {errors.signature && (touched.signature ?? submitCount > 0) && (
            <FormControl error>
              <FormHelperText> {errors.signature}</FormHelperText>
            </FormControl>
          )}
        </Box>
        {isSignatureModalOpen && (
          <SignDocumentModal
            open={true}
            onClose={() => setIsSignatureModalOpen(false)}
          />
        )}
      </Stack>
    </Box>
  );
}
