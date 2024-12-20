// Store selected tags in a Set that can be accessed by other modules
export const selectedTags = new Set<string>();

export function setupTagsHandling() {
  const selectedTagsContainer = document.getElementById('selectedTagsContainer');
  const groupContainers = document.querySelectorAll('.group-container');
  
  function createSelectedTagElement(tag: string) {
    const tagEl = document.createElement('div');
    tagEl.className = `px-3 py-1.5 text-sm text-white bg-gradient-to-r from-indigo-500 
                       to-indigo-600 border border-indigo-400 rounded-full flex items-center gap-2`;
    tagEl.innerHTML = `
      <span class="capitalize">${tag}</span>
      <button class="remove-tag hover:text-indigo-200 transition-colors" data-tag="${tag}">
        <span class="material-icons text-sm">close</span>
      </button>
    `;
    return tagEl;
  }

  function addClearFiltersButton(container: HTMLElement) {
    const clearBtn = document.createElement('button');
    clearBtn.className = 'px-3 py-1.5 text-sm text-red-600 hover:text-red-700 font-medium transition-colors flex items-center gap-1 capitalize bg-red-200/80 backdrop-blur-sm rounded-full border border-red-200 shadow-sm';
    clearBtn.innerHTML = `Clear all filters <span class="material-icons text-sm">close</span>`;
    clearBtn.addEventListener('click', clearFilters);
    container.appendChild(clearBtn);
  }

  function updateSelectedTagsDisplay() {
    if (!selectedTagsContainer) return;
    const selectedTagsList = document.getElementById('selectedTagsList');
    if (!selectedTagsList) return;

    selectedTagsList.innerHTML = '';

    if (selectedTags.size > 0) {
      selectedTagsContainer.classList.remove('hidden');
      selectedTagsContainer.classList.add('flex');

      Array.from(selectedTags).forEach((tag) => {
        selectedTagsList.appendChild(createSelectedTagElement(tag));
      });

      addClearFiltersButton(selectedTagsList);
    } else {
      selectedTagsContainer.classList.add('hidden');
      selectedTagsContainer.classList.remove('flex');
    }
  }

  function clearFilters() {
    selectedTags.clear();
    
    // Reset all tag buttons
    document.querySelectorAll('.tag-button').forEach((button) => {
      button.classList.remove('bg-indigo-100');
    });

    // Reset all tools to visible
    document.querySelectorAll('.tool-card').forEach((tool) => {
      const htmlTool = tool as HTMLElement;
      htmlTool.style.display = '';
      htmlTool.style.opacity = '1';
    });

    updateSelectedTagsDisplay();
    window.location.reload(); // Refresh the page to reset all states
  }

  function setupDropdownHandlers() {
    groupContainers.forEach(container => {
      const button = container.querySelector('.tag-group-button');
      const dropdown = container.querySelector('.tag-dropdown');

      button?.addEventListener('click', (e) => {
        e.stopPropagation();
        dropdown?.classList.toggle('hidden');
        
        // Close other dropdowns
        document.querySelectorAll('.tag-dropdown').forEach(d => {
          if (d !== dropdown) d.classList.add('hidden');
        });
      });
    });

    // Close dropdowns when clicking outside
    document.addEventListener('click', () => {
      document.querySelectorAll('.tag-dropdown').forEach(dropdown => {
        dropdown.classList.add('hidden');
      });
    });
  }

  function setupTagButtonHandlers() {
    document.querySelectorAll('.tag-button').forEach(button => {
      button.addEventListener('click', (e) => {
        e.stopPropagation();
        const tag = button.getAttribute('data-tag');
        if (!tag) return;

        if (selectedTags.has(tag)) {
          selectedTags.delete(tag);
          button.classList.remove('bg-indigo-100');
        } else {
          selectedTags.add(tag);
          button.classList.add('bg-indigo-100');
        }

        filterTools();
        updateSelectedTagsDisplay();
      });
    });
  }

  function setupSelectedTagsHandlers() {
    selectedTagsContainer?.addEventListener('click', (e) => {
      const target = e.target as HTMLElement;
      const removeButton = target.closest('.remove-tag');
      if (!removeButton) return;

      const tag = removeButton.getAttribute('data-tag');
      if (!tag) return;

      // Find and trigger click on corresponding tag button
      document.querySelectorAll('.tag-button').forEach((button) => {
        if (button.getAttribute('data-tag') === tag) {
          (button as HTMLButtonElement).click();
        }
      });
    });
  }

  // Initialize handlers
  setupDropdownHandlers();
  setupTagButtonHandlers();
  setupSelectedTagsHandlers();
}

// Helper function to filter tools based on selected tags
function filterTools() {
  const tools = document.querySelectorAll('.tool-card');
  let visibleTools = 0;

  tools.forEach((tool) => {
    const toolTags = (tool.getAttribute('data-tags') || '').split(',');
    const htmlTool = tool as HTMLElement;

    // If no tags are selected, show all tools
    if (selectedTags.size === 0) {
      htmlTool.style.display = 'block';
      htmlTool.style.opacity = '1';
      visibleTools++;
      return;
    }

    // Check if tool has any of the selected tags
    const hasSelectedTag = Array.from(selectedTags).some(
      (tag) => toolTags.includes(tag)
    );

    if (hasSelectedTag) {
      htmlTool.style.display = 'block';
      htmlTool.style.opacity = '1';
      visibleTools++;
    } else {
      htmlTool.style.opacity = '0';
      setTimeout(() => {
        htmlTool.style.display = 'none';
      }, 300);
    }
  });

  // Update empty state
  const emptyState = document.getElementById('searchEmptyState');
  if (visibleTools === 0) {
    emptyState?.classList.remove('hidden');
  } else {
    emptyState?.classList.add('hidden');
  }

  // Update category sections
  document.querySelectorAll('[data-category-group]').forEach(section => {
    const hasVisibleTools = section.querySelector('.tool-card[style*="display: block"]');
    if (hasVisibleTools) {
      (section as HTMLElement).style.display = 'block';
    } else {
      (section as HTMLElement).style.display = 'none';
    }
  });
}