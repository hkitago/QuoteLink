function show(platform, enabled, useSettingsInsteadOfPreferences) {
  // Localization
  const labelStrings = {
    "ar": {
      "iOS": "يمكنك تفعيل إضافة رابط ق على Safari من الإعدادات. يرجى ملاحظة أنك بحاجة إلى فتح إعدادات Safari يدويًا. بالنقر على الزر أدناه، سيتم توجيهك إلى صفحة إعدادات التطبيق. لتفعيل الإضافة، انتقل إلى إعدادات Safari وقم بتفعيلها.",
      "macOn": "إضافة رابط ق مفعل حاليًا. يمكنك إيقاف تشغيله في قسم الإضافات في إعدادات Safari.",
      "macOff": "إضافة رابط ق غير مفعلة حاليًا. يمكنك تشغيلها في قسم الإضافات في إعدادات Safari.",
      "macUnknown": "يمكنك تفعيل إضافة رابط ق في قسم الإضافات في إعدادات Safari.",
      "macPreferences": "قم بالخروج وفتح إعدادات Safari…",
      "iOSSettings": "فتح الإعدادات",
      "SupportPage": "صفحة الدعم"
    },
    "ar-SA": {
      "iOS": "يمكنك تفعيل إضافة رابط ق على Safari من الإعدادات. يرجى ملاحظة أنك بحاجة إلى فتح إعدادات Safari يدويًا. بالنقر على الزر أدناه، سيتم توجيهك إلى صفحة إعدادات التطبيق. لتفعيل الإضافة، انتقل إلى إعدادات Safari وقم بتفعيلها.",
      "macOn": "إضافة رابط ق مفعل حاليًا. يمكنك إيقاف تشغيله من قسم الإضافات في إعدادات Safari.",
      "macOff": "إضافة رابط ق غير مفعلة حاليًا. يمكنك تفعيلها من قسم الإضافات في إعدادات Safari.",
      "macUnknown": "يمكنك تفعيل إضافة رابط ق في قسم الإضافات ضمن إعدادات Safari.",
      "macPreferences": "خروج وفتح إعدادات Safari…",
      "iOSSettings": "فتح الإعدادات",
      "SupportPage": "صفحة الدعم"
    },
    "de": {
      "iOS": "Sie können die ZitatLink Safari-Erweiterung in den Einstellungen aktivieren. Bitte beachten Sie, dass Sie die Safari-Einstellungen manuell öffnen müssen. Durch Tippen auf den unten stehenden Button werden Sie zur Einstellungsseite der App weitergeleitet. Um die Erweiterung zu aktivieren, gehen Sie zu den Safari-Einstellungen und aktivieren Sie sie dort.",
      "macOn": "Die ZitatLink-Erweiterung ist derzeit aktiviert. Sie können sie im Abschnitt Erweiterungen der Safari-Einstellungen deaktivieren.",
      "macOff": "Die ZitatLink-Erweiterung ist derzeit deaktiviert. Sie können sie im Abschnitt Erweiterungen der Safari-Einstellungen aktivieren.",
      "macUnknown": "Sie können die ZitatLink-Erweiterung im Abschnitt Erweiterungen der Safari-Einstellungen aktivieren.",
      "macPreferences": "Beenden und Safari-Einstellungen öffnen…",
      "iOSSettings": "Einstellungen öffnen",
      "SupportPage": "Support-Seite"
    },
    "en": {
      "iOS": "You can turn on QuoteLink’s Safari extension in the iOS Settings. Please note that you need to open Safari settings manually. By tapping the button below, you will be redirected to the app's settings page. To enable the extension, go to Safari’s settings and activate it.",
      "macOn": "QuoteLink’s extension is currently on. You can turn it off in the Extensions section of Safari Settings.",
      "macOff": "QuoteLink’s extension is currently off. You can turn it on in the Extensions section of Safari Settings.",
      "macUnknown": "You can turn on QuoteLink’s extension in the Extensions section of Safari Settings.",
      "macPreferences": "Quit and Open Safari Settings…",
      "iOSSettings": "Open Settings",
      "SupportPage": "Support Page"
    },
    "es": {
      "iOS": "Puedes activar la extensión Safari de EnlaceCita en la Configuración. Ten en cuenta que necesitas abrir la configuración de Safari manualmente. Al tocar el botón de abajo, serás redirigido a la página de configuración de la aplicación. Para habilitar la extensión, ve a la configuración de Safari y actívala.",
      "macOn": "La extensión de EnlaceCita está actualmente activada. Puedes desactivarla en la sección de Extensiones de la Configuración de Safari.",
      "macOff": "La extensión de EnlaceCita está actualmente desactivada. Puedes activarla en la sección de Extensiones de la Configuración de Safari.",
      "macUnknown": "Puedes activar la extensión Safari de EnlaceCita en la sección de Extensiones de la Configuración de Safari.",
      "macPreferences": "Salir y abrir la Configuración de Safari…",
      "iOSSettings": "Abrir Ajustes",
      "SupportPage": "Página de Soporte"
    },
    "es-MX": {
      "iOS": "Puedes activar la extensión Safari de EnlaceCita en la Configuración. Ten en cuenta que necesitas abrir la configuración de Safari manualmente. Al tocar el botón de abajo, serás redirigido a la página de configuración de la aplicación. Para habilitar la extensión, ve a la configuración de Safari y actívala.",
      "macOn": "La extensión de EnlaceCita está activada. Puedes desactivarla en la sección de Extensiones de la Configuración de Safari.",
      "macOff": "La extensión de EnlaceCita está desactivada. Puedes activarla en la sección de Extensiones de la Configuración de Safari.",
      "macUnknown": "Puedes activar la extensión Safari de EnlaceCita en la sección de Extensiones de la Configuración de Safari.",
      "macPreferences": "Salir y abrir la Configuración de Safari…",
      "iOSSettings": "Abrir Configuración",
      "SupportPage": "Página de Soporte"
    },
    "fr": {
      "iOS": "Vous pouvez activer l'extension Safari de LienCita dans les Réglages. Veuillez noter que vous devez ouvrir les réglages de Safari manuellement. En appuyant sur le bouton ci-dessous, vous serez redirigé vers la page des réglages de l'application. Pour activer l'extension, allez dans les réglages de Safari et activez-la.",
      "macOn": "L'extension LienCita est actuellement activée. Vous pouvez la désactiver dans la section Extensions des Réglages Safari.",
      "macOff": "L'extension LienCita est actuellement désactivée. Vous pouvez l'activer dans la section Extensions des Réglages Safari.",
      "macUnknown": "Vous pouvez activer l'extension LienCita dans la section Extensions des Réglages Safari.",
      "macPreferences": "Quittez et ouvrez les Réglages Safari…",
      "iOSSettings": "Ouvrir les Paramètres",
      "SupportPage": "Page d'Assistance"
    },
    "hi": {
      "iOS": "आप सेटिंग्स में उद्धरणलिंक की Safari एक्सटेंशन को चालू कर सकते हैं। कृपया ध्यान दें कि आपको Safari सेटिंग्स को मैन्युअल रूप से खोलना होगा। नीचे दिए गए बटन पर टैप करके, आप ऐप की सेटिंग्स पेज पर पुनर्निर्देशित किए जाएंगे। एक्सटेंशन को सक्षम करने के लिए, Safari की सेटिंग्स में जाएं और इसे सक्रिय करें।",
      "macOn": "उद्धरणलिंक का एक्सटेंशन वर्तमान में चालू है। आप इसे Safari सेटिंग्स के एक्सटेंशन सेक्शन में बंद कर सकते हैं।",
      "macOff": "उद्धरणलिंक का एक्सटेंशन वर्तमान में बंद है। आप इसे Safari सेटिंग्स के एक्सटेंशन सेक्शन में चालू कर सकते हैं।",
      "macUnknown": "आप Safari सेटिंग्स के एक्सटेंशन सेक्शन में उद्धरणलिंक का एक्सटेंशन चालू कर सकते हैं।",
      "macPreferences": "बाहर निकलें और Safari सेटिंग्स खोलें…",
      "iOSSettings": "सेटिंग्स खोलें",
      "SupportPage": "सहायता पृष्ठ"
    },
    "id": {
      "iOS": "Anda dapat mengaktifkan ekstensi Safari TautanKutipan di Pengaturan. Harap perhatikan bahwa Anda perlu membuka pengaturan Safari secara manual. Dengan mengetuk tombol di bawah, Anda akan diarahkan ke halaman pengaturan aplikasi. Untuk mengaktifkan ekstensi, buka pengaturan Safari dan aktifkan.",
      "macOn": "Ekstensi TautanKutipan saat ini aktif. Anda dapat mematikannya di bagian Ekstensi di Pengaturan Safari.",
      "macOff": "Ekstensi TautanKutipan saat ini nonaktif. Anda dapat mengaktifkannya di bagian Ekstensi di Pengaturan Safari.",
      "macUnknown": "Anda dapat mengaktifkan ekstensi TautanKutipan di bagian Ekstensi di Pengaturan Safari.",
      "macPreferences": "Keluar dan Buka Pengaturan Safari…",
      "iOSSettings": "Buka Pengaturan",
      "SupportPage": "Halaman Dukungan"
    },
    "ja": {
      "iOS": "設定で引用リンクのSafari拡張機能を有効にすることができます。Safari設定は手動で開く必要があることにご注意ください。下のボタンをタップすると、アプリの設定ページにリダイレクトされます。拡張機能を有効にするには、Safariの設定に移動して有効化してください。",
      "macOn": "引用リンクの拡張機能は現在オンになっています。Safariの設定の拡張機能セクションでオフにすることができます。",
      "macOff": "引用リンクの拡張機能は現在オフになっています。Safariの設定の拡張機能セクションでオンにすることができます。",
      "macUnknown": "Safariの設定の拡張機能セクションで引用リンクの拡張機能をオンにすることができます。",
      "macPreferences": "終了してSafari設定を開く…",
      "iOSSettings": "設定を開く",
      "SupportPage": "サポートページ"
    },
    "ko-KR": {
      "iOS": "설정에서 인용링크의 Safari 확장을 활성화할 수 있습니다. Safari 설정을 수동으로 열어야 한다는 점에 유의하세요. 아래 버튼을 탭하면 앱의 설정 페이지로 리디렉션됩니다. 확장 프로그램을 활성화하려면 Safari 설정으로 이동하여 활성화하세요.",
      "macOn": "현재 인용링크 확장이 활성화되어 있습니다. Safari 설정의 확장 프로그램 섹션에서 비활성화할 수 있습니다.",
      "macOff": "현재 인용링크 확장이 비활성화되어 있습니다. Safari 설정의 확장 프로그램 섹션에서 활성화할 수 있습니다.",
      "macUnknown": "Safari 설정의 확장 프로그램 섹션에서 인용링크 확장을 활성화할 수 있습니다.",
      "macPreferences": "Safari 설정을 열려면 종료하고 열기…",
      "iOSSettings": "설정 열기",
      "SupportPage": "고객지원 페이지"
    },
    "nl": {
      "iOS": "U kunt de CitatieLink Safari-extensie inschakelen in Instellingen. Let op: u moet de Safari-instellingen handmatig openen. Door op de onderstaande knop te tikken, wordt u doorgestuurd naar de instellingenpagina van de app. Om de extensie in te schakelen, gaat u naar de Safari-instellingen en activeert u deze.",
      "macOn": "De CitatieLink-extensie is momenteel ingeschakeld. U kunt deze uitschakelen in de sectie Extensies van Safari Instellingen.",
      "macOff": "De CitatieLink-extensie is momenteel uitgeschakeld. U kunt deze inschakelen in de sectie Extensies van Safari Instellingen.",
      "macUnknown": "U kunt de CitatieLink-extensie inschakelen in de sectie Extensies van Safari Instellingen.",
      "macPreferences": "Stoppen en Safari Instellingen openen…",
      "iOSSettings": "Instellingen Openen",
      "SupportPage": "Ondersteuningspagina"
    },
    "pt": {
      "iOS": "Você pode ativar a extensão do Safari do LinkCitação nas Configurações. Observe que você precisa abrir as configurações do Safari manualmente. Ao tocar no botão abaixo, você será redirecionado para a página de configurações do aplicativo. Para ativar a extensão, vá para as configurações do Safari e ative-a.",
      "macOn": "A extensão do LinkCitação está atualmente ativada. Você pode desativá-la na seção Extensões das Configurações do Safari.",
      "macOff": "A extensão do LinkCitação está atualmente desativada. Você pode ativá-la na seção Extensões das Configurações do Safari.",
      "macUnknown": "Você pode ativar a extensão do LinkCitação na seção Extensões das Configurações do Safari.",
      "macPreferences": "Sair e abrir as Configurações do Safari…",
      "iOSSettings": "Abrir Configurações",
      "SupportPage": "Página de Suporte"
    },
    "pt-PT": {
      "iOS": "Pode ativar a extensão do Safari do LinkCitação nas Definições. Note que precisa de abrir as definições do Safari manualmente. Ao tocar no botão abaixo, será redirecionado para a página de definições da aplicação. Para ativar a extensão, vá às definições do Safari e ative-a.",
      "macOn": "A extensão do LinkCitação está atualmente ativada. Pode desativá-la na secção Extensões das Definições do Safari.",
      "macOff": "A extensão do LinkCitação está atualmente desativada. Pode ativá-la na secção Extensões das Definições do Safari.",
      "macUnknown": "Pode ativar a extensão do LinkCitação na secção Extensões das Definições do Safari.",
      "macPreferences": "Saia e abra as Definições do Safari…",
      "iOSSettings": "Abrir Definições",
      "SupportPage": "Página de Suporte"
    },
    "pt-BR": {
      "iOS": "Você pode ativar a extensão do Safari do LinkCitação nas Configurações. Observe que você precisa abrir as configurações do Safari manualmente. Ao tocar no botão abaixo, você será redirecionado para a página de configurações do aplicativo. Para ativar a extensão, vá para as configurações do Safari e ative-a.",
      "macOn": "A extensão do LinkCitação está atualmente ativada. Você pode desativá-la na seção Extensões das Configurações do Safari.",
      "macOff": "A extensão do LinkCitação está atualmente desativada. Você pode ativá-la na seção Extensões das Configurações do Safari.",
      "macUnknown": "Você pode ativar a extensão do LinkCitação na seção Extensões das Configurações do Safari.",
      "macPreferences": "Saia e abra as Configurações do Safari…",
      "iOSSettings": "Abrir Configurações",
      "SupportPage": "Página de Suporte"
    },
    "th": {
      "iOS": "คุณสามารถเปิดใช้งานส่วนขยาย Safari ของ ลิงก์การอ้างอิง ได้ในการตั้งค่า โปรดทราบว่าคุณจำเป็นต้องเปิดการตั้งค่า Safari ด้วยตนเอง เมื่อแตะปุ่มด้านล่าง คุณจะถูกนำไปยังหน้าการตั้งค่าของแอป เพื่อเปิดใช้งานส่วนขยาย ให้ไปที่การตั้งค่า Safari และเปิดใช้งาน",
      "macOn": "ส่วนขยายของ ลิงก์การอ้างอิง ปัจจุบันเปิดใช้งานอยู่ คุณสามารถปิดการใช้งานได้ในส่วนขยายของการตั้งค่า Safari",
      "macOff": "ส่วนขยายของ ลิงก์การอ้างอิง ปัจจุบันปิดใช้งานอยู่ คุณสามารถเปิดการใช้งานได้ในส่วนขยายของการตั้งค่า Safari",
      "macUnknown": "คุณสามารถเปิดใช้งานส่วนขยายของ ลิงก์การอ้างอิง ได้ในส่วนขยายของการตั้งค่า Safari",
      "macPreferences": "ออกและเปิดการตั้งค่า Safari…",
      "iOSSettings": "เปิดการตั้งค่า",
      "SupportPage": "หน้าสนับสนุน"
    },
    "tr": {
      "iOS": "AlıntıBağlantısı'nın Safari uzantısını Ayarlar'da açabilirsiniz. Safari ayarlarını manuel olarak açmanız gerektiğini lütfen unutmayın. Aşağıdaki düğmeye dokunarak, uygulamanın ayarlar sayfasına yönlendirileceksiniz. Uzantıyı etkinleştirmek için Safari ayarlarına gidin ve etkinleştirin.",
      "macOn": "AlıntıBağlantısı'nın uzantısı şu anda açık. Bunu Safari Ayarları'ndaki Uzantılar bölümünde kapatabilirsiniz.",
      "macOff": "AlıntıBağlantısı'nın uzantısı şu anda kapalı. Bunu Safari Ayarları'ndaki Uzantılar bölümünde açabilirsiniz.",
      "macUnknown": "AlıntıBağlantısı'nın uzantısını Safari Ayarları'ndaki Uzantılar bölümünde açabilirsiniz.",
      "macPreferences": "Çıkış yap ve Safari Ayarları'nı aç…",
      "iOSSettings": "Ayarları Aç",
      "SupportPage": "Destek Sayfası"
    },
    "zh": {
      "iOS": "您可以在设置中启用 引述链接 的 Safari 扩展程序。请注意，您需要手动打开 Safari 设置。点击下方按钮，您将被重定向到应用程序的设置页面。要启用扩展程序，请进入 Safari 设置并激活它。",
      "macOn": "引述链接 的扩展程序目前已启用。您可以在 Safari 设置的扩展程序部分将其禁用。",
      "macOff": "引述链接 的扩展程序目前已禁用。您可以在 Safari 设置的扩展程序部分将其启用。",
      "macUnknown": "您可以在 Safari 设置的扩展程序部分启用 引述链接 的扩展程序。",
      "macPreferences": "退出并打开 Safari 设置…",
      "iOSSettings": "打开设置",
      "SupportPage": "支持页面"
    },
    "zh-CN": {
      "iOS": "您可以在设置中启用 引述链接 的 Safari 扩展程序。请注意，您需要手动打开 Safari 设置。点击下方按钮，您将被重定向到应用程序的设置页面。要启用扩展程序，请进入 Safari 设置并激活它。",
      "macOn": "引述链接 的扩展程序目前已启用。您可以在 Safari 设置的扩展程序部分将其禁用。",
      "macOff": "引述链接 的扩展程序目前已禁用。您可以在 Safari 设置的扩展程序部分将其启用。",
      "macUnknown": "您可以在 Safari 设置的扩展程序部分启用 引述链接 的扩展程序。",
      "macPreferences": "退出并打开 Safari 设置…",
      "iOSSettings": "打开设置",
      "SupportPage": "支持页面"
    },
    "zh-TW": {
      "iOS": "您可以在設定中啟用 引述鏈接 的 Safari 擴充功能。請注意，您需要手動開啟 Safari 設定。點擊下方按鈕，您將被重新導向到應用程式的設定頁面。要啟用擴充功能，請進入 Safari 設定並啟用它。",
      "macOn": "引述鏈接 的擴充功能目前已啟用。您可以在 Safari 設定的擴充功能部分將其停用。",
      "macOff": "引述鏈接 的擴充功能目前已停用。您可以在 Safari 設定的擴充功能部分將其啟用。",
      "macUnknown": "您可以在 Safari 設定的擴充功能部分啟用 引述鏈接 的擴充功能。",
      "macPreferences": "退出並打開 Safari 設定…",
      "iOSSettings": "開啟設定",
      "SupportPage": "支援頁面"
    },
    "zh-HK": {
      "iOS": "您可以在設定中啟用 引述鏈接 的 Safari 擴展程式。請注意，您需要手動開啟 Safari 設定。點擊下方按鈕，您將被重新導向到應用程式的設定頁面。要啟用擴展程式，請進入 Safari 設定並啟用它。",
      "macOn": "引述鏈接 的擴展程式目前已啟用。您可以在 Safari 設定的擴展程式部分將其禁用。",
      "macOff": "引述鏈接 的擴展程式目前已禁用。您可以在 Safari 設定的擴展程式部分將其啟用。",
      "macUnknown": "您可以在 Safari 設定的擴展程式部分啟用 引述鏈接 的擴展程式。",
      "macPreferences": "退出並打開 Safari 設定…",
      "iOSSettings": "開啟設定",
      "SupportPage": "支援頁面"
    },
    "it": {
      "iOS": "Puoi attivare l'estensione Safari di CitLink nelle Impostazioni. Tieni presente che devi aprire manualmente le impostazioni di Safari. Toccando il pulsante qui sotto, verrai reindirizzato alla pagina delle impostazioni dell'app. Per abilitare l'estensione, vai alle impostazioni di Safari e attivala.",
      "macOn": "L'estensione di CitLink è attualmente attiva. Puoi disattivarla nella sezione Estensioni delle Impostazioni di Safari.",
      "macOff": "L'estensione di CitLink è attualmente disattivata. Puoi attivarla nella sezione Estensioni delle Impostazioni di Safari.",
      "macUnknown": "Puoi attivare l'estensione di CitLink nella sezione Estensioni delle Impostazioni di Safari.",
      "macPreferences": "Esci e apri le Impostazioni di Safari…",
      "iOSSettings": "Apri Impostazioni",
      "SupportPage": "Pagina di Supporto"
    },
    "uk": {
      "iOS": "Ви можете увімкнути розширення Safari CytLink у Налаштуваннях. Зверніть увагу, що вам потрібно вручну відкрити налаштування Safari. Натиснувши кнопку нижче, ви перейдете на сторінку налаштувань додатка. Щоб увімкнути розширення, перейдіть до налаштувань Safari та активуйте його.",
      "macOn": "Розширення CytLink наразі увімкнене. Ви можете вимкнути його в розділі Розширення в Налаштуваннях Safari.",
      "macOff": "Розширення CytLink наразі вимкнене. Ви можете увімкнути його в розділі Розширення в Налаштуваннях Safari.",
      "macUnknown": "Ви можете увімкнути розширення CytLink у розділі Розширення в Налаштуваннях Safari.",
      "macPreferences": "Вийти та відкрити Налаштування Safari…",
      "iOSSettings": "Відкрити Налаштування",
      "SupportPage": "Сторінка Підтримки"
    },
    "ca": {
      "iOS": "Podeu activar l’extensió de Safari de CitaLink a Configuració. Tingueu en compte que heu d'obrir manualment la configuració de Safari. En tocar el botó de sota, sereu redirigits a la pàgina de configuració de l'aplicació. Per habilitar l'extensió, aneu a la configuració de Safari i activeu-la.",
      "macOn": "L’extensió de CitaLink està actualment activada. Podeu desactivar-la a la secció Extensions de les Preferències de Safari.",
      "macOff": "L’extensió de CitaLink està actualment desactivada. Podeu activar-la a la secció Extensions de les Preferències de Safari.",
      "macUnknown": "Podeu activar l’extensió de CitaLink a la secció Extensions de les Preferències de Safari.",
      "macPreferences": "Sortiu i obriu les Preferències de Safari…",
      "iOSSettings": "Obrir Configuració",
      "SupportPage": "Pàgina de Suport"
    },
    "el": {
      "iOS": "Μπορείτε να ενεργοποιήσετε την επέκταση Safari του SyndLink στις Ρυθμίσεις. Σημειώστε ότι πρέπει να ανοίξετε χειροκίνητα τις ρυθμίσεις του Safari. Πατώντας το παρακάτω κουμπί, θα ανακατευθυνθείτε στη σελίδα ρυθμίσεων της εφαρμογής. Για να ενεργοποιήσετε την επέκταση, μεταβείτε στις ρυθμίσεις του Safari και ενεργοποιήστε την.",
      "macOn": "Η επέκταση του SyndLink είναι αυτή τη στιγμή ενεργή. Μπορείτε να την απενεργοποιήσετε στην ενότητα Επεκτάσεις στις Ρυθμίσεις Safari.",
      "macOff": "Η επέκταση του SyndLink είναι αυτή τη στιγμή απενεργοποιημένη. Μπορείτε να την ενεργοποιήσετε στην ενότητα Επεκτάσεις στις Ρυθμίσεις Safari.",
      "macUnknown": "Μπορείτε να ενεργοποιήσετε την επέκταση του SyndLink στην ενότητα Επεκτάσεις στις Ρυθμίσεις Safari.",
      "macPreferences": "Αποσυνδεθείτε και ανοίξτε τις Ρυθμίσεις Safari…",
      "iOSSettings": "Άνοιγμα Ρυθμίσεων",
      "SupportPage": "Σελίδα Υποστήριξης"
    },
    "hr": {
      "iOS": "Možete uključiti CitLink Safari proširenje u Postavkama. Imajte na umu da trebate ručno otvoriti Safari postavke. Dodirom na gumb ispod bit ćete preusmjereni na stranicu postavki aplikacije. Da biste omogućili proširenje, idite u Safari postavke i aktivirajte ga.",
      "macOn": "CitLink proširenje je trenutno uključeno. Možete ga isključiti u odjeljku Proširenja u Safari postavkama.",
      "macOff": "CitLink proširenje je trenutno isključeno. Možete ga uključiti u odjeljku Proširenja u Safari postavkama.",
      "macUnknown": "Možete uključiti CitLink proširenje u odjeljku Proširenja u Safari postavkama.",
      "macPreferences": "Zatvori i otvori Safari postavke…",
      "iOSSettings": "Otvori Postavke",
      "SupportPage": "Stranica Podrške"
    },
    "sv": {
      "iOS": "Du kan aktivera Safari-tillägget för CitatLink i Inställningar. Observera att du måste öppna Safari-inställningarna manuellt. Genom att trycka på knappen nedan kommer du att omdirigeras till appens inställningssida. För att aktivera tillägget, gå till Safari-inställningarna och aktivera det.",
      "macOn": "CitatLink-tillägget är för närvarande aktiverat. Du kan stänga av det i avsnittet Tillägg i Safari-inställningarna.",
      "macOff": "CitatLink-tillägget är för närvarande avaktiverat. Du kan aktivera det i avsnittet Tillägg i Safari-inställningarna.",
      "macUnknown": "Du kan aktivera CitatLink-tillägget i avsnittet Tillägg i Safari-inställningarna.",
      "macPreferences": "Avsluta och öppna Safari-inställningarna…",
      "iOSSettings": "Öppna Inställningar",
      "SupportPage": "Supportsida"
    },
    "sk": {
      "iOS": "Môžete aktivovať rozšírenie Safari pre CitLink v Nastaveniach. Upozorňujeme, že nastavenia Safari musíte otvoriť manuálne. Kliknutím na tlačidlo nižšie budete presmerovaní na stránku nastavení aplikácie. Pre povolenie rozšírenia prejdite do nastavení Safari a aktivujte ho.",
      "macOn": "Rozšírenie CitLink je momentálne zapnuté. Môžete ho vypnúť v sekcii Rozšírenia v Nastaveniach Safari.",
      "macOff": "Rozšírenie CitLink je momentálne vypnuté. Môžete ho zapnúť v sekcii Rozšírenia v Nastaveniach Safari.",
      "macUnknown": "Môžete aktivovať rozšírenie CitLink v sekcii Rozšírenia v Nastaveniach Safari.",
      "macPreferences": "Ukončiť a otvoriť Nastavenia Safari…",
      "iOSSettings": "Otvoriť Nastavenia",
      "SupportPage": "Stránka Podpory"
    },
    "cs": {
      "iOS": "Můžete zapnout rozšíření Safari pro CitLink v Nastavení. Vezměte prosím na vědomí, že musíte otevřít nastavení Safari ručně. Klepnutím na tlačítko níže budete přesměrováni na stránku nastavení aplikace. Chcete-li povolit rozšíření, přejděte do nastavení Safari a aktivujte jej.",
      "macOn": "Rozšíření CitLink je aktuálně zapnuto. Můžete jej vypnout v sekci Rozšíření v Nastavení Safari.",
      "macOff": "Rozšíření CitLink je aktuálně vypnuto. Můžete jej zapnout v sekci Rozšíření v Nastavení Safari.",
      "macUnknown": "Můžete zapnout rozšíření CitLink v sekci Rozšíření v Nastavení Safari.",
      "macPreferences": "Ukončit a otevřít Nastavení Safari…",
      "iOSSettings": "Otevřít Nastavení",
      "SupportPage": "Stránka Podpory"
    },
    "da": {
      "iOS": "Du kan aktivere Safari-udvidelsen for CitatLink i Indstillinger. Bemærk venligst, at du skal åbne Safari-indstillingerne manuelt. Ved at trykke på knappen nedenfor vil du blive omdirigeret til appens indstillingsside. For at aktivere udvidelsen skal du gå til Safari-indstillingerne og aktivere den.",
      "macOn": "CitatLink-udvidelsen er i øjeblikket aktiveret. Du kan deaktivere den i afsnittet Udvidelser i Safari-Indstillinger.",
      "macOff": "CitatLink-udvidelsen er i øjeblikket deaktiveret. Du kan aktivere den i afsnittet Udvidelser i Safari-Indstillinger.",
      "macUnknown": "Du kan aktivere CitatLink-udvidelsen i afsnittet Udvidelser i Safari-Indstillinger.",
      "macPreferences": "Afslut og åbn Safari-Indstillinger…",
      "iOSSettings": "Åbn Indstillinger",
      "SupportPage": "Supportside"
    },
    "nb": {
      "iOS": "Du kan aktivere Safari-utvidelsen for CitLink i Innstillinger. Vær oppmerksom på at du må åpne Safari-innstillingene manuelt. Ved å trykke på knappen nedenfor vil du bli omdirigert til appens innstillingsside. For å aktivere utvidelsen, gå til Safari-innstillingene og aktiver den.",
      "macOn": "CitLink-utvidelsen er for øyeblikket aktivert. Du kan slå den av i Utvidelser-seksjonen i Safari-innstillingene.",
      "macOff": "CitLink-utvidelsen er for øyeblikket deaktivert. Du kan slå den på i Utvidelser-seksjonen i Safari-innstillingene.",
      "macUnknown": "Du kan aktivere CitLink-utvidelsen i Utvidelser-seksjonen i Safari-innstillingene.",
      "macPreferences": "Avslutt og åpne Safari-innstillingene…",
      "iOSSettings": "Åpne Innstillinger",
      "SupportPage": "Støtteside"
    },
    "hu": {
      "iOS": "Az IdLink Safari-bővítményét az Beállításokban kapcsolhatja be. Kérjük, vegye figyelembe, hogy a Safari beállításait manuálisan kell megnyitnia. Az alábbi gombra koppintva átirányítjuk az alkalmazás beállítások oldalára. A bővítmény engedélyezéséhez lépjen a Safari beállításaiba, és aktiválja azt.",
      "macOn": "Az IdLink bővítmény jelenleg be van kapcsolva. Kikapcsolhatja az Safari Beállítások Bővítmények részében.",
      "macOff": "Az IdLink bővítmény jelenleg ki van kapcsolva. Bekapcsolhatja az Safari Beállítások Bővítmények részében.",
      "macUnknown": "Az IdLink bővítményt az Safari Beállítások Bővítmények részében kapcsolhatja be.",
      "macPreferences": "Kilépés és Safari Beállítások megnyitása…",
      "iOSSettings": "Beállítások Megnyitása",
      "SupportPage": "Támogatási Oldal"
    },
    "fi": {
      "iOS": "Voit aktivoida LainLinkin Safari-laajennuksen Asetuksissa. Huomaa, että sinun on avattava Safari-asetukset manuaalisesti. Napauttamalla alla olevaa painiketta sinut ohjataan sovelluksen asetussivulle. Ota laajennus käyttöön siirtymällä Safarin asetuksiin ja aktivoimalla se.",
      "macOn": "LainLink-laajennus on tällä hetkellä käytössä. Voit sammuttaa sen Safari Asetusten Laajennukset-osiossa.",
      "macOff": "LainLink-laajennus on tällä hetkellä pois päältä. Voit aktivoida sen Safari Asetusten Laajennukset-osiossa.",
      "macUnknown": "Voit aktivoida LainLink-laajennuksen Safari Asetusten Laajennukset-osiossa.",
      "macPreferences": "Poistu ja avaa Safari Asetukset…",
      "iOSSettings": "Avaa Asetukset",
      "SupportPage": "Tukisivu"
    },
    "fr-CA": {
      "iOS": "Vous pouvez activer l’extension Safari de LienCita dans les Réglages. Veuillez noter que vous devez ouvrir les réglages de Safari manuellement. En appuyant sur le bouton ci-dessous, vous serez redirigé vers la page des réglages de l'application. Pour activer l'extension, allez dans les réglages de Safari et activez-la.",
      "macOn": "L’extension LienCita est actuellement activée. Vous pouvez la désactiver dans la section Extensions des Réglages Safari.",
      "macOff": "L’extension LienCita est actuellement désactivée. Vous pouvez l’activer dans la section Extensions des Réglages Safari.",
      "macUnknown": "Vous pouvez activer l’extension LienCita dans la section Extensions des Réglages Safari.",
      "macPreferences": "Quitter et ouvrir les Réglages Safari…",
      "iOSSettings": "Ouvrir les Paramètres",
      "SupportPage": "Page de Soutien"
    },
    "vi": {
      "iOS": "Bạn có thể bật tiện ích mở rộng Safari của TrichLink trong Cài đặt. Xin lưu ý rằng bạn cần mở cài đặt Safari thủ công. Bằng cách nhấn vào nút bên dưới, bạn sẽ được chuyển hướng đến trang cài đặt của ứng dụng. Để bật tiện ích mở rộng, hãy vào cài đặt Safari và kích hoạt nó.",
      "macOn": "Tiện ích mở rộng TrichLink hiện đang bật. Bạn có thể tắt nó trong phần Tiện ích mở rộng của Cài đặt Safari.",
      "macOff": "Tiện ích mở rộng TrichLink hiện đang tắt. Bạn có thể bật nó trong phần Tiện ích mở rộng của Cài đặt Safari.",
      "macUnknown": "Bạn có thể bật tiện ích mở rộng TrichLink trong phần Tiện ích mở rộng của Cài đặt Safari.",
      "macPreferences": "Thoát và mở Cài đặt Safari…",
      "iOSSettings": "Mở Cài đặt",
      "SupportPage": "Trang Hỗ trợ"
    },
    "he": {
      "iOS": "אתה יכול להפעיל את תוסף Safari של קישורציטוט בהגדרות. שים לב שעליך לפתוח את הגדרות Safari באופן ידני. על ידי לחיצה על הכפתור למטה, תועבר לדף ההגדרות של האפליקציה. כדי להפעיל את התוסף, עבור להגדרות Safari והפעל אותו.",
      "macOn": "התוסף של קישורציטוט פעיל כעת. אתה יכול לכבות אותו בחלק התוספים בהגדרות Safari.",
      "macOff": "התוסף של קישורציטוט כבוי כעת. אתה יכול להפעיל אותו בחלק התוספים בהגדרות Safari.",
      "macUnknown": "אתה יכול להפעיל את תוסף קישורציטוט בחלק התוספים בהגדרות Safari.",
      "macPreferences": "סגור ופתח את הגדרות Safari…",
      "iOSSettings": "פתח הגדרות",
      "SupportPage": "דף תמיכה"
    },
    "pl": {
      "iOS": "Możesz włączyć rozszerzenie Safari CytLink w Ustawieniach. Pamiętaj, że musisz ręcznie otworzyć ustawienia Safari. Dotykając przycisku poniżej, zostaniesz przekierowany na stronę ustawień aplikacji. Aby włączyć rozszerzenie, przejdź do ustawień Safari i aktywuj je.",
      "macOn": "Rozszerzenie CytLink jest obecnie włączone. Możesz je wyłączyć w sekcji Rozszerzenia w Ustawieniach Safari.",
      "macOff": "Rozszerzenie CytLink jest obecnie wyłączone. Możesz je włączyć w sekcji Rozszerzenia w Ustawieniach Safari.",
      "macUnknown": "Możesz włączyć rozszerzenie CytLink w sekcji Rozszerzenia w Ustawieniach Safari.",
      "macPreferences": "Zamknij i otwórz Ustawienia Safari…",
      "iOSSettings": "Otwórz Ustawienia",
      "SupportPage": "Strona Wsparcia"
    },
    "ms": {
      "iOS": "Anda boleh mengaktifkan sambungan Safari PetLink dalam Tetapan. Sila ambil perhatian bahawa anda perlu membuka tetapan Safari secara manual. Dengan mengetik butang di bawah, anda akan dialihkan ke halaman tetapan aplikasi. Untuk membolehkan sambungan, pergi ke tetapan Safari dan aktifkannya.",
      "macOn": "Sambungan PetLink kini aktif. Anda boleh mematikannya di bahagian Sambungan dalam Tetapan Safari.",
      "macOff": "Sambungan PetLink kini tidak aktif. Anda boleh mengaktifkannya di bahagian Sambungan dalam Tetapan Safari.",
      "macUnknown": "Anda boleh mengaktifkan sambungan PetLink di bahagian Sambungan dalam Tetapan Safari.",
      "macPreferences": "Tutup dan buka Tetapan Safari…",
      "iOSSettings": "Buka Tetapan",
      "SupportPage": "Halaman Sokongan"
    },
    "ro": {
      "iOS": "Puteți activa extensia Safari LinkCita în Setări. Vă rugăm să rețineți că trebuie să deschideți manual setările Safari. Apăsând butonul de mai jos, veți fi redirecționat către pagina de setări a aplicației. Pentru a activa extensia, accesați setările Safari și activați-o.",
      "macOn": "Extensia LinkCita este activă în prezent. Puteți să o dezactivați în secțiunea Extensii din Setările Safari.",
      "macOff": "Extensia LinkCita este dezactivată în prezent. Puteți să o activați în secțiunea Extensii din Setările Safari.",
      "macUnknown": "Puteți activa extensia LinkCita în secțiunea Extensii din Setările Safari.",
      "macPreferences": "Ieșiți și deschideți Setările Safari…",
      "iOSSettings": "Deschide Setări",
      "SupportPage": "Pagina de Asistență"
    },
    "ru": {
      "iOS": "Вы можете включить расширение Safari CitaLink в Настройках. Обратите внимание, что вам нужно вручную открыть настройки Safari. Нажав на кнопку ниже, вы будете перенаправлены на страницу настроек приложения. Чтобы включить расширение, перейдите в настройки Safari и активируйте его.",
      "macOn": "Расширение CitaLink в настоящее время включено. Вы можете отключить его в разделе Расширения Настроек Safari.",
      "macOff": "Расширение CitaLink в настоящее время отключено. Вы можете включить его в разделе Расширения Настроек Safari.",
      "macUnknown": "Вы можете включить расширение CitaLink в разделе Расширения Настроек Safari.",
      "macPreferences": "Закройте и откройте Настройки Safari…",
      "iOSSettings": "Открыть Настройки",
      "SupportPage": "Страница Поддержки"
    },
    "en-GB": {
      "iOS": "You can turn on QuoteLink’s Safari extension in Settings. Please note that you need to open Safari settings manually. By tapping the button below, you will be redirected to the app's settings page. To enable the extension, go to Safari's settings and activate it.",
      "macOn": "QuoteLink’s extension is currently on. You can turn it off in the Extensions section of Safari Settings.",
      "macOff": "QuoteLink’s extension is currently off. You can turn it on in the Extensions section of Safari Settings.",
      "macUnknown": "You can turn on QuoteLink’s extension in the Extensions section of Safari Settings.",
      "macPreferences": "Quit and open Safari Preferences…",
      "iOSSettings": "Open Settings",
      "SupportPage": "Support Page"
    },
    "en-AU": {
      "iOS": "You can turn on QuoteLink’s Safari extension in Settings. Please note that you need to open Safari settings manually. By tapping the button below, you will be redirected to the app's settings page. To enable the extension, go to Safari's settings and activate it.",
      "macOn": "QuoteLink’s extension is currently on. You can turn it off in the Extensions section of Safari Settings.",
      "macOff": "QuoteLink’s extension is currently off. You can turn it on in the Extensions section of Safari Settings.",
      "macUnknown": "You can turn on QuoteLink’s extension in the Extensions section of Safari Settings.",
      "macPreferences": "Quit and open Safari Preferences…",
      "iOSSettings": "Open Settings",
      "SupportPage": "Support Page"
    },
  };
  
  const langCode = labelStrings[window.navigator.language]
  ? window.navigator.language
  : labelStrings[window.navigator.language.substring(0, 2)]
  ? window.navigator.language.substring(0, 2)
  : 'en';
  
  document.getElementsByClassName('platform-ios')[0].innerText = labelStrings[langCode].iOS;
  document.getElementsByClassName('platform-ios open-settings')[0].innerText = labelStrings[langCode].iOSSettings;
  document.getElementsByClassName('support-button')[0].innerText = labelStrings[langCode].SupportPage;

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

function openSettings() {
    webkit.messageHandlers.controller.postMessage("open-settings");
}

document.querySelector("button.open-preferences").addEventListener("click", openPreferences);
document.querySelector("button.open-settings").addEventListener("click", openSettings);

function openSupport() {
    webkit.messageHandlers.controller.postMessage("open-support");
}

document.querySelector("button.support-button").addEventListener("click", openSupport);
