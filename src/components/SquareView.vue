<template>
  <div class="main">
    <div class="header">
      <span style="align-self: center;font-size: 30px;color: #adadad;cursor: pointer;" class="nav_btn"><i
        class="fa fa-navicon"></i></span>
      <span style="align-self: center;font-size: 30px;font-weight: bold;margin-left: 40px">{{ title }}</span>
    </div>
    <a-row :gutter="20" style="padding: 20px">
      <a-col v-for="index in 3" :span="8" :key="index">
        <div>
          <div style="position: absolute;top: 3px;left: 3px;color: gray;font-size: 12px">
            <!--IP：{{arr[index-1]===''?'':arr[index-1].c_ip}}-->
            <!--&nbsp;&nbsp;&nbsp;-->
            <span style="font-size: 24px;font-weight: bold;padding-left: 20px"
                  :style="{color:arr[index-1]===''?'lightgrey':'black'}">{{ index }}</span>
          </div>
          <div class="result_img">
            <div v-show="btn"
                 style="position: absolute;bottom: 1px;right: 1px;background: black;height: 8px;width: 8px"></div>
            <img v-show="imgSrc[index-1]!==''" :src="imgSrc[index-1]" alt="pic" style="height: 100%;width: 100%">
          </div>
        </div>
      </a-col>
      <a-col v-for="index in 6" v-if="index>3" :span="8" :key="index" style="margin-top: 20px">
        <div>
          <div style="position: absolute;top: 3px;left: 3px;color: gray;font-size: 12px">
            <!--IP：{{arr[index-1]===''?'':arr[index-1].c_ip}}-->
            <!--&nbsp;&nbsp;&nbsp;-->
            <span style="font-size: 24px;font-weight: bold;padding-left: 20px"
                  :style="{color:arr[index-1]===''?'lightgrey':'black'}">{{ index }}</span>
          </div>
          <div class="result_img">
            <div v-show="btn"
                 style="position: absolute;bottom: 1px;right: 1px;background: black;height: 8px;width: 8px"></div>
            <img v-show="imgSrc[index-1]!==''" :src="imgSrc[index-1]" alt="pic" style="height: 100%;width: 100%">
          </div>
        </div>
      </a-col>
    </a-row>
    <!--<a-row>-->
    <!--<a-col v-for="(item,index) in list" :key="index" :span="24/count">-->
    <!--<div>-->
    <!--<div style="position: absolute;top: 3px;left: 3px;color: gray;font-size: 12px">-->
    <!--IP：{{item.c_ip}}-->
    <!--&nbsp;&nbsp;&nbsp;-->
    <!--序号：{{ index }}-->
    <!--</div>-->
    <!--<div class="result_img">-->
    <!--<img :src="imgSrc" alt="pic" style="height: 100%;width: 100%">-->
    <!--</div>-->
    <!--</div>-->
    <!--</a-col>-->
    <!--</a-row>-->
  </div>
</template>

<script>

  const NUM = 3;//每行图像数
  export default {
    name: "SquareView",
    data() {
      return {
        arr: ['', '', '', '', '', ''],//最多6人
        imgSrc: ['', '', '', '', '', ''],
        btn: 0,
        title: '示例标题',
      }
    },
    mounted() {
      WS.onmessage = (e) => {
        let data = JSON.parse(e.data);
        if (data.code === 201) {
          this.imgSrc.splice(data.data.num - 1, 1, data.data.img);
        } else if (data.code === 204) {
          let num_arr = Object.keys(data.data);//序号数组
          for (let i = 0, length = num_arr.length; i < length; i++) {
            this.arr.splice(num_arr[i] - 1, 1, data.data[num_arr[i]]);
          }
        }
      };

      //单位高度
      for (let item of document.getElementsByClassName('result_img')) {
        item.style.height = document.body.offsetHeight / 2 - 62 + 'px';
      }

      //改变宽高
      // 1. 获取两个大小div
      for (let item of document.getElementsByClassName('result_img')) {
        var oPanel = item;
        var oDragIcon = item.children[0];
        // 定义4个变量
        var disX = 0;//鼠标按下时光标的X值
        var disY = 0;//鼠标按下时光标的Y值
        var disW = 0; //拖拽前div的宽
        var disH = 0; // 拖拽前div的高
        //3. 给小div加点击事件
        oDragIcon.onmousedown = function (ev) {
          var ev = ev || window.event;
          disX = ev.clientX; // 获取鼠标按下时光标x的值
          disY = ev.clientY; // 获取鼠标按下时光标Y的值
          var p = this.parentNode;
          disW = p.offsetWidth; // 获取拖拽前div的宽
          disH = p.offsetHeight; // 获取拖拽前div的高
          document.onmousemove = function (ev) {
            var ev = ev || window.event;
            //拖拽时为了对宽和高 限制一下范围，定义两个变量
            var W = ev.clientX - disX + disW;
            var H = ev.clientY - disY + disH;
            if (W < 100) {
              W = 100;
            }
            if (W > 800) {
              W = 800;
            }
            if (H < 100) {
              H = 100;
            }
            if (H > 500) {
              H = 500;
            }
            p.style.width = W + 'px';// 拖拽后物体的宽
            p.style.height = H + 'px';// 拖拽后物体的高
          }
          document.onmouseup = function () {
            document.onmousemove = null;
            document.onmouseup = null;
          }
        }
      }
    }
  }
</script>

<style scoped>
  .header {
    padding: 0 20px;
    height: 64px;
    box-shadow: 3px 0 5px lightgray;
    display: flex;
    justify-items: center;
  }

  .main {
    overflow: hidden;
  }

  .result_img {
    position: relative;
    box-shadow: 0 0 3px gray;
  }
</style>
