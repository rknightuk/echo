class Squirminal extends HTMLElement {
  static define(tagName) {
    if("customElements" in window) {
      window.customElements.define(tagName || "squirm-inal", Squirminal);
    }
  }

  constructor() {
    super();

    this.speed = 0.5    ; // higher is faster, 3 is about the fastest it can go.
    this.chunkSize = {
      min: 5,
      max: 30
    };
    this.flatDepth = 1000;

    this.attr = {
      cursor: "cursor",
      autoplay: "autoplay",
      buttons: "buttons",
      global: "global",
    };
    this.classes = {
      showCursor: "squirminal-cursor-show",
      content: "squirminal-content",
    };
    this.events = {
      start: "squirminal.start",
      end: "squirminal.end",
      frameAdded: "squirminal.frameadded",
    };
  }

  _serializeContent(node, selector = []) {
    if(node.nodeType === 3) {
      let text = node.nodeValue;
      node.nodeValue = "";

      // this represents characters that need to be added to the page.
      return {
        text: text.split(""),
        selector: selector
      };
    } else if(node.nodeType === 1) {
      if(node.tagName.toLowerCase() !== "squirm-inal" && node.innerText) {
        node.classList.add("sq-empty");
      }
    }
    let content = [];
    let j = 0;
    for(let child of Array.from(node.childNodes)) {
      content.push(this._serializeContent(child, [...selector, j]));
      j++;
    }

    return content;
  }

  getNode(target, selector) {
    for(let childIndex of selector) {
      target = target.childNodes[childIndex];
    }
    return target;
  }

  removeEmptyClass(node) {
    if(node && node.nodeValue) {
      while(node) {
        if(node.classList) {
          node.classList.remove("sq-empty");
        }
        node = node.parentNode;
      }
    }
  }

  addCharacters(target, characterCount = 1) {
    for(let entry of this.serialized) {
      let str = [];
      while(entry.text.length && characterCount-- > 0) {
        str.push(entry.text.shift());
      }

      let targetNode = this.getNode(target, entry.selector);
      targetNode.nodeValue += str.join("");
      this.removeEmptyClass(targetNode);

      if(characterCount === 0) break;
    }
  }

  hasQueue() {
    for(let entry of this.serialized) {
      if(entry.text.length > 0) {
        return true;
      }
    }
    return false;
  }

  connectedCallback() {
    this.init();

    // TODO this is not ideal because the intersectionRatio is based on the empty terminal, not the
    // final animated version. So it’s tiny when empty and when the IntersectionRatio is 1 it may
    // animate off the bottom of the viewport.
    if(this.hasAttribute(this.attr.autoplay)) {
      this._whenVisible(this, (isVisible) => {
        if(isVisible) {
          this.play();
        }
      });
    }

    if(this.hasAttribute(this.attr.cursor)) {
      this.addEventListener("squirminal.start", () => {
        this.classList.add(this.classes.showCursor);
      });

      this.addEventListener("squirminal.end", () => {
        this.classList.remove(this.classes.showCursor);
      });
    }


    let href = this.getAttribute("href");
    if(href) {
      this.addEventListener("squirminal.end", () => {
        window.location.href = href;
      });
    }
  }

  init() {
    this.paused = true;
    this.originalContent = this.cloneNode(true);
    this.serialized = this._serializeContent(this).flat(this.flatDepth);

    // Add content div
    this.content = this.querySelector(`.${this.classes.content}`);
    if(!this.content) {
      let content = document.createElement("div");
      content.classList.add(this.classes.content);

      // add non-text that have already been emptied by the serializer
      for(let child of Array.from(this.childNodes)) {
        content.appendChild(child);
      }
      this.appendChild(content);
      this.content = content;
    }

    // Play/pause button
    this.toggleButton = this.querySelector(":scope button[data-sq-toggle]");
    if(this.hasAttribute(this.attr.buttons) && !this.toggleButton) {
      let toggleBtn = document.createElement("button");
      toggleBtn.innerText = "Play";
      toggleBtn.setAttribute("data-sq-toggle", "");
      toggleBtn.addEventListener("click", e => {
        this.toggle();
      })
      this.appendChild(toggleBtn);
      this.toggleButton = toggleBtn;
    }

    this.skipButton = this.querySelector(":scope button[data-sq-skip]");
    if(this.hasAttribute(this.attr.buttons) && !this.skipButton) {
      let skipBtn = document.createElement("button");
      skipBtn.innerText = "Skip";
      skipBtn.setAttribute("data-sq-skip", "");
      skipBtn.addEventListener("click", e => {
        this.skip();
      })
      this.appendChild(skipBtn);
      this.skipButton = skipBtn;
    }
  }

  onreveal(callback) {
    this.addEventListener(this.events.frameAdded, callback, {
      passive: true,
    });
    this.addEventListener(this.events.end, () => {
      this.removeEventListener(this.events.frameAdded, callback);
    }, {
      passive: true,
      once: true,
    });
  }

  onstart(callback) {
    this.addEventListener(this.events.start, callback, {
      passive: true,
      once: true,
    });
  }

  onend(callback) {
    this.addEventListener(this.events.end, callback, {
      passive: true,
      once: true,
    });
  }

  setButtonText(button, text) {
    if(button && text) {
      button.innerText = text;
    }
  }

  _whenVisible(el, callback) {
    if(!('IntersectionObserver' in window)) {
      // run by default without intersectionobserver
      callback(undefined);
      return;
    }

    return new IntersectionObserver(entries => {
      entries.forEach(entry => {
        callback(entry.isIntersecting)
      });
    }, {
      threshold: 1
    }).observe(el);
  }

  toggle() {
    if(this.paused) {
      this.play();
    } else {
      this.pause();
    }
  }

  pause() {
    this.paused = true;
    this.setButtonText(this.toggleButton, "Play");
  }

  skip() {
    this.play({
      chunkSize: this.originalContent.innerHTML.length,
      delay: 0
    });
  }

  play(overrides = {}) {
    if(window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      overrides.chunkSize = this.originalContent.innerHTML.length;
      overrides.delay = 0;
    }

    this.paused = false;
    if(this.hasQueue()) {
      this.setButtonText(this.toggleButton, "Pause");
      this.dispatchEvent(new CustomEvent(this.events.start));
    }

    requestAnimationFrame(() => this.showMore(overrides));
  }

  showMore(overrides = {}) {
    if(this.paused) {
      return;
    }

    if(!this.hasQueue()) {
      this.pause();
      this.dispatchEvent(new CustomEvent(this.events.frameAdded));
      this.dispatchEvent(new CustomEvent(this.events.end));
      return;
    }

    // show a random chunk size between min/max
    let chunkSize = overrides.chunkSize || Math.round(Math.max(this.chunkSize.min, Math.random() * this.chunkSize.max + 1));
    this.addCharacters(this.content, chunkSize);

    this.dispatchEvent(new CustomEvent(this.events.frameAdded));

    // the amount we wait is based on how many non-whitespace characters printed to the screen in this chunk
    let delay = overrides.delay > -1 ? overrides.delay : chunkSize * (1/this.speed);
    if(delay > 16) {
      setTimeout(() => {
        requestAnimationFrame(() => this.showMore(overrides));
      }, delay);
    } else {
      requestAnimationFrame(() => this.showMore(overrides));
    }
  }

  isGlobalCommand() {
    return this.hasAttribute(this.attr.global);
  }

  clone() {
    let cloned = this.cloneNode();
    // restart from scratch
    cloned.innerHTML = this.originalContent.innerHTML;
    return cloned;
  }
}

Squirminal.define();
