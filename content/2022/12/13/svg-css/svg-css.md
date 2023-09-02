---
title: SVG + CSS = ❤️
slug: svg-css
date: 2022-12-13
featured: img/featured.jpg
featured_author: Michael Fenton
featured_url: michaelrfenton
tags:
  - code
  - protips
---

SVG est clairement un super format pour les illustrations sur le web. Mais ce qui en fait un encore meilleur format est le fait qu'il peut interagir avec CSS et ça c'est vraiment cool ! ❤️
---

Mais le sujet est un poil long et complexe alors voici le sommaire pour ce dont je vais vous parler.

1. [Les différentes méthodes de chargement](#les-differentes-methodes-de-chargement)
	1. [La balise `img`](#la-balise-img)
	2. [La propriété CSS `background-image`](#la-propriete-css-background-image)
	3. [Le <span lang="en">inlined</span> `SVG`](#le-inlined-svg)
	4. [Les `symbol` SVG](#les-symbol-svg)
	5. [La balise `object`](#la-balise-object)
	6. [Les Data URI](#les-data-uri)
	7. [Les avantages et inconvénients](#les-avantages-et-inconvenients)
2. [Interagir avec un SVG depuis le document](#interagir-avec-un-svg-depuis-le-document)
	1. [Les propriétés CSS pour SVG](#les-proprietes-css-pour-svg)
	2. [L'héritage CSS](#l-heritage-css)
	3. [Le <span lang="en">Clipping</span>](#le-clipping)
	4. [Le <span lang="en">Responsive</span>](#le-responsive)
3. [Interagir avec un SVG depuis le SVG lui-même](#interagir-avec-un-svg-depuis-le-svg-lui-meme)

## Les différentes méthodes de chargement

Avant d'entrer directement dans le sujet CSS il nous faut nous attarder sur un petit détail : toutes les méthodes de chargement de SVG dans une page web ne permettent pas de profiter de la relation entre SVG et CSS.

À vrai dire il n'existe pas de méthode parfaite, en fait chacune d'entre elles a ses avantages et inconvénients et vous devrez choisir à chaque fois ce qui correspond le mieux à vos besoins.

### La balise `img`

Vous la connaissez déjà, plus besoin de la présenter, il s'agit de la très célèbre balise `img` qui sert, comme son nom l'indique à intégrer une image à votre page web.

```html
	<img src="svg/mon-super-svg.svg" alt="Mon texte alternatif">
```

Simple et efficace ! Seul problème, un svg embarqué dans cette balise se trouve complètement coupé du reste du Document. Un peu comme une `iframe` dont le contenu n'hériterait de quoique ce soit de la page qui l'appelle.

Vous ne pourrez lui appliquer comme CSS que ce que vous pouvez déjà appliquer à une image dite "classique", c'est à dire des filtres et autres transformations mais ça s'arrêtera à peu près là.

### La propriété CSS `background-image`

C'est la petite cousine de `img` mais pour CSS.

De la même manière elle va être encapsulé et coupé du reste du document.

Les petites nuances étant qu'elle n'est pas dans le DOM donc elle ne devra servir qu'à des fins décoratives, mais aussi que vous aurez probablement besoin d'y rajouter quelques petites choses supplémentaires comme les propriétés [background-repeat](https://developer.mozilla.org/fr/docs/Web/CSS/background-repeat) et [background-size](https://developer.mozilla.org/fr/docs/Web/CSS/background-size).

```css
  .mon-super-element {
    width: 10rem;
    height: 3rem;
    background-image: url('../svg/mon-super-svg.svg');
    background-repeat: no-repeat;
    background-size: contain;
  }
```

### Le Inlined SVG

C'est là qu'on va commencer à pouvoir s'amuser. SVG étant basé sur le format XML tout comme HTML il est donc complètement compatible avec ce dernier mais aussi avec CSS et JavaScript.

Vous allez donc pouvoir directement intégrer ce SVG dans votre DOM sans avoir besoin d'artifice et interagir avec très simplement.

```html
  <body>
    <svg viewBox="0 0 200 200">
      <rect x="10" y="10" width="100" height="100" stroke="red" fill="grey" stroke-width="5" />
    </svg>
  </body>
```

Alors là, pour mon exemple, j'ai utilisé un SVG simple qui est donc très léger mais imaginez un instant un SVG d'une grosse illustration et vous risquez de sérieusement encombrer votre DOM et potentiellement ralentir le temps dechargement et/ou rendu votre page HTML (mais honnêtement pour ça faudrait vraiment un **ÉNORME** SVG).

### Les `symbol` SVG

Si vous avez déjà mis le nez dans du code SVG vous êtes très probablement déjà tombé sur la balise `<use />` (propre à SVG) et vous avez peut être alors compris que c'était une manière de rappeler des formes déjà existantes. C'est franchement pratique en plus d'être puissant.

C'est en fait tout le principe du sprite SVG. Vous n'avez qu'à charger une fois un seul SVG, que ce soit un appel vers un fichier externe ou directement inline, comprenant différents `symbol` et ensuite vous pourrez les appeler à volonté à différents endroits de votre page sans ajouter de poids à celle-ci.

En très bref, la balise `<use />` va aller dire au navigateur qu'elle a besoin de tel `symbol` avec telle `id` à tel endroit et ce dernier ira comme faire un lien virtuel ramenant alors cette forme à l'endroit souhaité en tant que duplicata fantôme (c'est à dire qui n'existe pas vraiment en définitive).

```html
  <!-- SVG directement via un appel externe -->
  <svg>
    <use href="svg/mon-super-svg.svg#marker" />
  </svg>

  <!-- SVG inline -->
  <svg style="display: none;">
    <symbol id="marker" viewBox="0 0 200 200">
      <rect x="10" y="10" width="100" height="100" stroke="red" fill="grey" stroke-width="5" />
    </symbol>
  </svg>

  <!-- Plus loin dans le DOM -->
  <svg>
    <use href="#marker" />
  </svg>
```

On pourrait très naturellement se dire que cette méthode est bonne pour les performances de votre site et en soi ce n'est pas complètement faux. Sauf que si c'est fait de manière un peu globale et sans faire attention ça peut avoir l'effet inverse.

Mettons que vous ayez un sprite de 100 `symbol` ce qui est loin d'être impossible pour un sprite de jeu d'icônes par exemple, mais que sur une page vous n'utilisez que 2 ou 3 icônes, vous allez donc charger toutes les autres pour rien. Et ça c'est vraiment dommage. Cependant pour palier à ce désagrément certains outils de framework JavaScript permettent de créer des sprites à la volonté par exemple.

Donc faites attention. ;)

### La balise `object`

Pour les plus vieux d'entre vous, vous vous souvenez peut être d'elle parce que c'était un bon moyen, sinon le meilleur, de charger des applets de feue **Flash** sur une page web.

Mais force est d'avouer qu'elle est très peu utilisée de nos jours puisque son but principal est de charger des fichiers externes souvent dans un format que HTML ne peux pas intégrer directement comme un PDF ou un applet Java ou que sais-je.

```html
  <object type="image/svg+xml" data="svg/mon-super-svg.svg">
    Mon texte alternatif
  </object>
```

Et là je vous vois venir avec vos "Mais c'est comme la balise `img` en fait ?".

Et bien non ! C'est encore mieux… pour peu que vous en ayez vraiment l'utilité.

Ce que je ne vous ai pas dit au tout début c'est qu'un SVG peut aussi contenir son propre CSS ou son propre JavaScript sauf que si vous chargez votre SVG depuis une balise `img` et bien vous ne verrez que la première frame de ce SVG.  
En d'autres termes si vous aviez une animation CSS dans ce SVG seul l'**état 0** ou la première frame de l'animation sera affichée et aucune animation ne se fera.

Ce qui ne sera pas le cas si vous chargez votre SVG via une balise `object`. Tout le CSS ainsi que le JavaScript à l'intérieur de ce dernier sera interprété et effectif.

### Les Data URI

Ceci est un cas un peu particulier puisqu'il ne s'agit pas à proprement parler de méthode de chargement mais plutôt de nature de SVG.

Normalement, quand vous chargez un SVG via une balise `img` vous devez fournir à l'attribut `src` un chemin relatif ou absolu vers un fichier binaire avec une extension… sauf que c'est pas du tout obligatoire.

Vous pouvez très bien fournir à la balise un SVG **directement** mais pour ce faire vous devez transformez un peu ce dernier en l'encodant avec un [URL-encoder](https://yoksel.github.io/url-encoder/) ou un base64-encoder mais le base64 serait déconseillé pour les SVG puisqu'il a tendance à rendre le fichier un poil plus lourd.

De toute évidence pas si évidente si vous pouvez faire ça avec une balise `img`, vous pourrez faire ça aussi avec un `background-image` CSS ou encore la balise `object`.

```html
  <img src="data:image/svg+xml,%3Csvg […]" alt="Mon text alternatif">
```
    
```css
  .mon-super-element {
    width: 10rem;
    height: 3rem;
    background-image: url('data:image/svg+xml,%3Csvg […]');
    background-repeat: no-repeat;
    background-size: contain;
  }
```

```html
  <object type="image/svg+xml" data="data:image/svg+xml,%3Csvg […]">
    Mon texte alternatif
  </object>
```

Ce que vous pourrez faire avec ce SVG dépendra surtout de la méthode de chargement choisie évidemment.

### Les avantages et inconvénients

J'en ai déjà un peu parlé sur chaque méthode mais ce seront ces avantages et inconvénients qui devront vous guider vers le meilleur choix à faire selon vos besoins. Pour ce faire vous devez vous poser les bonnes questions :

- Est-ce **les requêtes HTTP supplémentaires** pour aller chercher vos SVG sont ok pour vous ?
- Est-ce que un **DOM trop chargé et donc le poids de la page HTML ou des fichiers CSS** est un sujet important pour vous
- Est-ce que vous voulez tirer profit de **styles et/ou JavaScript embarqués dans le SVG** ?
- Est-ce que vous souhaitez pouvoir **interagir directement avec les formes de votre SVG depuis les styles et/ou le JavaScript de votre page** ?
- Est-ce que au contraire, je veux juste **charger un SVG simple sans rien y changer comme une image bitmap** ?

<div class="notabene">
Si vous décidez de charger un SVG contenant du JS via un appel externe (`img`, `object`, etc) il vaut mieux qu'il vienne du même domaine que la page. Pour des raisons de sécurité, il me semble que certains navigateurs pourraient bloquer l'interprétation du JS (à prendre avec des pincettes car je ne suis sûr de rien à ce sujet).
</div>

Pour vous aider à peut être y voir un poil plus clair voici ci-dessous un tableau récapitulatif.

<table class="table-compare" style="text-align: center;">
  <thead>
    <tr>
      <td></td>
      <th><code>img</code></th>
	    <th>bg-image</th>
    	<th>Inlined</th>
    	<th>Symbols</th>
    	<th><code>object</code></th>
    	<th>Data URI</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th>Requête HTTP</th>
      <td>✅ oui</td>
      <td>✅ oui</td>
      <td>❌ non</td>
      <td>✅ non avec SVG externe<br />❌ oui avec SVG inline</td>
      <td>✅ oui</td>
      <td>❌ non</td>
    </tr>
    <tr>
      <th>Alourdi DOM et/ou CSS</th>
      <td>❌ non</td>
      <td>❌ non</td>
      <td>✅ oui</td>
      <td>❌ non avec SVG externe<br />✅ oui avec SVG inline</td>
      <td>❌ non</td>
      <td>✅ oui</td>
    </tr>
    <tr>
      <th>Coupé du DOM</th>
      <td>✅ oui</td>
      <td>✅ oui</td>
      <td>❌ non</td>
      <td>❌ non avec SVG externe<br />❌ non avec SVG inline</td>
      <td>✅ oui</td>
      <td>✅ oui</td>
    </tr>
    <tr>
      <th>Avoir ses propres CSS et <abbr title="JavaScript">JS</abbr></th>
      <td>❌ non</td>
      <td>❌ non</td>
      <td>✅ oui</td>
      <td>✅ oui avec SVG externe<br />✅ oui avec SVG inline</td>
      <td>✅ oui</td>
      <td>❌ non</td>
    </tr>
    <tr>
      <th>Document interagit avec</th>
      <td>❌ non</td>
      <td>❌ non</td>
      <td>✅ oui</td>
      <td>✅ oui avec SVG externe<br />✅ oui avec SVG inline</td>
      <td>❌ non</td>
      <td>❌ non</td>
    </tr>
  </tbody>
</table>

Comme vous pouvez mieux le voir, aucune méthode n'est vraiment parfaite, alors choisissez bien.

Maintenant que vous connaissez toutes les bases nécessaires on va pouvoir passer aux choses sérieuses.

## Interagir avec un SVG depuis le document

<div class="notabene">
Tout ce qui va suivre ne sera possible que si votre SVG est inlined avec ou sans symbol.
</div>

### Les propriétés CSS pour SVG

Comme SVG est basé sur XML, CSS a tout le loisir du monde pour sélectionner des éléments du SVG qui s'avèrent être aussi des formes. De fait on peut s'amuser à les modifier à volonté, quitte à faire des trucs moches (et je dis pas ça parce que je sais pas faire de trucs jolis… encore que…)  
Commençons par faire quelques tracés vectoriels simple avec SVG.

```xml
  <svg>
		<rect x="10" y="10" width="100" height="100" stroke="#ffc09f" fill="transparent" stroke-width="5" />
  </svg>
  <svg>
		<circle cx="60" cy="60" r="50" stroke="#ffee93" fill="transparent" stroke-width="5" />
  </svg>
  <svg>
		<ellipse cx="60" cy="60" rx="40" ry="25" stroke="#fcf5c7" fill="transparent" stroke-width="5" />
  </svg>
  <svg>
		<line x1="10" x2="100" y1="10" y2="100" stroke="#a0ced9" stroke-width="5" />
  </svg>
  <svg>
		<polyline points="10,30 60,50 90,75 60,100 90" fill="none" stroke="#adf7b6" stroke-width="5" />
  </svg>
  <svg>
		<polygon points="70,80 10,90 70, 5 90, 10" stroke="#eac4d5" fill="transparent" stroke-width="5" />
  </svg>
  <svg>
    <defs>
      <!-- Pattern courtesy of https://iros.github.io/patternfills/ -->
      <!-- Pattern qui ne sera pas visible sauf si on l'appelle directement -->
      <pattern id="pattern-1" patternUnits="userSpaceOnUse" width="10" height="10">
        <image
        	xlink:href="data:image/svg+xml;base64,PHN2ZyB4bWxucz0naHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmcnIHdpZHRoPScxMCcgaGVpZ2h0PScxMCc+CiAgPHJlY3Qgd2lkdGg9JzEwJyBoZWlnaHQ9JzEwJyBmaWxsPSd3aGl0ZScgLz4KICA8cmVjdCB4PScwJyB5PScwJyB3aWR0aD0nOScgaGVpZ2h0PSc5JyBmaWxsPSdibGFjaycgLz4KPC9zdmc+"
          x="0" y="0" width="10" height="10">
        </image>
      </pattern>
    </defs>
    <path
    	d="M 10,30
				A 20,20 0,0,1 50,30
				A 20,20 0,0,1 90,30
				Q 90,60 50,90
				Q 10,60 10,30 z"
      stroke="#e8d1c5"
      stroke-width="5"
      fill="transparent"
    />
  </svg>
```

Ce qui nous donnerait ça.

{% demo 'Formes SVG de départ' %}

```css
svg {
  width: 8rem;
  height: 8rem;
}
```
```html
<svg>
	<rect x="10" y="10" width="100" height="100" stroke="#ffc09f" fill="transparent" stroke-width="5" />
</svg>
<svg>
	<circle cx="60" cy="60" r="50" stroke="#ffee93" fill="transparent" stroke-width="5" />
</svg>
<svg>
	<ellipse cx="60" cy="60" rx="40" ry="25" stroke="#fcf5c7" fill="transparent" stroke-width="5" />
</svg>
<svg>
	<line x1="10" x2="100" y1="10" y2="100" stroke="#a0ced9" stroke-width="5" />
</svg>
<svg>
	<polyline points="10,30 60,50 90,75 60,100 90" fill="none" stroke="#adf7b6" stroke-width="5" />
</svg>
<svg>
	<polygon points="70,80 10,90 70, 5 90, 10" stroke="#eac4d5" fill="transparent" stroke-width="5" />
</svg>
<svg>
  <defs>
    <!-- Pattern courtesy of https://iros.github.io/patternfills/ -->
    <!-- Pattern qui ne sera pas visible sauf si on l'appelle directement -->
    <pattern id="pattern-1" patternUnits="userSpaceOnUse" width="10" height="10">
      <image
      	xlink:href="data:image/svg+xml;base64,PHN2ZyB4bWxucz0naHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmcnIHdpZHRoPScxMCcgaGVpZ2h0PScxMCc+CiAgPHJlY3Qgd2lkdGg9JzEwJyBoZWlnaHQ9JzEwJyBmaWxsPSd3aGl0ZScgLz4KICA8cmVjdCB4PScwJyB5PScwJyB3aWR0aD0nOScgaGVpZ2h0PSc5JyBmaWxsPSdibGFjaycgLz4KPC9zdmc+"
        x="0" y="0" width="10" height="10">
      </image>
    </pattern>
  </defs>
  <path
  	d="M 10,30
			A 20,20 0,0,1 50,30
			A 20,20 0,0,1 90,30
			Q 90,60 50,90
			Q 10,60 10,30 z"
    stroke="#e8d1c5"
    stroke-width="5"
    fill="transparent"
  />
</svg>
```
{% enddemo %}

Alors que peut-on changer sur un SVG avec du CSS ? Beaucoup de choses comme vous pouvez le voir sur [cette spec W3C](https://www.w3.org/TR/SVG/propidx.html) mais vous pourrez remarquer que c'est tout de même peu comparé à tout ce que CSS peut offrir.

Mais essayons de passer en revue quelques uns des plus intéressants pour les SVG.

Par exemple, voyons l'impact de ces quelques propriétés sur nos SVG.

```css
  rect {
    /* Change la couleur du tracé */
    stroke: crimson;
  }
  circle {
    /* Rempli d'une couleur l'intérieur du tracé */
    fill: teal;
  }
  ellipse {
    /* Change l'épaisseur du tracé */
    stroke-width: 8;
  }
  line {
    /* Change la rendu du tracé */
    stroke-dasharray: 2 4% 5;
  }
  polyline {
    fill: rebeccapurple;
    stroke-width: 8;
    /* Change le bout du tracé */
    stroke-linecap: round;
  }
  polygon {
    fill: rebeccapurple;
    /* Au lieu de changer la couleur d'un tracé
    vous pouvez aussi lui attribuer un pattern */
    stroke: url(#pattern);
  }
  path {
    /* Vous pouvez vous amusez en changeant plusieurs
    propriétés en même temps */
    stroke: crimson;
    fill: teal;
    stroke-width: 8;
    stroke-dasharray: 2 4% 5;
    stroke-linecap: round;
    stroke: url(#pattern);
  }
```
{% demo 'Formes SVG stylées' %}
```css
svg {
  width: 8rem;
  height: 8rem;
}
rect {
	stroke: crimson;
}
circle {
  fill: teal;
}
ellipse {
  stroke-width: 8;
}
line {
  stroke-dasharray: 2 4% 5;
}
polyline {
  fill: rebeccapurple;
	stroke-width: 8;
  stroke-linecap: round;
}
polygon {
  fill: rebeccapurple;
  stroke: url(#pattern);
}
path {
  stroke: crimson;
  fill: teal;
  stroke-width: 8;
  stroke-dasharray: 2 4% 5;
  stroke-linecap: round;
  stroke: url(#pattern);
}
```
```html
<svg>
	<rect x="10" y="10" width="100" height="100" stroke="#ffc09f" fill="transparent" stroke-width="5" />
</svg>
<svg>
	<circle cx="60" cy="60" r="50" stroke="#ffee93" fill="transparent" stroke-width="5" />
</svg>
<svg>
	<ellipse cx="60" cy="60" rx="40" ry="25" stroke="#fcf5c7" fill="transparent" stroke-width="5" />
</svg>
<svg>
	<line x1="10" x2="100" y1="10" y2="100" stroke="#a0ced9" stroke-width="5" />
</svg>
<svg>
	<polyline points="10,30 60,50 90,75 60,100 90" fill="none" stroke="#adf7b6" stroke-width="5" />
</svg>
<svg>
	<polygon points="70,80 10,90 70, 5 90, 10" stroke="#eac4d5" fill="transparent" stroke-width="5" />
</svg>
<svg>
	<defs>
		<!-- Pattern courtesy of https://iros.github.io/patternfills/ -->
		<pattern id="pattern" patternUnits="userSpaceOnUse" width="10" height="10">
			<image
				xlink:href="data:image/svg+xml;base64,PHN2ZyB4bWxucz0naHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmcnIHdpZHRoPScxMCcgaGVpZ2h0PScxMCc+CiAgPHJlY3Qgd2lkdGg9JzEwJyBoZWlnaHQ9JzEwJyBmaWxsPSd3aGl0ZScgLz4KICA8cmVjdCB4PScwJyB5PScwJyB3aWR0aD0nOScgaGVpZ2h0PSc5JyBmaWxsPSdibGFjaycgLz4KPC9zdmc+"
				x="0" y="0" width="10" height="10">
			</image>
		</pattern>
	</defs>
	<path
		d="M 10,30
		A 20,20 0,0,1 50,30
		A 20,20 0,0,1 90,30
		Q 90,60 50,90
		Q 10,60 10,30 z"
		stroke="#e8d1c5"
		stroke-width="5"
		fill="transparent"
	/>
</svg>
```
{% enddemo %}

Un petit détail aura peut être attiré votre attention ici. Pourquoi donc l'exemple `polyline` a une couleur à l'intérieur du tracé ? Comme si ce dernier avait un tracé fermé comme un `polygon` ?

Et bien la raison est simple : c'est parce que c'est effectivemet un tracé fermé.  
En fait la différence principale entre un `polyline` et `polygon`, au delà du nom, est que `polygon` fermera le tracé **mais** fera un segment `stroke` entre le premier et dernier point en plus. Donc dans les deux cas, le tracé est fermé et peut avoir un `fill` remplir son office.

J'en conviens ce n'est pas forcément intuitif de prime abord mais rien de bien gênant ici, il suffit de le savoir et voilà vous savez maintenant.

### L'héritage CSS

Si notre SVG fait parti du DOM et qu'il peut interagir avec CSS alors tout naturellement on peut penser qu'il hérite de propriétés CSS comme tout bon élément HTML qui se respecte. Et c'est le cas, enfin en partie.

Un SVG sera exclu du box-model CSS et donc n'héritera rien qui soit lié à ce dernier. En gros notre SVG héritera surtout de tout ce qui concerne les fonts.

Prenons par exemple ces quelques tracés `<text>` propres à SVG et voyons ce qu'il se passe.

```css
.mon-svg-text {
  width: 16rem;
  height: 8rem;
  color: DarkSeaGreen;
}
.mon-svg-text .small { font: italic 13px sans-serif; }
.mon-svg-text .heavy { font: bold 30px sans-serif; }
.mon-svg-text .Rrrrr { font: italic 40px serif; }
```

```html
<svg class="mon-svg-text">
	<text x="20" y="35" class="small">Mon</text>
	<text x="50" y="35" class="heavy">chat</text>
	<text x="55" y="55" class="small">est un</text>
	<text x="95" y="55" class="Rrrrr">enfoiré !</text>
</svg>
```
{% demo 'Texte SVG' %}
```css
body {background-color: #fff;}
.mon-svg-text {
	width: 16rem;
	height: 8rem;
	color: DarkSeaGreen;
}
.mon-svg-text .small { font: italic 13px sans-serif; }
.mon-svg-text .heavy { font: bold 30px sans-serif; }
.mon-svg-text .Rrrrr { font: italic 40px serif; }
```
```html
<svg class="mon-svg-text">
  <text x="20" y="35" class="small">Mon</text>
  <text x="50" y="35" class="heavy">chat</text>
  <text x="55" y="55" class="small">est un</text>
  <text x="95" y="55" class="Rrrrr">enfoiré !</text>
</svg>
```
{% enddemo %}
<div class="notabene">
	J'ai mis ici un fond blanc ici parce que par défaut un svg sans couleur définie est noir donc c'était mieux pour la visibilité.
</div>

Comme vous pouvez le voir la forme `text` prend bien en charge toutes les propriétés CSS propres aux fonts. Toutes ? Non ! Car la couleur devrait être `DarkSeaGreen` et ce noir est tout sauf du vert d'une mer sombre.

Que s'est-il passé ? Est-ce que la couleur n'est pas héritée ?

Et bien en fait elle l'est **mais** `text` n'est pas du texte ou en tout cas n'est pas un text node au sens où le DOM l'entend. C'est avant tout un tracé vectoriel SVG.  
Le SVG reçoit bien la couleur en héritage mais n'en fait rien puisque, pour lui, ce qui donne la couleur à un SVG ce n'est pas la propriété `color` mais `fill`.

Et le seul moyen de récupérer la valeur de la `color` pour la doner à `fill` c'est d'utiliser le mot clé `currentColor` qui en gros ira dire au CSS d'aller chercher la valeur du `color` dont il a hérité.

Enfin quand je dis la seule… ça c'était avant puisque désormais on peut allègrement user et abuser des CSS custom properties ce qui offre encore plus de souplesse en forçant l'héritage de bien d'autres propriétés.

```css
.mon-svg-text {
  --stroke-color: crimson;
  width: 16rem;
  height: 8rem;
  color: DarkSeaGreen;
}
.mon-svg-text .small { font: italic 13px sans-serif; }
.mon-svg-text .heavy { font: bold 30px sans-serif; }
.mon-svg-text .Rrrrr { font: italic 40px serif; }

.mon-svg-text text {
  fill: currentColor;
  stroke: var(--stroke-color);
}
```

{% demo 'Texte SVG stylé' %}
```css
body {background-color: #fff;}
.mon-svg-text {
  --stroke-color: crimson;
	width: 16rem;
	height: 8rem;
	color: DarkSeaGreen;
}
.mon-svg-text .small { font: italic 13px sans-serif; }
.mon-svg-text .heavy { font: bold 30px sans-serif; }
.mon-svg-text .Rrrrr { font: italic 40px serif; }

.mon-svg-text text {
  fill: currentColor;
  stroke: var(--stroke-color);
}
```
```html
<svg class="mon-svg-text">
  <text x="20" y="35" class="small">Mon</text>
  <text x="50" y="35" class="heavy">chat</text>
  <text x="55" y="55" class="small">est un</text>
  <text x="95" y="55" class="Rrrrr">enfoiré !</text>
</svg>
```
{% enddemo %}

Pour en savoir plus sur les propriétés CSS héritées naturellement, retournez jeter un œil à la même [spec W3C](https://www.w3.org/TR/SVG/propidx.html) citée plus haut.

### Le Clipping

On vient de voir comment CSS peut directement influencer sur un SVG mais ce dernier est capable de choses un peu particulières, comme devenir un masque.

Pour exemple, j'ai choisi un SVG d'un joli cœur bien rouge et trois conteneurs aux contenus divers : un rempli de texte, un avec une image et un avec un CSS `background-image`.

```css
.area, .svg {
  display: block;
  max-width: 500px;
  height: 250px;
  margin: 2rem auto;
  overflow: hidden;
}
.lgbt {
  background: linear-gradient(
  to bottom,
  #e40303,
  #e40303 16.67%,
  #ff8c00 16.67%,
  #ff8c00 33.33%,
  #ffed00 33.33%,
  #ffed00 50%,
  #008026 50%,
  #008026 66.67%,
  #004dff 66.67%,
  #004dff 83.33%,
  #750787 83.33%,
  #750787
  );
}
```

```html
<svg class="svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 475.528 475.528">
  <path fill="red" d="M237.376,436.245l0.774,0.976c210.94-85.154,292.221-282.553,199.331-367.706
    c-92.899-85.154-199.331,30.953-199.331,30.953h-0.774c0,0-106.44-116.107-199.331-30.953
    C-54.844,154.658,26.437,351.092,237.376,436.245z"/>
</svg>
<div class="area clip">
  <p>Je t'adore à l'égal de la voûte nocturne,<br />
  	Ô vase de tristesse, ô grande taciturne,<br />
  	Et t'aime d'autant plus, belle, que tu me fuis,<br />
  	Et que tu me parais, ornement de mes nuits,<br />
  	Plus ironiquement accumuler les lieues<br />
  	Qui séparent mes bras des immensités bleues.<br />
  	<br />
  	Je m'avance à l'attaque, et je grimpe aux assauts,<br />
  	Comme après un cadavre un chœur de vermisseaux,<br />
  	Et je chéris, ô bête implacable et cruelle !<br />
    Jusqu'à cette froideur par où tu m'es plus belle !</p>
</div>
<div class="area clip">
  <img src="https://blog.foojin.com/content/images/size/w1000/2017/08/banner-large-bis.jpg" alt="Moi-même dans mon bain.">
</div>
<div class="area clip lgbt"></div>
```

{% demo 'Préparation clipping SVG' %}
```css
.area, .svg {
  display: block;
  max-width: 500px;
  height: 250px;
  margin: 2rem auto;
  overflow: hidden;
}
.lgbt {
	background: linear-gradient(
	to bottom,
	#e40303,
	#e40303 16.67%,
	#ff8c00 16.67%,
	#ff8c00 33.33%,
	#ffed00 33.33%,
	#ffed00 50%,
	#008026 50%,
	#008026 66.67%,
	#004dff 66.67%,
	#004dff 83.33%,
	#750787 83.33%,
	#750787
	);
}
```
```html
<svg class="svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 475.528 475.528">
  <path fill="red" d="M237.376,436.245l0.774,0.976c210.94-85.154,292.221-282.553,199.331-367.706
    c-92.899-85.154-199.331,30.953-199.331,30.953h-0.774c0,0-106.44-116.107-199.331-30.953
    C-54.844,154.658,26.437,351.092,237.376,436.245z"/>
</svg>
<div class="area text">
  <p>Je t'adore à l'égal de la voûte nocturne,<br />
		Ô vase de tristesse, ô grande taciturne,<br />
		Et t'aime d'autant plus, belle, que tu me fuis,<br />
		Et que tu me parais, ornement de mes nuits,<br />
		Plus ironiquement accumuler les lieues<br />
		Qui séparent mes bras des immensités bleues.<br />
		<br />
		Je m'avance à l'attaque, et je grimpe aux assauts,<br />
		Comme après un cadavre un chœur de vermisseaux,<br />
		Et je chéris, ô bête implacable et cruelle !<br />
    Jusqu'à cette froideur par où tu m'es plus belle !</p>
</div>
<div class="area img">
	{% image "./img/bath.jpg", "Moi-même dans mon bain" %}
</div>
<div class="area lgbt"></div>
```
{% enddemo %}

Maintenant en retouchant un peu le SVG pour le préparer et un soupçon de CSS…

```svg
<svg xmlns="http://www.w3.org/2000/svg" width="50%" viewBox="0 0 475.528 475.528" aria-hidden="true"
          style="position: absolute; width: 0; height: 0; overflow: hidden;">
  <defs>
    <clipPath id="clip">
      <path transform="scale(.5)" fill="red" d="M237.376,436.245l0.774,0.976c210.94-85.154,292.221-282.553,199.331-367.706
                c-92.899-85.154-199.331,30.953-199.331,30.953h-0.774c0,0-106.44-116.107-199.331-30.953
                C-54.844,154.658,26.437,351.092,237.376,436.245z"/>
    </clipPath>
  </defs>
</svg>
```

Vous pouvez remarquer trois choses ici.  
La première c'est que l'on va cacher ce SVG avec du CSS et `aria-hidden` puisque l'on va s'en servir comme clip mais on ne veut pas qu'il soit visible ou qu'il prenne de la place en dehors de cette usage.  
La deuxième c'est que l'on va spécifiquement définir ce tracé en tant que tracé de clip en le mettant dans un élément `<clipPath>`.  
La troisième c'est qu'on va un peu réduire sa taille de moitié avec un `transform="scale(.5)` mais c'est purement cosmétique ici.

Puis on ajoute le clipping…

```css
  .area {
    clip-path: url(#clip);
  }
```

Rien de foufou pour le CSS, ici on va seulement donner l'`id` ou plutôt l'ancre du `clipPath` défini. Si le SVG avait été externe on aurait donc écrit à la place :

```css
  .area {
    clip-path: url(svg/mon-clip.svg#clip);
  }
```
    

Et on obtient ce qui suit.

{% demo 'Clipping SVG' %}
```css
.area, .svg {
  display: block;
  max-width: 500px;
  height: 250px;
  margin: 2rem auto;
  overflow: hidden;
}
img {
	width: 100%;
	height: auto;
}
.lgbt {
	background: linear-gradient(
	to bottom,
	#e40303,
	#e40303 16.67%,
	#ff8c00 16.67%,
	#ff8c00 33.33%,
	#ffed00 33.33%,
	#ffed00 50%,
	#008026 50%,
	#008026 66.67%,
	#004dff 66.67%,
	#004dff 83.33%,
	#750787 83.33%,
	#750787
	);
}
.clip {
  clip-path: url(#clip);
}
```
```html
<svg
	xmlns="http://www.w3.org/2000/svg" width="50%" viewBox="0 0 475.528 475.528" aria-hidden="true"
  style="position: absolute; width: 0; height: 0; overflow: hidden;">
  <defs>
    <clipPath id="clip">
      <path transform="scale(.5)" fill="red" d="M237.376,436.245l0.774,0.976c210.94-85.154,292.221-282.553,199.331-367.706
                c-92.899-85.154-199.331,30.953-199.331,30.953h-0.774c0,0-106.44-116.107-199.331-30.953
                C-54.844,154.658,26.437,351.092,237.376,436.245z"/>
    </clipPath>
  </defs>
</svg>
<div class="area clip">
    <p>Je t'adore à l'égal de la voûte nocturne,<br />
		Ô vase de tristesse, ô grande taciturne,<br />
		Et t'aime d'autant plus, belle, que tu me fuis,<br />
		Et que tu me parais, ornement de mes nuits,<br />
		Plus ironiquement accumuler les lieues<br />
		Qui séparent mes bras des immensités bleues.<br />
		<br />
		Je m'avance à l'attaque, et je grimpe aux assauts,<br />
		Comme après un cadavre un chœur de vermisseaux,<br />
		Et je chéris, ô bête implacable et cruelle !<br />
    Jusqu'à cette froideur par où tu m'es plus belle !</p>
</div>
<div class="area clip">
  {% image "./img/bath.jpg", "Moi-même dans mon bain", '500' %}
</div>
<div class="area clip lgbt"></div>
```
{% enddemo %}

### Le Responsive

L'un des intérêts majeurs du SVG par rapport aux images bitmap est que, comme il s'agit de vectoriel, il répond très bien aux changements de taille. Qu'il soit rétréci ou agrandi le SVG restera propre et non pixélisé. Un petit bémol toutefois, si vous rétrécissez fortement votre SVG vous pourriez avoir un rendu des tracés un peu trop gros ou non proportionnels mais ça pourra être prévu en amont.

Mais ce n'est pas ce dont nous allons parler. À la place nous allons voir ce qu'on peut faire avec un SVG et une *Media Query*.

De toute évidence on pourrait juste changer la taille du SVG selon la taille du viewport mais ce serait franchement pas drôle.  
À la place on va carrément changer le dessin en fonction de la taille de l'écran.

Pour ça il nous un peu de CSS et un SVG avec plusieurs tracés.

On va donc dès le départ cacher un tracé pendant que l'autre reste en place et selon la taille de l'écran on inversera ça.

```css
.rwd-svg {
  display: block;
  width: 20rem;
  height: 20rem;
  margin: 2rem auto;
}
.full {display: none;}
.broken {display: block;}
@media screen and (min-width: 64em) {
  .full {display: block;}
  .broken {display: none;}
}
```

Puis un SVG avec nos deux `path` que je peux distinguer grâce aux classes `full` et `broken`.

```xml
  <svg class="rwd-svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 475.528 475.528">
    <path class="full" fill="red" d="M237.376,436.245l0.774,0.976c210.94-85.154,292.221-282.553,199.331-367.706
    c-92.899-85.154-199.331,30.953-199.331,30.953h-0.774c0,0-106.44-116.107-199.331-30.953
    C-54.844,154.658,26.437,351.092,237.376,436.245z"/>
    <path transform="scale(2.5)" class="broken" fill="red" d="M158.513,18.41c-20.862-11.524-48.007-7.782-64.96,8.604C76.693,10.741,49.215,6.951,28.564,18.41
		C10.954,28.098,0,46.6,0,66.752c0,5.742,0.922,11.46,2.618,16.499c8.93,40.155,84.825,88.229,88.049,90.244l2.886,1.827
		l2.887-1.827c3.239-2.009,79.074-50.059,87.928-89.721c1.766-5.449,2.691-11.173,2.691-17.016
		C187.059,46.6,176.123,28.068,158.513,18.41z M13.076,80.382c-1.486-4.479-2.213-9.048-2.213-13.637
		c0-16.182,8.778-31.045,22.95-38.852c6.509-3.604,13.923-5.52,21.394-5.52c12.65,0,24.466,5.456,32.873,14.827L71.782,69.815
		c-0.801,1.565-0.767,3.416,0.049,4.95c0.792,1.532,2.302,2.594,4.028,2.862l21.884,3.124l-19.61,22.993
		c-1.032,1.218-1.483,2.807-1.215,4.366c0.238,1.564,1.148,2.94,2.481,3.763l20.304,12.58l-9.584,35.664
		C72.266,148.097,19.796,110.613,13.076,80.382z M173.906,80.894c-6.04,27.088-50.162,60.645-71.56,75.576l8.866-33.102
		c0.608-2.301-0.341-4.768-2.387-6.004l-18.344-11.387L112.381,80.3c1.267-1.501,1.645-3.599,0.943-5.425
		c-0.7-1.857-2.362-3.178-4.305-3.471L84.819,67.96l15.835-31.654c0.049-0.106-0.024-0.213,0.024-0.326
		c13.651-13.679,35.5-17.528,52.604-8.099c14.158,7.779,22.95,22.688,22.95,38.858C176.208,71.435,175.49,76.01,173.906,80.894z
		 M166.721,66.752c0,3.654-0.585,7.228-1.718,10.668c-0.365,1.142-1.425,1.851-2.569,1.851c-0.292,0-0.584-0.024-0.84-0.131
		c-1.425-0.478-2.205-2.012-1.718-3.422c0.95-2.886,1.449-5.897,1.449-8.966c0-10.75-5.821-20.627-15.198-25.791
		c-4.487-2.469-9.268-3.702-14.273-3.702c-1.51,0-2.709-1.19-2.709-2.713s1.188-2.7,2.709-2.7c5.932,0,11.588,1.446,16.867,4.332
		C159.852,42.34,166.721,54.038,166.721,66.752z"/>
  </svg>
```

**Et voilà !** Redimensionnez donc la fenêtre de votre navigateur jusqu'à être inférieur à 1024px pour voir la forme changer. Notez que si vous lisez ce billet sur un téléphone ou sur une petite tablette vous n'allez pas pouvoir voir le résultat. Réessayez sur un plus grand écran à la maison ou chez vos voisins plus tard dans ce cas.

<style>
  .rwd-svg {
		display: block;
  	width: 20rem;
    height: 20rem;
    margin: 2rem auto;
  }
  .full {display: none;}
  .broken {display: block;}
  @media screen and (min-width: 64em) {
    .full {display: block;}
    .broken {display: none;}
  }
</style>
<svg class="rwd-svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 475.528 475.528">
  <path class="full" fill="red" d="M237.376,436.245l0.774,0.976c210.94-85.154,292.221-282.553,199.331-367.706
                      c-92.899-85.154-199.331,30.953-199.331,30.953h-0.774c0,0-106.44-116.107-199.331-30.953
                      C-54.844,154.658,26.437,351.092,237.376,436.245z"/>
  <path transform="scale(2.5)" class="broken" fill="red" d="M158.513,18.41c-20.862-11.524-48.007-7.782-64.96,8.604C76.693,10.741,49.215,6.951,28.564,18.41
	C10.954,28.098,0,46.6,0,66.752c0,5.742,0.922,11.46,2.618,16.499c8.93,40.155,84.825,88.229,88.049,90.244l2.886,1.827
	l2.887-1.827c3.239-2.009,79.074-50.059,87.928-89.721c1.766-5.449,2.691-11.173,2.691-17.016
	C187.059,46.6,176.123,28.068,158.513,18.41z M13.076,80.382c-1.486-4.479-2.213-9.048-2.213-13.637
	c0-16.182,8.778-31.045,22.95-38.852c6.509-3.604,13.923-5.52,21.394-5.52c12.65,0,24.466,5.456,32.873,14.827L71.782,69.815
	c-0.801,1.565-0.767,3.416,0.049,4.95c0.792,1.532,2.302,2.594,4.028,2.862l21.884,3.124l-19.61,22.993
	c-1.032,1.218-1.483,2.807-1.215,4.366c0.238,1.564,1.148,2.94,2.481,3.763l20.304,12.58l-9.584,35.664
	C72.266,148.097,19.796,110.613,13.076,80.382z M173.906,80.894c-6.04,27.088-50.162,60.645-71.56,75.576l8.866-33.102
	c0.608-2.301-0.341-4.768-2.387-6.004l-18.344-11.387L112.381,80.3c1.267-1.501,1.645-3.599,0.943-5.425
	c-0.7-1.857-2.362-3.178-4.305-3.471L84.819,67.96l15.835-31.654c0.049-0.106-0.024-0.213,0.024-0.326
	c13.651-13.679,35.5-17.528,52.604-8.099c14.158,7.779,22.95,22.688,22.95,38.858C176.208,71.435,175.49,76.01,173.906,80.894z
	 M166.721,66.752c0,3.654-0.585,7.228-1.718,10.668c-0.365,1.142-1.425,1.851-2.569,1.851c-0.292,0-0.584-0.024-0.84-0.131
	c-1.425-0.478-2.205-2.012-1.718-3.422c0.95-2.886,1.449-5.897,1.449-8.966c0-10.75-5.821-20.627-15.198-25.791
	c-4.487-2.469-9.268-3.702-14.273-3.702c-1.51,0-2.709-1.19-2.709-2.713s1.188-2.7,2.709-2.7c5.932,0,11.588,1.446,16.867,4.332
	C159.852,42.34,166.721,54.038,166.721,66.752z"/>
</svg>

## Interagir avec un SVG depuis le SVG lui-même

Tout ce que l'on a vu jusque là peut aussi être mis directement dans le SVG ce qui peut avoir plusieurs intérêts. Notamment de s'assurer que les CSS et JS propres au SVG seront toujours embarqué avec ce dernier. Particulièrement pratique si ce SVG est appelé sur plusieurs pages ou même plusieurs autres sites.

C'est en soi très pratique cependant on pourrait objecter en disant que c'est bien mignon tout ça mais l'auteur du SVG n'aura pas forcément la main sur la façon dont sera intégré son œuvre, ce qui n'est pas faux. Ceci étant, à titre de rappel, si le SVG est chargé via une balise `img` par exemple, les CSS embarqués n'écouteront certes pas la page **mais** afficheront néanmoins la première frame de ce SVG ce qui permet donc d'envisager un rendu fallback. Au moins ça n'aura pas l'air cassé.

Par exemple, j'ai repris mon petit cœur sur lequel j'ai ajouté quelques petits détails.

```xml
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 475.528 475.528">
  <style>/* <![CDATA[ */
    :root {
      --hue: 348;
    }
    path {
      fill: hsl(var(--hue), 83%, 35%);
      transform-origin: center;
      transform: scale(1);
      transition: all ease-in 300ms;
    }
    path:hover {
      fill: hsl(var(--hue), 83%, 47%);
      transform: scale(.9);
    }
  /* ]]> */</style>
  <path id="heart" d="M237.376,436.245l0.774,0.976c210.94-85.154,292.221-282.553,199.331-367.706
    c-92.899-85.154-199.331,30.953-199.331,30.953h-0.774c0,0-106.44-116.107-199.331-30.953
    C-54.844,154.658,26.437,351.092,237.376,436.245z"/>
  <script>/* <![CDATA[ */
    const heart = document.getElementById('heart');
    function clickHandler() {
      heart.style.setProperty('--hue', Math.random() * 360);
    }
    heart.addEventListener('click', clickHandler);
  /* ]]> */</script>
</svg>
```

Vous pouvez remarquer que les styles CSS ou même le JavaScript sont encapsulés dans des "balises" `CDATA` pour la simple et bonne raison qu'en temps normal, dans un SVG, seuls sont attendus des balises formatées à la XML et, jusqu'à preuve du contraire, ni CSS ni JS ne le sont. Du coup, si on veut qu'ils soient interprétés comme ce qu'ils sont on doit les encapsuler dans du `CDATA`.

Bref, j'ai ajouté des petits styles au hover qui change couleur et taille et un `addEventListener` sur le tracé pour carrément changer la base de couleur au hasard.

Et voici le SVG en question… dans une balise `img`. Pas de hover ni d'événement au click, comme vous pouvez le constater mais le cœur est rouge car on a prévu le coup et le style par défaut contient une couleur de base.

![](img/svg-animation.svg)

Par contre, si on met le même fichier dans une balise `object`… tout fonctionne comme prévu. Passez donc votre souris dessus et cliquez sans parcimonie !

<object type="image/svg+xml" data="img/svg-animation.svg">
  Un cœur gros comme ça.
</object>

Bon j'ai surtout fait des exemples simples parce que je suis plus un codeur qu'un designer mais ça devrait vous montrer que la vraie limite concernant SVG et CSS est surtout notre imagination. 😉

{% raw %}
<script>
  const iframes = document.querySelectorAll("iframe");  
  iframes.forEach(item => {
  	item.onload = function(){
  		item.style.height = item.contentWindow.document.documentElement.scrollHeight
 + 'px';
 		};
  });
</script>
{% endraw %}
