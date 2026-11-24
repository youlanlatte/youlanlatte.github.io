async function loadGithubData() {
  const list = document.querySelector('#repo-list');
  const count = document.querySelector('#repo-count');
  const stars = document.querySelector('#total-stars');
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 10000);
  try {
    const repos = [];
    let page = 1;
    while (true) {
      const response = await fetch('https://api.github.com/users/youlanlatte/repos?sort=updated&per_page=100&page=' + page, { signal: controller.signal });
      if (!response.ok) throw new Error('GitHub unavailable');
      const batch = await response.json();
      repos.push(...batch);
      if (batch.length < 100) break;
      page++;
    }
    count.textContent = repos.length;
    stars.textContent = repos.reduce((sum, repo) => sum + repo.stargazers_count, 0);
    list.textContent = repos.length ? '' : '暂无公开项目。';
    for (const repo of repos.slice(0, 5)) {
      const item = document.createElement('article');
      item.className = 'repo-item';
      const link = document.createElement('a');
      link.href = 'https://github.com/youlanlatte/' + encodeURIComponent(repo.name);
      link.textContent = repo.name;
      const description = document.createElement('p');
      description.textContent = repo.description || '';
      const meta = document.createElement('small');
      meta.textContent = [repo.language, '★ ' + repo.stargazers_count, '更新于 ' + new Date(repo.updated_at).toLocaleDateString('zh-CN')].filter(Boolean).join(' · ');
      item.append(link, description, meta);
      list.append(item);
    }
  } catch {
    count.textContent = stars.textContent = '—';
    const link = document.createElement('a');
    link.href = 'https://github.com/youlanlatte?tab=repositories';
    link.textContent = '前往 GitHub 查看项目';
    list.replaceChildren('项目数据暂时无法加载。', link);
  } finally {
    clearTimeout(timeout);
  }
}
loadGithubData();
