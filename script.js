const z = document.querySelector.bind(document);
const zz = document.querySelectorAll.bind(document);
// ---------------------------------------------------------------------
$(document).ready(function() {
    $('nav .bar').click(function() {
        $('nav .list').slideToggle();
    })
})

var arrayComic;
let indexWeb;
var dataWeb = getApi("dataWeb").sort((a, b) => {
    return b.chapComic - a.chapComic;
});
if (dataWeb == undefined) {
    arrayComic = [];
} else {
    arrayComic = dataWeb;
}
const inputs = zz(".box-input input")
// Đẩy giá trị lên mảng---------------------------------------------
function postComic(indexWeb) {
    inputs[3].addEventListener('click', () => {
        const comic = {
            nameComic: inputs[0].value,
            chapComic: inputs[1].value,
            comicLink: inputs[2].value,
            chapLink: getLinkChap(),
            updateChap: getUpdate()
        }
        if (indexWeb == 1) {
            let x = arrayComic.findIndex(item => item.nameComic == inputs[0].value);
            arrayComic.splice(x, 1);
        } 
        arrayComic.push(comic);
        postApi("dataWeb", arrayComic);
    })
};
// Lấy giá trị thời gian dang truyen--------------------------------
function getUpdate() {
    const today = new Date();
    const day = today.getDate();
    const month = today.getMonth();
    const year = today.getFullYear();
    const update = day + "/" + month + "/" + year;
    return update;
};
// Lấy giá trị đường dẫn chương truyện------------------------------
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
// Trả về giá trị mảng----------------------------------------------
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
// Sửa thông tin truyện---------------------------------------------
const boxInput = z('.box-input');
const btnExtra = z('#contain .extra');
const btnErase = z('.box-input .erase');
const btnClose = z('.box-input .close');
btnExtra.onclick = () => {
    z('.box-input h1').innerText = "Thêm truyện tranh";
    z('.box-input h2').innerText = "";
    z('.box-input .erase').classList.add('hide');
    inputs[3].value = "Thêm truyện";
    boxInput.style.top = "100px";
    for (let i = 0; i<= 2; i++) {
        inputs[i].value = "";
    }
    postComic(0);
}
btnClose.onclick = () => {
    boxInput.style.top = "-500px";
}
zz('.box-links_item').forEach((item, index) => {
    item.onclick = () => {
        inputs[0].value = arrayComic[index].nameComic;
        inputs[1].value = arrayComic[index].chapComic;
        inputs[2].value = arrayComic[index].comicLink;
        boxInput.style.top = "100px";
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
    let x = arrayComic.findIndex(item => item.nameComic == getName);
    arrayComic.splice(x, 1);
    postApi("dataWeb", arrayComic);
}

// ---------------------------------------------------------------------
function postApi(name, value) {
    const covertValue = JSON.stringify(value);
    localStorage.setItem(name, covertValue);
    location.reload();
};
function getApi(name) {
    const value = JSON.parse(localStorage.getItem(name));
    return value;
};