function VerifyCodeFactory(options) { //创建一个图形验证码对象，接收options对象为参数
  this.options = { //默认options参数值
    id: "", //容器Id
    canvasId: "verifyCanvas", //canvas的ID
    width: "100", //默认canvas宽度
    height: "30", //默认canvas高度
    type: "blend", //图形验证码默认类型blend:数字字母混合类型、number:纯数字、letter:纯字母
    code: ""
  }

  if (Object.prototype.toString.call(options) === "[object Object]") {//判断传入参数类型
    Object.assign(this.options, options)
  } else {
    this.options.id = options;
  }

  this.options.numArr = "0,1,2,3,4,5,6,7,8,9".split(",");
  this.options.letterArr = getAllLetter();

  this._init();
  this.refresh();
}

VerifyCodeFactory.prototype = {
  /**版本号**/
  version: '1.0.0',

  /**初始化方法**/
  _init: function () {
    let con = document.getElementById(this.options.id);
    let canvas = document.createElement("canvas");
    this.options.width = con.offsetWidth > 0 ? con.offsetWidth : "100";
    this.options.height = con.offsetHeight > 0 ? con.offsetHeight : "30";
    canvas.id = this.options.canvasId;
    canvas.width = this.options.width;
    canvas.height = this.options.height;
    canvas.style.cursor = "pointer";
    canvas.innerHTML = "您的浏览器版本不支持canvas";
    con.appendChild(canvas);
    let parent = this;
    canvas.onclick = function () {
      parent.refresh();
    }
  },

  /**生成验证码**/
  refresh: function () {
    this.options.code = "";
    let canvas = document.getElementById(this.options.canvasId);
    if (!canvas.getContext) {
      return;
    }

    let ctx = canvas.getContext('2d');

    ctx.textBaseline = "middle";

    ctx.fillStyle = randomColor(180, 240);
    ctx.fillRect(0, 0, this.options.width, this.options.height);

    let txtArr = this._determineVerifyType();

    for (let i = 1; i <= 4; i++) {
      let txt = txtArr[randomNum(0, txtArr.length)];
      this.options.code += txt;
      ctx.font = randomNum(this.options.height / 2, this.options.height) + 'px SimHei'; //随机生成字体大小
      ctx.fillStyle = randomColor(50, 160); //随机生成字体颜色
      ctx.shadowOffsetX = randomNum(-3, 3);
      ctx.shadowOffsetY = randomNum(-3, 3);
      ctx.shadowBlur = randomNum(-3, 3);
      ctx.shadowColor = "rgba(0, 0, 0, 0.3)";
      let x = this.options.width / 5 * i;
      let y = this.options.height / 2;
      let deg = randomNum(-30, 30);
      /**设置旋转角度和坐标原点**/
      ctx.translate(x, y);
      ctx.rotate(deg * Math.PI / 180);
      ctx.fillText(txt, 0, 0);
      /**恢复旋转角度和坐标原点**/
      ctx.rotate(-deg * Math.PI / 180);
      ctx.translate(-x, -y);
    }
    /**绘制干扰线**/
    for (let i = 0; i < 4; i++) {
      ctx.strokeStyle = randomColor(40, 180);
      ctx.beginPath();
      ctx.moveTo(randomNum(0, this.options.width), randomNum(0, this.options.height));
      ctx.lineTo(randomNum(0, this.options.width), randomNum(0, this.options.height));
      ctx.stroke();
    }
    /**绘制干扰点**/
    for (let i = 0; i < this.options.width / 4; i++) {
      ctx.fillStyle = randomColor(0, 255);
      ctx.beginPath();
      ctx.arc(randomNum(0, this.options.width), randomNum(0, this.options.height), 1, 0, 2 * Math.PI);
      ctx.fill();
    }
  },

  /**验证验证码**/
  validate: function (code) {
    code = code && code.toLowerCase();
    let v_code = this.options.code.toLowerCase();
    return code === v_code;
  },

  _determineVerifyType: function () {
    switch (this.options.type) {
      case "blend":
        return this.options.numArr.concat(this.options.letterArr);
      case "number":
        return this.options.numArr;
      default:
        return this.options.letterArr;
    }
  }
}

/**生成字母数组**/
function getAllLetter() {
  let letters = [];
  // 大写字母
  for (let i = 65; i < 91; i++) {
    letters.push(String.fromCharCode(i));
  }

  // 小写字母
  for (let i = 97; i < 123; i++) {
    letters.push(String.fromCharCode(i));
  }

  return letters
}

/**生成一个随机数**/
function randomNum(min, max) {
  return Math.floor(Math.random() * (max - min) + min);
}

/**生成一个随机色**/
function randomColor(min, max) {
  let r = randomNum(min, max);
  let g = randomNum(min, max);
  let b = randomNum(min, max);
  return `rgb(${r},${g},${b})`;
}

export default VerifyCodeFactory
