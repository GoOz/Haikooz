---
title: Déception d'une compatibilité illusoire
date: 2024-04-05
featured: img/featured.jpg
featured_author: Lukas Bachofner
featured_url: lukasbachofnerfoto
tags:
  - notes
---

**En vrac**

---

J'aime pas trop la pub. J'apprécie pas trop Instagram non plus mais force est d'admettre que c'est encore une plateforme où les photographes trainent alors j'y suis aussi.

Mais je me suis dit que j'allais payer l'abonnement sans pub, parce que je peux me le permettre et parce que j'ai vraiment pas envie que **Meta** me suce mes données personnelles.

Enfin ça c'était le plan.

J'avais réussi à m'abonner il y a quelques mois déjà, non sans mal mais j'ai arrêté l'abonnement suite à leur changement tarifaire qui consiste à te faire payer pour chaque compte Facebook + Instagram d'un même compte Meta. Autant Instagram j'utilise mais Facebook pas vraiment alors j'allais pas payer pour ça.

Bref nous voici donc maintenant où quand je me connecte à Instagram il me dit qu'il faut que je prenne une décision de nouveau à propos de mes données personnelles.

Je décide donc de m'abonner de nouveau (maintenant que j'ai bien séparé mes comptes Facebook et Instagram) en passant par _instagram.com_.

Petit problème cependant dans le tunnel de paiement, c'est que Instagram n'autorise pas les sites à l'intégrer dans une iframe… même si le site en question est Instagram lui-même…

{% image "./img/iframe.png", "Firefox ne peut ouvrir cette page" %}

Impossible d'aller au bout du tunnel de paiement donc. Évidemment le problème est le même quelque soit le navigateur utilisé.

Je me laisse pas faire pour autant. J'accepte donc le compte en "gratuit avec publicité", ce qui me permet d'enfin afficher Instagram normalement et ensuite d'aller dans les paramètres de mon compte Meta.

Une fois là-bas, n'étant plus du tout dans le même environnement, je me dis que ça pouvait passer puisque c'était le même genre de problème que j'avais eu la première fois.

Et bingpot ! Ça fonctionne ! Je peux enfin payer !

Je valide le paiement auprès de ma banque et ça me dit bien que la banque valide et que ça va revenir sur le site Meta. Et BIM page blanche…

{% image "./img/redirect.png", "Page de redirection blanche" %}

En regardant le code, je vois qu'il y a un `<form>` censé être soumis au `onload` mais manifestement rien ne se passe et pas d'erreur dans la console.

À ce moment-là, je ne sais toujours pas si mon paiement est passé ou pas.
Et quand je vais voir le statut de mon compte, il est toujours marqué comme étant "Gratuit avec publicité".

Bref, j'ai signalé un problème auprès de Meta mais je ne sais toujours pas si mon paiement est passé ou non.

J'ai bien compris qu'ils étaient forts question monétisation des données personnelles mais manifestement, là où tous les autres maitrisent les tunnels de paiement avec du vrai argent, eux sont clairement à la ramasse et ne savent pas faire du tout.

Si j'étais cynique je dirais qu'ils ont tellement pas envie que les gens payent qu'ils ne testent même pas cette fonctionnalité proprement et s'en battent un peu les roubignoles.

Mais je ne suis pas cynique, oh non. 🙃

---

J'ai réessayé quelques jours plus tard toujours sans succès et puis j'ai eu une épiphanie…

J'ai essayé avec un autre navigateur, Chrome en l'occurrence, et ça a marché.

Une partie de moi est soulagé que ce soit fini et que j'ai plus à me taper des pubs sans fin mais une autre est sévèrement outré qu'une fonctionnalité aussi importante sur un site si gros ne fonctionne pas sur Firefox.

Il serait vain de vous exposer à quel point j'ai envie de casser des trucs… mais vous avez l'idée.
