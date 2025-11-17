
function onPageLoad() {
    // create a reference to the button
    const btn = document.querySelector(".nav-button")
    // create a reference to the menu
    const menu = document.querySelector("#categories")
    // make the buttom btn listen for a click
    btn.addEventListener("click", function () {
        //console.log("clicked")
        if (menu.classList.contains("open")) {
            menu.classList.remove("open")
        }
        else {
            menu.classList.add("open")
        }
    })

}
// wait for all the HTML to load and then execute onPageLoad
window.addEventListener("load", onPageLoad)

// below for testing
// =========================================================
// 新增功能模块：链接存在性检查和 404 重定向
// 此代码独立于原有的 onPageLoad 函数
// =========================================================

// 定义通用提示页面的变量 (请根据你的实际文件名修改 'not_ready.html')
const fallbackPage = 'not_ready.html'; 

function checkLinksOnLoad() {
    // 获取页面上所有的链接元素
    const links = document.querySelectorAll('a'); 
    
    links.forEach(link => {
        link.addEventListener('click', function(event) {
            // 默认阻止跳转，防止在异步检查完成前浏览器跳转
            event.preventDefault(); 

            const href = this.getAttribute('href');
            
            // 仅对内部、非空链接进行检查
            if (href && !href.startsWith('http') && href !== fallbackPage) {
                
                // 异步检查文件是否存在 (使用 HEAD 请求提高效率)
                fetch(href, { method: 'HEAD' })
                    .then(response => {
                        // HTTP 状态码 404 或非 200/300 成功状态，都视为不存在
                        if (response.status === 404 || !response.ok) {
                            // 确定不存在，跳转到通用页
                            window.location.href = `${fallbackPage}?target=${encodeURIComponent(href)}`;
                        } else {
                            // 确定存在 (200 OK)，手动跳转到原链接
                            window.location.href = href; 
                        }
                    })
                    .catch(error => {
                        // 如果 fetch 失败 (例如网络错误或本地文件安全限制)
                        console.error("Link check failed. Proceeding with original link.", error);
                        // 为了安全，我们假设链接可能有效，并手动跳转到原链接
                        window.location.href = href; 
                    });
            } else {
                 // 对于外部链接、或已经指向通用页的链接，直接跳转
                 window.location.href = href; 
            }
        });
    });
}

// 确保在页面加载完成后，执行这个新的功能模块
// 它可以和原有的 window.addEventListener("load", onPageLoad) 共存
window.addEventListener("load", checkLinksOnLoad);