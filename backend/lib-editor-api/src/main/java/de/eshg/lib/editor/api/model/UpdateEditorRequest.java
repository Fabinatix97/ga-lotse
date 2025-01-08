/*
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.lib.editor.api.model;

import io.swagger.v3.oas.annotations.media.Schema;
import java.util.UUID;

@Schema(name = "UpdateEditorRequest")
public record UpdateEditorRequest(
    String title, String text, MoveOperation moveOperation, UUID answerId) {}
