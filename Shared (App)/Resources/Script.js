function show(platform, enabled, useSettingsInsteadOfPreferences) {
  // Localization
  const labelStrings = {
    ar: {
      "iOS": "يمكنك تفعيل إضافة QuoteLink على Safari من الإعدادات.",
      "macOn": "إضافة QuoteLink مفعل حاليًا. يمكنك إيقاف تشغيله في قسم الإضافات في إعدادات Safari.",
      "macOff": "إضافة QuoteLink غير مفعلة حاليًا. يمكنك تشغيلها في قسم الإضافات في إعدادات Safari.",
      "macUnknown": "يمكنك تفعيل إضافة QuoteLink في قسم الإضافات في إعدادات Safari.",
      "macPreferences": "قم بالخروج وفتح إعدادات Safari…"
    },
    de: {
      "iOS": "Sie können die QuoteLink Safari-Erweiterung in den Einstellungen aktivieren.",
      "macOn": "Die QuoteLink-Erweiterung ist derzeit aktiviert. Sie können sie im Abschnitt Erweiterungen der Safari-Einstellungen deaktivieren.",
      "macOff": "Die QuoteLink-Erweiterung ist derzeit deaktiviert. Sie können sie im Abschnitt Erweiterungen der Safari-Einstellungen aktivieren.",
      "macUnknown": "Sie können die QuoteLink-Erweiterung im Abschnitt Erweiterungen der Safari-Einstellungen aktivieren.",
      "macPreferences": "Beenden und Safari-Einstellungen öffnen…"
    },
    en: {
      "iOS": "You can turn on QuoteLink’s Safari extension in Settings.",
      "macOn": "QuoteLink’s extension is currently on. You can turn it off in the Extensions section of Safari Settings.",
      "macOff": "QuoteLink’s extension is currently off. You can turn it on in the Extensions section of Safari Settings.",
      "macUnknown": "You can turn on QuoteLink’s extension in the Extensions section of Safari Settings.",
      "macPreferences": "Quit and Open Safari Settings…"
    },
    es: {
      "iOS": "Puedes activar la extensión Safari de QuoteLink en la Configuración.",
      "macOn": "La extensión de QuoteLink está activada actualmente. Puedes desactivarla en la sección de Extensiones de la Configuración de Safari.",
      "macOff": "La extensión de QuoteLink está desactivada actualmente. Puedes activarla en la sección de Extensiones de la Configuración de Safari.",
      "macUnknown": "Puedes activar la extensión Safari de QuoteLink en la sección de Extensiones de la Configuración de Safari.",
      "macPreferences": "Salir y abrir la Configuración de Safari…"
    },
    fr: {
      "iOS": "Vous pouvez activer l'extension Safari de QuoteLink dans les Réglages.",
      "macOn": "L'extension QuoteLink est actuellement activée. Vous pouvez la désactiver dans la section Extensions des Réglages Safari.",
      "macOff": "L'extension QuoteLink est actuellement désactivée. Vous pouvez l'activer dans la section Extensions des Réglages Safari.",
      "macUnknown": "Vous pouvez activer l'extension QuoteLink dans la section Extensions des Réglages Safari.",
      "macPreferences": "Quittez et ouvrez les Réglages Safari…"
    },
    hi: {
      "iOS": "आप सेटिंग्स में QuoteLink की Safari एक्सटेंशन को चालू कर सकते हैं।",
      "macOn": "QuoteLink का एक्सटेंशन वर्तमान में चालू है। आप इसे Safari सेटिंग्स के एक्सटेंशन सेक्शन में बंद कर सकते हैं।",
      "macOff": "QuoteLink का एक्सटेंशन वर्तमान में बंद है। आप इसे Safari सेटिंग्स के एक्सटेंशन सेक्शन में चालू कर सकते हैं।",
      "macUnknown": "आप Safari सेटिंग्स के एक्सटेंशन सेक्शन में QuoteLink का एक्सटेंशन चालू कर सकते हैं।",
      "macPreferences": "बाहर निकलें और Safari सेटिंग्स खोलें…"
    },
    id: {
      "iOS": "Anda dapat mengaktifkan ekstensi Safari QuoteLink di Pengaturan.",
      "macOn": "Ekstensi QuoteLink saat ini aktif. Anda dapat mematikannya di bagian Ekstensi di Pengaturan Safari.",
      "macOff": "Ekstensi QuoteLink saat ini nonaktif. Anda dapat mengaktifkannya di bagian Ekstensi di Pengaturan Safari.",
      "macUnknown": "Anda dapat mengaktifkan ekstensi QuoteLink di bagian Ekstensi di Pengaturan Safari.",
      "macPreferences": "Keluar dan Buka Pengaturan Safari…"
    },
    ja: {
      "iOS": "設定でQuoteLinkのSafari拡張機能を有効にすることができます。",
      "macOn": "QuoteLinkの拡張機能は現在オンになっています。Safariの設定の拡張機能セクションでオフにすることができます。",
      "macOff": "QuoteLinkの拡張機能は現在オフになっています。Safariの設定の拡張機能セクションでオンにすることができます。",
      "macUnknown": "Safariの設定の拡張機能セクションでQuoteLinkの拡張機能をオンにすることができます。",
      "macPreferences": "終了してSafari設定を開く…"
    },
    nl: {
      "iOS": "U kunt de QuoteLink Safari-extensie inschakelen in Instellingen.",
      "macOn": "De QuoteLink-extensie is momenteel ingeschakeld. U kunt deze uitschakelen in de sectie Extensies van Safari Instellingen.",
      "macOff": "De QuoteLink-extensie is momenteel uitgeschakeld. U kunt deze inschakelen in de sectie Extensies van Safari Instellingen.",
      "macUnknown": "U kunt de QuoteLink-extensie inschakelen in de sectie Extensies van Safari Instellingen.",
      "macPreferences": "Stoppen en Safari Instellingen openen…"
    },
    pt: {
      "iOS": "Você pode ativar a extensão do Safari do QuoteLink nas Configurações.",
      "macOn": "A extensão do QuoteLink está atualmente ativada. Você pode desativá-la na seção Extensões das Configurações do Safari.",
      "macOff": "A extensão do QuoteLink está atualmente desativada. Você pode ativá-la na seção Extensões das Configurações do Safari.",
      "macUnknown": "Você pode ativar a extensão do QuoteLink na seção Extensões das Configurações do Safari.",
      "macPreferences": "Sair e abrir as Configurações do Safari…"
    },
    th: {
      "iOS": "คุณสามารถเปิดใช้งานส่วนขยาย Safari ของ QuoteLink ได้ในการตั้งค่า",
      "macOn": "ส่วนขยายของ QuoteLink ปัจจุบันเปิดใช้งานอยู่ คุณสามารถปิดการใช้งานได้ในส่วนขยายของการตั้งค่า Safari",
      "macOff": "ส่วนขยายของ QuoteLink ปัจจุบันปิดใช้งานอยู่ คุณสามารถเปิดการใช้งานได้ในส่วนขยายของการตั้งค่า Safari",
      "macUnknown": "คุณสามารถเปิดใช้งานส่วนขยายของ QuoteLink ได้ในส่วนขยายของการตั้งค่า Safari",
      "macPreferences": "ออกและเปิดการตั้งค่า Safari…"
    },
    tr: {
      "iOS": "QuoteLink'in Safari uzantısını Ayarlar'da açabilirsiniz.",
      "macOn": "QuoteLink'in uzantısı şu anda açık. Bunu Safari Ayarları'ndaki Uzantılar bölümünde kapatabilirsiniz.",
      "macOff": "QuoteLink'in uzantısı şu anda kapalı. Bunu Safari Ayarları'ndaki Uzantılar bölümünde açabilirsiniz.",
      "macUnknown": "QuoteLink'in uzantısını Safari Ayarları'ndaki Uzantılar bölümünde açabilirsiniz.",
      "macPreferences": "Çıkış yap ve Safari Ayarları'nı aç…"
    },
    zh: {
      "iOS": "您可以在设置中启用 QuoteLink 的 Safari 扩展程序。",
      "macOn": "QuoteLink的扩展程序目前已启用。您可以在Safari设置的扩展程序部分将其禁用。",
      "macOff": "QuoteLink的扩展程序目前已禁用。您可以在Safari设置的扩展程序部分将其启用。",
      "macUnknown": "您可以在Safari设置的扩展程序部分启用QuoteLink的扩展程序。",
      "macPreferences": "退出并打开Safari设置…"
    },
  };
  const langCode = window.navigator.language ? (window.navigator.language).substring(0, 2) : 'en';

  document.getElementsByClassName('platform-ios')[0].innerText = labelStrings[langCode].iOS;
  document.getElementsByClassName('platform-mac state-on')[0].innerText = labelStrings[langCode].macOn;
  document.getElementsByClassName('platform-mac state-off')[0].innerText = labelStrings[langCode].macOff;
  document.getElementsByClassName('platform-mac state-unknown')[0].innerText = labelStrings[langCode].macUnknown;
  document.getElementsByClassName('platform-mac open-preferences')[0].innerText = labelStrings[langCode].macPreferences;

    document.body.classList.add(`platform-${platform}`);

    if (useSettingsInsteadOfPreferences) {
        document.getElementsByClassName('platform-mac state-on')[0].innerText = "QuoteLink’s extension is currently on. You can turn it off in the Extensions section of Safari Settings.";
        document.getElementsByClassName('platform-mac state-off')[0].innerText = "QuoteLink’s extension is currently off. You can turn it on in the Extensions section of Safari Settings.";
        document.getElementsByClassName('platform-mac state-unknown')[0].innerText = "You can turn on QuoteLink’s extension in the Extensions section of Safari Settings.";
        document.getElementsByClassName('platform-mac open-preferences')[0].innerText = "Quit and Open Safari Settings…";
    }

    if (typeof enabled === "boolean") {
        document.body.classList.toggle(`state-on`, enabled);
        document.body.classList.toggle(`state-off`, !enabled);
    } else {
        document.body.classList.remove(`state-on`);
        document.body.classList.remove(`state-off`);
    }
}

function openPreferences() {
    webkit.messageHandlers.controller.postMessage("open-preferences");
}

document.querySelector("button.open-preferences").addEventListener("click", openPreferences);
