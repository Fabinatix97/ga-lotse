<#import "template.ftl" as layout>
<#import "field.ftl" as field>
<#import "buttons.ftl" as buttons>

<@layout.registrationLayout; section>
<!-- template: pin-access-code.ftl -->
    <#if section = "title">

        ${msg("loginTitle",(realm.displayName!''))}

    <#elseif section = "header">

        ${msg("accessCodePageTitle")}

        <div id="page-title-info-text">
            ${msg(context_info!'')}
        </div>

    <#elseif section = "form">

        <form id="kc-form-login" class="${properties.kcFormClass!}" onsubmit="return true;" action="${url.loginAction}" method="post" autocomplete="off">

            <@field.input name="access_code" label=msg("accessCodeLabel") value="${(access_code!'')}" fieldName="access_code" />

            <#assign pin_error = kcSanitize(messagesPerField.get('pin'))?no_esc>
            <@field.group name="pin" label=msg("pinLabel") error=pin_error required=false>
                <span class="${properties.kcInputClass} <#if pin_error?has_content>${properties.kcError}</#if>">
                    <input id="pin" name="pin" value="" type="password" autocomplete="off" aria-invalid="<#if pin_error?has_content>true</#if>"/>
                    <@field.errorIcon error=pin_error/>
                </span>
            </@field.group>

            <div id="kc-form-buttons" class="${properties.kcFormGroupClass!}">
              <@buttons.button name="login" id="kc-login" label="doSubmit" class=["kcButtonPrimaryClass", "kcButtonBlockClass"]/>
            </div>

        </form>

    </#if>
</@layout.registrationLayout>
