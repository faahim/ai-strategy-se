import { selectedTags } from './tagsHandler';

export function setupFilterHandling() {
  const searchInput = document.getElementById('toolSearch') as HTMLInputElement;
  const sortSelect = document.getElementById('toolSort') as HTMLSelectElement;
  let searchTimeout: number;

  function checkToolMatches(tool: Element, searchTerm: string): boolean {
    const name = tool.querySelector('h2')?.textContent?.toLowerCase() || '';
    const description = tool.querySelector('p')?.textContent?.toLowerCase() || '';
    const toolTags = (tool.getAttribute('data-tags') || '').split(',');
    
    const matchesSearch = name.includes(searchTerm) || description.includes(searchTerm);
    const matchesTags = selectedTags.size === 0 || 
      toolTags.some(tag => selectedTags.has(tag));

    return matchesSearch && matchesTags;
  }

  function updateToolVisibility(tool: HTMLElement, matches: boolean) {
    if (matches) {
      tool.style.display = 'block';
      tool.style.opacity = '1';
    } else {
      tool.style.opacity = '0';
      setTimeout(() => {
        tool.style.display = 'none';
      }, 300);
    }
  }

  function filterTools() {
    const tools = document.querySelectorAll('.tool-card');
    const searchTerm = searchInput.value.toLowerCase();
    
    tools.forEach(tool => {
      const matches = checkToolMatches(tool, searchTerm);
      updateToolVisibility(tool as HTMLElement, matches);
    });

    updateEmptyState();
    updateCategorySections();
  }

  function updateEmptyState() {
    const visibleTools = document.querySelectorAll('.tool-card[style*="display: block"]');
    const emptyState = document.getElementById('searchEmptyState');
    
    if (visibleTools.length === 0) {
      emptyState?.classList.remove('hidden');
    } else {
      emptyState?.classList.add('hidden');
    }
  }

  function updateCategorySections() {
    document.querySelectorAll('[data-category-group]').forEach(section => {
      const hasVisibleTools = section.querySelector('.tool-card[style*="display: block"]');
      if (hasVisibleTools) {
        (section as HTMLElement).style.display = 'block';
      } else {
        (section as HTMLElement).style.display = 'none';
      }
    });
  }

  // Setup event listeners
  searchInput?.addEventListener('input', () => {
    clearTimeout(searchTimeout);
    searchTimeout = setTimeout(filterTools, 300);
  });

  sortSelect?.addEventListener('change', handleSort);
}

function handleSort() {
  // Implement sorting logic here
}