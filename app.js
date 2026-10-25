(() => {
  const menuButton = document.querySelector('.menu-toggle');
  const nav = document.querySelector('#primary-nav');
  const searchForm = document.querySelector('#search-form');
  const searchInput = document.querySelector('#site-search');
  const cards = [...document.querySelectorAll('.story-card')];
  const topicButtons = [...document.querySelectorAll('.topic-chip')];
  const emptyState = document.querySelector('#empty-state');
  const newsletterForm = document.querySelector('#newsletter-form');
  const newsletterMessage = document.querySelector('#newsletter-message');
  let activeCategory = 'all';
  let searchTerm = '';

  document.querySelector('#year').textContent = String(new Date().getFullYear());

  menuButton?.addEventListener('click', () => {
    const expanded = menuButton.getAttribute('aria-expanded') === 'true';
    menuButton.setAttribute('aria-expanded', String(!expanded));
    nav?.classList.toggle('open', !expanded);
  });

  nav?.querySelectorAll('a').forEach((link) => link.addEventListener('click', () => {
    nav.classList.remove('open');
    menuButton?.setAttribute('aria-expanded', 'false');
  }));

  function updateStories() {
    let visible = 0;
    cards.forEach((card) => {
      const categoryMatch = activeCategory === 'all' || card.dataset.category === activeCategory;
      const searchable = (card.dataset.search + ' ' + card.textContent).toLowerCase();
      const searchMatch = !searchTerm || searchable.includes(searchTerm);
      const show = categoryMatch && searchMatch;
      card.hidden = !show;
      if (show) visible += 1;
    });
    if (emptyState) emptyState.hidden = visible > 0;
  }

  topicButtons.forEach((button) => button.addEventListener('click', () => {
    activeCategory = button.dataset.filter || 'all';
    topicButtons.forEach((item) => {
      const active = item === button;
      item.classList.toggle('active', active);
      item.setAttribute('aria-pressed', String(active));
    });
    updateStories();
  }));

  searchInput?.addEventListener('input', () => {
    searchTerm = searchInput.value.trim().toLowerCase();
    updateStories();
  });

  searchForm?.addEventListener('submit', (event) => {
    event.preventDefault();
    searchTerm = searchInput?.value.trim().toLowerCase() || '';
    updateStories();
    document.querySelector('#latest')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });

  newsletterForm?.addEventListener('submit', (event) => {
    event.preventDefault();
    if (newsletterMessage) {
      newsletterMessage.textContent = 'This is a visual prototype. Newsletter signup is not connected, and no data was sent.';
    }
  });
})();