{{- define "module.statistics.container" }}
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
      name: statistics-db
      key: POSTGRESQL_HOST
- name: DB_PORT
  valueFrom:
    secretKeyRef:
      name: statistics-db
      key: POSTGRESQL_PORT
- name: DB_NAME
  valueFrom:
    secretKeyRef:
      name: statistics-db
      key: POSTGRESQL_DB
- name: spring.datasource.username
  valueFrom:
    secretKeyRef:
      name: statistics-db
      key: POSTGRESQL_USER
- name: spring.datasource.password
  valueFrom:
    secretKeyRef:
      name: statistics-db
      key: POSTGRESQL_PASSWORD
- name: de.eshg.centralrepository.serviceUrl
  value: "http://{{ .Values.domains.centralservices.centralrepository }}"
- name: de.eshg.base.service-url
  value: "http://base{{ .Values.domains.clusterLocalSuffix }}"
- name: eshg.keycloak.url
  value: "https://{{ .Values.domains.hosts.keycloak }}"
- name: eshg.keycloak.internal.url
  value: "https://{{ .Values.domains.hosts.keycloakInternal }}"
{{- if .Values.businessmodules.schoolentry.enabled }}
- name: de.eshg.business-modules.clients.SCHOOL_ENTRY.url
  value: http://schoolentry{{ .Values.domains.clusterLocalSuffix }}
{{- end }}
{{- if .Values.businessmodules.inspection.enabled }}
- name: de.eshg.business-modules.clients.INSPECTION.url
  value: http://inspection{{ .Values.domains.clusterLocalSuffix }}
{{- end }}
{{- if .Values.businessmodules.officialmedicalservice.enabled }}
- name: de.eshg.business-modules.clients.OFFICIAL_MEDICAL_SERVICE.url
  value: http://officialmedicalservice{{ .Values.domains.clusterLocalSuffix }}
{{- end }}
{{- if .Values.businessmodules.stiprotection.enabled }}
- name: de.eshg.business-modules.clients.STI_PROTECTION.url
  value: http://stiprotection{{ .Values.domains.clusterLocalSuffix }}
{{- end }}
{{- if .Values.businessmodules.dental.enabled }}
- name: de.eshg.business-modules.clients.DENTAL.url
  value: "http://dental{{ .Values.domains.clusterLocalSuffix }}"
{{- end }}
{{- if .Values.businessmodules.measlesprotection.enabled }}
- name: de.eshg.business-modules.clients.MEASLES_PROTECTION.url
  value: http://measlesprotection{{ .Values.domains.clusterLocalSuffix }}
{{- end }}
{{- if .Values.businessmodules.travelmedicine.enabled }}
- name: de.eshg.business-modules.clients.TRAVEL_MEDICINE.url
  value: http://travelmedicine{{ .Values.domains.clusterLocalSuffix }}
{{- end }}
{{- if .Values.businessmodules.medsabroad.enabled }}
- name: de.eshg.business-modules.clients.MEDS_ABROAD.url
  value: http://medsabroad{{ .Values.domains.clusterLocalSuffix }}
{{- end }}
{{- if .Values.businessmodules.medicalregistry.enabled }}
- name: de.eshg.business-modules.clients.MEDICAL_REGISTRY.url
  value: http://medicalregistry{{ .Values.domains.clusterLocalSuffix }}
{{- end }}
{{- if .Values.businessmodules.prostituteprotection.enabled }}
- name: de.eshg.business-modules.clients.PROSTITUTE_PROTECTION.url
  value: http://prostituteprotection{{ .Values.domains.clusterLocalSuffix }}
{{- end }}
- name: spring.security.oauth2.client.registration.module-client.client-id
  value: system-statistics
- name: spring.security.oauth2.client.registration.module-client.client-secret
  valueFrom:
    secretKeyRef:
      name: keycloak-client-secrets
      key: statistics-module-client-secret
{{- end }}
