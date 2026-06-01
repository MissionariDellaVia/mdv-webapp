// scripts/lib/transform-locations.js
function inlineMarkdown(text) {
  return String(text).replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
}
function articlesToHtml(articles) {
  if (!Array.isArray(articles) || articles.length === 0) return '';
  return `<ul>${articles.map((a) => `<li>${inlineMarkdown(a)}</li>`).join('')}</ul>`;
}
function imageFilenames(section) {
  const url = section && section.image ? section.image.url : null;
  if (!url) return [];
  return Array.isArray(url) ? url.slice() : [url];
}
function transformAttivita(attivita, lang) {
  if (!attivita || !Array.isArray(attivita.groups)) return [];
  const intro = attivita.main && attivita.main.caption ? attivita.main.caption : null;
  return attivita.groups.map((group, gIndex) => ({
    slug: group.key,
    name: group.title || group.key,
    lang,
    intro,
    position: gIndex,
    info: (Array.isArray(group.sections) ? group.sections : []).map((section, sIndex) => ({
      title: section.title || null,
      body: articlesToHtml(section.articles),
      imageFilenames: imageFilenames(section),
      position: sIndex,
    })),
  }));
}
module.exports = { transformAttivita, articlesToHtml, imageFilenames, inlineMarkdown };
