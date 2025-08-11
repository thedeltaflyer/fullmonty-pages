// JavaScript source code

const SHEET_CSV_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vSWA0cohQEmwx6KHWzzdDpsSCw6LNg8LLwEE1eftKKSqycOOCWidYITkFOVDpmJ1meNcvSwE4-pzWr_/pub?gid=3600704&single=true&output=csv';
const TAP_FIELDS =['Available','Tap Number','Type','Maker','Name','Style','ABV','Description','Price Info','Logo','Countries','Maker_JP','Name_JP','Description_JP','Standard Price Note']

class TapItem {
    constructor(tapItem) {
        this.Available = String(tapItem['Available'] || '').trim();
        this.Tap_Number = String(tapItem['Tap Number'] || '').trim();
        this.Type = String(tapItem['Type'] || '').trim();
        this.Maker = String(tapItem['Maker'] || '').trim();
        this.Name = String(tapItem['Name'] || '').trim();
        this.Style = String(tapItem['Style'] || '').trim();
        this.ABV = String(tapItem['ABV'] || '').trim();
        this.Description = String(tapItem['Description'] || '').trim();
        this.Price_Info = String(tapItem['Price Info'] || '').trim();
        this.Logo = String(tapItem['Logo'] || '').trim();
        this.Countries = String(tapItem['Countrie'] || tapItem['Countries'] || '').trim();
        this.Maker_JP = String(tapItem['Maker_JP'] || '').trim();
        this.Maker_JP = String(tapItem['Name_JP'] || '').trim();
        this.Available = String(tapItem['Available'] || '').trim();
        this.Description_JP = String(tapItem['Description_JP'] || '').trim();
        this.Standard_Price_Note = String(tapItem['Standard Price Note'] || '').trim();
    }

    Available;
    Tap_Number;
    Type;
    Maker;
    Name;
    Style;
    ABV;
    Description;
    Price_Info;
    Logo;
    Countries;
    Maker_JP;
    Name_JP;
    Description_JP;
    Standard_Price_Note;

    /**
     * @returns {DocumentFragment}
     */
    getLogoElement() {
        if (this.Logo) return make('div', { class: 'tap-logo' }, make('img', { src: this.Logo, alt: `${this.Name} logo`, loading: 'lazy' }));
        if (/perry/i.test(this.Type)) return make('div', { class: 'tap-logo', ariaLabel: 'Perry' }, '🍐');
        if (/cider/i.test(this.Type)) return make('div', { class: 'tap-logo', ariaLabel: 'Cider' }, '🍎');
        return make('div', { class: 'tap-logo', ariaLabel: 'Beer' }, '🍺');
    }

    /**
     * @returns {DocumentFragment}
     */
    renderFlagBadges() {
        if (!this.Countries) return make('span');
        const codes = String(this.Countries).split(',').map(c => c.trim().toUpperCase()).filter(Boolean);
        return make('span', { class: 'flags' }, codes.map(code =>
            make('span', { class: 'flag-badge', ariaLabel: `${code} flag` }, flagEmoji(code))
        ));
    }

    /**
     * 
     * @param {string} defaultPriceNote
     * @returns
     */
    renderTapItem(defaultPriceNote) {
        const price = this.Price_Info || defaultPriceNote || '';
        const countries = this.renderFlagBadges()
        const number = this.Tap_Number && make('div', { class: 'tap-number' }, this.Tap_Number);

        const card = make('article', { class: 'tap-item', role: 'listitem' }, [
            make('div', { class: 'tap-col' }, [
                number,
                make('div', { class: 'tap-countries' }, countries),
                this.getLogoElement(),
                make('div', { class: 'tap-details' }, [
                    make('div', { class: 'tap-fullname' }, [
                        make('span', { class: 'tap-maker', style: (this.Maker == '' ? 'display: none' : '') }, this.Maker),
                        make('span', { style: ([this.Maker, this.Name].includes('') ? 'display: none' : '') }, ' • '),
                        make('span', { class: 'tap-name', style: (this.Name == '' ? 'display: none' : '') }, this.Name),
                    ]),
                    make('div', { class: 'meta-row' }, [
                        make('span', { class: 'tap-style' }, this.Style),
                        make('span', { class: 'tap-abv' }, this.ABV ? `ABV: ${this.ABV}%` : ''),
                    ]),
                    make('p', { class: 'tap-description' }, this.Description),
                ]),
            ]),
            make('div', { class: 'tap-price' }),
        ]);

        const priceHost = card.querySelector('.tap-price');
        priceHost.append(highlightYen(price));
        return card;
    }

}

const memo = (fn) => { const cache = new Map(); return (k) => cache.has(k) ? cache.get(k) : (cache.set(k, fn(k)), cache.get(k)); };

const flagEmoji = memo((code) => {
    if (!code) return '';
    const map = {
        ENGLAND: '\uD83C\uDFF4\uDB40\uDC67\uDB40\uDC62\uDB40\uDC65\uDB40\uDC6E\uDB40\uDC67\uDB40\uDC7F',
        SCOTLAND: '\uD83C\uDFF4\uDB40\uDC67\uDB40\uDC62\uDB40\uDC73\uDB40\uDC63\uDB40\uDC74\uDB40\uDC7F',
        WALES: '\uD83C\uDFF4\uDB40\uDC67\uDB40\uDC62\uDB40\uDC77\uDB40\uDC6C\uDB40\uDC73\uDB40\uDC7F'
    };
    const upper = code.trim().toUpperCase();
    if (map[upper]) return map[upper];
    const OFFSET = 127397;
    return [...upper].map(c => String.fromCodePoint(c.charCodeAt(0) + OFFSET)).join('');
});

/**
 * 
 * @param {any} tag
 * @param {any} props
 * @param {any} children
 * @returns {DocumentFragment}
 */
const make = (tag, props = {}, children = []) => {
    const el = document.createElement(tag);
    for (const [k, v] of Object.entries(props)) {
        if (k === 'class') el.className = v;
        else if (k === 'dataset') Object.assign(el.dataset, v);
        else if (k === 'style' && typeof v === 'object') Object.assign(el.style, v);
        else if (k.startsWith('on') && typeof v === 'function') el.addEventListener(k.slice(2), v);
        else if (k === 'text') el.textContent = v;
        else el.setAttribute(k, v);
    }
    const appendChild = (c) => {
        if (c == null) return;
        if (c instanceof Node || c instanceof DocumentFragment) { el.append(c); return; }
        if (typeof c[Symbol.iterator] === 'function' && !(typeof c === 'string')) {
            for (const sub of c) appendChild(sub);
            return;
        }
        el.append(document.createTextNode(String(c)));
    };
    appendChild(children);
    return el;
};

const byId = (id) => document.getElementById(id);

/**
 * @param {String} price
 * @returns {DocumentFragment}
 */
function highlightYen(price) {
    const frag = document.createDocumentFragment();
    const regex = /(¥\d+[\d,]*)/g;
    let lastIndex = 0; let m;
    const s = String(price ?? '');
    while ((m = regex.exec(s)) !== null) {
        if (m.index > lastIndex) frag.append(s.slice(lastIndex, m.index));
        frag.append(make('span', { class: 'price-text' }, m[1]));
        lastIndex = regex.lastIndex;
    }
    if (lastIndex < s.length) frag.append(s.slice(lastIndex));
    return frag;
}

/**
 * @param {any} v
 * @returns {string}
 */
function coerceBool(v) { return /^(true|1|yes)$/i.test(String(v || '')); }

function normalizeString(v, trueValue, falseValue ) {
    return String(v || '').trim();
}

/**
 * @param {TapItem[]}
 * @returns {string}
 */
function pickStandardPrice(rows) {
    let val = '';
    for (const row of rows) {
        const s = row.Standard_Price_Note;
        if (s) val = s;
    }
    return val;
}

function scaleTapBoard() {
    const scaler = byId('boardScaler');
    const chalkboard = document.querySelector('.chalkboard');
    const ciderHeader = byId('tap-cider-header');
    const beerHeader = byId('tap-beer-header');
    const cider = byId('cider-column');
    const beer = byId('beer-column');
    if (!scaler || !chalkboard || !cider || !beer) return;
    const headerH = Math.max(ciderHeader?.offsetHeight || 0, beerHeader?.offsetHeight || 0);
    const availableHeight = chalkboard.clientHeight - headerH - 50;
    const maxHeight = Math.max(cider.scrollHeight, beer.scrollHeight);
    const scale = maxHeight > 0 ? Math.min(1, availableHeight / maxHeight) : 1;
    scaler.style.transform = `scale(${scale})`;
    scaler.style.height = `${Math.ceil(maxHeight * scale)}px`;
    scaler.style.overflow = 'visible';
}

let resizeRAF = null;
function scheduleScale() {
    if (resizeRAF) cancelAnimationFrame(resizeRAF);
    resizeRAF = requestAnimationFrame(scaleTapBoard);
}

function renderRows(rows) {
    const ciderColumn = byId('cider-column');
    const beerColumn = byId('beer-column');
    const ciderHeader = byId('tap-cider-header');
    if (!ciderColumn || !beerColumn) return;

    ciderColumn.innerHTML = '';
    beerColumn.innerHTML = '';



    const ciderFrag = document.createDocumentFragment();
    const beerFrag = document.createDocumentFragment();
    let hasPerry = false;

    const tapItems = rows.map(row => new TapItem(row));

    const defaultPrice = pickStandardPrice(tapItems);

    for (const tapItem of tapItems) {
        if (!tapItem.Maker && !tapItem.Name) continue;
        if (!coerceBool(tapItem.Available)) continue;

        if (/perry/i.test(tapItem.Type)) hasPerry = true;
        const card = tapItem.renderTapItem(defaultPrice);
        (/(cider)|(perry)/i.test(tapItem.Type) ? ciderFrag : beerFrag).append(card);
    }

    ciderHeader.textContent = hasPerry ? 'CIDER & PERRY' : 'CIDER'

    ciderColumn.append(ciderFrag);
    beerColumn.append(beerFrag);
    window._lastUpdated = new Date();
    scheduleScale();
}

function loadTapData() {
    Papa.parse(SHEET_CSV_URL, {
        download: true,
        header: true,
        skipEmptyLines: true,
        complete: ({ data }) => {
            try { renderRows(data); } catch (err) { console.error(err); }
        },
        error: (err) => { console.error('PapaParse error', err); },
    });
}

function watchdog() {
    if (window._lastUpdated && (Date.now() - window._lastUpdated.getTime()) > 2 * 60 * 1000) {
        window.location.reload();
    }
}

const ro = new ResizeObserver(scheduleScale);
window.addEventListener('load', () => {
    ro.observe(byId('cider-column'));
    ro.observe(byId('beer-column'));
    window.addEventListener('resize', scheduleScale);
    loadTapData();
    setInterval(loadTapData, 60 * 1000);
    setInterval(watchdog, 90 * 1000);
});
