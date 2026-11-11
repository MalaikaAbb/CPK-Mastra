const colorSchemeScript = `(() => {
  const media = matchMedia("(prefers-color-scheme: dark)");
  const apply = () => document.documentElement.classList.toggle("dark", media.matches);
  apply();
  media.addEventListener("change", apply);
})();`;

<head>
  <script dangerouslySetInnerHTML={{ __html: colorSchemeScript }} />
</head>;
