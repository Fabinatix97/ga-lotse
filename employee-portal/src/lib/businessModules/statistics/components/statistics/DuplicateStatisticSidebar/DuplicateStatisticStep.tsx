/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { Alert } from "@eshg/lib-portal/components/Alert";
import { InputField } from "@eshg/lib-portal/components/formFields/InputField";
import { createFieldNameMapper } from "@eshg/lib-portal/helpers/form";
import { Divider, Stack, Typography } from "@mui/joy";

import { DetailsCell } from "@/lib/shared/components/detailsSection/DetailsCell";
import { formatDateRangeNumeric } from "@/lib/shared/helpers/dateTime";

import { OriginalStatistic } from "./DuplicateStatisticSidebar";
import { DuplicateStatisticFormModel } from "./duplicateStatisticFormModel";

export function DuplicateStatisticStep(props: {
  originalStatistic: OriginalStatistic;
  defaultNewStatisticName: string;
}) {
  const fieldName = createFieldNameMapper<DuplicateStatisticFormModel>();

  return (
    <Stack gap={3}>
      <Stack gap={1}>
        <DetailsCell
          name="originalStatisticName"
          label="Name der Auswertung"
          value={props.originalStatistic.name}
        />
      </Stack>
      <InputField
        name={fieldName("name")}
        label="Name des Duplikats"
        placeholder={props.defaultNewStatisticName}
      />
      <Divider />
      <Stack gap={1}>
        <Typography level="title-md">Betrachtungszeitraum</Typography>
        <Typography level="body-md">
          {formatDateRangeNumeric(
            props.originalStatistic.timeRangeStart,
            props.originalStatistic.timeRangeEnd,
          )}
        </Typography>
      </Stack>
      <Alert
        color={"primary"}
        message="Die Analysen und Diagramme werden ebenfalls mit dupliziert."
      ></Alert>
    </Stack>
  );
}
