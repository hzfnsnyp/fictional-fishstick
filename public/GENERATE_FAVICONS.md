# Generate Favicons

## Required Files (Currently Missing)

The following favicon files are referenced in `index.html` but need to be generated:

### PNG Files
- [ ] `favicon-16x16.png` - 16×16px PNG
- [ ] `favicon-32x32.png` - 32×32px PNG
- [ ] `apple-touch-icon.png` - 180×180px PNG (no transparency)
- [ ] `android-chrome-192x192.png` - 192×192px PNG
- [ ] `android-chrome-512x512.png` - 512×512px PNG
- [ ] `mstile-150x150.png` - 150×150px PNG

### SVG Files
- [ ] `favicon.svg` - SVG favicon (scalable)
- [ ] `safari-pinned-tab.svg` - Monochrome SVG for Safari pinned tabs

### Existing File
- [x] `favicon.ico` - Multi-size ICO file (already exists)

## Quick Setup: Use Real Favicon Generator

### Step 1: Prepare Source Image
Create or export your logo/icon as:
- **Format:** PNG, SVG, or JPG
- **Size:** At least 512×512px (or vector SVG)
- **Background:** Transparent for logo, or solid color for simpler icons
- **Design:** Simple, recognizable at small sizes

### Step 2: Generate Favicons

1. Go to https://realfavicongenerator.net/
2. Click "Select your Favicon image"
3. Upload your source image
4. Configure platforms:

   **iOS Web Clip:**
   - Design: iOS 7+
   - Background color: Match your brand or use white
   - Margin: 0-4px recommended

   **Android Chrome:**
   - Theme color: `#000000` (or your brand color)
   - Name: "Artist Portfolio"

   **Windows Metro:**
   - Tile color: `#000000` (or your brand color)

   **Safari Pinned Tab:**
   - Color: `#000000` (or your brand color)
   - Icon should be monochrome/silhouette

   **Favicon Generator Options:**
   - Path: `/`
   - App name: Leave empty (handled by manifest)
   - Compression: Use default

4. Click "Generate your Favicons and HTML code"

### Step 3: Download and Install

1. Click "Favicon package"
2. Extract the ZIP file
3. Copy ALL files to `/public/` directory:
   ```bash
   # From extracted folder:
   cp *.png /path/to/sanata.art/public/
   cp *.svg /path/to/sanata.art/public/
   cp *.ico /path/to/sanata.art/public/
   ```

4. **Important:** Update colors in existing config files:
   - Edit `/public/site.webmanifest`:
     - Change `theme_color` to match your brand
     - Change `background_color` if needed
     - Update `name` and `short_name`

   - Edit `/public/browserconfig.xml`:
     - Change `TileColor` to match your brand

### Step 4: Verify Installation

1. Start dev server: `npm run dev`
2. Open http://localhost:5173/
3. Check browser tab for favicon
4. Test adding to home screen (mobile)
5. Check in different browsers

## Manual Generation (Alternative)

If you prefer command-line tools:

```bash
# Install sharp-cli for PNG generation
npm install -g sharp-cli

# From your source image (source.png):
sharp -i source.png -o favicon-16x16.png resize 16 16
sharp -i source.png -o favicon-32x32.png resize 32 32
sharp -i source.png -o apple-touch-icon.png resize 180 180
sharp -i source.png -o android-chrome-192x192.png resize 192 192
sharp -i source.png -o android-chrome-512x512.png resize 512 512
sharp -i source.png -o mstile-150x150.png resize 150 150
```

For ICO file (multi-size):
```bash
# Install ImageMagick
convert source.png -define icon:auto-resize=16,32,48 favicon.ico
```

For SVG favicon:
- Export your logo as SVG
- Ensure it's optimized (use SVGO)
- Save as `favicon.svg`

For Safari pinned tab:
- Create monochrome/single-color version
- Export as SVG
- Save as `safari-pinned-tab.svg`

## Current Status

✅ HTML meta tags configured in `index.html`
✅ Web manifest configured (`site.webmanifest`)
✅ Browser config configured (`browserconfig.xml`)
⏳ **Favicon image files need to be generated**

Once you generate and add the files, everything will work automatically!

## Colors to Update

Before generating, decide on your brand colors:

- **Theme Color** (browser UI): Currently `#000000` (black)
- **Background Color** (splash screen): Currently `#ffffff` (white)
- **Tile Color** (Windows): Currently `#000000` (black)
- **Safari Pinned Tab Color**: Currently `#000000` (black)

Update these in:
- `site.webmanifest` → `theme_color`, `background_color`
- `browserconfig.xml` → `TileColor`
- `index.html` → `meta[name="theme-color"]`, `link[rel="mask-icon"]`
