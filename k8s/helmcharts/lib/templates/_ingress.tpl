{{- define "ingress" }}
{{- $name := index . 0 }}
{{- $type := index . 1 }}
{{- $host := index . 2 }}
{{- $port := index . 3 }}
{{- $service := index . 4 }}
{{- $namespace := index . 5 }}

{{ if (eq "traefik" $type) -}}
apiVersion: traefik.io/v1alpha1
kind: IngressRouteTCP
metadata:
  name: {{ $name }}
  namespace: {{ $namespace }}
spec:
  entryPoints:
    - websecure
  routes:
    - match: HostSNI(`{{ $host }}`)
      services:
        - name: {{ $service }}
          port: {{ $port }}
  tls:
    passthrough: true
{{- end }}
{{ if (eq "openshift" $type) -}}

apiVersion: route.openshift.io/v1
kind: Route
metadata:
  name: {{ $name }}
  namespace: {{ $namespace }}
spec:
  host: {{ $host }}
  port:
    targetPort: {{ $port }}
  tls:
    termination: passthrough
    insecureEdgeTerminationPolicy: Redirect
  to:
    kind: Service
    name: {{ $service }}

{{- end }}
{{- end }}
