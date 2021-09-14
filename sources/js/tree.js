/**
 * 树节点类
 * @param {number} id 树节点所对应线性表节点的id值
 * @param {any} data 树节点所对应线性表节点的data值
 * @param {LinearNode} ln 树节点所对应线性表节点
 * @param {TreeNode} parent 该节点的父节点
 * @param {Array} children 该节点的子节点数组
 */
class TreeNode{
	constructor(id, data, ln, parent, children = []) {
		this.id = id;
		this.data = data;
		this.ln = ln;
		this.parent = parent;
		this.children = children;
	}
}

/**
 * 树类
 * @param {LinearTable} table 具有树结构的线性表
 */
class Tree{
	constructor(table = null) {
		this.root = new TreeNode(-1, null, null, null); // 树的根节点
		this.log = ''; // 操作记录
		if (table === null) {
			this.table = new LinearTable();
		}
		else {
			this.table = table;
			this.tableToTree();
		}
	}

	/**
	 * 将LinearTable转为Tree
	 */
	tableToTree() {
		let arr=[]
		for (let ln = this.table.head.next; ln; ln = ln.next){
			arr.push(ln);
		}
		// 注意逆序操作，因为使用的时链表头插法，需要按照链表插入的顺序插入树节点
		for (let i = arr.length - 1; i >= 0; --i){
			const ln = arr[i];
			this._addNode(ln.pid,ln.id,ln.data,ln)
		}
	}

	/**
	 * 递归查找id所在节点函数
	 * @param {TreeNode} tn 当前遍历到的节点对象
	 * @param {number} id 要查找的id值
	 * @returns 如果能找到id，则返回id所在节点；否则返回null
	 */
	_findNodeById(tn, id) {
		if (tn.id === id) {
			// 找到了
			return tn
		}
		for (let i = 0; i < tn.children.length; ++i){
			// 查找所有子节点
			const ret = this._findNodeById(tn.children[i], id);
			if (ret !== null)
				return ret;
		}
		return null // 找不到返回null
	}

	/**
	 * 查找id所在节点函数
	 * @param {number} id 要查找的id值
	 * @returns 如果能找到id，则返回id所在节点；否则返回null
	 */
	findNodeById(id) {
		return this._findNodeById(this.root, id)
	}

	/**
	 * 从节点的父节点移除该节点
	 * @param {TreeNode} tn 要移除的树节点
	 */
	removeChild(tn) {
		let ptn = tn.parent;
		ptn.children.splice(ptn.children.findIndex(child => { return child === tn }), 1)
	}

	/**
	 * 递归删除子树
	 * @param {TreeNode} tn 当前要删除的子树的根节点
	 */
	_deleteNode(tn) {
		tn.children.forEach(child => {
			this._deleteNode(child);
		})
		this.table.delete(tn.id);
	}

	/**
	 * 删除子树
	 * @param {number} id 要删除节点的id
	 */
	deleteNode(id) {
		const tn = this.findNodeById(id);
		if (tn !== null) {
			this._deleteNode(tn);
			if (tn !== this.root) {
				this.removeChild(tn)
			}
			this.log += '\n\n删除节点' + id + '成功'
			console.log('删除节点' + id + '成功')
		}
		else {
			this.log += '\n\n删除节点' + id + '失败：找不到该节点'
			console.log('删除节点' + id + '失败：找不到该节点')
			alert('删除节点' + id + '失败：找不到该节点')
		}
	}

	/**
	 * 插入节点
	 * @param {number} pid 要插入节点的父节点的id
	 * @param {number} id 要插入节点的id
	 * @param {any} data 要插入节点的数据
	 * @param {LinearNode} ln 要插入节点对应的线性表中的节点
	 */
	_addNode(pid, id, data, ln) {
		const ptn = this.findNodeById(pid); // 找到父节点
		const newNode = new TreeNode(id, data, ln, ptn)
		ptn.children.push(newNode) // 直接插在父节点末尾
	}

	/**
	 * 添加新节点
	 * @param {number} pid 要插入的新节点的父节点id
	 * @param {any} data 要插入节点的数据
	 * @returns 新节点的id
	 */
	addNode(pid, data) {
		if (this.root.children.length === 0) {
			pid = -1;
		}
		if (this.findNodeById(pid) === null) {
			this.log += '\n\n在父节点' + pid + '下插入结点失败：找不到id'
			console.log('在父节点' + pid + '下插入结点失败：找不到id')
			alert('要插入的父结点不存在！')
			return
		}
		const ln = this.table.add(pid, data); // 在线性表中插入新节点
		this._addNode(pid, ln.id, data, ln) // 在树上插入新节点
		this.log+='\n\n在父节点' + pid + '下插入结点成功'
		return ln.id
	}

	/**
	 * 修改节点信息
	 * @param {number} id 要修改的节点id
	 * @param {any} data 要改为的值
	 */
	modifyNode(id, data) {
		const tn = this.findNodeById(id)
		if (tn === null) {
			this.log += '\n\n调整节点' + id + '失败：找不到该节点'
			console.log('\n\n调整节点' + id + '失败：找不到该节点')
			alert('找不到该节点！')
			return 
		}
		tn.data = tn.ln.data = data;
		this.log += '\n\n调整节点' + id + '成功'
		console.log('\n\n调整节点' + id + '成功')
	}

	/**
	 * 将树转为DOT格式的中间遍历函数
	 * @param {BNode} tn 当前节点对象
	 * @param {number} id 调用该函数时操作的id，用于标红
	 * @param {Counter} no 计数器，用于唯一标识节点
	 * @returns 该节点在DOT中的节点名称和该子树转出的DOT格式字符串
	 */
	 _toDOT(tn, id, no = new Counter) {
		// 本质就是按照DOT格式拼接字符串
		const nodeid = 'node' + no.add()
		let str=nodeid + '['+(tn.id === id ? 'color="red",':'')+'label=\"id='+tn.id+',data='+tn.data+'\"];\n'
		for (let i = 0; i < tn.children.length; ++i){
			const ret = this._toDOT(tn.children[i],id, no)
			str += "\"" + nodeid + "\" -> \"" + ret.nodeid + "\";\n"
			str+=ret.str
		}
		return { nodeid, str }
	}

	/**
	 * 将树和链表转为DOT格式用于显示图片
	 * @param {number} id 调用该函数时操作的id，用于标红
	 * @returns 生成的DOT格式字符串
	 */
	toDOT(id) {
		// return this.table.show().DOT;
		return 'digraph g {\nsplines="line";\nnode [shape = record, height = .1];\n' + (this.root.children.length > 0 ? this._toDOT(this.root.children[0], id).str : '') + this.table.show(id).DOT + '}\n';
	}
}

/**
 * @class 计数器类
 * @param {number} count 计数器的值
 */
 class Counter {
	constructor() {
		this.count = 0;
	}

	add() {
		return this.count++;
	}
}
