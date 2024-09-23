/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { ApiFacilityType } from "@eshg/employee-portal-api/measlesProtection";
import { InputField } from "@eshg/lib-portal/components/formFields/InputField";
import { buildEnumOptions } from "@eshg/lib-portal/helpers/form";
import { useFormikContext } from "formik";
import { useState } from "react";

import { MeaslesFacility } from "@/lib/businessModules/measlesProtection/api/mutations/procedures";
import { facilityTypeNames } from "@/lib/businessModules/measlesProtection/components/procedures/constants";
import { WrappedSelectField } from "@/lib/businessModules/measlesProtection/shared/WrappedSelectField";

export function MeaslesFacilityTypeSelect() {
  const { setFieldValue, values } = useFormikContext<MeaslesFacility>();
  const [showCommentField, setShowCommentField] = useState(
    !!values.otherFacilityTypeInformation,
  );

  async function handleChange(value: string) {
    if (value == ApiFacilityType.Other) {
      setShowCommentField(true);
      await setFieldValue("otherFacilityTypeInformation", "");
    } else {
      setShowCommentField(false);
      await setFieldValue("otherFacilityTypeInformation", undefined);
    }
  }

  return (
    <>
      <WrappedSelectField
        name={"type"}
        label="Typ"
        options={buildEnumOptions(facilityTypeNames)}
        required="Bitte einen Typ auswählen."
        onChange={handleChange}
      />
      {showCommentField && (
        <InputField
          name={"otherFacilityTypeInformation"}
          label="Anderer Einrichtungstyp"
          required="Bitte einen spezifischen anderen Typ angeben."
        />
      )}
    </>
  );
}
