---
title: Un pour l’argent, deux pour le spectacle, et trois pour le caillou.
date: 2024-03-12
featured: img/featured.jpg
featured_author: Marino Linic
featured_url: marinolinic
tags: notes
---

**Des trucs en vrac…**

<!-- excerpt -->

Je trouve que ça a un effet relaxant d'écrire du CSS moderne. La satisfaction que cela me procure est *étrangement* inversement proportionnelle à la frustration que j'éprouvais quand je faisais du support IE jadis.

```css
:where(input[type="file"]) {
  --color: var(--brand-main);
  border: 1px solid var(--color);
  border-radius: calc(var(--reset-font-size) * var(--size-1));
  height: calc(var(--size-7) + var(--size-2));
  background-color: var(--background-dark);
  color: var(--placeholder);
  font-style: italic;
  padding-inline-end: var(--size-3);

  &::file-selector-button {
    margin-inline-end: var(--size-3);
    border: 0;
    height: 100%;
    padding: var(--size-2) var(--size-3);
    background-color: var(--color);
    color: var(--body-light);
  }

  &:where(:hover) {
    --color: var(--brand-dark);
  }

  &:where(:active) {
    --color: var(--brand-darker);
  }

  &:where([disabled]) {
    --color: var(--brand-disabled);
    cursor: not-allowed;
  }
}
```

---

A propos du développement frontend (et plus particulièrement CSS)…

> Certain pursuits are validated with importance, dignity, and honor.
> 
> Doctors; lawyers; architects; CEOs; software engineers.
> 
> Some kinds of work are “serious” work, which is well and good—except that, implicitly, that means other kinds are _not_ serious.
> 
> We might not ever say it, or even think it, but when we cast some people as heroes, we relegate others to the role of the sidekick—even though their labor is no less important, and they do at least as much to push the work toward success.
> 
> Nurses; paralegals; interior designers; executive assistants; frontend developers.
> 
> (Surely it’s a coincidence the first group tends to be more male than the second.)
> 
> — *Josh Collinsworth* ~ [The quiet, pervasive devaluation of frontend](https://joshcollinsworth.com/blog/devaluing-frontend)

C'est l'histoire de toute ma carrière…

---

Depuis que je suis sur [Glass](https://glass.photo/) (réseau social pour photographes payant mais très bienveillant et de qualité selon moi) je vois le travail de nombreux photographes qui ont du talent et je remarque souvent qu'ils ou elles ont une sorte de touche personnelle, une sorte de type de photo de prédilection.

Et quand je regarde [ce que je fais](https://www.bloogart.com/), je ne vois aucun fil rouge. Je touche à beaucoup de type de photo, j'expérimente beaucoup, même [mon challenge pour l'année](https://blog.foojin.com/2023/12/22/shuffle-mon-challenge-photo/) est aléatoire…

J'arrive pas à me décider si c'est une bonne chose ou pas que je ne me sois pas trouvé un type de prédilection. Le faut-il seulement ? Ou alors j'ai bien une touche perso mais je suis pas assez détaché et objectif pour le voir.

🤷‍♂️
