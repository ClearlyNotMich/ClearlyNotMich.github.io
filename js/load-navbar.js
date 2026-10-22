document.addEventListener('DOMContentLoaded', () => {
    const navbarContainer = document.getElementById('navbar-container');
    if (!navbarContainer) return;

    return fetch('../components/navbar.html')
        .then(response => {
            if (!response.ok) throw new Error('Navigation request failed');
            return response.text();
        })
        .then(data => {
            navbarContainer.innerHTML = data;
        })
        .catch(() => {
            // Keep a usable route home if the shared navigation cannot load.
            const navigation = document.createElement('nav');
            navigation.setAttribute('aria-label', 'Main navigation');
            const message = document.createElement('p');
            message.setAttribute('role', 'status');
            message.textContent = 'Navigation could not be loaded. ';
            const home = document.createElement('a');
            home.href = '../index.html';
            home.textContent = 'Home';
            message.appendChild(home);
            navigation.appendChild(message);
            navbarContainer.innerHTML = '';
            navbarContainer.appendChild(navigation);
        });
});
