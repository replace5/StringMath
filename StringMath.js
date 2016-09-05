(function(global) {
	// 获取小数位数
	function get_decimal_length(num) {
		return (String(num) + '.').split('.')[1].length;
	}

	// 获取整数位数
	function get_integer_length() {
		return String(num).split('.')[0].length;
	}

	// 补全小数位数
	function pad_decimal(num, length) {
		num = String(num);
		if (!length) {
			return num;
		}

		num += '.';
		num = num.split('.');

		while (num[1].length < length) {
			num[1] += '0';
		}
		num = num.slice(0, 2);

		return num.join('.');
	}

	// 补全整数位数
	function pad_integer(num, length) {
		num = String(num);
		num = num.split('.');

		while (num[0].length < length) {
			num[0] = '0' + num[0];
		}

		return num.join('.');
	}

	// 清除多余的0
	function clear0(str_num) {
		// 清除左侧的0
		while(str_num.charAt(0) === '0' && str_num.charAt(1) != '.' && str_num.length > 1) {
			str_num = str_num.substr(1);
		}

		// 清除小数点多余的0
		while(str_num.charAt(str_num.length - 1) === '0' && str_num.indexOf('.') > 0) {
			str_num = str_num.slice(0, -1);
		}

		// 如果最后一位是小数点，去除小数点
		if (str_num.indexOf('.') === str_num.length - 1) {
			str_num = str_num.slice(0, -1);
		}

		return str_num;
	}

	function find_index(arr, val) {
		for (var i = 0; i < arr.length; i++) {
			if (arr[i] === val) {
				return i;
			}
		}

		return -1;
	}

	// 字符串数字符号位处理
	var StringSymbol = {
		// 获取符号位，负为-1，正为1, 0返回0
		get: function(str_num) {
			str_num = String(str_num);
			clear0(str_num);
			if (str_num === '0') {
				return 0;
			}
			return String(str_num).charAt(0) === '-' ? -1 : 1;
		},
		// 清除符号位
		clear: function(str_num) {
			str_num = String(str_num);
			if (str_num.charAt(0) === '+' || str_num.charAt(0) === '-') {
				str_num = str_num.substr(1);
			}

			return str_num;
		},
		// 符号位取反
		navigate: function(str_num) {
			str_num = String(str_num);

			switch(str_num.charAt(0)) {
				case '-':
					str_num = str_num.substr(1);
				break;
				case '+':
					str_num = '-' + str_num.substr(1);
				break;
				default:
					str_num = '-' + str_num;
				break;
			}

			return str_num;
		}
	}

	var StringMath = {
		plus: function(a, b) {
			if (arguments.length > 2) {
				var ret = 0;
				for (var i = 0; i < arguments.length; i++) {
					ret = this.plus(ret, arguments[i]);
				}
				return ret;
			}

			b = b || 0;

			var origin_a = a = String(a);
			var origin_b = b = String(b);


			// 计算符号位
			var a_symbol = StringSymbol.get(a);
			var b_symbol = StringSymbol.get(b);

			a = StringSymbol.clear(a);
			b = StringSymbol.clear(b);

			// 加法从右向左计算，所以小数位数要相等
			var decimal_length = Math.max(get_decimal_length(a), get_decimal_length(b));
			if (decimal_length) {
				a = pad_decimal(a, decimal_length);
				b = pad_decimal(b, decimal_length);
			}

			// 进位数，默认0
			var carry = 0;
			// 缓存结果
			var buffer = '';
			var i = 0;
			var length = Math.max(a.length, b.length);
			while(i++ < length) {
				var a_digit = a.charAt(a.length - i);
				var b_digit = b.charAt(b.length - i);

				if (a_digit == '.' && b_digit == '.') {
					buffer = '.' + buffer;
					continue;
				}

				a_digit = a_symbol * Number(a_digit);
				b_digit = b_symbol * Number(b_digit);

				// a的当前位 + b的当前位 + 进位数
				var digit_num = a_digit + b_digit + carry;
				// 计算进位数
				carry = Math.floor(digit_num / 10);
				// 小于10的为当前位，放入缓存对应位置
				buffer = String((10 + digit_num) % 10) + buffer;
			}

			// 加完还剩下进位数，加上去
			if (carry > 0) {
				buffer = String(carry) + buffer;
			} else if (carry < 0) {
				// 小减大不能直接计算，转换为大减小
				buffer = this.plus(StringSymbol.navigate(origin_a), StringSymbol.navigate(origin_b));
				return StringSymbol.navigate(buffer);
			}

			buffer = clear0(buffer);
			
			return buffer;
		},
		subtract: function(a, b) {
			var args = [].slice.call(arguments, 0);

			// 减法改为有符号加法
			for (var i = 1; i < args.length; i++) {
				args[i] = StringSymbol.navigate(b);
			}

			return this.plus.apply(this, args);
		},
		multiply: function(a, b) {
			// 处理多个参数的情况
			if (arguments.length > 2) {
				var ret = 1;
				for (var i = 0; i < arguments.length; i++) {
					ret = this.multiply(ret, arguments[i]);
				}
				return ret;
			}

			b = b || 1;

			var origin_a = a = String(a);
			var origin_b = b = String(b);


			// 计算符号位
			var a_symbol = StringSymbol.get(a);
			var b_symbol = StringSymbol.get(b);

			a = StringSymbol.clear(a);
			b = StringSymbol.clear(b);

			// 乘法要把小数转为整数计算
			var decimal_length = Math.max(get_decimal_length(a), get_decimal_length(b));
			if (decimal_length) {
				a = pad_decimal(a, decimal_length);
				b = pad_decimal(b, decimal_length);
				a = a.split('.').join('');
				b = b.split('.').join('');
			}

			// 所有位缓存结果数组
			var buffer = [];
			var j = 0;
			while(j++ < a.length) {
				var a_digit = a.charAt(a.length - j);
				a_digit = Number(a_digit);

				var k = 0;
				// 进位数，默认0
				var carry = 0;
				// 一位缓存结果
				var digit_buffer = '';
				while(k++ < b.length) {
					var b_digit = b.charAt(b.length - k);
					b_digit = Number(b_digit);

					var digit_num = a_digit * b_digit + carry;

					// 计算进位数
					carry = Math.floor(digit_num / 10);
					// 小于10的为当前位，放入缓存对应位置
					digit_buffer = String((10 + digit_num) % 10) + digit_buffer;
				}

				if (carry) {
					digit_buffer = String(carry) + digit_buffer;
				}

				// 乘法的高位乘低位，要补上高位的0
				digit_buffer += new Array(j).join(0);

				buffer.push(digit_buffer);
			}

			// 把每位加起来
			buffer = this.plus.apply(this, buffer);

			// 小数点位置
			if (decimal_length) {
				buffer = [buffer.substr(0, decimal_length * 2), buffer.substr(decimal_length * 2)].join('.');
			}

			if (a_symbol * b_symbol === -1) {
				buffer = StringSymbol.navigate(buffer);
			}

			buffer = clear0(buffer);

			return buffer;
		},
		// 除法保留位数
		DIVIDE_DECIMAL_LIMIT: 5,
		divide: function(a, b) {
			// 处理多个参数的情况
			if (arguments.length > 2) {
				var ret = a;
				for (var i = 1; i < arguments.length; i++) {
					ret = this.divide(ret, arguments[i]);
				}
				return ret;
			}

			b = b || 1;


			var origin_a = a = String(a);
			var origin_b = b = String(b);


			// 计算符号位
			var a_symbol = StringSymbol.get(a);
			var b_symbol = StringSymbol.get(b);

			a = StringSymbol.clear(a);
			b = StringSymbol.clear(b);

			// 转换成整数
			var decimal_length = Math.max(get_decimal_length(a), get_decimal_length(b));
			if (decimal_length) {
				a = pad_decimal(a, decimal_length);
				b = pad_decimal(b, decimal_length);
				a = a.split('.').join('');
				b = b.split('.').join('');
			}


			// 下面是竖式计算
			var b_lenth = b.length;
			// 余数
			var remain = '';
			// 缓存
			var buffer = '';

			// 整数余数
			var int_remain = '';
			// 整数商
			var int_buffer = '';

			var w = 5000;
			// 根据保留的小数位，判断何时跳出循环
			// 多计算一位，四舍五入
			while(get_decimal_length(buffer) <= this.DIVIDE_DECIMAL_LIMIT) {
				
				// 初始当前位被除数为余数
				var a_digit = remain;

				// 如果a有长度，则截取1位，不够长度就补小数0
				if (a.length) {
					a_digit += a.charAt(0);
					a = a.substr(1);
				} else {
					a_digit += '0';
					// 补上小数点
					if (buffer.indexOf('.') === -1) {

						// 进入小数运算了，此处记录下整数的商和余
						int_remain = remain;
						int_buffer = buffer;
						buffer += '.';
					}
				}

				// 从0开始到9逐个尝试
				for (var i = 0; i <= 9; i++) {
					// 从小到大尝试，如果下一个值与b的乘积小于当前位的被除数，则商的当前位为i
					var trial = this.multiply(i + 1, b);
					if (this.gt(trial, a_digit)) {
						buffer += i;
						// 求余数
						remain = this.subtract(a_digit, this.multiply(i, b));
						break;
					}
				}

				if (w -- <= 0) {
					break;
				}
			}

			// 把此次计算的整数位的商和余公布出去
			this._divide_remain = clear0(int_remain);
			this._divide_int_result = clear0(int_buffer);

			// 四舍五入
			return this.toFixed(buffer, this.DIVIDE_DECIMAL_LIMIT);

		},
		mod: function(a, b) {
			// 求模运算直接保留0位小数，取余数
			var origin_decimal_limit = this.DIVIDE_DECIMAL_LIMIT;
			this.DIVIDE_DECIMAL_LIMIT = 0;
			this.divide(a, b);
			this.DIVIDE_DECIMAL_LIMIT = origin_decimal_limit;
			return this._divide_remain;
		},
		eq: function(a, b) {
			return StringSymbol.get(this.subtract(a, b)) === 0;
		},
		gt: function(a, b) {
			return StringSymbol.get(this.subtract(a, b)) === 1;
		},
		gte: function(a, b) {
			return StringSymbol.get(this.subtract(a, b)) >= 0;
		},
		// a小于b
		lt: function(a, b) {
			return StringSymbol.get(this.subtract(a, b)) === -1;
		},
		// a小于等于b
		lte: function(a, b) {
			return StringSymbol.get(this.subtract(a, b)) <= 0;
		},
		// 最大值
		max: function(a) {
			if (arguments.length > 2) {
				var ret = a;
				for (var i = 1; i < arguments.length; i++) {
					ret = this.max(ret, arguments[i]);
				}
				return ret;
			}

			return this.gte(a, b) ? String(a) : String(b);
		},
		// 最小值
		min: function(a) {
			if (arguments.length > 2) {
				var ret = a;
				for (var i = 1; i < arguments.length; i++) {
					ret = this.min(ret, arguments[i]);
				}
				return ret;
			}

			return this.lte(a, b) ? String(a) : String(b);
		},
		// 四舍五入
		round: function(str_num) {
			var arr = (String(str_num) + '.').split('.');

			if (arr[1].charAt(0) >= 5) {
				return this.plus(arr[0], 1);
			}

			return arr[0];
		},
		// 向上取整
		ceil: function(str_num) {
			var arr = (String(str_num) + '.').split('.');
			return this.plus(arr[0], 1);
		},
		// 向下取整
		floor: function(str_num) {
			var arr = (String(str_num) + '.').split('.');
			return arr[0];
		},
		// 绝对值
		abs: function(str_num) {
			return StringSymbol.clear(str_num);
		},
		// 四舍五入小数到指定位
		toFixed: function(str_num, decimal_length) {
			var arr = (String(str_num) + '.').split('.');
			arr = arr.slice(0, 2);

			if (arr[1].charAt(decimal_length) >=5) {
				arr[1] = this.plus(arr[1].substr(0, decimal_length), 1)
			} else {
				arr[1] = arr[1].substr(0, decimal_length);
			}


			return clear0(arr.join('.'));
		},
		//  指数运算
		//  index不支持小数
		pow: function(base, index) {
			switch(index) {
				case 2:
					return this.multiply(base, base);
				case 1:
					return String(base);
				case 0:
					return '1';

			}
			// 处理小数
			if (index < 0) {
				index *= -1;
				return this.divide(1, this.pow(base, index));
			}

			// 采用递归二分法，减少运算
			var half_index = Math.floor(index / 2);
			var half_muti = Math.pow(base, half_index);

			var ret = this.pow(half_muti, 2);
			if (index % 2) {
				ret = this.multiply(ret, base); 
			}

			return ret;
		},
		CHAR_MAP: '0123456789abcdefghijklmnopqrstuvwxyz',
		// 转换为36进制及以下的进制
		system: function(str_num, radix) {
			str_num = String(str_num);

			var str_symbol = StringSymbol.get(str_num);
			str_num = StringSymbol.clear(str_num);

			var ret = '';
			do {
				this.divide(str_num, radix);
				str_num = this._divide_int_result;
				var dec_digit = this._divide_remain;
				var sys_digit = this.CHAR_MAP.charAt(dec_digit);
				ret = sys_digit + ret;
				
			} while (!this.eq(str_num, 0));


			if (str_symbol === -1) {
				ret = this.navigate(ret);
			}

			return clear0(ret);
		},
		// 转2进制
		bin: function(str_num) {
			return this.system(str_num, 2);
		},
		// 转8进制
		oct: function(str_num) {
			return this.system(str_num, 8);
		},
		// 转16进制
		hex: function(str_num) {
			return this.system(str_num, 16);
		},
		// 36进制转10进制
		dec: function(str_num, radix) {
			str_num = String(str_num);
			var ret = '';
			for (var i = 0 ; i < str_num.length; i++) {
				var digit_sys = str_num.charAt(i);
				var digit_dec = find_index(CHAR_MAP, digit_sys);

				if (digit_dec === -1) {
					break;
				}

				ret = this.plus(ret, this.multiply(digit_dec, this.pow(radix, str_num.length - i - 1)));
			}

			return ret;
		}
	}

	global.StringMath = StringMath;
})(this);
