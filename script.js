const z = document.querySelector.bind(document);
const zz = document.querySelectorAll.bind(document);
//1. Lấy giá trị trên LocalStorage----------------------------------
var arrayComic;
(function handleArray() {
    let dataWeb = getApi("dataWeb");
    if (dataWeb == undefined) {
        dataWeb = [];
        postApi("dataWeb", dataWeb);
    } else {
        arrayComic = getApi("dataWeb").sort((a, b) => {
            return b.chapComic - a.chapComic;
        });
    }
})();
// Hiển thị dữ liệu ra Website--------------------------------------
if (arrayComic.length >= 1) {
    function renderComic(array) {
        const boxLink = z(".box-links");
        boxLink.innerHTML = array.map((item) => {
            let {nameComic, chapComic, chapLink, comicLink, updateChap} = item;
            return (`
                <div class="box-links_item">
                    <a href=${comicLink} class="name" target="_blank">${nameComic}</a>
                    <a href=${chapLink} class="chap" target="_blank">
                        <span class="num">
                            Đọc tiếp  
                            <i class="fa fa-chevron-right"></i> 
                            <span>Chương ${chapComic} </span>
                        </span>
                        <span class="day">
                            <i class="far fa-calendar"></i>
                            ${updateChap}
                        </span>
                    </a>
                    <i class="fa-solid fa-bars-staggered bar"></i>
                </div>
            `)
        }).join('');
    } renderComic(arrayComic);
}
// Thêm truyện tranh------------------------------------------------
let indexWeb;
const inputs = zz(".box-input input")
function handleApi() {
    function getTime() {
        const today = new Date();
        const day = today.getDate();
        const month = today.getMonth() + 1;
        const year = today.getFullYear();
        const update = day + "/" + month + "/" + year;
        return update;
    };
    function getLinkChap () {
        let urlChap, nameItem;
        let numItem = inputs[1].value;
        let linkItem = inputs[2].value;
        if(linkItem.includes("truyenqq")){
            urlChap = linkItem + '-chap-' + numItem + '.html';
        } else if (linkItem.includes("timtruyen3s")){
            nameItem = linkItem.replace(linkItem.split('truyen'), 'doc');
            urlChap = nameItem.replace('.html', "-chuong-" + numItem + ".html")
        } else if(linkItem.includes("goctruyentranh")) {  
            urlChap = linkItem + "/chuong-" + numItem;
        } else if(linkItem.includes("mangakakalot")) {     
            nameItem = linkItem.replace("/manga", "/chapter");
            urlChap = nameItem + "/chapter-" + numItem;
        } else if(linkItem.includes("mangafire")) {   
            nameItem = linkItem.replace("/manga", "/read");
            urlChap = nameItem + "/en/chapter-" + numItem;
        } else if(linkItem.includes("manhuatop")) {  
            urlChap = linkItem + "chapter-" + numItem;
        } else { urlChap = linkItem};
        return urlChap;
    };
    // Đẩy giá trị lên mảng---------------------------------------------
    function postComic(indexWeb) {
        inputs[3].addEventListener('click', () => {
            const comic = {
                nameComic: inputs[0].value,
                chapComic: inputs[1].value,
                comicLink: inputs[2].value,
                chapLink: getLinkChap(),
                updateChap: getTime()
            }
            if (indexWeb == 1) {
                let x = arrayComic.findIndex(item => item.nameComic == inputs[0].value);
                arrayComic.splice(x, 1);
            } 
            arrayComic.push(comic);
            postApi("dataWeb", arrayComic);
        })
    };
    const boxInput = z('.box-input');
    const btnExtra = z('#contain .extra');
    const btnErase = z('.box-input .erase');
    const btnClose = z('.box-input .close');
    btnExtra.onclick = () => {
        z('.box-input h1').innerText = "Thêm truyện tranh";
        z('.box-input h2').innerText = "";
        z('.box-input .erase').classList.add('hide');
        z('.box-input .api').classList.remove('hide');
        inputs[3].value = "Thêm truyện";
        boxInput.style.top = "20px";
        for (let i = 0; i<= 2; i++) {inputs[i].value = ""}
        postComic(0);
    }
    btnClose.onclick = () => {
        boxInput.style.top = "-600px";
    }
    zz('.box-links_item').forEach((item, index) => {
        item.onclick = () => {
            inputs[0].value = arrayComic[index].nameComic;
            inputs[1].value = arrayComic[index].chapComic;
            inputs[2].value = arrayComic[index].comicLink;
            z('.box-input .api').classList.add('hide');
            boxInput.style.top = "20px";
            z('.box-input h1').innerText = "Sửa truyện tranh";
            z('.box-input h2').innerText = '<' +  arrayComic[index].nameComic + '>';
            inputs[3].value = "Sửa truyện";
            editComic(index);
            postComic(1);
            z('.box-input .erase.hide').classList.remove('hide');
        }
    })
    function editComic(index) {
        btnErase.onclick = () => {
            let getName = arrayComic[index].nameComic;
            let isTrue = confirm("Bạn có muốn xoá truyện " + getName + " không?");
            if (isTrue == 1) {eraseComic(getName)}
        }
    }
    function eraseComic(getName) {
        let index = arrayComic.findIndex(item => item.nameComic == getName);
        arrayComic.splice(index, 1);
        postApi("dataWeb", arrayComic);
    }
} handleApi();
function handlePostArr() {
    inputs[4].value = JSON.stringify(getApi("dataWeb"));
    let isTrue;
    inputs[6].onclick = () => {
        isTrue = confirm ("Bạn muốn đẩy mảng lên Website không?")
        if (isTrue == 0) {

        } else if (isTrue == 1) {
            localStorage.setItem("dataWeb", inputs[5].value);
        }
    }
} handlePostArr();
// ------------------------------------------------------------------
function postApi(name, value) {
    const covertValue = JSON.stringify(value);
    localStorage.setItem(name, covertValue);
    location.reload();
};
function getApi(name) {
    const value = JSON.parse(localStorage.getItem(name));
    return value;
};
