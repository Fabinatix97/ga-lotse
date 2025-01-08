/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { ApiPersonContact } from "@eshg/employee-portal-api/base";
import { useState } from "react";

import { PersonContactCard } from "@/lib/baseModule/components/contacts/forms/card/PersonContactCard";
import { MergePersonContactForm } from "@/lib/baseModule/components/contacts/forms/merge/MergePersonContactForm";
import { SelectMergeTargetForm } from "@/lib/baseModule/components/contacts/forms/merge/SelectMergeTargetForm";
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

interface MergePersonContactSidebarProps extends SidebarWithFormRefProps {
  firstContact: ApiPersonContact;
  secondContact: ApiPersonContact;
}

export function useMergePersonContactSidebar() {
  return useSidebarWithFormRef({
    component: MergePersonContactSidebar,
  });
}

export function MergePersonContactSidebar(
  props: MergePersonContactSidebarProps,
) {
  const [state, setState] = useState<SidebarState>({
    stage: "select",
  });

  if (state.stage === "select") {
    return (
      <SelectMergeTargetForm
        onSubmit={(selected) => setState({ stage: "merge", selected })}
        renderCard={(contact) => <PersonContactCard contact={contact} />}
        firstContact={props.firstContact}
        secondContact={props.secondContact}
        onClose={() => props.onClose(true)}
      />
    );
  }

  return (
    <MergePersonContactForm
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
