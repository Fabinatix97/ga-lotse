/*
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.lib.editor.api.model;

import de.eshg.lib.editor.api.model.element.EditorElementDto;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;

public record ModifyEditorElementResponse(@NotNull @Valid EditorElementDto element) {}
