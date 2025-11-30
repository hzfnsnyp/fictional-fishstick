# Favicon Structure for sanata.art

This directory contains all favicon variants for optimal display across all platforms and devices.

## Current Status

The favicon structure is prepared for:
- ✅ Modern browsers (SVG, PNG)
- ✅ Apple devices (iOS, macOS)
- ✅ Android devices
- ✅ Windows Metro tiles
- ✅ Safari pinned tabs
- ✅ Web app manifests

## File Structure

```
public/
├── favicon.ico              # Legacy favicon (16x16, 32x32, 48x48)
├── favicon.svg              # Modern SVG favicon (future-proof)
├── favicon-16x16.png        # Small icon for bookmarks
├── favicon-32x32.png        # Standard favicon
├── apple-touch-icon.png     # iOS home screen (180x180)
├── android-chrome-192x192.png  # Android home screen
├── android-chrome-512x512.png  # Android splash screen
├── safari-pinned-tab.svg    # Safari pinned tabs (monochrome)
├── mstile-150x150.png       # Windows Metro tile
├── browserconfig.xml        # Windows Metro configuration
└── site.webmanifest         # Web app manifest
```

## How to Replace Favicon

### Step 1: Generate All Variants

Visit https://realfavicongenerator.net/ and upload your new favicon image (at least 512x512px).

### Step 2: Download Generated Package

The generator will create all required files with correct sizes and formats.

### Step 3: Replace Files

1. Extract the downloaded package
2. Replace all files in `/public/` directory
3. Update colors in `browserconfig.xml` and `site.webmanifest` if needed

### Step 4: Update HTML (Already Done)

The `<head>` section in `/index.html` already includes all necessary tags.

## Testing Checklist

After replacing favicon:

- [ ] Test in Chrome (desktop & mobile)
- [ ] Test in Firefox
- [ ] Test in Safari (desktop & iOS)
- [ ] Test in Edge
- [ ] Add to iOS home screen
- [ ] Add to Android home screen
- [ ] Check Windows Start menu tile
- [ ] Verify Safari pinned tab appearance

## Notes

- SVG favicon provides best quality and smallest file size
- PNG variants ensure compatibility with older browsers
- Apple touch icon should have no transparency
- Windows tile should match brand colors

## Resources

- [Real Favicon Generator](https://realfavicongenerator.net/)
- [Favicon Cheat Sheet](https://github.com/audreyfeldroy/favicon-cheat-sheet)
- [MDN Favicon Guide](https://developer.mozilla.org/en-US/docs/Glossary/Favicon)
