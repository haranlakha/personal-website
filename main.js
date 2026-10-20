(function () {
    var USER = 'haranlakha';
    var dropdown = document.getElementById('repo-dropdown');

    function render(repos) {
        dropdown.innerHTML = '';
        if (!repos.length) {
            dropdown.innerHTML = '<span class="repo-status">No public repositories yet.</span>';
            return;
        }
        repos.forEach(function (repo) {
            var a = document.createElement('a');
            a.href = repo.html_url;
            a.className = 'repo-item';
            a.target = '_blank';
            a.rel = 'noopener';

            var name = document.createElement('span');
            name.className = 'repo-name';
            name.textContent = repo.name;
            a.appendChild(name);

            if (repo.description) {
                var desc = document.createElement('span');
                desc.className = 'repo-desc';
                desc.textContent = repo.description;
                a.appendChild(desc);
            }
            dropdown.appendChild(a);
        });
    }

    fetch('https://api.github.com/users/' + USER + '/repos?sort=updated&per_page=100')
        .then(function (res) {
            if (!res.ok) throw new Error('GitHub API error ' + res.status);
            return res.json();
        })
        .then(function (repos) {
            render(repos.filter(function (r) { return !r.fork; }));
        })
        .catch(function () {
            dropdown.innerHTML = '<span class="repo-status">Couldn\'t load repositories right now. Try again later.</span>';
        });
})();

// Touch / small screens: tap to open instead of hover
(function () {
    var mobile = window.matchMedia('(max-width: 700px), (hover: none)');
    var items = document.querySelectorAll('.menu-item');
    var portfolio = document.querySelector('.portfolio-wrap');

    function closeSubmenus() {
        items.forEach(function (i) { i.classList.remove('exp-open'); });
        if (portfolio) portfolio.classList.remove('open');
    }

    document.querySelectorAll('.hover-trigger').forEach(function (trigger) {
        trigger.addEventListener('click', function () {
            if (!mobile.matches) return;
            var item = trigger.closest('.menu-item');
            var willOpen = !item.classList.contains('open');
            items.forEach(function (i) { i.classList.remove('open'); });
            closeSubmenus();
            if (willOpen) item.classList.add('open');
        });
    });

    var expLink = document.querySelector('.experience-link');
    if (expLink) {
        expLink.addEventListener('click', function (e) {
            if (!mobile.matches) return;
            e.preventDefault();
            var item = expLink.closest('.menu-item');
            var willOpen = !item.classList.contains('exp-open');
            closeSubmenus();
            if (willOpen) item.classList.add('exp-open');
        });
    }

    var portLink = document.querySelector('.portfolio-link');
    if (portLink && portfolio) {
        portLink.addEventListener('click', function (e) {
            if (!mobile.matches) return;
            // Tap toggles the repo list (never follows the link on mobile)
            e.preventDefault();
            var willOpen = !portfolio.classList.contains('open');
            closeSubmenus();
            if (willOpen) portfolio.classList.add('open');
        });
    }
})();