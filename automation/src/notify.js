// Things that need a human open a GitHub issue; GitHub emails the repo owner.
// Each alert key is raised once, so a stuck order doesn't spam the inbox.
export function createNotifier({ state, env = process.env, log = console }) {
  const pending = [];
  return {
    alert(key, title, body) {
      if (state.alerts[key]) return;
      state.alerts[key] = new Date().toISOString();
      pending.push({ title, body });
      log.warn(`ALERT: ${title}\n${body}`);
    },
    async flush() {
      const { GITHUB_TOKEN, GITHUB_REPOSITORY } = env;
      if (!GITHUB_TOKEN || !GITHUB_REPOSITORY) return;
      for (const { title, body } of pending.splice(0)) {
        const res = await fetch(`https://api.github.com/repos/${GITHUB_REPOSITORY}/issues`, {
          method: "POST",
          headers: { Authorization: `Bearer ${GITHUB_TOKEN}`, Accept: "application/vnd.github+json" },
          body: JSON.stringify({ title: `[Honey Mommy] ${title}`, body, labels: ["needs-attention"] }),
        });
        if (!res.ok) log.error(`Could not open issue "${title}": ${res.status}`);
      }
    },
  };
}
