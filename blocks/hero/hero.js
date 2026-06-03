/**
 * loads and decorates the hero block
 * @param {Element} block The block element
 */
export default function decorate(block) {
  const h1 = block.querySelector('h1');
  if (!h1) return;

  const words = h1.textContent.trim().split(/\s+/);
  if (words.length <= 2) return;

  const gradientWords = words.slice(0, words.length - 2).join(' ');
  const plainWords = words.slice(words.length - 2).join(' ');

  h1.innerHTML = `<span class="hero-gradient">${gradientWords}</span> ${plainWords}`;
}
