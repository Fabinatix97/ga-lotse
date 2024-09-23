/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { ApiGetReferencePersonResponse } from "@eshg/employee-portal-api/base";
import { formatDate } from "@eshg/lib-portal/formatters/dateTime";
import { Divider, Stack } from "@mui/joy";
import { isNonNullish } from "remeda";

import { BaseAddressDetails } from "@/lib/shared/components/address/BaseAddressDetails";
import { DetailsCell } from "@/lib/shared/components/detailsSection/DetailsCell";
import {
  GENDER_VALUES,
  SALUTATION_VALUES,
  getOptionalTitle,
} from "@/lib/shared/components/personSidebar/constants";
import { translateCountry } from "@/lib/shared/helpers/i18n";

export function PersonDetails({
  selectedPerson,
}: {
  selectedPerson: ApiGetReferencePersonResponse;
}) {
  return (
    <Stack gap={1}>
      <Stack direction={"row"} gap={3}>
        <DetailsCell
          name={"title"}
          label={"Titel"}
          value={getOptionalTitle(selectedPerson.title)}
        />
        <DetailsCell
          name={"salutation"}
          label={"Anrede"}
          value={SALUTATION_VALUES[selectedPerson.salutation]}
        />
      </Stack>
      <DetailsCell
        name={"firstName"}
        label={"Vorname"}
        value={selectedPerson.firstName}
      />
      <DetailsCell
        name={"lastName"}
        label={"Nachname"}
        value={selectedPerson.lastName}
      />
      <DetailsCell
        name={"nameAtBirth"}
        label={"Geburtsname"}
        value={selectedPerson.nameAtBirth}
      />
      <Stack direction={"row"} gap={3}>
        <DetailsCell
          name={"dateOfBirth"}
          label={"Geburtsdatum"}
          value={formatDate(selectedPerson.dateOfBirth)}
        />
        <DetailsCell
          name={"gender"}
          label={"Geschlecht"}
          value={GENDER_VALUES[selectedPerson.gender]}
        />
      </Stack>
      <DetailsCell
        name={"countryOfBirth"}
        label={"Geburtsland"}
        value={
          isNonNullish(selectedPerson.countryOfBirth)
            ? translateCountry(selectedPerson.countryOfBirth)
            : undefined
        }
      />
      <DetailsCell
        name={"placeOfBirth"}
        label={"Geburtsort"}
        value={selectedPerson.placeOfBirth}
      />
      {/*<DetailsCell name={"dataOrigin"} label={"Datenherkunft"} value={selectedPerson.dataOrigin} />*/}

      {isNonNullish(selectedPerson.contactAddress) && (
        <>
          <Divider sx={(theme) => ({ marginBlock: theme.spacing(1) })} />
          {/*<Typography level={"title-lg"}>Kontaktadresse</Typography>*/}
          <BaseAddressDetails address={selectedPerson.contactAddress} />
        </>
      )}
    </Stack>
  );
}
