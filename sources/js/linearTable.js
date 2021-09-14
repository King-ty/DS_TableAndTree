/**
 * 问题描述中的链表节点结构类
 * @param {number} id 节点id
 * @param {any} data 节点数据data
 * @param {number} pid 节点父节点的id
 * @param {LinearNode} next 下一个链表节点
 */
class LinearNode{
	constructor(id, data, pid, next = null) {
		this.id = id;
		this.data = data;
		this.pid = pid;
		this.next = next;
	}
}

/**
 * 链表类
 */
class LinearTable{
	constructor() {
		this.head = new LinearNode(-1, null, -1); // 链表头节点
		this.idnum = 0; // 用于生成id
		this.length = 0; // 链表长度（节点数量）
	}

	/**
	 * 在链表中添加节点
	 * @param {number} pid 添加节点的pid
	 * @param {any} data 添加节点的data数据
	 * @param {number} id 添加节点的id
	 * @returns 新节点对象
	 */
	add(pid, data, id) {
		this.length++;
		if (typeof id === 'undefined') {
			id = this.idnum++;
		}
		const newNode = new LinearNode(id, data, pid, this.head.next);
		this.head.next = newNode;
		return newNode
	}

	/**
	 * 删除节点
	 * @param {LinearNode} lnPre 要删除节点的前驱节点
	 */
	_delete(lnPre) {
		this.length--;
		lnPre.next = lnPre.next.next;
	}

	/**
	 * 删除节点
	 * @param {number} id 要删除节点的id
	 */
	delete(id) {
		this._delete(this.findNodeById(id).lnPre)
	}

	/**
	 * 按照id查找结点
	 * @param {number} id 要查找的节点id
	 * @returns 找到的节点前驱节点和该节点
	 */
	findNodeById(id) {
		for (let pre = this.head; pre.next !== null; pre = pre.next){
			if (pre.next.id === id) {
				return {lnPre:pre,ln:pre.next}
			}
		}
	}

	/**
	 * 用于展示链表结构
	 * @param {number} id 操作的节点id，用于标红
	 * @returns 遍历生成的数组和DOT格式字符串
	 */
	show(id) {
		// 本质就是按照DOT格式拼接字符串
		let ret = [];
		let DOT=''
		// let DOT='digraph gg {\nsplines="line";\nnode [shape = record, height = .1];\n'
		for (let ln = this.head.next,i=0; ln; ln = ln.next,++i){
			ret.push({ id: ln.id, data: ln.data, pid: ln.pid })
			DOT += 'node' + (this.length + i) + '[' + (ln.id === id ? 'color="red",' : '') + 'label=\"id=' + ln.id + ',data=' + ln.data + ',pid=' + ln.pid + '\"];\n';
			if (ln.next)
				DOT += "\"node" + (this.length + i) + "\" -> \"node" + (this.length + i + 1) + "\";\n";
		}
		// DOT += '}\n';
		return { arr: ret, DOT }
	}
}