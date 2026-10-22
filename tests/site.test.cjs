const assert = require('node:assert/strict');
const { readFileSync } = require('node:fs');
const path = require('node:path');
const test = require('node:test');
const vm = require('node:vm');

class Element {
  constructor(tagName = 'div') {
    this.tagName = tagName;
    this.children = [];
    this.attributes = {};
    this.listeners = {};
    this.style = {};
    this.classes = new Set();
    this.classList = { add: value => this.classes.add(value) };
    this.textContent = '';
  }
  set innerHTML(value) { this.html = value; this.children = []; }
  get innerHTML() { return this.html || ''; }
  setAttribute(name, value) { this.attributes[name] = value; }
  getAttribute(name) { return this.attributes[name]; }
  appendChild(child) { this.children.push(child); }
  addEventListener(name, callback) { this.listeners[name] = callback; }
}

function loadScript(filename, { ids = {}, selectors = {}, fetch } = {}) {
  const events = {};
  const observers = [];
  const document = {
    addEventListener: (name, callback) => { events[name] = callback; },
    getElementById: id => ids[id] || null,
    querySelectorAll: selector => selectors[selector] || [],
    createElement: tag => new Element(tag),
  };
  class IntersectionObserver {
    constructor(callback) { this.callback = callback; this.elements = []; observers.push(this); }
    observe(element) { this.elements.push(element); }
  }
  const source = readFileSync(path.join(__dirname, '..', 'js', filename), 'utf8');
  vm.runInNewContext(source, { document, IntersectionObserver, fetch }, { filename });
  return { ready: events.DOMContentLoaded, observers };
}

test('a page without a gallery still sets up reveal and skill animations', () => {
  const reveal = new Element();
  const bar = new Element();
  bar.setAttribute('data-skill', '80');
  const page = loadScript('main.js', { selectors: { '.reveal': [reveal], '.bar': [bar] } });
  assert.doesNotThrow(() => page.ready());
  assert.deepEqual(page.observers[0].elements, [reveal]);
  assert.deepEqual(page.observers[1].elements, [bar]);
  page.observers[0].callback([{ isIntersecting: true, target: reveal }]);
  page.observers[1].callback([{ isIntersecting: true, target: bar }]);
  assert.ok(reveal.classes.has('active'));
  assert.equal(bar.style.width, '80%');
});

test('an incomplete gallery is skipped without attaching broken controls', () => {
  const carousel = new Element();
  const nextBtn = new Element('button');
  const page = loadScript('main.js', { ids: { carousel, nextBtn } });
  assert.doesNotThrow(() => page.ready());
  assert.equal(carousel.children.length, 0);
  assert.equal(nextBtn.listeners.click, undefined);
});

test('the gallery loads its seven media items and both controls wrap', () => {
  const ids = { carousel: new Element(), prevBtn: new Element('button'), nextBtn: new Element('button') };
  loadScript('main.js', { ids }).ready();
  assert.equal(ids.carousel.children.length, 7);
  assert.equal(ids.carousel.children.filter(child => child.tagName === 'img').length, 5);
  assert.equal(ids.carousel.children.filter(child => child.tagName === 'video').length, 2);
  assert.equal(ids.carousel.children[0].src, '../assets/projects/project1.jpg');
  assert.equal(ids.carousel.style.transform, 'translateX(0%)');
  ids.nextBtn.listeners.click();
  assert.equal(ids.carousel.style.transform, 'translateX(-100%)');
  for (let index = 0; index < 6; index++) ids.nextBtn.listeners.click();
  assert.equal(ids.carousel.style.transform, 'translateX(0%)');
  ids.prevBtn.listeners.click();
  assert.equal(ids.carousel.style.transform, 'translateX(-600%)');
});

test('the navigation loader inserts a successful same-site response', async () => {
  const container = new Element();
  const requests = [];
  const page = loadScript('load-navbar.js', {
    ids: { 'navbar-container': container },
    fetch: async url => {
      requests.push(url);
      return { ok: true, text: async () => '<nav>Site navigation</nav>' };
    },
  });
  await page.ready();
  assert.deepEqual(requests, ['../components/navbar.html']);
  assert.equal(container.innerHTML, '<nav>Site navigation</nav>');
});

for (const failure of ['HTTP error', 'network rejection']) {
  test(`navigation ${failure} gives an accessible Home fallback`, async () => {
    const container = new Element();
    let errorBodyRead = false;
    const page = loadScript('load-navbar.js', {
      ids: { 'navbar-container': container },
      fetch: async () => {
        if (failure === 'network rejection') throw new Error('Offline');
        return { ok: false, text: async () => { errorBodyRead = true; return '<h1>Error page</h1>'; } };
      },
    });
    await page.ready();
    assert.equal(errorBodyRead, false);
    assert.equal(container.innerHTML, '');
    const navigation = container.children[0];
    assert.equal(navigation.tagName, 'nav');
    assert.equal(navigation.getAttribute('aria-label'), 'Main navigation');
    const message = navigation.children[0];
    assert.equal(message.getAttribute('role'), 'status');
    assert.match(message.textContent, /Navigation could not be loaded/);
    assert.equal(message.children[0].textContent, 'Home');
    assert.equal(message.children[0].href, '../index.html');
  });
}

test('a page without a navigation container makes no request', () => {
  let requested = false;
  const page = loadScript('load-navbar.js', { fetch: () => { requested = true; } });
  page.ready();
  assert.equal(requested, false);
});
