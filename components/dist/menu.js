const smMenu = document.createElement('template')
smMenu.innerHTML = `
<style>     
*{
    padding: 0;
    margin: 0;
    -webkit-box-sizing: border-box;
            box-sizing: border-box;
}
:host{
    display: -webkit-inline-box;
    display: -ms-inline-flexbox;
    display: inline-flex;
}
.menu{
    display: -ms-grid;
    display: grid;
    place-items: center;
    height: 2rem;
    width: 2rem;
    outline: none;
}
.icon {
    position: absolute;
    fill: rgba(var(--text-color), 0.7);
    height: 2.4rem;
    width: 2.4rem;
    padding: 0.5rem;
    border-radius: 2rem;
    -webkit-transition: background 0.3s;
    -o-transition: background 0.3s;
    transition: background 0.3s;
}      
.select{
    position: relative;
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    -webkit-box-orient: vertical;
    -webkit-box-direction: normal;
        -ms-flex-direction: column;
            flex-direction: column;
    cursor: pointer;
    width: 100%;
    -webkit-tap-highlight-color: transparent;
}
.menu:focus .icon,
.focused{
    background: rgba(var(--text-color), 0.1); 
}
:host([align-options="left"]) .options{
    left: 0;
}
:host([align-options="right"]) .options{
    right: 0;
}
.options{
    padding: 0.5rem 0;
    overflow: hidden auto;
    position: absolute;
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    min-width: -webkit-max-content;
    min-width: -moz-max-content;
    min-width: max-content;
    -webkit-box-orient: vertical;
    -webkit-box-direction: normal;
        -ms-flex-direction: column;
            flex-direction: column;
    background: rgba(var(--background-color), 1);
    border-radius: 0.3rem;
    z-index: 1;
    -webkit-box-shadow: 0 0.5rem 1.5rem -0.5rem rgba(0,0,0,0.3);
            box-shadow: 0 0.5rem 1.5rem -0.5rem rgba(0,0,0,0.3);
    bottom: auto;
}
.hide{
    display: none;
}
@media screen and (max-width: 640px){
    .options{
        position: fixed;
        left: 0;
        right: 0;
        bottom: 0;
        top: auto;
        border-radius: 0.5rem 0.5rem 0 0;
    }
}
@media (hover: hover){
    .menu:hover .icon{
        background: rgba(var(--text-color), 0.1); 
    }
}
</style>
<div class="select">
    <div class="menu" tabindex="0">
        <svg class="icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24"><path fill="none" d="M0 0h24v24H0z"/><path d="M12 3c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 14c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0-7c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"/></svg>
    </div>
    <div class="options hide">
        <slot></slot> 
    </div>
</div>`;
customElements.define('sm-menu', class extends HTMLElement {
    constructor() {
        super()
        this.attachShadow({
            mode: 'open'
        }).append(smMenu.content.cloneNode(true))

        this.isOpen = false;
        this.availableOptions
        this.containerDimensions
        this.animOptions = {
            duration: 200,
            easing: 'ease'
        }

        this.optionList = this.shadowRoot.querySelector('.options')
        this.menu = this.shadowRoot.querySelector('.menu')
        this.icon = this.shadowRoot.querySelector('.icon')

        this.expand = this.expand.bind(this)
        this.collapse = this.collapse.bind(this)
        this.toggle = this.toggle.bind(this)
        this.handleKeyDown = this.handleKeyDown.bind(this)
        this.handleClickoutSide = this.handleClickoutSide.bind(this)

    }
    static get observedAttributes() {
        return ['value']
    }
    get value() {
        return this.getAttribute('value')
    }
    set value(val) {
        this.setAttribute('value', val)
    }
    expand() {
        if (!this.isOpen) {
            this.optionList.classList.remove('hide')
            this.optionList.animate([
                {
                    transform: window.innerWidth < 640 ? 'translateY(1.5rem)' : 'translateY(-1rem)',
                    opacity: '0'
                },
                {
                    transform: 'none',
                    opacity: '1'
                },
            ], this.animOptions)
                .onfinish = () => {
                    this.isOpen = true
                    this.icon.classList.add('focused')
                }
        }
    }
    collapse() {
        if (this.isOpen) {
            this.optionList.animate([
                {
                    transform: 'none',
                    opacity: '1'
                },
                {
                    transform: window.innerWidth < 640 ? 'translateY(1.5rem)' : 'translateY(-1rem)',
                    opacity: '0'
                },
            ], this.animOptions)
                .onfinish = () => {
                    this.isOpen = false
                    this.icon.classList.remove('focused')
                    this.optionList.classList.add('hide')
                }
        }
    }
    toggle() {
        if (!this.isOpen) {
            this.expand()
        } else {
            this.collapse()
        }
    }
    handleKeyDown(e) {
        // If key is pressed on menu button
        if (e.target === this) {
            if (e.code === 'ArrowDown') {
                e.preventDefault()
                this.availableOptions[0].focus()
            }
            else if (e.code === 'Enter' || e.code === 'Space') {
                e.preventDefault()
                this.toggle()
            }
        } else { // If mey is pressed over menu options
            if (e.code === 'ArrowUp') {
                e.preventDefault()
                if (document.activeElement.previousElementSibling) {
                    document.activeElement.previousElementSibling.focus()
                } else {
                    this.availableOptions[this.availableOptions.length - 1].focus()
                }
            }
            else if (e.code === 'ArrowDown') {
                e.preventDefault()
                if (document.activeElement.nextElementSibling) {
                    document.activeElement.nextElementSibling.focus()
                } else {
                    this.availableOptions[0].focus()
                }
            }
            else if (e.code === 'Enter' || e.code === 'Space') {
                e.preventDefault()
                e.target.click()
            }
        }
    }
    handleClickoutSide(e) {
        if (!this.contains(e.target) && e.button !== 2) {
            this.collapse()
        }
    }
    connectedCallback() {
        this.setAttribute('role', 'listbox')
        this.setAttribute('aria-label', 'dropdown menu')
        const slot = this.shadowRoot.querySelector('.options slot')
        slot.addEventListener('slotchange', e => {
            this.availableOptions = e.target.assignedElements()
            this.containerDimensions = this.optionList.getBoundingClientRect()
        });
        this.addEventListener('click', this.toggle)
        this.addEventListener('keydown', this.handleKeyDown)
        document.addEventListener('mousedown', this.handleClickoutSide)
    }
    disconnectedCallback() {
        this.removeEventListener('click', this.toggle)
        this.removeEventListener('keydown', this.handleKeyDown)
        document.removeEventListener('mousedown', this.handleClickoutSide)
    }
})

// option
const menuOption = document.createElement('template')
menuOption.innerHTML = `
<style>     
*{
    padding: 0;
    margin: 0;
    -webkit-box-sizing: border-box;
            box-sizing: border-box;
}     
:host{
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    --padding: 0.6rem 1.6rem;
}
.option{
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    min-width: 100%;
    padding: var(--padding);
    cursor: pointer;
    overflow-wrap: break-word;
    white-space: nowrap;
    outline: none;
    font-size: 1rem;
    user-select: none;
    -webkit-box-align: center;
        -ms-flex-align: center;
            align-items: center;
}
:host(:focus){
    outline: none;
    background: rgba(var(--text-color), 0.1);
}
@media (any-hover: hover){
    :host{
        --padding: 0.8rem 1.6rem;
    }
    .option:hover{
        background: rgba(var(--text-color), 0.1);
    }
}
</style>
<div class="option">
    <slot></slot> 
</div>`;
customElements.define('menu-option', class extends HTMLElement {
    constructor() {
        super()
        this.attachShadow({
            mode: 'open'
        }).append(menuOption.content.cloneNode(true))
    }

    connectedCallback() {
        this.setAttribute('role', 'option')
        this.addEventListener('keyup', e => {
            if (e.code === 'Enter' || e.code === 'Space') {
                e.preventDefault()
                this.click()
            }
        })
    }
})