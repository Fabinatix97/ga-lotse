<#import "template.ftl" as layout>
<#import "field.ftl" as field>
<#import "buttons.ftl" as buttons>

<@layout.registrationLayout; section>
<!-- template: date-of-birth-access-code.ftl -->
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

            <#assign date_of_birth_error = kcSanitize(messagesPerField.get('date_of_birth'))?no_esc>
            <@field.group name="date_of_birth" label=msg("dateOfBirthLabel") error=date_of_birth_error required=false>
                <span class="${properties.kcInputClass} <#if date_of_birth_error?has_content>${properties.kcError}</#if>">
                    <input id="date_of_birth" name="date_of_birth" value="" type="date" autocomplete="off" aria-invalid="<#if date_of_birth_error?has_content>true</#if>"/>
                    <@field.errorIcon error=date_of_birth_error/>
                </span>
            </@field.group>

            <div id="kc-form-buttons" class="${properties.kcFormGroupClass!}">
              <@buttons.button name="login" id="kc-login" label="doSubmit" class=["kcButtonPrimaryClass", "kcButtonBlockClass"]/>
            </div>

        </form>

    </#if>
</@layout.registrationLayout>
