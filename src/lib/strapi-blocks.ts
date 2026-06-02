export function renderBlocksToHtml(blocks: any[]): string {
  if (!Array.isArray(blocks)) {
    if (typeof blocks === 'string') return blocks;
    return '';
  }

  return blocks.map(block => {
    switch (block.type) {
      case 'paragraph':
        return `<p>${renderChildren(block.children)}</p>`;
      case 'heading': {
        const level = block.level || 1;
        return `<h${level}>${renderChildren(block.children)}</h${level}>`;
      }
      case 'list': {
        const tag = block.format === 'ordered' ? 'ol' : 'ul';
        return `<${tag}>${renderChildren(block.children)}</${tag}>`;
      }
      case 'list-item':
        return `<li>${renderChildren(block.children)}</li>`;
      case 'quote':
        return `<blockquote>${renderChildren(block.children)}</blockquote>`;
      case 'code':
        return `<pre><code>${renderChildren(block.children)}</code></pre>`;
      default:
        if (block.children) {
          return renderChildren(block.children);
        }
        return '';
    }
  }).join('');
}

function renderChildren(children: any[]): string {
  if (!Array.isArray(children)) return '';
  return children.map(child => {
    if (child.type === 'text') {
      let text = escapeHtml(child.text);
      if (child.bold) text = `<strong>${text}</strong>`;
      if (child.italic) text = `<em>${text}</em>`;
      if (child.underline) text = `<u>${text}</u>`;
      if (child.strikethrough) text = `<del>${text}</del>`;
      if (child.code) text = `<code>${text}</code>`;
      return text;
    }
    if (child.type === 'link') {
      return `<a href="${escapeHtml(child.url)}" target="_blank" rel="noopener noreferrer">${renderChildren(child.children)}</a>`;
    }
    if (child.children) {
      return renderChildren(child.children);
    }
    return '';
  }).join('');
}

function escapeHtml(unsafe: string): string {
  if (typeof unsafe !== 'string') return '';
  return unsafe
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}
