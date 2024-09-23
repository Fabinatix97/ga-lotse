<#macro checkbox checked title>
<#-- @ftlvariable name="checked" type="java.lang.Boolean" -->
<#-- @ftlvariable name="title" type="java.lang.String" -->
  <div>
    <span style="font-size: 2rem; vertical-align: middle; margin-right: 0.5mm;">
      <#if checked>☒<#else>☐</#if>
    </span>
    <span style="vertical-align: middle;">${title}</span>
  </div>
</#macro>
