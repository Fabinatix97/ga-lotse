/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { TaskOutlined } from "@mui/icons-material";
import { Button, Sheet, Stack, Typography } from "@mui/joy";
import { useState } from "react";
import { isEmpty } from "remeda";

import { useSnackbar } from "@eshg/lib-portal";
import {
  ApiProcedureDetails,
  ApiProcedureProperty,
  GenerateConsultationCertificatePdfRequest,
} from "@eshg/prostitute-protection-api";

import { useGenerateConsultationCertificateMutation } from "../../../api/mutations/certificate";
import { useProstituteProtectionApiClients } from "../../../contexts/ProstituteProtectionApi";
import { useDecryptedPersons } from "../../../contexts/decryptedPersons/DecryptedPersonsStoreProvider";
import { isProcedureFinalized } from "../../../shared/helpers";

import {
  CertificateConfirmationModal,
  CertificateCreationOptions,
} from "./CertificateConfirmationModal";
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

  const { getDecryptedPerson } = useDecryptedPersons();
  const personData = getDecryptedPerson(procedureId);

  async function onConfirm(options: CertificateCreationOptions) {
    try {
      const response = await prostituteProtectionApi.validateCompleteness(
        procedureId,
        options.withAlias,
        options.withRegistrationCertificate,
      );
      const incompleteAreas = response.incompleteAreas;

      if (isEmpty(incompleteAreas)) {
        if (!personData) {
          snackbar.error("Die Personendaten sind nicht verfügbar");
          return;
        }

        const request: GenerateConsultationCertificatePdfRequest = {
          procedureId,
          apiCreateCertificateRequest: {
            withAlias: options.withAlias,
            withRegistrationCertificate: options.withRegistrationCertificate,
            firstName: personData.firstName,
            lastName: personData.lastName,
            dateOfBirth: personData.dateOfBirth,
          },
        };

        await generateCertificateMutation.mutateAsync(request);
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
