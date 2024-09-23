/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import {
  ApiMeaslesProtectionFeature,
  ApiMeaslesProtectionProcedure,
  ApiMonetaryFine,
  ApiProofSubmission,
  ApiSubmissionResult,
} from "@eshg/employee-portal-api/measlesProtection";
import { formatDate } from "@eshg/lib-portal/formatters/dateTime";
import { Add } from "@mui/icons-material";
import { Button, Grid, Stack } from "@mui/joy";

import { useIsNewFeatureEnabled } from "@/lib/businessModules/measlesProtection/api/queries/featureTogglesApi";
import { useProcedureQuery } from "@/lib/businessModules/measlesProtection/api/queries/procedures";
import { useProofRequestLettersQuery } from "@/lib/businessModules/measlesProtection/api/queries/proofRequestLetters";
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
import { Row } from "@/lib/shared/Row";
import { useSearchParam } from "@/lib/shared/hooks/searchParams/useSearchParam";

import { AccessRestrictionSidebar } from "./AccessRestrictionSidebar";
import { AdditionalInfoSection } from "./AdditionalInfoSection";
import { DetailCard } from "./DetailCard";
import { EditAccessRestrictionSidebar } from "./EditAccessRestrictionSidebar";
import { LabeledValue, ValueList } from "./LabeledValue";
import { ProofSidebar } from "./ProofSidebar";
import { AccessRestrictionCard } from "./proof/AccessRestrictionCard";
import { AppointmentCard } from "./proof/AppointmentCard";
import { ProofTabEntry } from "./proof/ProofTabEntry";
import { ProofTabFileCard } from "./proof/ProofTabFileCard";

export function ProofTab({ id }: Readonly<{ id: string }>) {
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
  const procedure = useProcedureQuery(id).data;
  const isEditAccessRestrictionEnabled = useIsNewFeatureEnabled(
    ApiMeaslesProtectionFeature.EditAccessRestriction,
  );

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
            procedureId={id}
          />
        </Grid>

        <Grid xxs={12} sm={6} xl={4}>
          <ProofSubmissionsCard
            proofSubmissions={proofSubmissions}
            onClick={() => setOpenProof(true)}
            procedureClosed={procedureClosed}
          />
        </Grid>

        <Grid xxs={12} sm={6} xl={4}>
          <FineCard
            monetaryFines={monetaryFines}
            onClick={() => setOpenFine(true)}
            procedureClosed={procedureClosed}
          />
        </Grid>

        <Grid xxs={12} lg={6}>
          <AccessRestrictionCard
            procedure={procedure}
            accessRestriction={procedure.accessRestriction}
            onClick={() => setOpenAccessRestriction(true)}
            onClickAddLetter={() => setOpenAccessRestrictionLetter(true)}
            procedureClosed={procedureClosed}
          />
        </Grid>
        <Grid xxs={12} lg={6}>
          <ProofRequestLetterCard
            procedure={procedure}
            onClick={() => setOpenProofRequestLetter(true)}
            procedureClosed={procedureClosed}
          />
        </Grid>
      </Grid>

      <Grid xxs={12} lg={6} xxl={3}>
        <AdditionalInfoSection procedure={procedure} />
      </Grid>
      <AddAppointmentSidebar id={id} />
      <EditAppointmentSidebar id={id} />
      <ProofSidebar id={id} />
      <FineSidebar id={id} />
      <AccessRestrictionSidebar id={id} />
      <AccessRestrictionLetterSidebar id={id} />
      {isEditAccessRestrictionEnabled && (
        <EditAccessRestrictionSidebar procedure={procedure} />
      )}
      <ProofRequestLetterSidebar id={id} />
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
    <DetailCard
      title="Nachweisvorlage"
      fullHeight={proofSubmissions.length > 0}
    >
      <Stack spacing={3} alignItems={"start"} width={"100%"}>
        {proofSubmissions.map((proof) => (
          <ProofTabEntry key={proof.externalId}>
            <LabeledValue
              label="Resultat"
              value={submissionResultLabels[proof.submissionResult]}
            />
            <Row>
              {proof.submissionResult ===
              ApiSubmissionResult.TempMedicalAttest ? (
                <LabeledValue
                  label="Frist zum medizinischen Attest"
                  value={formatDate(proof.medicalAttestDeadline)}
                />
              ) : null}
              <LabeledValue
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
    </DetailCard>
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
    <DetailCard title="Bußgeld" fullHeight={monetaryFines.length > 0}>
      <Stack spacing={3} alignItems={"start"} width={"100%"}>
        {monetaryFines.length > 0 && (
          <ValueList style={{ flexBasis: "auto" }}>
            {monetaryFines.map((fine) => (
              <LabeledValue
                key={fine.externalId}
                label="Erteilungsdatum"
                value={formatDate(fine.fineIssuedDate)}
              />
            ))}
          </ValueList>
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
    </DetailCard>
  );
}

interface ProofRequestLetterCardProps {
  procedure: ApiMeaslesProtectionProcedure;
  onClick: () => void;
  procedureClosed: boolean;
}

function ProofRequestLetterCard({
  procedure,
  onClick,
  procedureClosed,
}: Readonly<ProofRequestLetterCardProps>) {
  const proofSubmissionLetters =
    useProofRequestLettersQuery(procedure.id).data.letters ?? [];

  return (
    <DetailCard
      title={"Anschreiben Nachweisvorlage"}
      fullHeight={proofSubmissionLetters.length > 0}
    >
      <Stack spacing={3} width={"100%"} alignItems={"start"}>
        {proofSubmissionLetters.map((letter, index) => (
          <ProofTabEntry rowLayout key={index}>
            <LabeledValue
              label="Empfänger"
              value={formatName(
                getPersonByIdFromProcedure(letter.recipientId, procedure),
              )}
            />
            <LabeledValue
              label="Versanddatum"
              value={formatDate(letter.pdf.createdAt)}
            />
            <LabeledValue label="Frist" value={formatDate(letter.deadline)} />

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
    </DetailCard>
  );
}
