import { getMetadata } from '../../scripts/aem.js';
import { loadFragment } from '../fragment/fragment.js';

/**
 * loads and decorates the footer
 * @param {Element} block The footer block element
 */
export default async function decorate(block) {
  // load footer as fragment
  const footerMeta = getMetadata('footer');
  const footerPath = footerMeta ? new URL(footerMeta, window.location).pathname : '/footer';
  const fragment = await loadFragment(footerPath);

  // decorate footer DOM
  block.textContent = '';
  const footer = document.createElement('div');
  while (fragment.firstElementChild) footer.append(fragment.firstElementChild);

  // Restructure the flat default-content-wrapper into three semantic zones:
  // 1. .footer-columns  — 4-column link grid (h4 + ul pairs)
  // 2. .footer-social   — centered social icon row (picture paragraphs)
  // 3. .footer-legal    — copyright text + inline legal links
  const wrapper = footer.querySelector('.default-content-wrapper');
  if (wrapper) {
    const headings = [...wrapper.querySelectorAll(':scope > h4')];
    const lists = [...wrapper.querySelectorAll(':scope > ul')];
    const paragraphs = [...wrapper.querySelectorAll(':scope > p')];

    // Social icons = paragraphs that contain a <picture>
    const socialParas = paragraphs.filter((p) => p.querySelector('picture'));
    // Copyright = first paragraph without a picture
    const copyrightPara = paragraphs.find((p) => !p.querySelector('picture'));
    // Legal links = the last <ul> (after the 4 nav lists)
    const navLists = lists.slice(0, headings.length);
    const legalList = lists.length > headings.length ? lists[headings.length] : null;

    // Build columns zone
    const columnsEl = document.createElement('div');
    columnsEl.className = 'footer-columns';
    headings.forEach((heading, i) => {
      const col = document.createElement('div');
      col.className = 'footer-col';
      col.append(heading);
      if (navLists[i]) col.append(navLists[i]);
      columnsEl.append(col);
    });

    // Build social zone
    const socialEl = document.createElement('div');
    socialEl.className = 'footer-social';
    socialParas.forEach((p) => socialEl.append(p));

    // Build legal zone
    const legalEl = document.createElement('div');
    legalEl.className = 'footer-legal';
    if (copyrightPara) legalEl.append(copyrightPara);
    if (legalList) legalEl.append(legalList);

    wrapper.textContent = '';
    wrapper.append(columnsEl, socialEl, legalEl);
  }

  block.append(footer);
}
