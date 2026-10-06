# Site restaurant – structure

| Fichier | Rôle |
|---|---|
| `index.html` | Structure de la page |
| `css/style.css` | Design |
| `js/main.js` | Lit `content/site.json` et construit la page |
| `content/site.json` | **Tout le contenu** (textes, carte, photos, horaires) |
| `images/uploads/` | Photos envoyées depuis l'admin |
| `admin/index.html` | Charge Decap CMS (page `/admin`) |
| `admin/config.yml` | Définit les champs modifiables (aucun obligatoire) |
| `admin/preview.js` | Prévisualisation en direct dans l'admin |

## Mise en ligne
1. Push sur GitHub (branche `main`)
2. Netlify → Import from Git (pas de build command, publish directory = `/`)
3. Netlify → Identity → Enable (Registration : Invite only) → Services → Git Gateway → Enable
4. Identity → Invite users → email du responsable
5. Le responsable accepte l'invitation puis va sur `tonsite.netlify.app/admin`
