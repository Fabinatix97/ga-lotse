/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { TaskOutlined } from "@mui/icons-material";
import { Button, Sheet, Stack, Typography } from "@mui/joy";
import { useState } from "react";
import { isEmpty } from "remeda";

import { useSnackbar } from "@eshg/lib-portal";
import {
  ApiCreateCertificateRequest,
  ApiProcedureDetails,
  ApiProcedureProperty,
} from "@eshg/prostitute-protection-api";

import { useGenerateConsultationCertificateMutation } from "../../../api/mutations/certificate";
import { useProstituteProtectionApiClients } from "../../../contexts/ProstituteProtectionApi";
import { isProcedureFinalized } from "../../../shared/helpers";

import { CertificateConfirmationModal } from "./CertificateConfirmationModal";
import { IncompleteProcedureAreasModal } from "./IncompleteProcedureAreasModal";

export function CertificateActionPanel({
  procedure,
}: Readonly<{ procedure: ApiProcedureDetails }>) {
  if (isProcedureFinalized(procedure)) {
    return null;
  }

  return (
    <Sheet data-testid="sectionPanel">
      <Stack gap={1}>
        <Typography component="h2" level="title-sm" sx={{ fontWeight: 500 }}>
          Auszustellendes Zertifikat
        </Typography>
        <CertificateButton procedureId={procedure.id} />
      </Stack>
    </Sheet>
  );
}

interface CertificateButtonProps {
  procedureId: string;
}

function CertificateButton({ procedureId }: CertificateButtonProps) {
  const { prostituteProtectionApi } = useProstituteProtectionApiClients();
  const generateCertificateMutation =
    useGenerateConsultationCertificateMutation();
  const snackbar = useSnackbar();

  const [incompleteProcedureAreas, setIncompleteProcedureAreas] = useState<
    Record<string, ApiProcedureProperty[]>
  >({});
  const [isConfirmationModalOpen, setIsConfirmationModalOpen] = useState(false);

  async function onConfirm({
    withAlias,
    withRegistrationCertificate,
    dateOfBirth,
    firstName,
    lastName,
  }: ApiCreateCertificateRequest) {
    try {
      const response = await prostituteProtectionApi.validateCompleteness(
        procedureId,
        withAlias,
        withRegistrationCertificate,
      );
      const incompleteAreas = response.incompleteAreas;

      if (isEmpty(incompleteAreas)) {
        await generateCertificateMutation.mutateAsync({
          procedureId,
          apiCreateCertificateRequest: {
            withAlias,
            withRegistrationCertificate,
            dateOfBirth,
            firstName,
            lastName,
          },
        });
      }

      setIncompleteProcedureAreas(incompleteAreas);
    } catch {
      snackbar.error("Die Vollständigkeitsprüfung ist fehlgeschlagen");
    }
  }

  const title = "Beratungs Zertifikat nach §10 erstellen";

  return (
    <>
      <Button
        variant="outlined"
        color="primary"
        startDecorator={<TaskOutlined />}
        onClick={() => setIsConfirmationModalOpen(true)}
      >
        {title}
      </Button>
      <CertificateConfirmationModal
        open={isConfirmationModalOpen}
        title={title}
        onClose={() => setIsConfirmationModalOpen(false)}
        onConfirm={onConfirm}
      />
      <IncompleteProcedureAreasModal
        open={Object.entries(incompleteProcedureAreas).length > 0}
        incompleteProcedureAreas={incompleteProcedureAreas}
        onClose={() => setIncompleteProcedureAreas({})}
      />
    </>
  );
}
