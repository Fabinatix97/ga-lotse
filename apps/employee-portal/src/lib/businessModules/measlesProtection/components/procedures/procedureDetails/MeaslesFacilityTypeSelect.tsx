/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { useFormikContext } from "formik";
import { useState } from "react";

import { InputField, buildEnumOptions } from "@eshg/lib-portal";
import { ApiFacilityType } from "@eshg/measles-protection-api";

import { MeaslesFacility } from "@/lib/businessModules/measlesProtection/api/mutations/procedures";
import { facilityTypeNames } from "@/lib/businessModules/measlesProtection/components/procedures/constants";
import { WrappedSelectField } from "@/lib/businessModules/measlesProtection/shared/WrappedSelectField";

export interface MeaslesFacilityTypeSelectFormValues {
  type?: string;
  otherFacilityTypeInformation?: string;
}

export function MeaslesFacilityTypeSelect() {
  const { setFieldValue, values } = useFormikContext<MeaslesFacility>();
  const [showCommentField, setShowCommentField] = useState(
    !!values.otherFacilityTypeInformation,
  );

  async function handleChange(value: string) {
    if (value === ApiFacilityType.Other) {
      setShowCommentField(true);
      await setFieldValue(
        "measlesFacilityType.otherFacilityTypeInformation",
        "",
      );
    } else {
      setShowCommentField(false);
      await setFieldValue(
        "measlesFacilityType.otherFacilityTypeInformation",
        undefined,
      );
    }
  }

  return (
    <>
      <WrappedSelectField
        name="measlesFacilityType.type"
        label="Typ"
        options={buildEnumOptions(facilityTypeNames)}
        required="Bitte einen Typ auswählen."
        onChange={handleChange}
      />
      {showCommentField && (
        <InputField
          name="measlesFacilityType.otherFacilityTypeInformation"
          label="Anderer Einrichtungstyp"
          required="Bitte einen spezifischen anderen Typ angeben."
        />
      )}
    </>
  );
}
