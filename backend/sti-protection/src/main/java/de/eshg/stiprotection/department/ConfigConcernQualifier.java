/*
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.stiprotection.department;

import de.eshg.stiprotection.persistence.db.Concern;
import java.lang.annotation.ElementType;
import java.lang.annotation.Inherited;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;
import org.springframework.beans.factory.annotation.Qualifier;

@Target({
  ElementType.PARAMETER,
  ElementType.TYPE,
})
@Retention(RetentionPolicy.RUNTIME)
@Inherited
@Qualifier
public @interface ConfigConcernQualifier {
  Concern concern();
}
