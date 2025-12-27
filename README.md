# <img src="https://raw.githubusercontent.com/hkitago/QuoteLink/refs/heads/main/Shared%20(Extension)/Resources/images/icon.svg" height="36" valign="bottom"/> QuoteLink for Safari Extension

This Safari extension significantly streamlines the process of web page citation. Instead of repeatedly copying and pasting text and URLs, simply select the text and press the extension button to automatically generate a citation with the source URL. It can be quickly utilized for various purposes, such as creating papers, presentation materials, saving important recipes, or noting interesting information for later reference.

Copying to clipboard and sharing on social media can be completed with a single click. It will prove to be a useful tool that enables efficient and reliable work when creating documents that require source recording and citation.

## Installation & Uninstallation

### Installation

To install the extension on iOS or iPadOS, go to Settings > Apps > Safari > Extensions, or enable the extension by toggling it on in the Manage Extensions option found in the Safari address bar.
For macOS, open Safari, go to Safari > Settings > Extensions, and enable the extension from there.

### Uninstallation

To uninstall the extension, similarly to the installation process, toggle the extension off, or remove it completely by selecting the extension icon on the Home Screen and choosing "Delete app".

## Usage

1. Load a web page.
2. Select the text on the web page.
3. Tap the icon next to the address bar and choose the extension.
4. A window will slide up from the bottom on iPhone, or a pop-up window will appear on iPad and Mac; select an action and tap it.

> [!NOTE]
> - If you do not select text within the web page, the page title will be used.
> - If you enable the extension and it doesn't function correctly, please refresh the page, or close and restart the app, and try again.

> [!NOTE]
> When sharing content with generative AI services, selected text and source URLs are organized into simple, structured prompt segments.
> This approach is inspired by chunking concepts used in retrieval-based AI systems, helping preserve context and clarify relationships between information, while leaving the actual question or task entirely up to the user.

## Latest Version

### 1.5.5

#### **iOS/iPadOS** - 2025-12-26

- Added support for generative AI platforms in sharing presets
- Expanded the list of removable URL parameters for cleaner links

### 1.5.6

#### **macOS** - 2025-12-27

- Improved localization and layout for better readability across all languages

### 1.5.5 - 2025-12-26

- Added support for generative AI platforms in sharing presets
- Expanded the list of removable URL parameters for cleaner links

Previous Updates: [CHANGELOG.md](./CHANGELOG.md).

## Known Issues

- There is a rare issue where the extension may not work when a URL is passed from the in-app browser feature of other apps, such as RSS or social media apps, to Safari for display.
- If the extension does not function correctly immediately after installation, particularly on iPhones, restarting Safari or refreshing the relevant page may resolve the issue. This behavior stems from technical limitations, with the design prioritizing battery life and device performance. Appreciation is extended for users' understanding, and the team stands ready to implement any forthcoming Apple updates that might resolve this issue. (Which may be improved with the 1.4 release.)

## Roadmap

- Addition of action menu (For requests to add posting destinations, please contact me via the contact information below)
- Creation and exporting with image

## Compatibility

- iOS/iPadOS 16.6+
- macOS 12.4+

## License

This project is open-source and available under the [MIT License](LICENSE). Feel free to use and modify it as needed.

## Acknowledgments

The inspiration for this project came from two bookmarklets I developed and shared on GitHub Gist. You can view them [here](https://gist.github.com/hkitago/67ed3a91c7941ab9a2c6b657bac692cb) and [here](https://gist.github.com/hkitago/1009207b098773cf0a29b76636eb03c5). I would like to acknowledge the role of these bookmarklets in shaping the idea for the QuoteLink extension and helping to bring it to fruition.

Special thanks to [bradvin/social-share-urls: Social Share URLs](https://github.com/bradvin/social-share-urls) for handling social share URLs.

The implementation of prompt sharing to generative AI services was informed by [Free Prompt Prefilled Links Generator (2025) – LinkMyPrompt](https://linkmyprompt.com/).

Inspired in part by [ClearURLs](https://github.com/ClearURLs/Rules), whose work helped inform the list of removable tracking parameters.

## Contact

You can reach me via [email](mailto:hkitago@icloud.com?subject=Support%20for%20QuoteLink).

## Additional Information

### Development Story

For a detailed look at the development journey and background of the project, check out my [development story blog post](https://hkitago.com/2024/09/exploring-the-extension-the-quotelink-safari-dev-journey/).

### Related Links
- App Store: [QuoteLink on the App Store](https://apps.apple.com/app/quotelink-for-safari/id6670304147)
- [Get extensions to customize Safari on iPhone - Apple Support](https://support.apple.com/guide/iphone/iphab0432bf6/18.0/ios/18.0)
- [Get extensions to customize Safari on Mac - Apple Support](https://support.apple.com/guide/safari/get-extensions-sfri32508/mac)
- [Use Safari extensions on your Mac – Apple Support](https://support.apple.com/102343)
- Privacy Policy Page: [Privacy Policy – hkitago software dev](https://hkitago.com/wpautoterms/privacy-policy/)
- Support Page: [hkitago/QuoteLink](https://github.com/hkitago/QuoteLink/)

- [Long-Context Isn't All You Need: How Retrieval & Chunking Impact Finance RAG](https://www.snowflake.com/en/engineering-blog/impact-retrieval-chunking-finance-rag/)

> [!NOTE]
> Integration with third-party generative AI services relies on their current web interfaces and is not officially supported or endorsed by those services.
> Behavior may change as the services evolve.
