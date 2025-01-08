/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { ApiAffectedPerson } from "@eshg/employee-portal-api/officialMedicalService";
import { toDateString } from "@eshg/lib-portal/helpers/dateTime";

import { usePatchAffectedPerson } from "@/lib/businessModules/officialMedicalService/api/mutations/employeeOmsProcedureApi";
import { mapToPatchAffectedPersonRequest } from "@/lib/businessModules/officialMedicalService/shared/helpers";
import { mapOptional } from "@/lib/shared/api/models/utils";
import { mapApiAddressToForm } from "@/lib/shared/components/form/address/helpers";
import { PersonEditSidebar } from "@/lib/shared/components/personSidebar/PersonEditSidebar";
import {
  DefaultPersonForm,
  DefaultPersonFormValues,
} from "@/lib/shared/components/personSidebar/form/DefaultPersonForm";
import { normalizeListInputs } from "@/lib/shared/components/personSidebar/helpers";
import { useSidebarForm } from "@/lib/shared/hooks/useSidebarForm";

interface UpdateAffectedPersonSidebarProps {
  affectedPerson: ApiAffectedPerson;
  procedureId: string;
  open: boolean;
  onClose: () => void;
}

export function UpdateAffectedPersonSidebar({
  affectedPerson,
  procedureId,
  open,
  onClose,
}: UpdateAffectedPersonSidebarProps) {
  const { closeSidebar, handleClose, sidebarFormRef } = useSidebarForm({
    onClose,
  });

  const updateAffectedPerson = usePatchAffectedPerson();

  const version = affectedPerson.version;

  async function handleSubmit(values: DefaultPersonFormValues) {
    await updateAffectedPerson.mutateAsync(
      {
        procedureId,
        apiPatchAffectedPersonRequest: mapToPatchAffectedPersonRequest(
          values,
          version,
        ),
      },
      {
        onSuccess: closeSidebar,
      },
    );
  }

  return (
    <PersonEditSidebar
      open={open}
      title={"Betroffene Person bearbeiten"}
      onCancel={handleClose}
      onSubmit={handleSubmit}
      sidebarFormRef={sidebarFormRef}
      initialValues={mapPersonDetailsToForm(affectedPerson)}
      component={DefaultPersonForm}
      addressRequired
    />
  );
}

function mapPersonDetailsToForm(
  person: ApiAffectedPerson,
): DefaultPersonFormValues {
  return {
    salutation: person.salutation ?? "",
    title: person.title ?? "",
    firstName: person.firstName,
    lastName: person.lastName,
    dateOfBirth: toDateString(person.dateOfBirth),
    gender: person.gender ?? "",
    countryOfBirth: person.countryOfBirth ?? "",
    nameAtBirth: person.nameAtBirth ?? "",
    placeOfBirth: person.placeOfBirth ?? "",
    emailAddresses: normalizeListInputs(person.emailAddresses),
    phoneNumbers: normalizeListInputs(person.phoneNumbers),
    contactAddress: mapOptional(person.contactAddress, mapApiAddressToForm),
    differentBillingAddress: undefined,
  };
}
