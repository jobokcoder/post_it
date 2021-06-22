const postWrapper = document.querySelector('.app__contents');
const postItDom = document.querySelector('.postIt');
const postItWriteDom = document.querySelector('.postIt__write');
const postItUpdateDom = document.querySelector('.postIt__update');
const writeButton = document.querySelector('.app__header--button');

window.addEventListener('load', () => {
    init();
});

writeButton.addEventListener('click', (e) => { e.preventDefault(); addToWriteDom(); });

function updateStorage(dom){
    const today = new Date();
    const year = today.getFullYear();
    const month = ('0' + (today.getMonth() + 1)).slice(-2);
    const day = ('0' + today.getDate()).slice(-2);
    const dateString = year + '-' + month  + '-' + day;
    const updateTitle = dom.querySelector('.postIt__update--input-title');
    const updateText = dom.querySelector('.postIt__update--input-text');
    const data = JSON.parse(localStorage.getItem('postIt'));
    data['postArr'].forEach((post) => {
        if(post['id'] == dom.id){
            post['title'] = updateTitle.value;
            post['text'] = updateText.value;
            post['date'] = dateString;
        }
    });
    localStorage.setItem('postIt', JSON.stringify(data));
    loadStorage();
}

function updateToWriteDom(id){
    const changeDom = document.getElementById(id);
    const changeInfo = changeDom.querySelector('.postIt__info');
    const changeTitle = changeDom.querySelector('.postIt__info--title');
    const changeText = changeDom.querySelector('.postIt__info--text');
    const changeDate = changeDom.querySelector('.postIt__info--date');
    const updateDom = postItUpdateDom.cloneNode(true);
    const updateTitle = updateDom.querySelector('.postIt__update--input-title');
    const updateText = updateDom.querySelector('.postIt__update--input-text');
    const updateBottom = updateDom.querySelector('.postIt__update--bottom');
    const updateBottomBtn = updateDom.querySelector('.postIt__update--bottom-button');

    updateTitle.value = changeTitle.textContent;
    updateText.value = changeText.textContent;

    changeTitle.remove();
    changeText.remove();
    changeDate.remove();

    changeInfo.appendChild(updateTitle);
    changeInfo.appendChild(updateText);
    changeInfo.appendChild(updateBottom);

    updateBottomBtn.addEventListener('click', () => { updateStorage(changeDom) });
}

function addToWriteDom(){
    const postItWriteDomAll = document.querySelectorAll('.postIt__write');
    if(postItWriteDomAll.length == 0){
        const copyPostItWriteDom = postItWriteDom.cloneNode(true);
        const copyPostItWriteTitle = copyPostItWriteDom.querySelector('.postIt__write--input-title');
        const copyPostItWriteText = copyPostItWriteDom.querySelector('.postIt__write--input-text');
        const copyPostItWriteBtn = copyPostItWriteDom.querySelector('.postIt__write--bottom-button');
        copyPostItWriteBtn.addEventListener('click', () => {
            if(copyPostItWriteTitle.value === '' || copyPostItWriteText.value === ''){
                alert('빈 칸 없이 모두 채워주세요.');
                return 0;
            }
            insertStorage(copyPostItWriteDom);
            copyPostItWriteDom.remove();
        });
        postWrapper.appendChild(copyPostItWriteDom);
    }
}

function insertStorage(dom){
    const today = new Date();
    const year = today.getFullYear();
    const month = ('0' + (today.getMonth() + 1)).slice(-2);
    const day = ('0' + today.getDate()).slice(-2);
    const dateString = year + '-' + month  + '-' + day;
    const data = JSON.parse(localStorage.getItem('postIt'));
    const newPost = {};
    newPost['id'] = (data['postArr'].length + 1);
    newPost['title'] = dom.querySelector('.postIt__write--input-title').value;
    newPost['text'] = dom.querySelector('.postIt__write--input-text').value;
    newPost['date'] = dateString;
    data['postArr'].push(newPost);
    localStorage.setItem('postIt', JSON.stringify(data));
    loadStorage();
}

function loadStorage(){
    resetDom();
    const data = JSON.parse(localStorage.getItem('postIt'));
    if(data['postArr'].length > 0){
        data['postArr'].forEach((post) => {
            const copyPostItDom = postItDom.cloneNode(true);
            const copyPostItTitle = copyPostItDom.querySelector('.postIt__info--title');
            const copyPostItText = copyPostItDom.querySelector('.postIt__info--text');
            const copyPostItDate = copyPostItDom.querySelector('.postIt__info--date');
            const copyPostItUpdateeBtn = copyPostItDom.querySelector('.postIt__info--update-button');
            const copyPostItDeleteBtn = copyPostItDom.querySelector('.postIt__info--delete-button');
            copyPostItDom.id = post['id'];
            copyPostItTitle.textContent = post['title'];
            copyPostItText.textContent = post['text'];
            copyPostItDate.textContent = post['date'];
            copyPostItUpdateeBtn.addEventListener('click', (e) => {
                e.preventDefault();
                updateToWriteDom(post['id']);
            });
            copyPostItDeleteBtn.addEventListener('click', (e) => {
                e.preventDefault();
                deleteStorage(post['id']);
            });
            postWrapper.appendChild(copyPostItDom);
        });
    }
}

function createStorage(){
    const newStorage = {};
    newStorage['comment'] = 'Hello, My Friends';
    newStorage['postArr'] = [];
    localStorage.setItem('postIt', JSON.stringify(newStorage));
}

function deleteStorage(id){
    const data = JSON.parse(localStorage.getItem('postIt'));
    data['postArr'] = data['postArr'].filter((post) => {
        if(post['id'] != id){
            return true;
        }
    });
    localStorage.setItem('postIt', JSON.stringify(data));
    loadStorage();
}

function setStorage(){
    localStorage.getItem('postIt') ?? createStorage() ? loadStorage() : loadStorage();
}

function resetDom(){
    while(postWrapper.hasChildNodes()){
        postWrapper.removeChild(postWrapper.firstChild);
    }
}

function init(){
    resetDom();
    setStorage();
}
