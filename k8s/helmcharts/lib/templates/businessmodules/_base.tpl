{{- define "module.base.container" }}

{{- $bootstrapEnabled := (include "getBootstrapEnabled" .) }}

{{- $setupAdminEnabled := false }}
{{- if and (not (.Values.businessmodules.base.setupAdmin).username) (not (.Values.businessmodules.base.setupAdmin).email) }}
  {{- $setupAdminEnabled = false }}
{{- else if and (.Values.businessmodules.base.setupAdmin).username (.Values.businessmodules.base.setupAdmin).email }}
  {{- $setupAdminEnabled = true }}
{{- else }}
  {{- fail "setupAdmin needs an email and username property!" }}
{{- end }}

{{- if and (eq $bootstrapEnabled "true") (eq $setupAdminEnabled false) }}
  {{- fail "If bootstrapAdmin is enabled setupAdmin must be enabled as well. Set username and email of businessmodules.base.setupAdmin" }}
{{- end }}

{{- if not .Values.businessmoduleDefaults.database.selfmanaged }}
- name: spring.datasource.url
  value: "jdbc:postgresql://${DB_HOST}:${DB_PORT}/${DB_NAME}?sslmode=verify-full&sslrootcert=/var/run/db-certs/ca.crt"
{{- else }}
- name: spring.datasource.url
  value: "jdbc:postgresql://${DB_HOST}:${DB_PORT}/${DB_NAME}"
{{- end }}
- name: DB_HOST
  valueFrom:
    secretKeyRef:
      name: base-db
      key: POSTGRESQL_HOST
- name: DB_PORT
  valueFrom:
    secretKeyRef:
      name: base-db
      key: POSTGRESQL_PORT
- name: DB_NAME
  valueFrom:
    secretKeyRef:
      name: base-db
      key: POSTGRESQL_DB
- name: spring.datasource.username
  valueFrom:
    secretKeyRef:
      name: base-db
      key: POSTGRESQL_USER
- name: spring.datasource.password
  valueFrom:
    secretKeyRef:
      name: base-db
      key: POSTGRESQL_PASSWORD
- name: spring.mail.host
  valueFrom:
    secretKeyRef:
      key: smtp-host
      name: smtp-secrets
- name: spring.mail.port
  valueFrom:
    secretKeyRef:
      key: smtp-port
      name: smtp-secrets
- name: spring.mail.username
  valueFrom:
    secretKeyRef:
      key: smtp-username
      name: smtp-secrets
- name: spring.mail.password
  valueFrom:
    secretKeyRef:
      key: smtp-password
      name: smtp-secrets
- name: spring.mail.properties.mail.smtp.ssl.enable
  value: "{{ .Values.businessmodules.base.smtp.ssl }}"
- name: eshg.mail.noreply
  value: "{{ .Values.businessmodules.base.noreplyMail }}"
- name: eshg.keycloak.allow-passwords-for-employees
  value: "{{ .Values.businessmodules.base.allowEmployeePasswords }}"
{{- if eq $bootstrapEnabled "true" }}
- name: eshg.keycloak.bootstrap-admin.password
  valueFrom:
    secretKeyRef:
      key: password
      name: keycloak-admin
{{- end }}
- name: eshg.keycloak.bootstrap-admin.enabled
  valueFrom:
    configMapKeyRef:
      name: keycloak-bootstrap
      key: bootstrapEnabled
- name: eshg.keycloak.admin-client.client-secret
  valueFrom:
    secretKeyRef:
      key: base-admin-client-secret
      name: keycloak-admin
- name: eshg.keycloak.employee-realm.auth-client-secret
  valueFrom:
    secretKeyRef:
      name: keycloak-client-secrets
      key: employee-auth-client-secret
- name: eshg.keycloak.citizen-realm.auth-client-secret
  valueFrom:
    secretKeyRef:
      name: keycloak-client-secrets
      key: citizen-auth-client-secret
- name: eshg.keycloak.citizen-realm.muk-idp.signing-certificate
  value: "{{ .Values.keycloak.muk.signingCertificate }}"
- name: eshg.muk.profile
  value: "{{ .Values.keycloak.muk.profile }}"
- name: eshg.keycloak.citizen-realm.bund-id-idp.signing-certificate
  value: "{{ .Values.keycloak.bundId.signingCertificate }}"
- name: eshg.bund-id.profile
  value: "{{ .Values.keycloak.bundId.profile }}"
- name: eshg.keycloak.employee-realm.module-client-secrets.auditlog
  valueFrom:
    secretKeyRef:
      name: keycloak-client-secrets
      key: auditlog-module-client-secret
- name: eshg.keycloak.employee-realm.module-client-secrets.base
  valueFrom:
    secretKeyRef:
      name: keycloak-client-secrets
      key: base-module-client-secret
- name: eshg.keycloak.employee-realm.module-client-secrets.chat-management
  valueFrom:
    secretKeyRef:
      name: keycloak-client-secrets
      key: chat-management-module-client-secret
- name: eshg.keycloak.employee-realm.module-client-secrets.citizen-auth
  valueFrom:
    secretKeyRef:
      name: keycloak-client-secrets
      key: citizen-auth-module-client-secret
- name: eshg.keycloak.employee-realm.module-client-secrets.employee-auth
  valueFrom:
    secretKeyRef:
      name: keycloak-client-secrets
      key: employee-auth-module-client-secret
- name: eshg.keycloak.employee-realm.module-client-secrets.inspection
  valueFrom:
    secretKeyRef:
      name: keycloak-client-secrets
      key: inspection-module-client-secret
- name: eshg.keycloak.employee-realm.module-client-secrets.local-service-directory
  valueFrom:
    secretKeyRef:
      name: keycloak-client-secrets
      key: local-service-directory-module-client-secret
- name: eshg.keycloak.employee-realm.module-client-secrets.measles-protection
  valueFrom:
    secretKeyRef:
      name: keycloak-client-secrets
      key: measles-protection-module-client-secret
- name: eshg.keycloak.employee-realm.module-client-secrets.school-entry
  valueFrom:
    secretKeyRef:
      name: keycloak-client-secrets
      key: school-entry-module-client-secret
- name: eshg.keycloak.employee-realm.module-client-secrets.statistics
  valueFrom:
    secretKeyRef:
      name: keycloak-client-secrets
      key: statistics-module-client-secret
- name: eshg.keycloak.employee-realm.module-client-secrets.travel-medicine
  valueFrom:
    secretKeyRef:
      name: keycloak-client-secrets
      key: travel-medicine-module-client-secret
- name: eshg.keycloak.employee-realm.module-client-secrets.sti-protection
  valueFrom:
    secretKeyRef:
      name: keycloak-client-secrets
      key: sti-protection-module-client-secret
- name: eshg.keycloak.employee-realm.module-client-secrets.medical-registry
  valueFrom:
    secretKeyRef:
      name: keycloak-client-secrets
      key: medical-registry-module-client-secret
- name: eshg.keycloak.employee-realm.module-client-secrets.dental
  valueFrom:
    secretKeyRef:
      name: keycloak-client-secrets
      key: dental-module-client-secret
- name: eshg.keycloak.employee-realm.module-client-secrets.official-medical-service
  valueFrom:
    secretKeyRef:
      name: keycloak-client-secrets
      key: official-medical-service-module-client-secret
- name: eshg.keycloak.employee-realm.module-client-secrets.opendata
  valueFrom:
    secretKeyRef:
      name: keycloak-client-secrets
      key: opendata-module-client-secret
- name: eshg.keycloak.employee-realm.module-client-secrets.meds-abroad
  valueFrom:
    secretKeyRef:
      name: keycloak-client-secrets
      key: meds-abroad-module-client-secret
- name: spring.security.oauth2.client.registration.module-client.client-id
  value: system-base
- name: spring.security.oauth2.client.registration.module-client.client-secret
  valueFrom:
    secretKeyRef:
      name: keycloak-client-secrets
      key: base-module-client-secret
- name: eshg.keycloak.provision-test-users
  value: {{ .Values.businessmodules.base.provisionTestUsers | quote }}
- name: eshg.keycloak.test-users-secret-override
  valueFrom:
    secretKeyRef:
      name: keycloak-test-user-secrets
      key: test-users-secret-override
- name: eshg.employee-portal.reverse-proxy.url
  value: "https://{{ .Values.domains.hosts.employeeportal }}"
- name: eshg.citizen-portal.reverse-proxy.url
  value: "https://{{ .Values.domains.hosts.citizenportal }}"
- name: eshg.keycloak.smtp.host
  valueFrom:
    secretKeyRef:
      key: smtp-host
      name: smtp-secrets
- name: eshg.keycloak.smtp.port
  valueFrom:
    secretKeyRef:
      key: smtp-port
      name: smtp-secrets
- name: eshg.keycloak.smtp.ssl-enabled
  value: "{{ .Values.businessmodules.base.smtp.ssl }}"
- name: eshg.keycloak.smtp.username
  valueFrom:
    secretKeyRef:
      name: smtp-secrets
      key: smtp-username
- name: eshg.keycloak.smtp.password
  valueFrom:
    secretKeyRef:
      name: smtp-secrets
      key: smtp-password
- name: eshg.keycloak.setup-admin.enabled
  value: "{{ $setupAdminEnabled }}"
{{- if eq $setupAdminEnabled true }}
- name: eshg.keycloak.setup-admin.username
  value: "{{ .Values.businessmodules.base.setupAdmin.username }}"
- name: eshg.keycloak.setup-admin.email
  value: "{{ .Values.businessmodules.base.setupAdmin.email }}"
{{- end }}
- name: eshg.keycloak.url
  value: "https://{{ .Values.domains.hosts.keycloak }}"
- name: eshg.keycloak.internal.url
  value: "https://{{ .Values.domains.hosts.keycloakInternal }}"
{{- if .Values.businessmodules.schoolentry.enabled }}
- name: de.eshg.business-modules.clients.SCHOOL_ENTRY.url
  value: "http://schoolentry{{ .Values.domains.clusterLocalSuffix }}"
{{- end }}
{{- if .Values.businessmodules.inspection.enabled }}
- name: de.eshg.business-modules.clients.INSPECTION.url
  value: "http://inspection{{ .Values.domains.clusterLocalSuffix }}"
{{- end }}
{{- if .Values.businessmodules.measlesprotection.enabled }}
- name: de.eshg.business-modules.clients.MEASLES_PROTECTION.url
  value: "http://measlesprotection{{ .Values.domains.clusterLocalSuffix }}"
{{- end }}
{{- if .Values.businessmodules.travelmedicine.enabled }}
- name: de.eshg.business-modules.clients.TRAVEL_MEDICINE.url
  value: "http://travelmedicine{{ .Values.domains.clusterLocalSuffix }}"
{{- end }}
{{- if .Values.businessmodules.stiprotection.enabled }}
- name: de.eshg.business-modules.clients.STI_PROTECTION.url
  value: "http://stiprotection{{ .Values.domains.clusterLocalSuffix }}"
{{- end }}
{{- if .Values.businessmodules.dental.enabled }}
- name: de.eshg.business-modules.clients.DENTAL.url
  value: "http://dental{{ .Values.domains.clusterLocalSuffix }}"
{{- end }}
{{- if .Values.businessmodules.officialmedicalservice.enabled }}
- name: de.eshg.business-modules.clients.OFFICIAL_MEDICAL_SERVICE.url
  value: "http://officialmedicalservice{{ .Values.domains.clusterLocalSuffix }}"
{{- end }}
{{- if .Values.businessmodules.medicalregistry.enabled }}
- name: de.eshg.business-modules.clients.MEDICAL_REGISTRY.url
  value: "http://medicalregistry{{ .Values.domains.clusterLocalSuffix }}"
{{- end }}
{{- if .Values.businessmodules.medsabroad.enabled }}
- name: de.eshg.business-modules.clients.MEDS_ABROAD.url
  value: "http://medsabroad{{ .Values.domains.clusterLocalSuffix }}"
{{- end }}
{{- if .Values.svgsanitizer.enabled }}
- name: de.eshg.base.svg-sanitizer-base-url
  value: "http://svgsanitizer{{ .Values.domains.clusterLocalSuffix }}"
{{- end }}
- name: eshg.keycloak.test-client.max-number-of-parallel-threads
  value: "2"
{{- end }}
