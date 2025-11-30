export function mapContainer(container) {
  const map = {
    main: 'layout-main',
    content: 'layout-content',
    narrow: 'layout-narrow',
    wide: 'layout-wide',
    none: ''
  }
  return map[container] ?? map.main
}

