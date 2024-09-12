function show(platform, enabled, useSettingsInsteadOfPreferences) {
  // Localization
  const labelStrings = {
    "ar": {
      "iOS": "يمكنك تفعيل إضافة رابط الاقتباس على Safari من الإعدادات.",
      "macOn": "إضافة رابط الاقتباس مفعل حاليًا. يمكنك إيقاف تشغيله في قسم الإضافات في إعدادات Safari.",
      "macOff": "إضافة رابط الاقتباس غير مفعلة حاليًا. يمكنك تشغيلها في قسم الإضافات في إعدادات Safari.",
      "macUnknown": "يمكنك تفعيل إضافة رابط الاقتباس في قسم الإضافات في إعدادات Safari.",
      "macPreferences": "قم بالخروج وفتح إعدادات Safari…"
    },
    "ar-SA": {
      "iOS": "يمكنك تفعيل إضافة رابط الاقتباس على Safari من الإعدادات.",
      "macOn": "إضافة رابط الاقتباس مفعل حاليًا. يمكنك إيقاف تشغيله من قسم الإضافات في إعدادات Safari.",
      "macOff": "إضافة رابط الاقتباس غير مفعلة حاليًا. يمكنك تفعيلها من قسم الإضافات في إعدادات Safari.",
      "macUnknown": "يمكنك تفعيل إضافة رابط الاقتباس في قسم الإضافات ضمن إعدادات Safari.",
      "macPreferences": "خروج وفتح إعدادات Safari…"
    },
    "de": {
      "iOS": "Sie können die ZitatLink Safari-Erweiterung in den Einstellungen aktivieren.",
      "macOn": "Die ZitatLink-Erweiterung ist derzeit aktiviert. Sie können sie im Abschnitt Erweiterungen der Safari-Einstellungen deaktivieren.",
      "macOff": "Die ZitatLink-Erweiterung ist derzeit deaktiviert. Sie können sie im Abschnitt Erweiterungen der Safari-Einstellungen aktivieren.",
      "macUnknown": "Sie können die ZitatLink-Erweiterung im Abschnitt Erweiterungen der Safari-Einstellungen aktivieren.",
      "macPreferences": "Beenden und Safari-Einstellungen öffnen…"
    },
    "en": {
      "iOS": "You can turn on QuoteLink’s Safari extension in Settings.",
      "macOn": "QuoteLink’s extension is currently on. You can turn it off in the Extensions section of Safari Settings.",
      "macOff": "QuoteLink’s extension is currently off. You can turn it on in the Extensions section of Safari Settings.",
      "macUnknown": "You can turn on QuoteLink’s extension in the Extensions section of Safari Settings.",
      "macPreferences": "Quit and Open Safari Settings…"
    },
    "es": {
      "iOS": "Puedes activar la extensión Safari de EnlaceCita en la Configuración.",
      "macOn": "La extensión de EnlaceCita está actualmente activada. Puedes desactivarla en la sección de Extensiones de la Configuración de Safari.",
      "macOff": "La extensión de EnlaceCita está actualmente desactivada. Puedes activarla en la sección de Extensiones de la Configuración de Safari.",
      "macUnknown": "Puedes activar la extensión Safari de EnlaceCita en la sección de Extensiones de la Configuración de Safari.",
      "macPreferences": "Salir y abrir la Configuración de Safari…"
    },
    "es-MX": {
      "iOS": "Puedes activar la extensión Safari de EnlaceCita en la Configuración.",
      "macOn": "La extensión de EnlaceCita está activada. Puedes desactivarla en la sección de Extensiones de la Configuración de Safari.",
      "macOff": "La extensión de EnlaceCita está desactivada. Puedes activarla en la sección de Extensiones de la Configuración de Safari.",
      "macUnknown": "Puedes activar la extensión Safari de EnlaceCita en la sección de Extensiones de la Configuración de Safari.",
      "macPreferences": "Salir y abrir la Configuración de Safari…"
    },
    "fr": {
      "iOS": "Vous pouvez activer l'extension Safari de LienCitation dans les Réglages.",
      "macOn": "L'extension LienCitation est actuellement activée. Vous pouvez la désactiver dans la section Extensions des Réglages Safari.",
      "macOff": "L'extension LienCitation est actuellement désactivée. Vous pouvez l'activer dans la section Extensions des Réglages Safari.",
      "macUnknown": "Vous pouvez activer l'extension LienCitation dans la section Extensions des Réglages Safari.",
      "macPreferences": "Quittez et ouvrez les Réglages Safari…"
    },
    "hi": {
      "iOS": "आप सेटिंग्स में उद्धरणलिंक की Safari एक्सटेंशन को चालू कर सकते हैं।",
      "macOn": "उद्धरणलिंक का एक्सटेंशन वर्तमान में चालू है। आप इसे Safari सेटिंग्स के एक्सटेंशन सेक्शन में बंद कर सकते हैं।",
      "macOff": "उद्धरणलिंक का एक्सटेंशन वर्तमान में बंद है। आप इसे Safari सेटिंग्स के एक्सटेंशन सेक्शन में चालू कर सकते हैं।",
      "macUnknown": "आप Safari सेटिंग्स के एक्सटेंशन सेक्शन में उद्धरणलिंक का एक्सटेंशन चालू कर सकते हैं।",
      "macPreferences": "बाहर निकलें और Safari सेटिंग्स खोलें…"
    },
    "id": {
      "iOS": "Anda dapat mengaktifkan ekstensi Safari TautanKutipan di Pengaturan.",
      "macOn": "Ekstensi TautanKutipan saat ini aktif. Anda dapat mematikannya di bagian Ekstensi di Pengaturan Safari.",
      "macOff": "Ekstensi TautanKutipan saat ini nonaktif. Anda dapat mengaktifkannya di bagian Ekstensi di Pengaturan Safari.",
      "macUnknown": "Anda dapat mengaktifkan ekstensi TautanKutipan di bagian Ekstensi di Pengaturan Safari.",
      "macPreferences": "Keluar dan Buka Pengaturan Safari…"
    },
    "ja": {
      "iOS": "設定で引用リンクのSafari拡張機能を有効にすることができます。",
      "macOn": "引用リンクの拡張機能は現在オンになっています。Safariの設定の拡張機能セクションでオフにすることができます。",
      "macOff": "引用リンクの拡張機能は現在オフになっています。Safariの設定の拡張機能セクションでオンにすることができます。",
      "macUnknown": "Safariの設定の拡張機能セクションで引用リンクの拡張機能をオンにすることができます。",
      "macPreferences": "終了してSafari設定を開く…"
    },
    "ko-KR": {
      "iOS": "설정에서 인용링크의 Safari 확장을 활성화할 수 있습니다.",
      "macOn": "현재 인용링크 확장이 활성화되어 있습니다. Safari 설정의 확장 프로그램 섹션에서 비활성화할 수 있습니다.",
      "macOff": "현재 인용링크 확장이 비활성화되어 있습니다. Safari 설정의 확장 프로그램 섹션에서 활성화할 수 있습니다.",
      "macUnknown": "Safari 설정의 확장 프로그램 섹션에서 인용링크 확장을 활성화할 수 있습니다.",
      "macPreferences": "Safari 설정을 열려면 종료하고 열기…"
    },
    "nl": {
      "iOS": "U kunt de CitatieLink Safari-extensie inschakelen in Instellingen.",
      "macOn": "De CitatieLink-extensie is momenteel ingeschakeld. U kunt deze uitschakelen in de sectie Extensies van Safari Instellingen.",
      "macOff": "De CitatieLink-extensie is momenteel uitgeschakeld. U kunt deze inschakelen in de sectie Extensies van Safari Instellingen.",
      "macUnknown": "U kunt de CitatieLink-extensie inschakelen in de sectie Extensies van Safari Instellingen.",
      "macPreferences": "Stoppen en Safari Instellingen openen…"
    },
    "pt": {
      "iOS": "Você pode ativar a extensão do Safari do LinkCitação nas Configurações.",
      "macOn": "A extensão do LinkCitação está atualmente ativada. Você pode desativá-la na seção Extensões das Configurações do Safari.",
      "macOff": "A extensão do LinkCitação está atualmente desativada. Você pode ativá-la na seção Extensões das Configurações do Safari.",
      "macUnknown": "Você pode ativar a extensão do LinkCitação na seção Extensões das Configurações do Safari.",
      "macPreferences": "Sair e abrir as Configurações do Safari…"
    },
    "pt-PT": {
      "iOS": "Pode ativar a extensão do Safari do LinkCitação nas Definições.",
      "macOn": "A extensão do LinkCitação está atualmente ativada. Pode desativá-la na secção Extensões das Definições do Safari.",
      "macOff": "A extensão do LinkCitação está atualmente desativada. Pode ativá-la na secção Extensões das Definições do Safari.",
      "macUnknown": "Pode ativar a extensão do LinkCitação na secção Extensões das Definições do Safari.",
      "macPreferences": "Saia e abra as Definições do Safari…"
    },
    "pt-BR": {
      "iOS": "Você pode ativar a extensão do Safari do LinkCitação nas Configurações.",
      "macOn": "A extensão do LinkCitação está atualmente ativada. Você pode desativá-la na seção Extensões das Configurações do Safari.",
      "macOff": "A extensão do LinkCitação está atualmente desativada. Você pode ativá-la na seção Extensões das Configurações do Safari.",
      "macUnknown": "Você pode ativar a extensão do LinkCitação na seção Extensões das Configurações do Safari.",
      "macPreferences": "Saia e abra as Configurações do Safari…"
    },
    "th": {
      "iOS": "คุณสามารถเปิดใช้งานส่วนขยาย Safari ของ ลิงก์การอ้างอิง ได้ในการตั้งค่า",
      "macOn": "ส่วนขยายของ ลิงก์การอ้างอิง ปัจจุบันเปิดใช้งานอยู่ คุณสามารถปิดการใช้งานได้ในส่วนขยายของการตั้งค่า Safari",
      "macOff": "ส่วนขยายของ ลิงก์การอ้างอิง ปัจจุบันปิดใช้งานอยู่ คุณสามารถเปิดการใช้งานได้ในส่วนขยายของการตั้งค่า Safari",
      "macUnknown": "คุณสามารถเปิดใช้งานส่วนขยายของ ลิงก์การอ้างอิง ได้ในส่วนขยายของการตั้งค่า Safari",
      "macPreferences": "ออกและเปิดการตั้งค่า Safari…"
    },
    "tr": {
      "iOS": "AlıntıBağlantısı'nın Safari uzantısını Ayarlar'da açabilirsiniz.",
      "macOn": "AlıntıBağlantısı'nın uzantısı şu anda açık. Bunu Safari Ayarları'ndaki Uzantılar bölümünde kapatabilirsiniz.",
      "macOff": "AlıntıBağlantısı'nın uzantısı şu anda kapalı. Bunu Safari Ayarları'ndaki Uzantılar bölümünde açabilirsiniz.",
      "macUnknown": "AlıntıBağlantısı'nın uzantısını Safari Ayarları'ndaki Uzantılar bölümünde açabilirsiniz.",
      "macPreferences": "Çıkış yap ve Safari Ayarları'nı aç…"
    },
    "zh": {
      "iOS": "您可以在设置中启用 引述链接 的 Safari 扩展程序。",
      "macOn": "引述链接 的扩展程序目前已启用。您可以在 Safari 设置的扩展程序部分将其禁用。",
      "macOff": "引述链接 的扩展程序目前已禁用。您可以在 Safari 设置的扩展程序部分将其启用。",
      "macUnknown": "您可以在 Safari 设置的扩展程序部分启用 引述链接 的扩展程序。",
      "macPreferences": "退出并打开 Safari 设置…"
    },
    "zh-CN": {
      "iOS": "您可以在设置中启用 引述链接 的 Safari 扩展程序。",
      "macOn": "引述链接 的扩展程序目前已启用。您可以在 Safari 设置的扩展程序部分将其禁用。",
      "macOff": "引述链接 的扩展程序目前已禁用。您可以在 Safari 设置的扩展程序部分将其启用。",
      "macUnknown": "您可以在 Safari 设置的扩展程序部分启用 引述链接 的扩展程序。",
      "macPreferences": "退出并打开 Safari 设置…"
    },
    "zh-TW": {
      "iOS": "您可以在設定中啟用 引述鏈接 的 Safari 擴充功能。",
      "macOn": "引述鏈接 的擴充功能目前已啟用。您可以在 Safari 設定的擴充功能部分將其停用。",
      "macOff": "引述鏈接 的擴充功能目前已停用。您可以在 Safari 設定的擴充功能部分將其啟用。",
      "macUnknown": "您可以在 Safari 設定的擴充功能部分啟用 引述鏈接 的擴充功能。",
      "macPreferences": "退出並打開 Safari 設定…"
    },
    "zh-HK": {
      "iOS": "您可以在設定中啟用 引述鏈接 的 Safari 擴展程式。",
      "macOn": "引述鏈接 的擴展程式目前已啟用。您可以在 Safari 設定的擴展程式部分將其禁用。",
      "macOff": "引述鏈接 的擴展程式目前已禁用。您可以在 Safari 設定的擴展程式部分將其啟用。",
      "macUnknown": "您可以在 Safari 設定的擴展程式部分啟用 引述鏈接 的擴展程式。",
      "macPreferences": "退出並打開 Safari 設定…"
    },
  };
  
  const langCode = labelStrings[window.navigator.language]
  ? window.navigator.language
  : labelStrings[window.navigator.language.substring(0, 2)]
  ? window.navigator.language.substring(0, 2)
  : 'en';
  
  document.getElementsByClassName('platform-ios')[0].innerText = labelStrings[langCode].iOS;
  
  document.body.classList.add(`platform-${platform}`);
  
  if (useSettingsInsteadOfPreferences) {
    document.getElementsByClassName('platform-mac state-on')[0].innerText = labelStrings[langCode].macOn;
    document.getElementsByClassName('platform-mac state-off')[0].innerText = labelStrings[langCode].macOff;
    document.getElementsByClassName('platform-mac state-unknown')[0].innerText = labelStrings[langCode].macUnknown;
    document.getElementsByClassName('platform-mac open-preferences')[0].innerText = labelStrings[langCode].macPreferences;
  }
  
  if (typeof enabled === "boolean") {
    document.body.classList.toggle(`state-on`, enabled);
    document.body.classList.toggle(`state-off`, !enabled);
  } else {
    document.body.classList.remove(`state-on`);
    document.body.classList.remove(`state-off`);
  }
  document.body.classList.add('fadeIn');

}

function openPreferences() {
    webkit.messageHandlers.controller.postMessage("open-preferences");
}

document.querySelector("button.open-preferences").addEventListener("click", openPreferences);
