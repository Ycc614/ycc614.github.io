//菜单交互公共JS
const sidebar = document.getElementById("sidebar");
const menuParents = document.querySelectorAll(".menu-parent");
const menuChilds = document.querySelectorAll(".menu-child");

//折叠按钮
document.getElementById("foldAllBtn").onclick = function(){
    sidebar.classList.toggle("collapse-all");
    const btn = document.getElementById("foldAllBtn");
    if(sidebar.classList.contains("collapse-all")){
        destroyPopper();
        document.querySelectorAll(".sub-menu").forEach(s=>s.classList.remove("open"));
    }
}

//悬浮浮窗全局变量
let popperDom = null;
let popperTimer = null;

//销毁浮窗
function destroyPopper(){
    if(popperDom){
        popperDom.remove();
        popperDom = null;
    }
    if(popperTimer){
        clearTimeout(popperTimer);
        popperTimer = null;
    }
}

//创建折叠模式悬浮浮窗
function createSubPopper(parentDom){
    destroyPopper();
    const sourceSub = parentDom.nextElementSibling;
    if(!sourceSub || !sourceSub.classList.contains("sub-menu")) return;
    const childList = Array.from(sourceSub.querySelectorAll(".menu-child"));
    popperDom = document.createElement("div");
    popperDom.className = "submenu-popper";
    const rect = parentDom.getBoundingClientRect();
    popperDom.style.top = rect.top + "px";
    childList.forEach(item=>{
        const href = item.dataset.href;
        const text = item.innerText;
        const div = document.createElement("div");
        div.className = "popper-item";
        div.innerText = text;
        div.dataset.href = href;
        div.onclick = function(){
            const url = this.dataset.href;
            if(url && url !== "#") location.href = url;
            destroyPopper();
        }
        popperDom.appendChild(div);
    })
    document.body.appendChild(popperDom);
    popperDom.style.display = "block";
    popperDom.onmouseleave = function(){
        popperTimer = setTimeout(()=>destroyPopper(),150);
    }
    popperDom.onmouseenter = function(){
        if(popperTimer) clearTimeout(popperTimer);
    }
}

//父菜单两套交互逻辑（展开模式点击展开子菜单；折叠模式hover出浮窗，点击不撑开侧边栏）
menuParents.forEach((parent)=>{
    parent.addEventListener("mouseenter",function(){
        const isSidebarCollapse = sidebar.classList.contains("collapse-all");
        const hasSub = this.dataset.haveSub === "true";
        if(isSidebarCollapse && hasSub){
            createSubPopper(this);
        }
    })
    parent.addEventListener("mouseleave",function(){
        const isSidebarCollapse = sidebar.classList.contains("collapse-all");
        const hasSub = this.dataset.haveSub === "true";
        if(isSidebarCollapse && hasSub){
            popperTimer = setTimeout(()=>destroyPopper(),150);
        }
    })
    parent.onclick = function(){
        const href = this.dataset.href;
        const nextSub = this.nextElementSibling;
        const isSidebarCollapse = sidebar.classList.contains("collapse-all");
        const hasSub = this.dataset.haveSub === "true";
        if(isSidebarCollapse){
            if(hasSub){
                return; //折叠状态带子菜单父菜单，点击无动作，仅hover浮窗
            }else{
                if(href && href !== "#") location.href = href;
            }
        }else{
            //展开模式原始逻辑
            if(nextSub && nextSub.classList.contains("sub-menu")){
                nextSub.classList.toggle("open");
            }else{
                if(href && href !== "#") location.href = href;
            }
        }
    }
})

//侧边栏内部子菜单点击（展开模式）
menuChilds.forEach(child=>{
    child.onclick = function(){
        const href = this.dataset.href;
        if(href && href != "#") location.href = href;
        child.parentElement.classList.add("open");
    }
})


//菜单高亮
function setMenuActive(){
    document.querySelectorAll(".sub-menu").forEach(sub=>{
        sub.classList.remove("open");
    })
    let currentPage = location.pathname.split('/').pop();
    document.querySelectorAll(".menu-parent,.menu-child").forEach(el=>{
        el.classList.remove("active");
    });
    menuChilds.forEach(child=>{
        const href = child.dataset.href;
        if(href === currentPage){
            child.classList.add("active");
            if(!sidebar.classList.contains("collapse-all")){
                child.parentElement.classList.add("open");
            }
            let parentMenu = child.parentElement.previousElementSibling;
            if(parentMenu) parentMenu.classList.add("active");
        }
    })
    menuParents.forEach(parent=>{
        const href = parent.dataset.href;
        if(href === currentPage){
            parent.classList.add("active");
        }
    })
    destroyPopper();
}


//快捷入口跳转
document.getElementById("goMonthCard").onclick = function(){
    location.href = "monthCard.html";
}

window.onload = function(){
    setMenuActive();
    renderHomeStat();
}