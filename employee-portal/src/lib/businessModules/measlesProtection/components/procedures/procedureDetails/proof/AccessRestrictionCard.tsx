/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import {
  ApiAccessRestriction,
  ApiMeaslesProtectionFeature,
  ApiMeaslesProtectionProcedure,
} from "@eshg/employee-portal-api/measlesProtection";
import { formatDate } from "@eshg/lib-portal/formatters/dateTime";
import { Add, EditOutlined } from "@mui/icons-material";
import { Button, IconButton, Stack } from "@mui/joy";

import { useIsNewFeatureEnabled } from "@/lib/businessModules/measlesProtection/api/queries/featureTogglesApi";
import { ACCESS_RESTRICTION_FIELDS } from "@/lib/businessModules/measlesProtection/components/procedures/procedureDetails/AccessRestrictionSidebar";
import { DetailCard } from "@/lib/businessModules/measlesProtection/components/procedures/procedureDetails/DetailCard";
import { EDIT_ACCESS_RESTRICTION_SEARCH_PARAM } from "@/lib/businessModules/measlesProtection/components/procedures/procedureDetails/EditAccessRestrictionSidebar";
import {
  LabeledValue,
  ValueList,
} from "@/lib/businessModules/measlesProtection/components/procedures/procedureDetails/LabeledValue";
import {
  formatName,
  getPersonByIdFromProcedure,
} from "@/lib/businessModules/measlesProtection/components/procedures/procedureDetails/helpers";
import { useSearchParam } from "@/lib/shared/hooks/searchParams/useSearchParam";

import { ProofTabEntry } from "./ProofTabEntry";
import { ProofTabFileCard } from "./ProofTabFileCard";

const fields = ACCESS_RESTRICTION_FIELDS;

export interface AccessRestrictionCardProps {
  procedure: ApiMeaslesProtectionProcedure;
  accessRestriction?: ApiAccessRestriction;
  onClick: () => void;
  onClickAddLetter: () => void;
  procedureClosed: boolean;
}

export function AccessRestrictionCard({
  procedure,
  accessRestriction,
  onClick,
  onClickAddLetter,
  procedureClosed,
}: Readonly<AccessRestrictionCardProps>) {
  const [_isEditOpen, setEditOpen] = useSearchParam(
    EDIT_ACCESS_RESTRICTION_SEARCH_PARAM,
    "boolean",
  );
  const isEditAccessRestrictionEnabled = useIsNewFeatureEnabled(
    ApiMeaslesProtectionFeature.EditAccessRestriction,
  );

  return (
    <DetailCard
      title="Betretungsverbot"
      fullHeight={!!accessRestriction}
      {...(isEditAccessRestrictionEnabled &&
        accessRestriction && {
          actionButton: (
            <IconButton
              color="primary"
              variant="outlined"
              onClick={() => setEditOpen(true)}
            >
              <EditOutlined />
            </IconButton>
          ),
        })}
    >
      <Stack spacing={3} alignItems={"start"} width={"100%"}>
        {accessRestriction ? (
          <>
            <ValueList rowLayout>
              <LabeledValue
                label={fields.restrictionIssuedDate.label}
                value={formatDate(accessRestriction.restrictionIssuedDate)}
              />
              <LabeledValue
                label={fields.restrictionStartDate.label}
                value={formatDate(accessRestriction.restrictionStartDate)}
              />
              {accessRestriction.restrictionTerminationDate && (
                <LabeledValue
                  label={fields.restrictionTerminationDate.label}
                  value={formatDate(
                    accessRestriction.restrictionTerminationDate,
                  )}
                />
              )}
            </ValueList>
            {accessRestriction.letters?.map((letter) => (
              <ProofTabEntry key={letter.externalId}>
                <LabeledValue label="" value="Anschreiben" />
                <LabeledValue
                  label="Empfänger"
                  value={formatName(
                    getPersonByIdFromProcedure(letter.recipientId, procedure),
                  )}
                  sx={{ width: "100%" }}
                />
                {letter.documentFileId && (
                  <ProofTabFileCard fileId={letter.documentFileId} />
                )}
              </ProofTabEntry>
            ))}
            {!procedureClosed && (
              <Button
                variant="plain"
                startDecorator={<Add />}
                onClick={onClickAddLetter}
              >
                Anschreiben hinzufügen
              </Button>
            )}
          </>
        ) : (
          !procedureClosed && (
            <Button variant="plain" startDecorator={<Add />} onClick={onClick}>
              Betretungsverbot erteilen
            </Button>
          )
        )}
      </Stack>
    </DetailCard>
  );
}
