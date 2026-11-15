/* =========================================================
   Gîte la Schlitte — script commun à toutes les pages
   (menu mobile, apparitions au scroll, visionneuse photo,
    carte Google à la demande, agenda adapté au mobile)
   ========================================================= */
(function () {
    'use strict';

    // Signale au CSS que le JS fonctionne (sinon rien n'est masqué)
    document.documentElement.classList.add('js');

    /* ---------- Menu mobile ---------- */
    var toggle = document.getElementById('nav-toggle');
    var menu = document.getElementById('nav-menu');

    function setMenu(ouvert) {
        menu.classList.toggle('is-open', ouvert);
        document.body.classList.toggle('menu-ouvert', ouvert);
        toggle.setAttribute('aria-expanded', String(ouvert));
        toggle.setAttribute('aria-label', ouvert ? 'Fermer le menu' : 'Ouvrir le menu');
    }

    if (toggle && menu) {
        toggle.addEventListener('click', function () {
            setMenu(!menu.classList.contains('is-open'));
        });
        menu.addEventListener('click', function (e) {
            if (e.target.closest('a')) setMenu(false);
        });
        document.addEventListener('keydown', function (e) {
            if (e.key === 'Escape') setMenu(false);
        });
        document.addEventListener('click', function (e) {
            if (menu.classList.contains('is-open') && !menu.contains(e.target) && !toggle.contains(e.target)) {
                setMenu(false);
            }
        });
        window.matchMedia('(min-width: 961px)').addEventListener('change', function (e) {
            if (e.matches) setMenu(false);
        });
    }

    /* ---------- Apparition au scroll (un seul observer pour tout le site) ---------- */
    var items = document.querySelectorAll('.reveal');
    if ('IntersectionObserver' in window) {
        var observer = new IntersectionObserver(function (entries, obs) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                    obs.unobserve(entry.target);
                }
            });
        }, { threshold: 0.15 });
        items.forEach(function (el) { observer.observe(el); });
    } else {
        items.forEach(function (el) { el.classList.add('is-visible'); });
    }

    /* ---------- Carte Google : chargée seulement au clic ---------- */
    document.querySelectorAll('[data-carte]').forEach(function (zone) {
        var bouton = zone.querySelector('button');
        if (!bouton) return;
        bouton.addEventListener('click', function () {
            var iframe = document.createElement('iframe');
            iframe.src = zone.dataset.carte;
            iframe.title = 'Carte : emplacement du gîte la Schlitte à La Bresse';
            iframe.loading = 'lazy';
            iframe.referrerPolicy = 'no-referrer-when-downgrade';
            zone.textContent = '';
            zone.appendChild(iframe);
        });
    });

    /* ---------- Agenda Google : vue « liste » sur téléphone ---------- */
    var agenda = document.getElementById('agenda');
    if (agenda && agenda.dataset.src) {
        var src = agenda.dataset.src;
        agenda.src = src;
    }

    /* ---------- Visionneuse de photos (page Le Gîte) ---------- */
    var lightbox = document.getElementById('lightbox');
    var photos = Array.prototype.slice.call(document.querySelectorAll('.photo'));

    if (lightbox && photos.length) {
        var img = lightbox.querySelector('img');
        var legende = lightbox.querySelector('figcaption');
        var courante = 0;

        var afficher = function (i) {
            courante = (i + photos.length) % photos.length;
            var source = photos[courante].querySelector('img');
            img.src = source.currentSrc || source.src;
            img.alt = source.alt;
            legende.textContent = photos[courante].dataset.legende || '';
        };

        photos.forEach(function (bouton, i) {
            bouton.addEventListener('click', function () {
                afficher(i);
                lightbox.showModal();
            });
        });
        lightbox.querySelector('.lightbox__fermer').addEventListener('click', function () { lightbox.close(); });
        lightbox.querySelector('.lightbox__prec').addEventListener('click', function () { afficher(courante - 1); });
        lightbox.querySelector('.lightbox__suiv').addEventListener('click', function () { afficher(courante + 1); });
        lightbox.addEventListener('click', function (e) { if (e.target === lightbox) lightbox.close(); });
        lightbox.addEventListener('keydown', function (e) {
            if (e.key === 'ArrowLeft') afficher(courante - 1);
            if (e.key === 'ArrowRight') afficher(courante + 1);
        });
    }

    /* ---------- Année du copyright ---------- */
    document.querySelectorAll('[data-annee]').forEach(function (el) {
        el.textContent = new Date().getFullYear();
    });
})();
