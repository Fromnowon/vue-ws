<!--公共主页，用于判断服务器状态、身份选择等-->
<template>
  <div class="main">
    <div style="margin-bottom: 20px;">
      <span style="font-size: 18px;font-weight: bold;">设置服务器地址：</span>
    </div>
    <div>
      <a-input v-model="serverIP"
               @pressEnter="onClick"
               :placeholder="defaultServerIP"
               size="large"
               :disabled="connecting">
      </a-input>
      <a-button
        block
        @click="onClick"
        type="primary"
        :loading="connecting"
        size="large"
        style="margin-top: 20px">
        {{ connecting?'连接中':'确认' }}
      </a-button>
    </div>
    <a-modal
      v-model="visible"
      :afterClose="cancelHandler"
      :footer="null"
      :maskClosable="false">
      <div style="margin: 40px 0">
        <transition name="switch" mode="out-in">
          <div v-if="configNum===0" key="role">
            <a-button block @click="configNum=1" type="primary" size="large">
              我是选手
            </a-button>
            <a-button block @click="configNum=2" type="primary" style="margin-top: 20px" size="large">
              我是评委
            </a-button>
            <a-button block @click="squareReg" style="margin-top: 20px" size="large">
              展示端
            </a-button>
          </div>
          <div v-else-if="configNum===1" key="num" style="text-align: center">
            <div v-show="!numValid">
              <a-alert type="error" message="序号冲突，请更改"/>
            </div>
            <br>
            请输入参赛序号：
            <a-input-number :min="1" :max="10" v-model="num"/>
            <br>
            <a-button :loading="connecting"
                      block
                      @click="competitorReg"
                      type="primary"
                      style="width: 220px;margin-top: 30px" size="large">
              确认
            </a-button>
          </div>
          <div v-else-if="configNum===2" key="num" style="text-align: center">
            <br>
            请选择选手序号：
            <a-select style="width: 80px" @change="judgeNumHandler">
              <a-select-option value="1">1</a-select-option>
              <a-select-option value="2">2</a-select-option>
              <a-select-option value="3">3</a-select-option>
            </a-select>
            <br>
            <a-button :loading="connecting"
                      block
                      @click="judgeReg"
                      type="primary"
                      style="width: 220px;margin-top: 30px" size="large">
              确认
            </a-button>
          </div>
        </transition>

      </div>
      <div>

      </div>
    </a-modal>
  </div>
</template>

<script>
  export default {
    name: "PublicIndex",
    data() {
      return {
        serverIP: '',
        connecting: false,//标记连接状态
        visible: false,
        defaultServerIP: window.location.hostname,
        configNum: 0,//序号配置
        judgeNum: null,
        num: 1,//参赛序号
        numValid: true,//参赛序号是否合法
      }
    },
    mounted() {
      //检测服务器状态

    },
    watch: {
      configNum(value) {
        if (value === 2) {
          //拉取已连接选手序号
          WS.send(JSON.stringify({code: 103}));
        }
      }
    },
    methods: {
      judgeNumHandler(num) {
        this.judgeNum = num;
      },
      cancelHandler() {
        //未选择身份则关闭连接
        WS.close();
        //关闭配置
        this.configNum = 0;
      },
      competitorReg() {
        sessionStorage.setItem('role', '参赛者');
        WS.send(JSON.stringify({code: 102, data: {isCompetitor: true, role: 'competitor', num: this.num}}));
        this.connecting = true;
        //this.$router.push('/competitor');
      },
      judgeReg() {
        sessionStorage.setItem('role', '评委');
        WS.send(JSON.stringify({code: 102, data: {isCompetitor: false, role: 'judge', num: null}}));
        this.$router.push('/judge');
      },
      squareReg() {
        sessionStorage.setItem('role', '展示端');
        WS.send(JSON.stringify({code: 102, data: {isCompetitor: false, role: 'square', num: null}}));
        this.$router.push('/square');
      },
      onClick() {
        let vm = this;
        //防止重复连接
        if (WS !== null) {
          // console.log(WS.readyState);
          if (WS.readyState === 1) {
            //已经连接，弹出提示
            const h = this.$createElement;
            this.$confirm({
              title: '提示',
              // content: "你已连接到服务器，身份为：" + sessionStorage.getItem('role') + "。仍要继续吗？",
              content: h('div', [
                h('span', '你已连接到服务器，身份为：'),
                h('strong', {style: {color: 'blue'}}, sessionStorage.getItem('role')),
                h('span', '。仍要继续吗？'),
              ]),
              maskClosable: false,
              okText: '确认',
              cancelText: '取消',
              onOk() {
                WS.close();
                f(vm);
              },
            });
          } else {
            f(vm);
          }
        } else {
          f(vm);
        }

        function f(vm) {
          vm.connecting = true;
          vm.serverIP = vm.serverIP.length === 0 ? vm.defaultServerIP : vm.serverIP;
          vm.connectHandler();
        }
      },
      connectHandler() {
        //尝试连接服务器
        WS = new WebSocket("ws://" + this.serverIP + ":2000");
        WS.onopen = () => {
          //this.$message.success('连接成功');
          this.connecting = false;
          //ws.send('connected');
          //选择身份
          this.visible = true;
          //心跳
          let heartbeat = setInterval(() => {
            if (WS.readyState !== 1) {
              window.clearInterval(heartbeat);
            } else {
              WS.send(JSON.stringify({code: 0, data: 'heartbeat'}));
            }
          }, 30000);
        };
        WS.onerror = (e) => {
          console.log(e);
          this.connecting = false;
          this.$error({
            title: '连接失败',
            content: '请检查网络连接状态或IP是否正确',
            maskClosable: true
          });
        };
        WS.onmessage = (e) => {
          let data = JSON.parse(e.data);
          //过滤通知
          switch (data.code) {
            case 1:
              this.$info({
                title: '通知',
                content: data.data,
                maskClosable: true
              });
              break;
            case 202:
              this.connecting = false;
              if (data.data === 'ok') {
                this.numValid = true;
                this.$router.push('/competitor');
              } else {
                console.log(data.data);
                this.numValid = false;
              }
              break;
            case 203:
              console.log(data);
              break;
          }
        };
        WS.onclose = () => {
          let vm = this;
          if (vm.$route.path !== '/') {
            vm.$error({
              title: '警告',
              content: "与服务器的连接断开",
              maskClosable: false,
              onOk() {
                window.location.href = '/';
              },
            });
          } else {
            //this.$message.error('连接断开');
          }

        };
      }
    },
  }
</script>

<style scoped>
  .main {
    padding-top: 200px;
    width: 320px;
    margin: 0 auto;
  }

  .switch-enter-active, .switch-leave-active {
    transition: all .2s;
  }

  .switch-enter, .switch-leave-to /* .fade-leave-active below version 2.1.8 */
  {
    transform: translateX(-5px);
    opacity: 0;
  }
</style>
