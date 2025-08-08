/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import AddIcon from "@mui/icons-material/Add";
import { Button } from "@mui/joy";

import { ApiGetReferencePersonResponse } from "@eshg/base-api";
import {
  ContentPanel,
  DefaultPersonFormValues,
  DetailsSection,
  PersonSidebar,
  SidebarWithFormRefProps,
  mapToPersonAddRequest,
  useSidebarWithFormRef,
} from "@eshg/lib-employee-portal";
import { ApiAddCustodianRequest } from "@eshg/school-entry-api";

import { ProcedureDetails } from "@/lib/businessModules/schoolEntry/api/models/ProcedureDetails";
import { useAddPersonAsCustodian } from "@/lib/businessModules/schoolEntry/api/mutations/schoolEntryApi";

export function AddCustodianPanel(props: { procedure: ProcedureDetails }) {
  const personSidebar = useSidebarWithFormRef({
    component: ConfiguredPersonSidebar,
  });

  return (
    <ContentPanel>
      <DetailsSection
        data-testid="add-custodian"
        title="PSB - Personensorgeberechtigte:r"
      >
        <Button
          color="primary"
          variant="plain"
          size="sm"
          sx={{ justifyContent: "flex-start" }}
          startDecorator={<AddIcon />}
          aria-label="Personensorgeberechtigte:r hinzufügen"
          onClick={() => personSidebar.open(props)}
        >
          Hinzufügen
        </Button>
      </DetailsSection>
    </ContentPanel>
  );
}

function ConfiguredPersonSidebar(
  props: {
    procedure: ProcedureDetails;
  } & SidebarWithFormRefProps,
) {
  const addPersonAsCustodian = useAddPersonAsCustodian(props.procedure.id);

  async function handleCreate(values: DefaultPersonFormValues) {
    await addPersonAsCustodian.mutateAsync(
      mapToRequest(values, props.procedure.version),
    );
  }

  async function handleSelect(person: ApiGetReferencePersonResponse) {
    await addPersonAsCustodian.mutateAsync({
      custodian: {
        ...person,
        referenceId: person.id,
      },
      procedureVersion: props.procedure.version,
    });
  }

  return (
    <PersonSidebar
      title="PSB hinzufügen"
      submitLabel="Hinzufügen"
      formRef={props.formRef}
      onCreate={({ createInputs }) => handleCreate(createInputs)}
      onSelect={({ person }) => handleSelect(person)}
      onClose={props.onClose}
    />
  );
}

function mapToRequest(
  values: DefaultPersonFormValues,
  procedureVersion: number,
): ApiAddCustodianRequest {
  return {
    custodian: mapToPersonAddRequest(values),
    procedureVersion: procedureVersion,
  };
}
