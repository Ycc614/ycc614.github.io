//公共菜单交互JS
let sidebar = null;
let menuParents = null;
let menuChilds = null;
let popperDom = null;
let popperTimer = null;

/** 初始化菜单dom */
function initMenuDom() {
    sidebar = document.getElementById("sidebar");
    menuParents = document.querySelectorAll(".menu-parent");
    menuChilds = document.querySelectorAll(".menu-child");
}

/** 销毁浮窗 */
function destroyPopper() {
    if (popperDom) {
        popperDom.remove();
        popperDom = null;
    }
    if (popperTimer) {
        clearTimeout(popperTimer);
        popperTimer = null;
    }
}

/** 创建折叠模式悬浮浮窗 */
function createSubPopper(parentDom) {
    destroyPopper();
    const sourceSub = parentDom.nextElementSibling;
    if (!sourceSub || !sourceSub.classList.contains("sub-menu")) return;
    const childList = Array.from(sourceSub.querySelectorAll(".menu-child"));
    popperDom = document.createElement("div");
    popperDom.className = "submenu-popper";
    const rect = parentDom.getBoundingClientRect();
    popperDom.style.top = rect.top + "px";
    childList.forEach(item => {
        const href = item.dataset.href;
        const text = item.innerText;
        const div = document.createElement("div");
        div.className = "popper-item";
        div.innerText = text;
        div.dataset.href = href;
        div.onclick = function () {
            const url = this.dataset.href;
            if (url && url !== "#") location.href = url;
            destroyPopper();
        }
        popperDom.appendChild(div);
    })
    document.body.appendChild(popperDom);
    popperDom.style.display = "block";
    popperDom.onmouseleave = function () {
        popperTimer = setTimeout(() => destroyPopper(), 150);
    }
    popperDom.onmouseenter = function () {
        if (popperTimer) clearTimeout(popperTimer);
    }
}

/** 绑定菜单全部事件 */
function bindMenuEvent() {
    //侧边栏折叠按钮
    document.getElementById("foldAllBtn").onclick = function () {
        sidebar.classList.toggle("collapse-all");
        if (sidebar.classList.contains("collapse-all")) {
            destroyPopper();
            document.querySelectorAll(".sub-menu").forEach(s => s.classList.remove("open"));
        }
    }

    //父菜单两套交互逻辑
    menuParents.forEach((parent) => {
        parent.addEventListener("mouseenter", function () {
            const isSidebarCollapse = sidebar.classList.contains("collapse-all");
            const hasSub = this.dataset.haveSub === "true";
            if (isSidebarCollapse && hasSub) createSubPopper(this);
        })
        parent.addEventListener("mouseleave", function () {
            const isSidebarCollapse = sidebar.classList.contains("collapse-all");
            const hasSub = this.dataset.haveSub === "true";
            if (isSidebarCollapse && hasSub) {
                popperTimer = setTimeout(() => destroyPopper(), 150);
            }
        })
        parent.onclick = function () {
            const href = this.dataset.href;
            const nextSub = this.nextElementSibling;
            const isSidebarCollapse = sidebar.classList.contains("collapse-all");
            const hasSub = this.dataset.haveSub === "true";
            if (isSidebarCollapse) {
                if (hasSub) {
                    return;
                } else {
                    if (href && href !== "#") location.href = href;
                }
            } else {
                if (nextSub && nextSub.classList.contains("sub-menu")) {
                    nextSub.classList.toggle("open");
                } else {
                    if (href && href !== "#") location.href = href;
                }
            }
        }
    })

    //子菜单点击
    menuChilds.forEach(child => {
        child.onclick = function () {
            const href = this.dataset.href;
            if (href && href !== "#") location.href = href;
            if (!sidebar.classList.contains("collapse-all")) {
                child.parentElement.classList.add("open");
            } else {
                child.parentElement.classList.remove("open");
            }
        }
    })
}

/** 菜单高亮 */
function setMenuActive() {
    document.querySelectorAll(".sub-menu").forEach(sub => {
        sub.classList.remove("open");
    })
    let currentPage = location.pathname.split('/').pop();
    document.querySelectorAll(".menu-parent,.menu-child").forEach(el => {
        el.classList.remove("active");
    });
    menuChilds.forEach(child => {
        const href = child.dataset.href;
        if (href === currentPage) {
            child.classList.add("active");
            if (sidebar && !sidebar.classList.contains("collapse-all")) {
                child.parentElement.classList.add("open");
            } else {
                child.parentElement.classList.remove("open");
            }
            let parentMenu = child.parentElement.previousElementSibling;
            if (parentMenu) parentMenu.classList.add("active");
        }
    })
    menuParents.forEach(parent => {
        const href = parent.dataset.href;
        if (href === currentPage) {
            parent.classList.add("active");
        }
    })
    destroyPopper();
}

/** 公共菜单初始化入口，每个页面onload调用 */
function initCommonMenu() {
    initMenuDom();
    bindMenuEvent();
    setMenuActive();
}