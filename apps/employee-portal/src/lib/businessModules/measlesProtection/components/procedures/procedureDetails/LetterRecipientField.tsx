/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { useFormikContext } from "formik";
import { useEffect } from "react";

import { SelectOption } from "@eshg/lib-portal";
import {
  ApiDraftMeaslesProcedure,
  ApiMeaslesProtectionProcedure,
} from "@eshg/measles-protection-api";

import { formatName } from "@/lib/businessModules/measlesProtection/components/procedures/procedureDetails/helpers";
import { WrappedSelectField } from "@/lib/businessModules/measlesProtection/shared/WrappedSelectField";

export function LetterRecipientField<
  TFormValues extends { recipientId: string },
>({
  procedure,
}: Readonly<{
  procedure: ApiDraftMeaslesProcedure | ApiMeaslesProtectionProcedure;
}>) {
  const { values, setFieldValue } = useFormikContext<TFormValues>();
  const { custodians, affectedPerson } = procedure;

  useEffect(() => {
    if (!values.recipientId) {
      void setFieldValue("recipientId", affectedPerson.id);
    }
  }, [affectedPerson, values, setFieldValue]);

  const options: SelectOption[] = [
    {
      label: formatName(affectedPerson),
      value: affectedPerson.id ?? "",
    },
  ];

  custodians?.forEach((custodian) => {
    options.push({
      label: formatName(custodian, "PSB - "),
      value: custodian.custodianId ?? "",
    });
  });

  return (
    <WrappedSelectField
      name="recipientId"
      label="Empfänger"
      //readOnly={options.length === 1} //TODO: Not yet supported?!
      options={options}
      required="Bitte einen Empfänger auswählen."
    />
  );
}
