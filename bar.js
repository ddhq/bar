window.Modal = function() {
	var reg = new RegExp("\\[([^\\[\\]]*?)\\]", 'igm');
	var alr = $("#modal-confirm");
	var ahtml = alr.html();
	var _alert = function(options) {
		alr.html(ahtml); // 复原
		//		alr.find('.ok').removeClass('btn-success').addClass('btn-primary');
		alr.find('.cancel').hide();
		_dialog(options);
		return {
			on: function(callback) {
				if(callback && callback instanceof Function) {
					alr.find('.ok').click(function() {
						callback(true)
					});
				}
			}
		};
	};
	var _confirm = function(options) {
		alr.html(ahtml); // 复原
		//		alr.find('.ok').removeClass('btn-primary').addClass('btn-success');
		alr.find('.cancel').show();
		_dialog(options);
		return {
			on: function(callback) {
				if(callback && callback instanceof Function) {
					alr.find('.ok').click(function() {
						callback(true)
					});
					alr.find('.cancel').click(function() {
						callback(false)
					});
				}
			}
		};
	};
	var _dialog = function(options) {
		var ops = {
			msg: "提示内容",
			title: "操作提示",
			btnok: "确定",
			btncl: "取消"
		};
		$.extend(ops, options);
		var html = alr.html().replace(reg, function(node, key) {
			return {
				Title: ops.title,
				Message: ops.msg,
				BtnOk: ops.btnok,
				BtnCancel: ops.btncl
			}[key];
		});
		alr.html(html);
		alr.modal({
			width: 700,
			backdrop: 'static'
		});
	}
	return {
		alert: _alert,
		confirm: _confirm
	}
}();

$().ready(() => {
	var num = 1;
	$('#balabala').on('click', function() {
		movelo();
	});

	function movelo() {
		var htmlWidth = $("html").width();
		if(num % 2 == 1) {
			$("#balabala").attr({
				title: '显示左侧导航'
			});
			$("#balabala").css({
				transform: 'rotate(-90deg)',
			}, 500)
			$(".sidebarNavDiv").animate({
				left: '-194px'
			}, 500);
			$(".sbright").animate({
				left: '-194px',
				width: htmlWidth - 10
			}, 500)
		} else {
			$("#balabala").attr({
				title: '隐藏左侧导航'
			});
			$("#balabala").css({
				transform: 'rotate(0deg)',
			}, 500)
			$(".sidebarNavDiv").animate({
				left: '0'
			}, 500);
			$(".sbright").animate({
				left: '0',
				width: htmlWidth - 210
			}, 500)
		}
		num++;
		$('#balabala').unbind('click');
		setTimeout(function() {
			$('#balabala').on("click", movelo);
		}, 500)
	}

	$(".slideUpDowntitle").on("click", function() {
		var status = $(this).next().attr("status");
		if(status == 0) {
			$(this).next().slideUp();
			$(this).children('.linkNav').html("+").css("left", "20px");
			$(this).next().attr("status", 1);
		} else {
			$(this).next().slideDown();
			$(this).children('.linkNav').html("-").css("left", "23px");
			$(this).next().attr("status", 0);
		}
	});

	var htmlWidth = $("html").width();
	var windowHeight = $(window).height();
	var headuiHeight = $('.headui').height() + 15;
	$('.headui').css({
		width: htmlWidth + 25
	});
	$(".sbright").css({
		"width": htmlWidth - 210,
		'min-height': windowHeight - 80,
		'margin-top': headuiHeight
	});
	$(".sidebarNavDiv").css({
		"height": windowHeight - 68,
		'margin-top': headuiHeight
	});

	$(window).resize(function() {
		var htmlWidth = $("html").width();
		var windowHeight = $(window).height();
		var headuiHeight = $('.headui').height() + 15;
		$('.headui').css({
			width: htmlWidth + 25
		});
		$(".sbright").css({
			"width": htmlWidth - 210,
			'min-height': windowHeight - 80,
			'margin-top': headuiHeight
		});
		$(".sidebarNavDiv").css({
			"height": windowHeight - 68,
			'margin-top': headuiHeight
		});
	});

	$('.username').on('click', function() {
		if($('.usernamegroup').css('display') == 'none') {
			$('.usernamegroup').slideDown();
		} else {
			$('.usernamegroup').slideUp();
		}
	});
	$('.usernamegroup p').on('click', function() {
		var tmp_u = $(this).text();
		$('.username').text(tmp_u);
		$('.usernamegroup').slideUp();
		cloudC = new CloudC(tmp_u);
	});

	// 读取数据库信息
	// 云端应用帐户ID
	var cloudID = "m1001";
	var cloudC = new CloudC("");;
	var obj = cloudC.readOnlyCall(cloudID, "0", "getcloudQADB", "", {});
	var db = JSON.parse(obj.result);

	// 准备问题数组
	var q_arr = [];
	q_arr = db.q_arr;

	// 准备答案数组
	var a_arr = [];
	a_arr = db.a_arr;

	$('#question_table').bootstrapTable({
		toolbar: '#nav',
		pagination: true,
		search: true,
		showColumns: true,
		clickToSelect: true,
		selectItemName: 'tableaName',
		pageSize: 5,
		columns: [{
				field: 'statusa',
				radio: true
			},
			{
				field: 'qid',
				title: '问题id',
				switchable: false,
				visible: false
			},
			{
				field: 'qstatus',
				title: 'qstatus',
				switchable: false,
				visible: false
			},
			{
				field: 'user',
				title: '发题人'
			},
			{
				field: 'price',
				title: '赏金'
			},
			{
				field: 'qtext',
				title: '状态'
			},
			{
				field: 'qcontent',
				title: '内容'
			},
		]
	});
	$('#question_table').bootstrapTable('load', q_arr);

	$('#reply_table').bootstrapTable({
		pagination: true,
		search: true,
		showColumns: true,
		clickToSelect: true,
		selectItemName: 'replyName',
		pageSize: 3,
		columns: [{
				field: 'status',
				radio: true
			},
			{
				field: 'qid',
				title: '问题id',
				switchable: false,
				visible: false
			},
			{
				field: 'aid',
				title: '回复id',
				switchable: false,
				visible: false
			},
			{
				field: 'user',
				title: '回复人'
			},
			{
				field: 'astatus',
				title: '回复类型'
			},
			{
				field: 'acontent',
				title: '回复内容'
			},
		]
	});

	// 点击问题，显示与问题相关答复
	$('#question_table').on('check.bs.table', function() {
		var selected_q = $('#question_table').bootstrapTable('getSelections')[0];
		console.log(selected_q.qid);
		var related_answer_arr = get_related_answer_arr('qid', selected_q.qid, a_arr);
		// 刷新回复表
		$('#reply_table').bootstrapTable('load', related_answer_arr);
	});

	$('#newq').on('click', function() {
		// 登录检查
		if($('.username').text() == '请登录') {
			Modal.alert({
				title: '提示',
				msg: '请先登录！',
				btnok: '确定',
				btncl: '取消',
			}).on(function(e) {

			});
			return;
		}

		$('#myModal1').modal({
			backdrop: 'static',
			keyboard: false
		});
	});
	
	// 确认最佳答案、删除问题按钮
	$('#pay').hide();
	$('#delq').hide();
	$('#dela').hide();

	// 回复按钮
	$('#req').on('click', function() {
		if($('#question_table').bootstrapTable('getSelections').length == 0) {
			Modal.alert({
				title: '提示',
				msg: '请选择要回答的问题！',
				btnok: '确定',
				btncl: '取消',
			}).on(function(e) {

			});
			return;
		}

		// 不能回复自己发布的问题
		var current_u = $('.username').text();
		var selected_q = $('#question_table').bootstrapTable('getSelections')[0];
		if(current_u == selected_q.user) {
			Modal.alert({
				title: '提示',
				msg: '你不可以回复自己发布的问题！',
				btnok: '确定',
				btncl: '取消',
			}).on(function(e) {

			});
			return;
		}

		$('#myModal2').modal({
			backdrop: 'static',
			keyboard: false
		});
	});

	// 确认发布按钮
	$('#btnOk').on('click', function() {
		var q_content = $('#txtDes').val();
		var qid = 0;
		if(q_arr.length > 0) {
			qid = q_arr[q_arr.length - 1].qid + 1;
		}
		var new_q = {
			'qid': qid,
			'user': $('.username').text(),
			'price': $('#price').val(),
			'qstatus': 'unsolve',
			'qtext': '等待解答',
			'qcontent': q_content
		};

		// 金额是否为数字
		if(!isRealNum(new_q.price)) {
			Modal.alert({
				title: '提示',
				msg: '赏金需为数字！',
				btnok: '确定',
				btncl: '取消',
			}).on(function(e) {

			});
			return;
		}
		// 问题是否为空
		if(new_q.qcontent == '' || new_q.qcontent.indexOf(" ") != -1) {
			Modal.alert({
				title: '提示',
				msg: '问题不允许为空！',
				btnok: '确定',
				btncl: '取消',
			}).on(function(e) {

			});
			return;
		}

		q_arr.push(new_q); // 添加到问题数组
		// 保存到数据库
		// 转账到平台
		db.q_arr = q_arr;
		var r = cloudC.call(cloudID, new_q.price, "dbSave", "['cloudQA_db'," + JSON.stringify(db) + "]", {});
		if(r) {
			Modal.alert({
				title: '提示',
				msg: '发布成功！',
				btnok: '确定',
				btncl: '取消',
			}).on(function(e) {

			});
		} else {
			Modal.alert({
				title: '提示',
				msg: '发布失败！',
				btnok: '确定',
				btncl: '取消',
			}).on(function(e) {

			});
			//失败回滚
			q_arr.pop();
			db.q_arr = q_arr;
			cloudC.call(cloudID, "0", "dbSave", "['cloudQA_db'," + JSON.stringify(db) + "]", {});
		}

		$('#question_table').bootstrapTable('load', q_arr);

		$('#myModal1').modal('hide');
	});

	// 确认回复按钮
	$('#btnOk2').on('click', function() {
		var selected_q = $('#question_table').bootstrapTable('getSelections')[0];
		var a_content = $('#txtRep').val();
		var aid = 0;
		if(a_arr.length > 0) {
			aid = q_arr[a_arr.length - 1].qid + 1;
		}

		var new_a = {
			'qid': selected_q.qid,
			'aid': aid,
			'user': $('.username').text(),
			'astatus': '普通回复',
			'acontent': a_content
		};
		// 问题是否为空
		if(new_a.acontent == "" || new_a.acontent.indexOf(" ") != -1) {
			Modal.alert({
				title: '提示',
				msg: '回复不允许为空！',
				btnok: '确定',
				btncl: '取消',
			}).on(function(e) {

			});
			return;
		}

		// 添加新的回复到回复数组
		a_arr.push(new_a)

		//添加新的回复到回复数据表
		$('#reply_table').bootstrapTable('insertRow', {
			'index': 0,
			'row': new_a
		});
		
		// 更新问题状态为已解答

		// 保存到数据库
		db.a_arr = a_arr;
		cloudC.call(cloudID, "0", "dbSave", "['cloudQA_db'," + JSON.stringify(db) + "]", {});

		$('#myModal2').modal('hide');
	});

	// 确认最佳答案按钮
	$('#pay').on('click', function() {
		var selected_a = $('#reply_table').bootstrapTable('getSelections')[0];
		if(!selected_a) {
			Modal.alert({
				title: '提示',
				msg: '请选择最佳答案！',
				btnok: '确定',
				btncl: '取消',
			}).on(function(e) {

			});
			return;
		}
		// 已打赏过
		var selected_q = $('#question_table').bootstrapTable('getSelections')[0];
		if(selected_q.qstatus != 'unsolve') {
			Modal.alert({
				title: '提示',
				msg: '问题已有最佳答案！',
				btnok: '确定',
				btncl: '取消',
			}).on(function(e) {

			});
			return;
		}

		// 是否打赏自己发布的问题
		var current_u = $('.username').text();
		var selected_q = $('#question_table').bootstrapTable('getSelections')[0];
		if(current_u != selected_q.user) {
			Modal.alert({
				title: '提示',
				msg: '你不可以打赏别人发布的问题！',
				btnok: '确定',
				btncl: '取消',
			}).on(function(e) {

			});
			return;
		}

		// 弹出确认提示
		Modal.confirm({
			title: '提示',
			msg: '是否确认最佳答案？',
			btnok: '确定',
			btncl: '取消',
		}).on(function(e) {
			if(e) {
				// 保存原有数据，在转账失败时回退
				var old_q_arr = JSON.parse(JSON.stringify(q_arr));
				var old_a_arr = JSON.parse(JSON.stringify(a_arr));

				// 执行打赏  TODO 更新表格方法不合理，待修改
				a_arr = update_selected_answer(selected_a.aid, a_arr);
				q_arr = update_paied_question(selected_q.qid, q_arr, 'solved');

				// 保存到数据库
				db.q_arr = q_arr;
				db.a_arr = a_arr;
				var r = cloudC.call(cloudID, "0", "renrenTakeout", "[ \"" + selected_a.user + "\", \"" + selected_q.price + "\", \'" + JSON.stringify(db) + "\']", {});
				if(r) {
					Modal.alert({
						title: '提示',
						msg: '打赏成功！',
						btnok: '确定',
						btncl: '取消',
					}).on(function(e) {

					});
				} else {
					Modal.alert({
						title: '提示',
						msg: '打赏失败！',
						btnok: '确定',
						btncl: '取消',
					}).on(function(e) {

					});
					q_arr = old_q_arr;
					a_arr = old_a_arr;
					db.q_arr = q_arr;
					db.a_arr = a_arr;
				}

				// 加载数据到表格
				var related_answer_arr = get_related_answer_arr('qid', selected_q.qid, a_arr);
				$('#reply_table').bootstrapTable('load', related_answer_arr);
				$('#question_table').bootstrapTable('load', q_arr);
			}
		});

	});  // 确认最佳答案 end
	
	// 问答大厅、我的提问、我的回答切换
	$('#hall').click(function () {
		console.log('hall');
		$('#a_div').hide();
		$('#pay').hide();
		$('#delq').hide();
		$('#dela').hide();
		
		$('#newq').show();
		$('#req').show();
		
		// 加载所有等待解答的问题到问题列表
		var related_answer_arr = get_related_answer_arr('qstatus', 'unsolve', a_arr);
		$('#question_table').bootstrapTable('load', q_arr);
	});
	
	$('#myq').click(function () {
		console.log('q');
		// 屏蔽发布新问题、回复
		$('#newq').hide();
		$('#req').hide();
		$('#dela').hide();
		
		$('#pay').show();
		$('#delq').show();
	});
	
	$('#mya').click(function () {
		console.log('a');
		$('#a_div').show();
		$('#dela').show();
		
		$('#pay').hide();
		$('#delq').hide();
	});
});

/*public function*/

// 更新需要打赏的回复
function update_selected_answer(aid, a_arr) {
	for(i = 0; i < a_arr.length; i++) {
		if(a_arr[i].aid == aid) {
			a_arr[i].astatus = '最佳回复';
			break;
		}
	}
	return a_arr;
}

// 更新已打赏的问题
function update_paied_question(qid, q_arr, status) {
	for(i = 0; i < q_arr.length; i++) {
		if(q_arr[i].qid == qid) {
			q_arr[i].qstatus = status;
			break;
		}
	}
	return q_arr;
}

// 更新所有问题的状态显示
function update_question_text(q_arr) {
	for(i = 0; i < q_arr.length; i++) {
		if(q_arr[i].qid == qid) {
			q_arr[i].qstatus = 'solved';
			break;
		}
	}
	return q_arr;
}

/*判断是否是数字*/
function isRealNum(val) {
	// isNaN()函数 把空串 空格 以及NUll 按照0来处理 所以先去除
	if(val === "" || val == null) {
		return false;
	}
	if(!isNaN(val)) {
		return true;
	} else {
		return false;
	}
}

/*
 返回指定条件的问题
 k: 'qid'  需要过滤的字段名
 v: 1      需要过滤的字段值
 a_arr:  [{}, {}] 数据源
 * */
function get_related_answer_arr(k, v, a_arr) {
	var related_answer_arr = [];
	for(i = 0; i < a_arr.length; i++) {
		if(a_arr[i][k] == v) {
			related_answer_arr.push(a_arr[i]);
		}
	}

	return related_answer_arr;
}
