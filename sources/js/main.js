/**
 * 给定一个区间，生成区间内所有整数的数组
 * @param {number} l 区间起点
 * @param {number} r 区间终点
 * @returns 生成的序列数组
 */
function getRange(l, r) {
    let arr = [];
    for (let i = l; i < r; ++i){
        arr.push(i);
    }
    return arr
}

/**
 * 随机生成一个具有树结构的线性表，其节点为题目要求的结构
 * @param {number} N 节点数范围
 * @param {number} MIN 节点数最小值
 * @returns 生成的线性表
 */
function getRandomTable(N = 9, MIN = 3) {
    const length = Math.floor(Math.random() * N + MIN) // 随机节点数量
    let numArr = getRange(1, length), openArr = [0];
    let ret = new LinearTable();
    ret.idnum = length;
    ret.add(-1,'d0',0) // 插入根节点
    while (openArr.length > 0 && numArr.length > 0) {
        const nw = openArr[0]
        openArr.shift()
        const childNum = Math.floor(Math.random() * numArr.length + 1)
        for (let j = 0; j < childNum; ++j){
            const temp = Math.floor(Math.random() * numArr.length)
            openArr.push(numArr[temp])
            ret.add(nw, 'd' + j, numArr[temp])
            numArr.splice(temp,1)
        }
    }
    if (numArr.length > 0) {
        // 处理剩余节点，全部处理为叶节点
        for (let i = 0; i < numArr.length; ++i){
            ret.add(openArr[Math.floor(Math.random() * openArr.length)], 'd' + Math.floor(Math.random() * 10), i);
        }
    }
    console.log(ret.show().arr)
    return ret
}

/**
 * 获得id所在标签的value值
 * @param {string} id 标签的id
 * @returns value值
 */
 function getValue(id) {
    return document.getElementById(id).value;
}

/**
 * 初始化SVG缩放
 */
 function initSVGZoom() {
	const svgElement = document.getElementById('tree-canvas').childNodes[6];
    svgPanZoom(svgElement, {controlIconsEnabled: true});
};

/**
 * 展示B-树的SVG图像
 * @param {number} value 本次操作的值
 */
function drawTree (value) {
    const vizData = tree.toDOT(value); // 获得B-树的DOT文本
    console.log('vizData=',vizData)
    const treeCanvas = document.getElementById('tree-canvas');
    treeCanvas.innerHTML = Viz(vizData, "svg");
    initSVGZoom();
};

/**
 * 展示操作序列
 */
 function showInstrs() {
    const textArea = document.getElementById('text-operations');
     textArea.value = tree.log;
     textArea.scrollTop = textArea.scrollHeight;
};

/**
 * 展示树的图像和操作的内容
 * @param {number} value 本次操作的值，用于标红
 */
function displayTree(value) {
    // 调用2个函数完成相应功能
    drawTree(value)
    showInstrs()
}

/**
 * 调整按钮的状态
 * @param {string} id 按钮的ID
 * @param {boolean} disable 按钮是否禁用
 */
function toggleButton(id,disable) {
    document.getElementById(id).disabled = disable;
};

/**
 * 解锁按钮
 */
function enableButtons() {
    toggleButton('btn-edit-add', false);
    toggleButton('btn-edit-modify', false);
    toggleButton('btn-edit-del', false);
};

/**
 * 绑定初始化按钮的函数，用于初始化线性表和树
 * @param {boolean} isRand 是否初始化随机线性表
 */
function btnTreeInit(isRand) {
    let table=null
    if (isRand) {
        table=getRandomTable()
    }
    tree = new Tree(table);
    // 初始化log
    if (isRand) {
        tree.log+='随机初始化成功'
    } else {
        tree.log+='初始化空树成功'
    }
    displayTree();
    enableButtons(); // 解锁按钮
};

/**
 * 绑定添加按钮的相关函数
 */
function btnTreeInsert() {
    const id = parseInt(getValue('input-id')), data = getValue('input-data');
    const newId = tree.addNode(id, data); // 注意标红的id是新生成的id
    displayTree(newId);
};

/**
 * 绑定修改按钮的相关函数
 */
 function btnTreeModify() {
    const id = parseInt(getValue('input-id')), data = getValue('input-data');
    tree.modifyNode(id, data);
    displayTree(id);
};

/**
 * 绑定删除按钮的相关函数
 */
function btnTreeDelete() {
    const id = parseInt(getValue('input-id')); // delete时不需要获取data
    tree.deleteNode(id);
    displayTree();
};