/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { ApiInstitutionContact } from "@eshg/base-api";
import { useState } from "react";

import { InstitutionContactCard } from "@/lib/baseModule/components/contacts/forms/card/InstitutionContactCard";
import { MergeInstitutionContactForm } from "@/lib/baseModule/components/contacts/forms/merge/MergeInstitutionContactForm";
import { SelectMergeTargetForm } from "@/lib/baseModule/components/contacts/forms/merge/SelectMergeTargetForm";
import { useResetAlertContextOnChange } from "@/lib/shared/hooks/useResetAlertContextOnChange";
import {
  SidebarWithFormRefProps,
  useSidebarWithFormRef,
} from "@/lib/shared/hooks/useSidebarWithFormRef";

interface SelectStage {
  stage: "select";
}

interface MergeStage {
  stage: "merge";
  selected: "first" | "second";
}

type SidebarState = SelectStage | MergeStage;

interface MergeInstitutionContactSidebarProps extends SidebarWithFormRefProps {
  firstContact: ApiInstitutionContact;
  secondContact: ApiInstitutionContact;
}

export function useMergeInstitutionContactSidebar() {
  return useSidebarWithFormRef({
    component: MergeInstitutionContactSidebar,
  });
}

function MergeInstitutionContactSidebar(
  props: MergeInstitutionContactSidebarProps,
) {
  const [state, setState] = useState<SidebarState>({
    stage: "select",
  });

  useResetAlertContextOnChange(state.stage);

  if (state.stage === "select") {
    return (
      <SelectMergeTargetForm
        onSubmit={(selected) => setState({ stage: "merge", selected })}
        renderCard={(contact) => <InstitutionContactCard contact={contact} />}
        firstContact={props.firstContact}
        secondContact={props.secondContact}
        onClose={() => props.onClose(true)}
      />
    );
  }

  return (
    <MergeInstitutionContactForm
      into={
        state.selected === "first" ? props.firstContact : props.secondContact
      }
      from={{
        type: "Entity",
        data:
          state.selected === "first" ? props.secondContact : props.firstContact,
      }}
      sidebarFormRef={props.formRef}
      onCancel={() => props.onClose(false)}
      onSuccess={() => props.onClose(true)}
      onBack={() => setState({ stage: "select" })}
      intoLabel={"Kontakt A"}
      fromLabel={"Kontakt B"}
    />
  );
}
