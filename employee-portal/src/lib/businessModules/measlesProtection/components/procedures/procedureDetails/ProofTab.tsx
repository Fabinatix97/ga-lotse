/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { Add } from "@mui/icons-material";
import { Button, Grid, Stack } from "@mui/joy";
import { useSuspenseQueries } from "@tanstack/react-query";

import { DetailsItem, useSearchParam } from "@eshg/lib-employee-portal";
import { Row } from "@eshg/lib-portal/components/Row";
import { formatDate } from "@eshg/lib-portal/formatters/dateTime";
import {
  ApiMeaslesProtectionProcedure,
  ApiMonetaryFine,
  ApiProofRequestLetter,
  ApiProofSubmission,
  ApiSubmissionResult,
} from "@eshg/measles-protection-api";

import {
  useProofRequestLetterApi,
  useProtectionProcedureApi,
} from "@/lib/businessModules/measlesProtection/api/clients";
import { getProcedureQuery } from "@/lib/businessModules/measlesProtection/api/queries/procedures";
import { getProofRequestLettersQuery } from "@/lib/businessModules/measlesProtection/api/queries/proofRequestLetters";
import { submissionResultLabels } from "@/lib/businessModules/measlesProtection/components/procedures/constants";
import { AccessRestrictionLetterSidebar } from "@/lib/businessModules/measlesProtection/components/procedures/procedureDetails/AccessRestrictionLetterSidebar";
import {
  AddAppointmentSidebar,
  EditAppointmentSidebar,
} from "@/lib/businessModules/measlesProtection/components/procedures/procedureDetails/AppointmentSidebar";
import { FineSidebar } from "@/lib/businessModules/measlesProtection/components/procedures/procedureDetails/FineSidebar";
import { ProofRequestLetterSidebar } from "@/lib/businessModules/measlesProtection/components/procedures/procedureDetails/ProofRequestLetterSidebar";
import {
  formatName,
  getPersonByIdFromProcedure,
} from "@/lib/businessModules/measlesProtection/components/procedures/procedureDetails/helpers";
import { InfoTile } from "@/lib/shared/components/infoTile/InfoTile";

import { AccessRestrictionSidebar } from "./AccessRestrictionSidebar";
import { AdditionalInfoSection } from "./AdditionalInfoSection";
import { EditAccessRestrictionSidebar } from "./EditAccessRestrictionSidebar";
import { ProofSidebar } from "./ProofSidebar";
import { AccessRestrictionCard } from "./proof/AccessRestrictionCard";
import { AppointmentCard } from "./proof/AppointmentCard";
import { ProofTabEntry } from "./proof/ProofTabEntry";
import { ProofTabFileCard } from "./proof/ProofTabFileCard";

export function ProofTab({ procedureId }: Readonly<{ procedureId: string }>) {
  const [_openProof, setOpenProof] = useSearchParam("add-proof", "boolean");
  const [_openFine, setOpenFine] = useSearchParam("add-fine", "boolean");
  const [_openAccessRestriction, setOpenAccessRestriction] = useSearchParam(
    "add-access-restriction",
    "boolean",
  );
  const [_openAccessRestrictionLetter, setOpenAccessRestrictionLetter] =
    useSearchParam("add-access-restriction-letter", "boolean");
  const [_openProofRequestLetter, setOpenProofRequestLetter] = useSearchParam(
    "add-proof-request-letter",
    "boolean",
  );
  const protectionProcedureApi = useProtectionProcedureApi();
  const proofRequestLetterApi = useProofRequestLetterApi();
  const [
    { data: procedure },
    {
      data: { letters },
    },
  ] = useSuspenseQueries({
    queries: [
      getProcedureQuery(protectionProcedureApi, procedureId),
      getProofRequestLettersQuery(proofRequestLetterApi, procedureId),
    ],
  });

  const procedureClosed = !procedure.isOpen;

  if (procedure.type !== "MeaslesProtectionProcedure") return null;

  const proofSubmissions = procedure.proofSubmissions ?? [];
  const monetaryFines = procedure.monetaryFines ?? [];
  const appointment = procedure.appointment;

  return (
    <Grid container spacing={2}>
      <Grid container spacing={2} xs={12} xxl={9}>
        <Grid xxs={12} sm={6} xl={4}>
          <AppointmentCard
            appointment={appointment}
            procedureClosed={procedureClosed}
            procedureId={procedureId}
          />
        </Grid>

        <Grid xxs={12} sm={6} xl={4}>
          <ProofSubmissionsCard
            proofSubmissions={proofSubmissions}
            procedureClosed={procedureClosed}
            onClick={() => setOpenProof(true)}
          />
        </Grid>

        <Grid xxs={12} sm={6} xl={4}>
          <FineCard
            monetaryFines={monetaryFines}
            procedureClosed={procedureClosed}
            onClick={() => setOpenFine(true)}
          />
        </Grid>

        <Grid xxs={12} lg={6}>
          <AccessRestrictionCard
            procedure={procedure}
            accessRestriction={procedure.accessRestriction}
            procedureClosed={procedureClosed}
            onClick={() => setOpenAccessRestriction(true)}
            onClickAddLetter={() => setOpenAccessRestrictionLetter(true)}
          />
        </Grid>
        <Grid xxs={12} lg={6}>
          <ProofRequestLetterCard
            procedure={procedure}
            procedureClosed={procedureClosed}
            proofSubmissionLetters={letters}
            onClick={() => setOpenProofRequestLetter(true)}
          />
        </Grid>
      </Grid>

      <Grid xxs={12} lg={6} xxl={3}>
        <AdditionalInfoSection procedure={procedure} />
      </Grid>
      <AddAppointmentSidebar id={procedureId} />
      <EditAppointmentSidebar id={procedureId} />
      <ProofSidebar id={procedureId} />
      <FineSidebar id={procedureId} />
      <AccessRestrictionSidebar id={procedureId} />
      <AccessRestrictionLetterSidebar id={procedureId} />
      <EditAccessRestrictionSidebar procedure={procedure} />
      <ProofRequestLetterSidebar id={procedureId} />
    </Grid>
  );
}

interface ProofSubmissionsProps {
  proofSubmissions: ApiProofSubmission[];
  onClick: () => void;
  procedureClosed: boolean;
}

function ProofSubmissionsCard({
  onClick,
  proofSubmissions,
  procedureClosed,
}: Readonly<ProofSubmissionsProps>) {
  return (
    <InfoTile
      title="Nachweisvorlage"
      name="proofSubmission"
      sx={{ height: "100%" }}
    >
      <Stack spacing={3} alignItems="start" width="100%">
        {proofSubmissions.map((proof) => (
          <ProofTabEntry key={proof.externalId}>
            <DetailsItem
              label="Resultat"
              value={submissionResultLabels[proof.submissionResult]}
            />
            <Row>
              {proof.submissionResult ===
              ApiSubmissionResult.TempMedicalAttest ? (
                <DetailsItem
                  label="Frist zum medizinischen Attest"
                  value={formatDate(proof.medicalAttestDeadline)}
                />
              ) : null}
              <DetailsItem
                label="Vorlagedatum"
                value={formatDate(proof.submissionDate)}
              />
            </Row>
            {proof.proofSubmissionDocumentId && (
              <ProofTabFileCard fileId={proof.proofSubmissionDocumentId} />
            )}
          </ProofTabEntry>
        ))}
        {!procedureClosed && (
          <Button variant="plain" startDecorator={<Add />} onClick={onClick}>
            Hinzufügen
          </Button>
        )}
      </Stack>
    </InfoTile>
  );
}

interface FineCardProps {
  onClick: () => void;
  monetaryFines: ApiMonetaryFine[];
  procedureClosed: boolean;
}

function FineCard({
  onClick,
  monetaryFines,
  procedureClosed,
}: Readonly<FineCardProps>) {
  return (
    <InfoTile title="Bußgeld" name="fine" sx={{ height: "100%" }}>
      <Stack spacing={3} alignItems="start" width="100%">
        {monetaryFines.length > 0 && (
          <Stack gap={1} sx={{ flexBasis: "auto" }}>
            {monetaryFines.map((fine) => (
              <DetailsItem
                key={fine.externalId}
                label="Erteilungsdatum"
                value={formatDate(fine.fineIssuedDate)}
              />
            ))}
          </Stack>
        )}
        {!procedureClosed && (
          <Button
            variant="plain"
            startDecorator={<Add />}
            disabled={procedureClosed}
            onClick={onClick}
          >
            Bußgeld erteilen
          </Button>
        )}
      </Stack>
    </InfoTile>
  );
}

interface ProofRequestLetterCardProps {
  onClick: () => void;
  procedure: ApiMeaslesProtectionProcedure;
  procedureClosed: boolean;
  proofSubmissionLetters: ApiProofRequestLetter[];
}

function ProofRequestLetterCard({
  onClick,
  procedure,
  procedureClosed,
  proofSubmissionLetters,
}: Readonly<ProofRequestLetterCardProps>) {
  return (
    <InfoTile
      title="Anschreiben Nachweisvorlage"
      name="proofSubmissionLetter"
      sx={{ height: "100%" }}
    >
      <Stack spacing={3} width="100%" alignItems="start">
        {proofSubmissionLetters.map((letter, index) => (
          <ProofTabEntry key={index} rowLayout>
            <DetailsItem
              label="Empfänger"
              value={formatName(
                getPersonByIdFromProcedure(letter.recipientId, procedure),
              )}
            />
            <DetailsItem
              label="Versanddatum"
              value={formatDate(letter.pdf.createdAt)}
            />
            <DetailsItem label="Frist" value={formatDate(letter.deadline)} />

            <ProofTabFileCard
              fileId={letter.pdf.fileId}
              fileData={letter.pdf}
            />
          </ProofTabEntry>
        ))}
        {!procedureClosed && (
          <Button
            variant="plain"
            startDecorator={<Add />}
            disabled={procedureClosed}
            onClick={onClick}
          >
            Anschreiben erstellen
          </Button>
        )}
      </Stack>
    </InfoTile>
  );
}
