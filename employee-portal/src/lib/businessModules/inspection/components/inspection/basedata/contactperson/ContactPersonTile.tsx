/**
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { Grid } from "@mui/joy";
import { isNonNullish } from "remeda";

import { ApiFacilityContactPerson } from "@eshg/base-api";
import { DetailsItem } from "@eshg/lib-employee-portal";
import { SALUTATION_VALUES } from "@eshg/lib-portal/components/formFields/constants";

import { EmailSection } from "@/lib/businessModules/inspection/components/inspection/common/EmailSection";
import { PhoneNumberSection } from "@/lib/businessModules/inspection/components/inspection/common/PhoneNumberSection";
import { TileDivider } from "@/lib/businessModules/inspection/components/inspection/common/TileDivider";
import { InfoTile } from "@/lib/shared/components/infoTile/InfoTile";
import { InfoTileAddButton } from "@/lib/shared/components/infoTile/InfoTileAddButton";

export interface ContactPersonTileProps {
  contactPerson?: ApiFacilityContactPerson;
  readonly?: boolean;
  onEdit: () => void;
  index?: number;
}

export function ContactPersonTile({
  contactPerson,
  readonly,
  onEdit,
  index,
}: Readonly<ContactPersonTileProps>) {
  return (
    <InfoTile
      name={isNonNullish(index) ? `contactPerson-${index}` : "contactPerson"}
      title="Kontaktperson"
      onEdit={isNonNullish(contactPerson) && !readonly ? onEdit : undefined}
    >
      <Grid container spacing={1}>
        {!isNonNullish(contactPerson) && (
          <InfoTileAddButton onClick={onEdit}>Hinzufügen</InfoTileAddButton>
        )}
        <Grid xs={6}>
          <Grid container direction="column" sx={{ gap: 2 }}>
            <Grid container direction="row" sx={{ gap: 3 }}>
              {isNonNullish(contactPerson?.salutation) &&
                contactPerson.salutation !== "NOT_SPECIFIED" && (
                  <DetailsItem
                    label="Anrede"
                    value={SALUTATION_VALUES[contactPerson.salutation]}
                  />
                )}
              {isNonNullish(contactPerson?.title) &&
                contactPerson.title !== "Keine Angabe" && (
                  <DetailsItem label="Titel" value={contactPerson.title} />
                )}
            </Grid>
            {isNonNullish(contactPerson?.role) && (
              <DetailsItem label="Role" value={contactPerson.role} />
            )}
            {isNonNullish(contactPerson?.firstName) && (
              <DetailsItem label="Vorname" value={contactPerson.firstName} />
            )}
            {isNonNullish(contactPerson?.lastName) && (
              <DetailsItem label="Nachname" value={contactPerson.lastName} />
            )}
          </Grid>
        </Grid>
        {(isNonNullish(contactPerson?.emailAddress) ||
          isNonNullish(contactPerson?.phoneNumber)) && (
          <>
            <TileDivider />
            <Grid xs={6} paddingInlineStart={{ xs: 2 }}>
              {isNonNullish(contactPerson?.emailAddress) && (
                <EmailSection emailAddress={contactPerson.emailAddress} />
              )}
              {isNonNullish(contactPerson?.phoneNumber) && (
                <PhoneNumberSection phoneNumber={contactPerson.phoneNumber} />
              )}
            </Grid>
          </>
        )}
      </Grid>
    </InfoTile>
  );
}
