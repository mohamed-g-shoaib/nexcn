export function getThemeBootstrapScript(storageKey = "theme"): string {
  return `(function(){try{var root=document.documentElement;var stored=localStorage.getItem(${JSON.stringify(
    storageKey,
  )});var theme=stored==="light"||stored==="dark"||stored==="system"?stored:"system";var resolved=theme==="system"?(window.matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light"):theme;root.classList.remove("light","dark");root.classList.add(resolved);root.style.colorScheme=resolved;}catch(_error){}})();`;
}
